#

#!FastApi
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware


#!Models and Serializers
from models import Product

#!Redis Orm
from redis_om.model import NotFoundError

#!Python modules and methods
from datetime import datetime

import jwt
from decouple import config


# create your views here,and run server =>  uvicorn main:app --reload
# app = FastAPI()


# Create FastApi object from FastAPI class
app = FastAPI(title="Inventory")
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#!root
@app.get("/")
async def root():
    return {"message": "Inventory"}



#!get_all_products
@app.get('/products')
async def get_all_products(request:Request):
    """Get All Products"""
    # user_token = request.headers.get('Authorization').split()[1]
    
    # print('Payload is fro product +- ', payload['sub'])
    # print('Header value is ', user_token)

    products = Product.find((Product.slug=='product')).all()
    return products



#!create_product
@app.post('/products')
async def create_product(body:Product):
    """Create Product"""
    product = Product(name=body.name,price=body.price,quantity=body.quantity)
    product.save()
    return product



#!get_product
@app.get('/products/{pk}')
async def get_product(pk:str):
    """Return specific product,for sended given value"""
    try:
        product = Product.get(pk=pk)
    except NotFoundError:
        return {'error': 'Product not found'},404
    return product


#!update_product
@app.patch('/products/{pk}')
async def update_product(pk:str,body:dict):
    """Update product,according to what to user send"""
    product = Product.get(pk=pk)
    if product:
        product.name = body['name']
        product.slug = body['slug']
        product.price = body['price']
        product.quantity=body['quantity']
        product.created_date=body['created_date']
        
        product.save()
        return product
    else:
        raise NotFoundError('Product not found')


#!delete_product
@app.delete('/products/{pk}') 
async def delete_product(pk:str):
    """Delete product,which we sended pk value"""
    product = Product.get(pk=pk).name
    Product.delete(pk=pk)
    return {"success": f"Deleted {product} successfully"}


#!delete_all_blogs          
@app.delete('/products')
async def delete_all_product():
    """Delete all products"""
    Product.find((Product.slug=='product')).delete()
    return {'success': 'Deleted all products successfully'}
