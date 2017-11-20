from django.shortcuts import render,redirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.urls import reverse
from django.contrib.auth.decorators import login_required as needLogin
# Create your views here.


@needLogin
def index(request):
    return render(request,'adminx/index.html')


def login(request):
    if request.method == "GET":
        nextpage = reverse("adminx:adminIndex")
        error = "false"
        if 'next' in request.GET:
            nextpage = request.GET['next']
        if 'error' in request.GET:
            error = request.GET['error']
        
        return render(request,'adminx/login.html',{
            'nextpage' : nextpage,
            'error': error
        })

    elif request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        nextpage = request.POST['next']
        user = authenticate(request,username=username,password=password)
        if user is not None:
            auth_login(request,user)
            return redirect(nextpage)
        else:
            return redirect(reverse("adminx:login")+"?next="+nextpage+"&error=true")



def logout(request):
    auth_logout(request)
    return redirect(reverse("adminx:login"))
