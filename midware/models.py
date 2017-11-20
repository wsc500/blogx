from django.db import models

# Create your models here.

class FileAndImage(models.Model):
    createdTime = models.DateTimeField(auto_now_add=True)
    filePath = models.CharField(max_length=100,default="")


