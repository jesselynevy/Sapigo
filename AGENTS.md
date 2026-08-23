# Repository Guidelines

## Project Structure & Module Organization

This repository contains the SapiGo FastAPI backend in `backend/`. Start the application from `backend/main.py`. Application code is organized by responsibility under `backend/app/`: `route/` for API endpoints, `schema/` for Pydantic request/response models, `service/` for business logic, `repository/` for database access, `model/` for SQLAlchemy models, and `core/` for configuration and database setup. AI-specific code belongs in `ai_service/`. Alembic configuration and revision files live in `backend/migration/` and `backend/alembic.ini`.

## Build, Test, and Development Commands

Run commands from `backend/`:

```bash
uv sync                 # install locked project and development dependencies
uv run dev              # run Uvicorn with reload at http://127.0.0.1:8000
uv run ruff check .     # lint Python code
uv run alembic upgrade head  # apply database migrations
```

The interactive API documentation is available at `/docs` while the service is running. Add dependencies with `uv add <package>` so `uv.lock` stays current.

## Coding Style & Naming Conventions

Use Python 3.12+, four-space indentation, type annotations, and conventional import grouping. Follow the existing `snake_case` module/function/variable names, `PascalCase` class and Pydantic/SQLAlchemy model names, and uppercase configuration keys. Keep routes thin: validate through schemas, delegate to services, and keep persistence queries in repositories. Run Ruff before submitting changes.

## Testing Guidelines

No test framework or coverage target is currently configured. Add tests with `pytest` when introducing behavior, placing them in `backend/tests/` and naming files `test_<feature>.py` and test functions `test_<expected_behavior>()`. Exercise success paths, validation failures, and missing-resource responses for API changes. Once tests are added, run them with `uv run pytest`.

## Commit & Pull Request Guidelines

Use concise, imperative Conventional Commit subjects such as `feat: add animal CRUD functions` and `fix: specify the torch dependency index`. Prefer lowercase types such as `feat`, `fix`, or `docs`, with an optional scope and a focused summary. Keep commits scoped. Pull requests should describe the behavior change, note schema or migration impact, link relevant issues, and include request/response examples or screenshots for API-visible changes.

## Configuration & Database Safety

Settings load from `backend/.env`; do not commit credentials. Supply `DATABASE_URL` or the `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_NAME` variables. Review generated Alembic revisions before applying them, especially destructive schema changes.
