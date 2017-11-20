from django.db import models

# Create your models here.
class BlogInfo(models.Model):
    createdTime = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100,default="")
    shortcut = models.CharField(max_length=300,default="")
    categoryid = models.IntegerField(default=1)
    ontop = models.BooleanField(default=False)


class BlogDetail(models.Model):
    blogid = models.IntegerField(default=0)
    content = models.TextField(default="")


class Category(models.Model):
    name = models.CharField(max_length=100,default="")
    fatherid = models.IntegerField(default=1)
    pathStr = models.CharField(max_length=300,default="")
    cnt = models.IntegerField(default=0)
    #pathStr is a descption of categorys path. e.g. AAA#BBB#CCC. Used for optimize db.

