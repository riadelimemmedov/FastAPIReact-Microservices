
#!Models and Serializers
from main import Order

#!Redis
from models import redis


#!Python modules and functions
import time


#?Key and Group 
key="refund_order"
group="payment-group"


#?Create group
try:
    redis.xgroup_create(key,group)
except:
    print('Group already exists --- PAYMENT ----')


#?Loop request value
while True:
    try:
        results = redis.xreadgroup(group, key, {key: '>'}, None)
        if results != []:
            print('Results payment is ', results)
            for result in results:
                obj = result[1][0][1]
                order = Order.get(obj['pk'])
                order.status = 'refunded' 
                order.save()
    except Exception as err:
        print('Error when refunded order ', str(err))
    time.sleep(1)