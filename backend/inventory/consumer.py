
#!Models and Serializers
from main import Product

#!Redis
from models import redis


#!Python modules and functions
import time



#?Key and Group 
key="order_completed"
group = "inventory-groups"


#?Create group
try:
    #Create channel for data streaming one broker to another
    redis.xgroup_create(key, group)
except:
    print('Group already exists --- INVENTORY ----')
    

#?Loop request value
while True:
    try:
        #Read data from created channel
        # {key : ''} =>  indicates that we want to read messages starting from the last unread message in the stream. '>' represents the ID of the latest message in the stream. => Third parameter
        # None => The count parameter. It specifies the maximum number of messages to read from the stream. In this case, None means that all available messages will be read. => Four parameter

        results = redis.xreadgroup(group,key,{key:'>'},None)#Every 1 seconds consume this task
        if results != []:
            for result in results:
                obj = result[1][0][1]
                try:
                    product = Product.get(obj['product_id'])
                    product.quantity = product.quantity - int(obj['quantity']) 
                    product.save()
                except Exception as err:
                    redis.xadd('refund_order',obj,'*')
        
    except Exception as e:
        print(str(e))
    time.sleep(1)