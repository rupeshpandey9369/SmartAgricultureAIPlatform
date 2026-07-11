import random
import string
from app.config import settings
from app.db.redis_client import redis_client

try:
    from twilio.rest import Client as TwilioClient
except ImportError:
    TwilioClient = None


def _otp_key(phone: str) -> str:
    return f"otp:{phone}"


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=settings.OTP_LENGTH))


def send_otp(phone: str) -> str:
    """Generates an OTP, stores it in Redis with TTL, sends via Twilio. Returns the OTP (for logging/dev only)."""
    otp = generate_otp()
    redis_client.setex(_otp_key(phone), settings.OTP_EXPIRE_SECONDS, otp)

    if TwilioClient and settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER:
        client = TwilioClient(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your Smart Agriculture verification code is {otp}. Valid for 5 minutes.",
            from_=settings.TWILIO_FROM_NUMBER,
            to=phone,
        )
    else:
        # Dev mode: log instead of sending a real SMS so you're not burning Twilio credits while building.
        print(f"[DEV OTP] phone={phone} otp={otp}")

    return otp


def verify_otp(phone: str, otp_input: str) -> bool:
    stored = redis_client.get(_otp_key(phone))
    if stored is None:
        return False
    if stored != otp_input:
        return False
    redis_client.delete(_otp_key(phone))
    return True
