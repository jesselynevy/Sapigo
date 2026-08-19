# Minimal Db Session Engine For DI
from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# session pooler needs pool settings kept small, connections get recycled
# else is local psql, no need pooler

if settings.DATABASE_SOURCE == "supabase":
    engine = create_engine(
        settings.DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        pool_recycle=1800,
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# model inherits from this
class Base(DeclarativeBase):
    pass


# FastAPI DI Later, use with Depends(get_db)
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# for scripts/background jobs, not request handlers
# commits on success, rolls back on error
@contextmanager
def session_scope() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
