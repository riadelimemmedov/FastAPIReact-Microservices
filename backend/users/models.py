
#!Tortoise orm
from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


#!Helper function
from utils.helpers import generate_random_user_code
import uuid

from datetime import datetime



#?Users
class Users(models.Model):
    ROLE_TYPE = [
        ('ADMIN','Admin'),
        ('USER','User')
    ]
    
    id = fields.IntField(pk=True)
    user_hashed_id = fields.CharField(max_length=40,unique=True,null=True,blank=True)
    first_name = fields.CharField(max_length=50)
    last_name  = fields.CharField(max_length=50)
    username = fields.CharField(max_length=50,unique=True,null=True)
    email = fields.CharField(max_length=100,unique=True)
    user_role = fields.CharField(max_length=50,null=True,choices=ROLE_TYPE,default=ROLE_TYPE[1][0])
    phone_number = fields.CharField(max_length=100,blank=True,null=True,unique=True)
    password = fields.CharField(max_length=128, null=True)
    address_line_1 = fields.CharField(blank=True,max_length=100,null=True)
    address_line_2 = fields.CharField(blank=True,max_length=100,null=True)
    city = fields.CharField(blank=True,max_length=20,null=True)
    state = fields.CharField(blank=True,max_length=20,null=True)
    country = fields.CharField(blank=True,max_length=20,null=True)
    date_joined = fields.DatetimeField(null=True,auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True,null=True)
    
    
    def __str__(self):
        return f"{self.first_name}:{self.last_name}"
    
    
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name or ''} {self.last_name or ''}".strip()
        return self.username
    
    
    
    

#?Pydantic shmecas
User_Pydantic = pydantic_model_creator(Users,name='User',exclude=['password'])
UserIn_Pydantic = pydantic_model_creator(Users,name='UserIn',exclude_readonly=True)





