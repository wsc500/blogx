from midware.midwares.error import NewError
from midware.models import FileAndImage
from django.conf import settings
import random
import os
import time
import datetime



def _getUniqueName(suffix,mediaRoot):
    trycnt = 0
    while trycnt < 100:
        #It is impossible to try more than 100 times.
        #Otherwise there is something wrong
        today = datetime.date.today()
        name = str(today.year)+str(today.month)+str(today.day)
        name += str(random.randint(1,10000000))
        name += '.'+suffix
        if not os.path.exists(mediaRoot+name):
            return name
    #Something impossible happen.
    NewError("100 tries failed when giving name to a new file.This is impossible.")




def uploadFile(request):
    #TODO: error message
    mediaRoot = settings.MEDIA_ROOT
    mediaUrl = settings.MEDIA_URL
   

    originalName = request.FILES['pic'].name
    fileName = _getUniqueName(originalName.split('.')[-1],mediaRoot)
    
    # Save to DB
    newFile = FileAndImage(filePath=mediaRoot+fileName)
    newFile.save()

    # Write file
    with open(mediaRoot+fileName,'wb+') as dest:
        for chunk in request.FILES['pic']:
            dest.write(chunk)

    return mediaUrl+fileName

