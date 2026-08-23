from datetime import datetime

from app.model.user import User
from app.repository.base_repo import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def get_by_whatsapp_number(self, whatsapp_number: str) -> User | None:
        return (
            self.db.query(self.model)
            .filter(self.model.whatsapp_number == whatsapp_number)
            .one_or_none()
        )

    def record_verification_and_login(self, user: User, now: datetime) -> User:
        if user.verified_at is None:
            user.verified_at = now
        user.last_login = now
        self.db.commit()
        self.db.refresh(user)
        return user
