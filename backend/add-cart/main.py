
#!FastApi
from fastapi import FastAPI,Header,HTTPException,Request
from fastapi.middleware.cors import CORSMiddleware



#!Python modules and functions
from datetime import datetime,timedelta


#!Redis
from models import redis



# create your views here,and run server =>  uvicorn main:app --reload
app = FastAPI(title="Add to cart")

# Create FastApi object from FastAPI class
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#*root
@app.get("/")
async def root():
    return {"message": "Hello world"}



#*add_to_cache
@app.post("/add_to_cache/")
def add_to_cache(user_hashed_id:str):
    user_data = redis.get(user_hashed_id)
    if user_data is None:
        redis.set(user_hashed_id,1,ex=timedelta(seconds=240))
    elif user_data is not None:
        user = int(user_data)
        user += 1
        redis.set(user_hashed_id,user,ex=timedelta(seconds=240))
    return {"message": "Value added to cache"}


#*get_from_cache
@app.post("/get_from_cache/")
def get_from_cache(user_hashed_id:str):
    user_data = redis.get(user_hashed_id)
    return {"cart_item_count":user_data}


