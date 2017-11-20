from django.shortcuts import render
from midware.midwares.markdown import RenderMarkdown
from .upload import uploadFile
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required as needLogin

def renderMarkdownApi(request):
    if request.method == 'POST':
        afterRender = RenderMarkdown(request.POST['original'])
        return JsonResponse({'mdhtml':afterRender})


@needLogin
def uploadFilesApi(request):
    if request.method == 'POST':
        newFileUrl = uploadFile(request)
        return JsonResponse({'newFile':newFileUrl})

