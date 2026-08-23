from datetime import UTC, datetime

from app.core.config import settings
from app.core.db import SessionLocal
from app.repository.user_repo import UserRepository


def main() -> None:
    if settings.APP_ENV != "development" or settings.AUTH_OTP_PROVIDER != "stub":
        raise SystemExit("The development seed command requires APP_ENV=development and AUTH_OTP_PROVIDER=stub")
    if not settings.AUTH_STUB_WHATSAPP_NUMBER:
        raise SystemExit("AUTH_STUB_WHATSAPP_NUMBER must be configured")

    db = SessionLocal()
    try:
        users = UserRepository(db)
        user = users.get_by_whatsapp_number(settings.AUTH_STUB_WHATSAPP_NUMBER)
        now = datetime.now(UTC)
        if user is None:
            user = users.create(
                whatsapp_number=settings.AUTH_STUB_WHATSAPP_NUMBER,
                full_name="Demo User",
                verified_at=now,
                last_login=now,
                is_active=True,
            )
        else:
            user = users.update(
                user.id,
                full_name="Demo User",
                verified_at=user.verified_at or now,
                is_active=True,
            )
        print(f"Seeded development user {user.whatsapp_number} ({user.id})")
    finally:
        db.close()


if __name__ == "__main__":
    main()
