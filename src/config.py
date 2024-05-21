from betterconf import Config, field
from betterconf.caster import to_int
from dotenv import load_dotenv
load_dotenv()


class BaseConfig(Config):
    base_url: str = field("BASE_URL")
    database_url: str = field("DATABASE_URL")
    telegram_bot_token: str = field("TELEGRAM_BOT_TOKEN")

    jwt_secret_key: str = field("JWT_SECRET_KEY")
    jwt_refresh_secret_key: str = field("JWT_REFRESH_SECRET_KEY")

    access_token_expire_minutes: int = field("ACCESS_TOKEN_EXPIRE_MINUTES", caster=to_int, default=30)
    refresh_token_expire_minutes: int = field("REFRESH_TOKEN_EXPIRE_MINUTES", caster=to_int, default=(60 * 24 * 7))
    hashing_algorithm: str = field("HASHING_ALGORITHM", default="HS256")

    ai_key: str = field("AI_KEY")
    admin_password: str = field("ADMIN_PASSWORD")

    mode: str = field("MODE", default="DEV")


cfg = BaseConfig()
