
#!FastApi
from fastapi import FastAPI,BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

#!Third party libraries
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType


#!Schemas
from schemas.request.sendemail import EmailSchema


#!Email Configuration
from configemail.conf_email import conf 



#?App
app = FastAPI(title='Send Email')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




#*send_background
@app.post('/send-email/background')
async def send_background(email:EmailSchema) -> JSONResponse:
    message = MessageSchema(
        subject="Ecommmerce Microservices",
        recipients=email.dict().get("email"),
        template_body=email.dict().get("body"),
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    await fm.send_message(message,template_name="email.html")
    return JSONResponse(status_code=200, content={"message": "Email has been send successfully"})