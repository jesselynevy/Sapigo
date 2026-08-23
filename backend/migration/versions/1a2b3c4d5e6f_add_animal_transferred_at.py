"""add animal transferred at

Revision ID: 1a2b3c4d5e6f
Revises: 864ec86dc5f0
Create Date: 2026-08-23 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision = "1a2b3c4d5e6f"
down_revision = "864ec86dc5f0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("animals", sa.Column("transferred_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("animals", "transferred_at")
