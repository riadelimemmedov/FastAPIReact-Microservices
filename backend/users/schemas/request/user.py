#


# ?Pyhon modules and Functions
import re


# ?FastApi
from email_validator import EmailNotValidError
from email_validator import validate_email as validate_user_email
from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, SecretStr, validator


# ?UserBase
from schemas.base import UserBase


# ?Helpers methods and variable
from utils.helpers import phone_number_pattern


#*UserRegisterIn
class UserRegisterIn(UserBase):
    password : str
    phone_number : str
    first_name : str
    last_name : str
    
    #validate_phone_number
    @validator('phone_number')
    def validate_phone_number(cls,phone_number):
        if(re.match(phone_number_pattern,phone_number) and len(phone_number) == 12 and phone_number.isdigit()):
            return phone_number
        else:
            raise ValueError('Phone number must be in this format : format:994xxxxxxxxx')


#!UserLoginIn
class UserLoginIn(UserBase):
    password : str
    