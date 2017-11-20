from django.conf.urls import url,include

from . import views
from . import views_blog as blogviews

blog_patterns = [

    url(r'^$',blogviews.index,name="blogAdmin"),
    url(r'^create/$',blogviews.create,name="createBlog"),
    url(r'^category/$',blogviews.category,name='category'),
    url(r'^update/$',blogviews.update,name='updateBlog'),
]

app_name = 'adminx'
urlpatterns = [
    url(r'^$',views.index,name="adminIndex"),
    
    #User
    url(r'^login/$',views.login,name="login"),
    url(r'^logout/$',views.logout,name="logout"),

    #Blog Admins
    url(r'^blog/',include(blog_patterns)),
    
    #Wiki Admins
    
]

