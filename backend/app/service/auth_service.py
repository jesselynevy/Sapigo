import uuid
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import jwt
from jwt import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.model.user import User
from app.repository.user_repo import UserRepository
from app.service.whatsapp_verification_service import (
    TwilioVerifyService,
    VerificationProviderConfigurationError,
    VerificationProviderError,
)


class AuthenticationError(Exception):
    """Base class for authentication failures safe to expose to clients."""


class AuthenticationConfigurationError(AuthenticationError):
    pass


class InactiveUserError(AuthenticationError):
    pass


class InvalidOtpError(AuthenticationError):
    pass


class InvalidTokenAuthenticationError(AuthenticationError):
    pass


@dataclass(frozen=True)
class AuthenticatedUser:
    user: User
    access_token: str


class AuthService:
    def __init__(self, db: Session, provider: TwilioVerifyService | None = None):
        self.users = UserRepository(db)
        self.provider = provider or TwilioVerifyService()

    @staticmethod
    def _now() -> datetime:
        return datetime.now(UTC)

    @staticmethod
    def _jwt_secret() -> str:
        if not settings.AUTH_JWT_SECRET:
            raise AuthenticationConfigurationError("Authentication is not configured")
        return settings.AUTH_JWT_SECRET

    def _create_access_token(self, user: User) -> str:
        now = self._now()
        return jwt.encode(
            {
                "sub": str(user.id),
                "typ": "access",
                "iat": now,
                "exp": now + timedelta(minutes=settings.AUTH_ACCESS_TOKEN_MINUTES),
            },
            self._jwt_secret(),
            algorithm=settings.AUTH_JWT_ALGORITHM,
        )

    def request_otp(self, whatsapp_number: str) -> None:
        try:
            result = self.provider.start_verification(whatsapp_number)
        except VerificationProviderConfigurationError as exc:
            raise AuthenticationConfigurationError("Authentication is not configured") from exc
        except VerificationProviderError as exc:
            raise AuthenticationError("Unable to request verification") from exc
        if result.status != "pending":
            raise AuthenticationError("Unable to request verification")

    def verify_otp(self, whatsapp_number: str, code: str) -> AuthenticatedUser:
        try:
            result = self.provider.check_verification(whatsapp_number, code)
        except VerificationProviderConfigurationError as exc:
            raise AuthenticationConfigurationError("Authentication is not configured") from exc
        except VerificationProviderError as exc:
            raise AuthenticationError("Unable to verify code") from exc
        if result.status != "approved":
            raise InvalidOtpError("Unable to verify code")

        user = self.users.get_by_whatsapp_number(whatsapp_number)
        if user is None:
            now = self._now()
            user = self.users.create(
                whatsapp_number=whatsapp_number,
                full_name=None,
                verified_at=now,
                last_login=now,
            )
        elif not user.is_active:
            raise InactiveUserError("Account is inactive")
        else:
            user = self.users.record_verification_and_login(user, self._now())

        return AuthenticatedUser(user=user, access_token=self._create_access_token(user))

    def get_current_user(self, access_token: str) -> User:
        try:
            payload = jwt.decode(
                access_token,
                self._jwt_secret(),
                algorithms=[settings.AUTH_JWT_ALGORITHM],
            )
            if payload.get("typ") != "access":
                raise InvalidTokenAuthenticationError("Invalid access token")
            user_id = uuid.UUID(payload["sub"])
        except (InvalidTokenError, KeyError, ValueError) as exc:
            raise InvalidTokenAuthenticationError("Invalid access token") from exc

        user = self.users.get(user_id)
        if user is None or not user.is_active:
            raise InvalidTokenAuthenticationError("Invalid access token")
        return user
