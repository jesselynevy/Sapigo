import hmac
import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.db import get_db
from app.model.user import User
from app.schema.auth import (
    AuthenticatedUserRead,
    OtpRequest,
    OtpRequestAccepted,
    OtpVerifyRequest,
    ProfileUpdateRequest,
)
from app.service.auth_service import (
    AuthenticationConfigurationError,
    AuthenticationError,
    AuthService,
    InactiveUserError,
    InvalidOtpError,
    InvalidTokenAuthenticationError,
)

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_COOKIE_NAME = "sapigo_access"
CSRF_COOKIE_NAME = "sapigo_csrf"

DbSession = Annotated[Session, Depends(get_db)]


def get_auth_service(db: DbSession) -> AuthService:
    return AuthService(db)


AuthServiceDependency = Annotated[AuthService, Depends(get_auth_service)]


def _authentication_error(exc: AuthenticationError) -> HTTPException:
    if isinstance(exc, AuthenticationConfigurationError):
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is unavailable",
        )
    if isinstance(exc, InactiveUserError):
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
    if isinstance(exc, InvalidOtpError):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to verify code",
        )
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Authentication provider is unavailable",
    )


def _set_auth_cookies(response: Response, access_token: str) -> None:
    max_age = settings.AUTH_ACCESS_TOKEN_MINUTES * 60
    common_cookie_options = {
        "max_age": max_age,
        "secure": settings.AUTH_COOKIE_SECURE,
        "samesite": "lax",
        "path": "/",
    }
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        access_token,
        httponly=True,
        **common_cookie_options,
    )
    response.set_cookie(
        CSRF_COOKIE_NAME,
        secrets.token_urlsafe(32),
        httponly=False,
        **common_cookie_options,
    )


def get_current_user(
    request: Request,
    service: AuthServiceDependency,
) -> User:
    access_token = request.cookies.get(ACCESS_COOKIE_NAME)
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    try:
        return service.get_current_user(access_token)
    except (AuthenticationConfigurationError, InvalidTokenAuthenticationError) as exc:
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
                if isinstance(exc, AuthenticationConfigurationError)
                else status.HTTP_401_UNAUTHORIZED
            ),
            detail="Authentication required",
        ) from exc


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_csrf(
    request: Request,
    x_csrf_token: Annotated[str | None, Header()] = None,
) -> None:
    csrf_cookie = request.cookies.get(CSRF_COOKIE_NAME)
    if not settings.AUTH_FRONTEND_ORIGIN or request.headers.get("origin") != settings.AUTH_FRONTEND_ORIGIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid request origin")
    if not csrf_cookie or not x_csrf_token or not hmac.compare_digest(csrf_cookie, x_csrf_token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid CSRF token")


CsrfValidated = Annotated[None, Depends(require_csrf)]


@router.post("/otp/request", response_model=OtpRequestAccepted, status_code=status.HTTP_202_ACCEPTED)
def request_otp(
    payload: OtpRequest,
    service: AuthServiceDependency,
) -> OtpRequestAccepted:
    try:
        service.request_otp(payload.whatsapp_number)
    except AuthenticationError as exc:
        raise _authentication_error(exc) from exc
    return OtpRequestAccepted(message="If delivery is available, a verification code has been sent.")


@router.post("/otp/verify", response_model=AuthenticatedUserRead)
def verify_otp(
    payload: OtpVerifyRequest,
    response: Response,
    service: AuthServiceDependency,
) -> AuthenticatedUserRead:
    try:
        authenticated_user = service.verify_otp(payload.whatsapp_number, payload.code)
    except AuthenticationError as exc:
        raise _authentication_error(exc) from exc
    _set_auth_cookies(response, authenticated_user.access_token)
    return AuthenticatedUserRead.model_validate(authenticated_user.user)


@router.post("/profile", response_model=AuthenticatedUserRead)
def update_profile(
    payload: ProfileUpdateRequest,
    _: CsrfValidated,
    user: CurrentUser,
    service: AuthServiceDependency,
) -> AuthenticatedUserRead:
    return AuthenticatedUserRead.model_validate(service.update_profile(user, payload.full_name))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, _: CsrfValidated) -> None:
    response.delete_cookie(
        ACCESS_COOKIE_NAME,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )
    response.delete_cookie(
        CSRF_COOKIE_NAME,
        httponly=False,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


@router.get("/me", response_model=AuthenticatedUserRead)
def get_me(user: CurrentUser) -> AuthenticatedUserRead:
    return AuthenticatedUserRead.model_validate(user)
