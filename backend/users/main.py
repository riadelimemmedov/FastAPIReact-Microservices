


#!FastApi
from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError, HTTPException



#!Tortoise Orm
from database.register import register_tortoise
from database.config import TORTOISE_ORM
from tortoise.contrib.fastapi import HTTPNotFoundError
from tortoise.contrib.pydantic import pydantic_model_creator



#!Database models
from models import Users,User_Pydantic,UserIn_Pydantic


#!Pydantic 
from pydantic import BaseModel


#!Python modules and functions
from typing import List


#!Models,Serializers,Schemas and Manager class
from manager.user import UserManager
from manager.auth import oauth2_schema
from schemas.request.user import UserRegisterIn, UserLoginIn


import jwt
from decouple import config


# user_pydantic = pydantic_model_creator(Users,exclude=['created_at','modified_at'])
# user_pydantic_no_id = pydantic_model_creator(Users,exclude_readonly=True,exclude=['created_at','modified_at','id'])



# Create FastApi object from FastAPI class
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Register TORTOISE ORM to FastAPI
register_tortoise(app,config=TORTOISE_ORM,generate_schemas=False)



#*Status
class Status(BaseModel):
    message:str
    

#!get_all_users
@app.get("/users",status_code=200,dependencies=[Depends(oauth2_schema)],response_model=List[User_Pydantic])
async def get_all_users():
    """Get all users"""
    return await User_Pydantic.from_queryset(Users.all())


#!create_user
@app.post('/users/',status_code=201,response_model=User_Pydantic)
async def create_user(user:UserIn_Pydantic):
    """Create user"""
    user = await Users.create(**user.dict(exclude_unset=True))
    print('User is ', user)
    if not user:
        raise HTTPException(status_code=422,detail=f"Could not create user,please try again")
    return await User_Pydantic.from_tortoise_orm(user)


#!get_user
@app.get('/user/{user_id}',status_code=200,response_model=User_Pydantic)
async def get_user(user_id:int):
    """Get user"""
    user = Users.get(id=user_id)
    if not user:
        return HTTPException(status_code=404,detail=f"User {user_id} not found")
    return await User_Pydantic.from_queryset_single(user)



#!update_user
@app.put('/user/{user_id}',status_code=200,response_model=User_Pydantic)
async def update_user(user_id:int,user:UserIn_Pydantic):
    """Update user"""
    await Users.filter(id=user_id).update(**user.dict(exclude_unset=True))
    return await User_Pydantic.from_queryset_single(Users.get(id=user_id))



#!delete_user
@app.delete('/user/{user_id}',status_code=202,response_model=Status)
async def delete_user(user_id:int):
    """Delete user"""
    deleted_account = await Users.filter(id=user_id).delete()
    if not deleted_account:
        return HTTPException(status_code=404,detail=f"User {user_id} not found")
    return Status(message=f"Deleted user {user_id} succsessfully")


#!delete_user
@app.delete("/users/",status_code=202,response_model=Status)
async def delete_all_user():
    """Delete all users"""
    deleted_all_users = await Users.all().delete()
    if not deleted_all_users:
        raise HTTPException(status_code=404,detail=f"Your database model not exists user data")
    return {f"message":'All user deleted successfully'}



#!register
@app.post('/register/',status_code=201)
async def register(user_data:UserRegisterIn):
    print('User data is +++ ', user_data)
    token = await UserManager.register(user_data)
    return {'token':token}

#!login
@app.post('/login/',status_code=201)
async def login(user_data:UserLoginIn):
    token = await UserManager.login(user_data)
    # user = await Users.get(email=user_data.email)
    user = await User_Pydantic.from_queryset_single(Users.get(email=user_data.email))
    return {'token':token,'user':user}



@app.post('/user/check')
async def check_user_token(token:dict):
    payload = jwt.decode(token['token'], config("SECRET_KEY"), algorithms=["HS256"])
    return payload['sub']
