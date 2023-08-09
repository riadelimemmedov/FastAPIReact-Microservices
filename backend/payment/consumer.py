
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
def getPaymentDetail():
    while True:
        try:
            results = redis.xreadgroup(group, key, {key: '>'}, None)
            print('Results is  PAYMENTTTT', results)
            if results != []:
                for result in results:
                    obj = result[1][0][1]
                    try:
                        print('Result order data is ..... ', obj)
                    except:
                        print('Error +++++')
        except Exception as err:
            print('Error when refunded order ', str(err))
        time.sleep(1)
getPaymentDetail()
