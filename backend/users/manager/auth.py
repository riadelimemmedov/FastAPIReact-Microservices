#

# ?FastApi
from fastapi import FastAPI,Request,Depends,HTTPException,status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, SecretStr, validator


# ?Third Party packages for FastApi
import jwt
from decouple import config


# ?Pyhon modules and Functions
from datetime import datetime, timedelta
from typing import Optional


# ?Models,Serializers,Schemas and Manager class
from models import Users



#*AuthManager
class AuthManager:
    #encode_token
    @staticmethod   
    def encode_token(user_id):
        try:
            payload = {
                "sub":user_id,
                "exp":datetime.now() + timedelta(days=3)
            }
            return jwt.encode(payload,config('SECRET_KEY'),algorithm="HS256")
        except Exception as err:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail=str(err))



#*CustomHTTPBearer
class CustomHTTPBearer(HTTPBearer):
    # __call__
    async def __call__(
        self, request: Request
    ) -> Optional[HTTPAuthorizationCredentials]:
        response = await super().__call__(request)
        try:
            payload = jwt.decode(
                response.credentials, config("SECRET_KEY"), algorithms=["HS256"]
            )
            user_data = await Users.filter(id = payload["sub"])
            request.state.user = user_data
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPAuthorizationCredentials(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )

# oauth2_schema
oauth2_schema = CustomHTTPBearer()
