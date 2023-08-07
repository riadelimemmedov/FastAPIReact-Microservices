
#!Python modules and functions
import os
from typing import List,Dict,Any


#!Pydantic
from pydantic import BaseModel,EmailStr



#*EmailSchema
class EmailSchema(BaseModel):
    email: List[EmailStr]
    body: Dict[str, Any]
