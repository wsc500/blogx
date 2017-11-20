from django.shortcuts import render,redirect
from midware.midwares.error import NewError
from django.contrib.auth.decorators import login_required as needLogin

# Create your views here.


@needLogin
def index(request):
    # I don't neet a fucking index.
    return create(request)


@needLogin
def create(request):
    if request.method == 'GET':
        return render(request,'adminx/blog/create.html',{
            'actionType':-1,
            'pageTitle':"New Blog",
        })


@needLogin
def category(request):
    return render(request,'adminx/blog/category.html')
 


@needLogin
def update(request):
    if request.method == 'GET':
        bid = -1
        if 'id' in request.GET:
            bid = int(request.GET['id'])
        return render(request,'adminx/blog/create.html',{
            'actionType':bid,
            'pageTitle':"Edit Blog",
        })
