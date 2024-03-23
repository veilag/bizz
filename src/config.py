from betterconf import Config, field
from dotenv import load_dotenv
load_dotenv()


class BaseConfig(Config):
    base_url = field("BASE_URL")
    telegram_bot_token = field("TELEGRAM_BOT_TOKEN")


cfg = BaseConfig()
