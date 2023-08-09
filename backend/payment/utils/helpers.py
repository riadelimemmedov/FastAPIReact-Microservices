
#!Third party libraries
import httpx


#?check_user_token
async def check_user_token(token:str):
    url = f"http://127.0.0.1:2000/user/check"
    
    try:
        with httpx.Client() as client:
            response = client.post(url,json={"token": token})
            return response.json()
            
        response.raise_for_status()
        return True
    except httpx.HTTPError as http_err:
        return False
