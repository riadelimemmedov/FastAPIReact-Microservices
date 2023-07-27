


#!FastApi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError, HTTPException



#!Tortoise Orm
from database.register import register_tortoise
from database.config import TORTOISE_ORM
from tortoise.contrib.fastapi import HTTPNotFoundError
from tortoise.contrib.pydantic import pydantic_model_creator



#!Database models
from models import Users


user_pydantic = pydantic_model_creator(Users,exclude=['created_at','modified_at'])
user_pydantic_no_id = pydantic_model_creator(Users,exclude_readonly=True,exclude=['created_at','modified_at'])



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




#!get_all_users
@app.get("/users")
async def get_all_users():
    return await user_pydantic.from_queryset(Users.all())



#!create_user
@app.post('/users/create',status_code=201)
async def create_user(username,full_name,password):
    user = await Users.create(username=username,full_name=full_name,password=password)
    if not user:
        raise HTTPException(status_code=422,detail=f"Could not create user,please try again")
    return {'user':user}



#!delete_user
@app.delete("/users/delete/{job_id}",responses={404: {"model": HTTPNotFoundError}})
async def delete_user(user_id:int):
    deleted_user = await Users.get(id=user_id).delete()
    if not deleted_user:
        raise HTTPException(status_code=404,detail=f"User {user_id} not found")
    return {f"message":'User {user_id} deleted successfully'}



#!update_user 
@app.put('/users/update/{user_id}',responses={404: {"model": HTTPNotFoundError}})
async def update_user(user_id:int,body:user_pydantic):
    user = Users.get(id=user_id)
    if not user:
        return  'User not found'
    updated_data = {key : value for key,value in body if key != 'id'}
    return user_pydantic_no_id.from_queryset_single(Users.get(id=user_id))
    


