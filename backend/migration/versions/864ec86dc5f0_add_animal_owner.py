"""add animal owner

Revision ID: 864ec86dc5f0
Revises: cf2f09b18d7a
Create Date: 2026-08-23 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision = "864ec86dc5f0"
down_revision = "cf2f09b18d7a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Existing records cannot be safely assigned to a reseller. Backfill them
    # deliberately before applying this migration in a populated environment.
    op.add_column("animals", sa.Column("owner_id", sa.UUID(), nullable=True))
    op.create_foreign_key("fk_animals_owner_id_users", "animals", "users", ["owner_id"], ["id"])
    op.create_index("ix_animals_owner_id", "animals", ["owner_id"])
    op.execute("""
        DO $$ BEGIN
          IF EXISTS (SELECT 1 FROM animals WHERE owner_id IS NULL) THEN
            RAISE EXCEPTION 'Backfill animals.owner_id before applying this migration';
          END IF;
        END $$;
    """)
    op.alter_column("animals", "owner_id", nullable=False)


def downgrade() -> None:
    op.drop_index("ix_animals_owner_id", table_name="animals")
    op.drop_constraint("fk_animals_owner_id_users", "animals", type_="foreignkey")
    op.drop_column("animals", "owner_id")
