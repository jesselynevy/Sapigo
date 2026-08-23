"""add animal owner

Revision ID: 864ec86dc5f0
Revises: cf2f09b18d7a, 2a8f4e6c1d90
Create Date: 2026-08-23 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision = "864ec86dc5f0"
down_revision = ("cf2f09b18d7a", "2a8f4e6c1d90")
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Existing records remain unassigned. New registrations provide an owner_id
    # through the authenticated reseller flow.
    op.add_column("animals", sa.Column("owner_id", sa.UUID(), nullable=True))
    op.create_foreign_key("fk_animals_owner_id_users", "animals", "users", ["owner_id"], ["id"])
    op.create_index("ix_animals_owner_id", "animals", ["owner_id"])


def downgrade() -> None:
    op.drop_index("ix_animals_owner_id", table_name="animals")
    op.drop_constraint("fk_animals_owner_id_users", "animals", type_="foreignkey")
    op.drop_column("animals", "owner_id")
