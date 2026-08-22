---
name: sapigo-fastapi-services
description: Add or update SapiGo service-layer business logic between FastAPI routes and repositories. Use for files in backend/app/service; do not use for endpoint wiring or raw ORM model design.
---

# SapiGo service layer

Services own resource-level application behavior. Accept a SQLAlchemy `Session` in the constructor, create the relevant repository there, and expose typed methods consumed by routes.

Receive Pydantic input schemas in create/update methods and pass `model_dump()` values to repositories. For PATCH, use `model_dump(exclude_unset=True)` so omitted fields are never overwritten. Keep SQLAlchemy queries and commits in repositories.

Define a small, resource-specific exception such as `<Resource>NotFoundError` when a requested record is absent. Services should raise it consistently; routes map it to HTTP errors. Put cross-resource validation, workflow decisions, and AI orchestration here when needed, while preserving caller-supplied transaction boundaries if the workflow cannot be safely split into independent repository commits.

Run `uv run ruff check .` from `backend/` after edits. Add focused tests for success, missing-resource, and any domain-rule branches that the service introduces.
