from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from src.config import cfg

engine = create_async_engine(
    url=cfg.database_url,
)

Base = declarative_base()
async_session = async_sessionmaker(
    bind=engine, expire_on_commit=False
)


async def init_models():
    if cfg.mode == "DEV":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    else:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
