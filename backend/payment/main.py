#

#!FastApi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.background import BackgroundTasks
from starlette.requests import Request


#!Models and Serializers
from models import redis,Order

#!Redis Orm
from redis_om.model import NotFoundError

#!Python modules and methods
from datetime import datetime
import httpx
import time


# create your views here,and run server =>  uvicorn main:app --reload
app = FastAPI()


# Create FastApi object from FastAPI class
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Payment and Order"}



#!get_all_orders
@app.get('/orders')
async def get_all_orders():
    """Get All Orders"""
    orders = Order.find((Order.slug=='order')).all()
    return orders



#!get_order
@app.get('/orders/{pk}')
async def get_order(pk:str):
    """Return specific order,for sended given value"""
    try:
        order = Order.get(pk=pk)
    except NotFoundError:
        return {'error': 'Order not found'},404
    return order



#!create_order
@app.post('/orders')
async def create_order(body:Order,background_tasks:BackgroundTasks):
    """Create a new order"""
    product_data = get_product_data(body.product_id)
    # print('Product data ', product_data)
    # print('oBdy attribute is ', body.quantity)
    
    order = Order(
        product_id=body.product_id,
        price=(product_data['price']*body.quantity),
        fee = 0.2 * (product_data['price'] * body.quantity),
        total = 1.2 * (product_data['price'] * body.quantity),
        quantity = body.quantity,
        status = 'pending'
    )
    created_order = order.save()
    if(created_order.pk):
        # print('WORKEDD')
        background_tasks.add_task(order_completed,order)
        # product_data['quantity'] = product_data['quantity']-body.quantity
        # update_product_data(body.product_id,product_data)
    return order



#*update_product_data
def update_product_data(product_id,product_data):
    url = f"http://127.0.0.1:4000/products/{product_id}"
    
    try:
        with httpx.Client() as client:
            response = client.patch(url,json=product_data)
            # print('Response is ', response)
        #Raise an exception for non-2xx status codes
        response.raise_for_status()
        return True
    except httpx.HTTPError as http_err:
        print('When update product quantity failed ', http_err)
        return False
    

#*get_product_data
def get_product_data(product_id):
    url = f"http://127.0.0.1:4000/products/{product_id}"
    try:
        with httpx.Client() as client:
            response = client.get(url).json()
        return response
    except httpx.HTTPError as http_err:
        print('When send get request to specific url return error ', http_err)
        return {http_err}
    

#?order_completed
def order_completed(order:Order):
    time.sleep(5)
    order.status = 'completed'
    order.save()
    redis.xadd("order_completed",order.dict(),'*')




#!delete_all_orders          
@app.delete('/orders')
async def delete_all_orders():
    """Delete all orders"""
    Order.find((Order.slug=='order')).delete()
    return {'success': 'Deleted all orders successfully'}
