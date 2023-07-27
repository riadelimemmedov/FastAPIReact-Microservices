from tortoise import fields, models



#!Users
class Users(models.Model):
    ROLE_TYPE = [
        ('ADMIN','Admin'),
        ('USER','User')
    ]
    
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=20, unique=True)
    full_name = fields.CharField(max_length=50, null=True)
    password = fields.CharField(max_length=128, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)
    user_role = fields.CharField(max_length=50,null=True,choices=ROLE_TYPE)
    
    
    def __str__(self):
        return f"{self.username}:{self.full_name}"
    