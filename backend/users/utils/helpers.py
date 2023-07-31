#

# ?FastApi
from fastapi import Depends, FastAPI, HTTPException, Request, status

# ?Python modules and function
import base64
import string
import random


#! Regex Pattern List
email_domain_pattern = r"^[\w\.-]+@[\w\.-]+\.(ru|com|az|org|net|edu|gov|mil|io|co|me|info|biz|tv|online|store|xyz)$"
email_body_pattern = "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
phone_number_pattern = "994\s?\d{2}[2-9]\d{6}"




#?generate_random_string
def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))



#?generate_random_user_code
def generate_random_user_code(length=12):
    code = generate_random_string(length)
    print('Your generaet code is ', code)
    return code