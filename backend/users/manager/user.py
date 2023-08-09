#

#!FastApi
from fastapi import FastAPI,HTTPException


#!Tortoise Orm
from tortoise import Tortoise



#!Third Party packages for FastApi
from passlib.context import CryptContext


#!Models and Manager class
from models import Users
from .auth import AuthManager

from utils.helpers import generate_random_user_code


#pwd_context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



#*UserManager
class UserManager:
    #register
    @staticmethod
    async def register(user_data):
        user_data.password = pwd_context.hash(user_data.password)
        try:
            user = await Users.create(**user_data.dict(exclude_unset=True))
        except Exception as err:
            raise HTTPException(status_code=400,detail="User already exists")
        created_user = await Users.get(id=user.id)
        
        created_user.user_hashed_id = generate_random_user_code(12)
        await created_user.save()
        return AuthManager.encode_token(created_user.id)
    
    #login
    @staticmethod
    async def login(user_data):
        user_do = await Users.filter(email=user_data.email).first()
        if not user_do:
            raise HTTPException(status_code=404,detail=f"User not found")
        elif not pwd_context.verify(user_data.password,user_do.password):
            raise HTTPException(status_code=401,detail="Invalid credentials")
        return AuthManager.encode_token(user_do.id)