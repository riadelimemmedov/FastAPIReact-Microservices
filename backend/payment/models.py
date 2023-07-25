#

#!Python modules and function
import datetime
import random

# !FastApi

#!Redis Orm
from redis_om import get_redis_connection
from redis_om import get_redis_connection, EmbeddedJsonModel, JsonModel, Field, Migrator


#!Third party packages
from decouple import config


#Create your models here.

#*RedisModel
class RedisModel:
    def __init__(self,host=config('REDIS_HOST'),port=config('REDIS_PORT',cast=int),password=config('REDIS_DATABASE_PASSWORD'),decode_responses=config('DECODE_RESPONSE',default=True)):
        self.redis = get_redis_connection(host=host,port=port,password=password,decode_responses=decode_responses)
        
    def get(self):
        return self.redis
redis = RedisModel().get()



#!Product
class Order(JsonModel):
    product_id:str = Field(index=True,full_text_search=True)
    product_name:str = Field(default="product_name",full_text_search=True)
    slug:str = Field(default=f"order")
    price:float
    fee:float
    total:float
    quantity:int
    status:str #pending,completed,refunded
    created_date : datetime.date = Field(default=datetime.datetime.today().strftime('%Y-%m-%d'))
    
    class Meta:
        database = redis


#?Migrate table to redis cloud database
Migrator().run()






