import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from jwt import ExpiredSignatureError, InvalidTokenError
load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")  # fallback only for local dev
ALGORITHM = "HS256"
DEFAULT_DURATION_HOURS = 168  # 7 days
DEFAULT_SIGNUP_DURATION_HOURS = 1

def generate_institution_application_token(institution, duration_hours=DEFAULT_DURATION_HOURS):
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(hours=duration_hours)

    payload = {
        "institution_id": str(institution.id),
        "iat": now,
        "nbf": now,
        "exp": expiry
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "token": token,
        "lifetime": duration_hours,
        "expiry_date": expiry
    }

def generate_signup_token(email,duration_hours = DEFAULT_SIGNUP_DURATION_HOURS):
    now = datetime.now(timezone.utc)
    expiry = now + timedelta(hours=duration_hours)

    payload = {
        "target": email,
        "iat": now,
        "nbf": now,
        "exp": expiry
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "token": token,
        "lifetime": duration_hours,
        "expiry_date": expiry
    }
def decode_application_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "valid": True,
            "payload": payload
        }
    except jwt.ExpiredSignatureError:
        return {
            "valid": False,
            "error": "Token has expired."
        }
    except jwt.InvalidTokenError as e:
        return {
            "valid": False,
            "error": f"Invalid token: {str(e)}"
        }

