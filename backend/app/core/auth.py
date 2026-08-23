from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.model.user import User
from app.service.auth_service import (
    AuthenticationConfigurationError,
    AuthService,
    InvalidTokenAuthenticationError,
)

ACCESS_COOKIE_NAME = "sapigo_access"

DbSession = Annotated[Session, Depends(get_db)]


def get_auth_service(db: DbSession) -> AuthService:
    return AuthService(db)


AuthServiceDependency = Annotated[AuthService, Depends(get_auth_service)]


def require_current_user(
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
    except AuthenticationConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is unavailable",
        ) from exc
    except InvalidTokenAuthenticationError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        ) from exc


CurrentUser = Annotated[User, Depends(require_current_user)]
