---
name: sapigo-fastapi-repositories
description: Add or update SapiGo SQLAlchemy repository data-access code and reusable CRUD behavior. Use for backend/app/repository; do not use for API contracts or business-policy decisions.
---

# SapiGo repositories

Repositories isolate SQLAlchemy persistence from routes and services. Resource repositories subclass `BaseRepository[Model]`, set `model`, and add only query methods that are specific to that resource.

Use the injected `Session` stored as `self.db`. Return ORM model instances or simple persistence results, not HTTP exceptions or Pydantic responses. Keep domain decisions such as authorization, workflow eligibility, and HTTP status codes in services/routes.

Follow `BaseRepository` semantics: `create` adds, commits, and refreshes; `get` returns the model or `None`; `update` returns the model or `None`; and `delete` returns a boolean. When adding an operation needing different transaction behavior, make its ownership explicit and coordinate with the service rather than silently committing partway through a multi-step workflow.

Use SQLAlchemy 2-compatible ORM APIs already established in the codebase and type query parameters/results. Run `uv run ruff check .` from `backend/` after changes.
