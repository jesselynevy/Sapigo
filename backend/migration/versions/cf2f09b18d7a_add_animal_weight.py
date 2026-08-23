"""add animal weight

Revision ID: cf2f09b18d7a
Revises: b94cc0c5eda8
Create Date: 2026-08-23 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision = "cf2f09b18d7a"
down_revision = "b94cc0c5eda8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("animals", sa.Column("weight", sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column("animals", "weight")
