
#!Python modules and functions
import os
from decouple import config



#?TORTOISE_ORM
TORTOISE_ORM = {
    "connections": {"default": config("DATABASE_URL_USER")},
    "apps": {
        "models": {
            "models": [
                "models", "aerich.models"
            ],
            "default_connection": "default"
        }
    }
}