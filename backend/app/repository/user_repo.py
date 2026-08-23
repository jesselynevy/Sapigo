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
