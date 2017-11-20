from django.shortcuts import render,get_object_or_404,get_list_or_404
from .models import BlogInfo,BlogDetail,Category
from midware.midwares.markdown import RenderMarkdown
from midware.midwares.error import NewError
from .common import getBlogList,handleSearchQuery,getBlogDetail,getPreviousAndNext

# Create your views here.

def superindex(request):
    return render(request,'midware/superindex.html')


def index(request):
    return render(request,'blog/index.html',{
        'blogs' : getBlogList(stickTop=True),
    })

def list(request):
    return render(request,'blog/list.html',{
        'blogs' : handleSearchQuery(request.GET),
    })


def detail(request,bid):
    blogDetail = getBlogDetail(bid) 
    pandn = getPreviousAndNext(bid)
    return render(request,'blog/detail.html',{**blogDetail,**pandn})

