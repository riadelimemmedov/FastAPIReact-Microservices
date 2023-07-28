#

# ?FastApi
from fastapi import Depends, FastAPI, HTTPException, Request, status

# ?Python modules and function
import base64


#! Regex Pattern List
email_domain_pattern = r"^[\w\.-]+@[\w\.-]+\.(ru|com|az|org|net|edu|gov|mil|io|co|me|info|biz|tv|online|store|xyz)$"
email_body_pattern = "^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$"
phone_number_pattern = "994\s?\d{2}[2-9]\d{6}"
