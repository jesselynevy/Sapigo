import hmac
from dataclasses import dataclass
from typing import Protocol

import httpx

from app.core.config import settings


class VerificationProviderError(Exception):
    """Raised when Twilio Verify cannot complete a verification request."""


class VerificationProviderConfigurationError(VerificationProviderError):
    """Raised when Twilio Verify settings are not configured."""


@dataclass(frozen=True)
class VerificationResult:
    status: str


class VerificationProvider(Protocol):
    def start_verification(self, whatsapp_number: str) -> VerificationResult: ...

    def check_verification(self, whatsapp_number: str, code: str) -> VerificationResult: ...


class TwilioVerifyService:
    base_url = "https://verify.twilio.com/v2/Services"

    def _configuration(self) -> tuple[str, str, str]:
        if not all(
            (
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN,
                settings.TWILIO_VERIFY_SERVICE_SID,
            )
        ):
            raise VerificationProviderConfigurationError(
                "Twilio Verify is not configured"
            )
        return (
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
            settings.TWILIO_VERIFY_SERVICE_SID,
        )

    def _post(self, path: str, data: dict[str, str]) -> VerificationResult:
        account_sid, auth_token, service_sid = self._configuration()
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(
                    f"{self.base_url}/{service_sid}/{path}",
                    auth=(account_sid, auth_token),
                    data=data,
                )
                response.raise_for_status()
        except httpx.HTTPError as exc:
            raise VerificationProviderError("Twilio Verify request failed") from exc

        status = response.json().get("status")
        if not isinstance(status, str):
            raise VerificationProviderError("Twilio Verify returned an invalid response")
        return VerificationResult(status=status)

    def start_verification(self, whatsapp_number: str) -> VerificationResult:
        return self._post(
            "Verifications",
            {"To": whatsapp_number, "Channel": "whatsapp"},
        )

    def check_verification(
        self, whatsapp_number: str, code: str
    ) -> VerificationResult:
        return self._post(
            "VerificationCheck",
            {"To": whatsapp_number, "Code": code},
        )


class DevelopmentStubVerificationService:
    """Development-only provider for one configured demo phone number and code."""

    def _configuration(self) -> tuple[str, str]:
        if settings.APP_ENV != "development":
            raise VerificationProviderConfigurationError(
                "The stub verification provider is only available in development"
            )
        if not (
            settings.AUTH_STUB_WHATSAPP_NUMBER and settings.AUTH_STUB_OTP_CODE
        ):
            raise VerificationProviderConfigurationError(
                "The stub verification provider is not configured"
            )
        return settings.AUTH_STUB_WHATSAPP_NUMBER, settings.AUTH_STUB_OTP_CODE

    def start_verification(self, whatsapp_number: str) -> VerificationResult:
        self._configuration()
        return VerificationResult(status="pending")

    def check_verification(
        self, whatsapp_number: str, code: str
    ) -> VerificationResult:
        configured_number, configured_code = self._configuration()
        if hmac.compare_digest(whatsapp_number, configured_number) and hmac.compare_digest(
            code, configured_code
        ):
            return VerificationResult(status="approved")
        return VerificationResult(status="denied")


def get_verification_provider() -> VerificationProvider:
    if settings.AUTH_OTP_PROVIDER == "twilio":
        return TwilioVerifyService()
    if settings.AUTH_OTP_PROVIDER == "stub":
        return DevelopmentStubVerificationService()
    raise VerificationProviderConfigurationError("Unknown OTP provider")
