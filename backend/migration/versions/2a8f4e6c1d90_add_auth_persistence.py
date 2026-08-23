"""simplify user auth fields

Revision ID: 2a8f4e6c1d90
Revises: b94cc0c5eda8
Create Date: 2026-08-23 00:00:00.000000
"""

import sqlalchemy as sa
from alembic import op

revision: str = "2a8f4e6c1d90"
down_revision: str | None = "b94cc0c5eda8"
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    op.drop_column("users", "otp_attempts")
    op.drop_column("users", "otp_expires_at")
    op.drop_column("users", "otp_code_hash")
    op.alter_column("users", "full_name", existing_type=sa.String(length=255), nullable=True)
    op.add_column("users", sa.Column("verified_at", sa.DateTime(), nullable=True))
    op.execute("UPDATE users SET verified_at = created_at WHERE is_verified = true")
    op.drop_column("users", "is_verified")


def downgrade() -> None:
    op.add_column("users", sa.Column("is_verified", sa.Boolean(), nullable=True))
    op.execute("UPDATE users SET is_verified = verified_at IS NOT NULL")
    op.alter_column("users", "is_verified", nullable=False)
    op.drop_column("users", "verified_at")
    op.execute("UPDATE users SET full_name = whatsapp_number WHERE full_name IS NULL")
    op.alter_column("users", "full_name", existing_type=sa.String(length=255), nullable=False)
    op.add_column(
        "users",
        sa.Column("otp_code_hash", sa.String(length=255), nullable=True),
    )
    op.add_column("users", sa.Column("otp_expires_at", sa.DateTime(), nullable=True))
    op.add_column(
        "users",
        sa.Column("otp_attempts", sa.Integer(), nullable=False, server_default="0"),
    )
    op.alter_column("users", "otp_attempts", server_default=None)
