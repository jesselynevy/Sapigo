from dataclasses import dataclass

import httpx

from app.core.config import settings


class VerificationProviderError(Exception):
    """Raised when Twilio Verify cannot complete a verification request."""


class VerificationProviderConfigurationError(VerificationProviderError):
    """Raised when Twilio Verify settings are not configured."""


@dataclass(frozen=True)
class VerificationResult:
    status: str


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
