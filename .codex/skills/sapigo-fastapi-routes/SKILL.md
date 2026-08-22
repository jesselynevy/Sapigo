---
name: sapigo-fastapi-routes
description: Add or update SapiGo FastAPI API routes, including request validation, dependency injection, and HTTP response handling. Use for endpoint work in backend/app/route; do not use for database-only or model-only changes.
---

# SapiGo FastAPI routes

Keep route modules thin. Put an `APIRouter` in `backend/app/route/<resource>.py`, using a plural resource prefix and tag. Register the router in `backend/app/route/__init__.py` so `backend/main.py` mounts it beneath `/api`.

Use Pydantic schemas for every request and response. Obtain a `Session` through `Depends(get_db)` and construct the resource service through a small dependency function. Delegate business operations to the service; do not place SQLAlchemy queries or transaction control in the route.

Translate service-level missing-resource errors to a 404 `HTTPException`. Match existing conventions: `201` for create, `204` for successful delete, `GET` collection pagination with `skip`/`limit`, and PATCH payloads for partial updates. Add domain-specific errors and status handling only when the service defines them.

After changing an API, ensure the route is registered and run `uv run ruff check .` from `backend/`. Add pytest coverage for new behavior when a test suite exists or the change introduces non-trivial validation/error handling.
