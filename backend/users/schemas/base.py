#


#!FastApi
from fastapi import Depends,FastAPI,HTTPException,Request,status
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer


#!Third Party packages for FastAPI
from pydantic import BaseModel,EmailStr,SecretStr,validator
from email_validator import EmailNotValidError
from email_validator import validate_email as validate_user_email


#!Python modules for FastAPI
from typing import List
import re


#! Helpers method for FastAPI
from utils.helpers import email_body_pattern,email_domain_pattern



#*UserBase
class UserBase(BaseModel):
    email:EmailStr
    
    
    # validate_email_domain
    @staticmethod
    def validate_email_domain(email):
        is_valid_format_domain = re.match(email_domain_pattern, email) is not None
        return is_valid_format_domain
    
    
    #validate_email_body
    @staticmethod
    def validate_email_body(email):
        is_valid_format_body = re.search(email_body_pattern, email) is not None
        return is_valid_format_body
    

    #validate_email
    @validator("email")
    def validate_email(cls, email):
        try:
            if cls.validate_email_domain(email) and cls.validate_email_body(email):
                return email
            else:
                raise ValueError("Please input valid email format")
        except EmailNotValidError:
            raise ValueError("Email is not valid format")
