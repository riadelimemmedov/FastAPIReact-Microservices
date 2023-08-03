#

#!?
from schemas.base import UserBase
from datetime import datetime


#*UserOut
class UserOut(UserBase):
    id:int
    first_name : str
    last_name : str
    phone_number : str
    user_role : str
