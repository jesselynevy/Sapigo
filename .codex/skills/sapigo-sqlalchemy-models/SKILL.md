---
name: sapigo-sqlalchemy-models
description: Add or update SapiGo SQLAlchemy database models and Alembic schema migrations. Use for backend/app/model or backend/migration changes; do not use for standalone Pydantic request/response schemas.
---

# SapiGo SQLAlchemy models

Define models in `backend/app/model/` using SQLAlchemy 2 declarative typing (`Mapped` and `mapped_column`) and inherit from `app.core.db.Base`. Prefer UUID primary keys with `UUID(as_uuid=True)`, `uuid.uuid4`, and PostgreSQL-compatible types already used by the project.

Keep relationships bidirectional with matching `back_populates`; use `TYPE_CHECKING` imports to avoid runtime circular imports. Add models to `app/model/__init__.py` so Alembic imports all metadata during autogeneration.

Any persistent schema change requires an Alembic revision in `backend/migration/versions/`. Review generated revisions carefully: preserve existing data unless the user authorizes a destructive migration, name PostgreSQL enums deliberately, and ensure required extensions (such as `vector`) are present before types that depend on them.

The project uses PostgreSQL and pgvector; embedding columns must keep their declared vector dimension consistent with the inference model. Run `uv run alembic upgrade head` against an appropriate non-production database and `uv run ruff check .` from `backend/` when configuration allows.
