from django.conf.urls import url,include

from . import views
app_name = 'blog'
urlpatterns = [
    url(r'^$',views.index,name="blogIndex"),
    url(r'^(?P<bid>[0-9]+)/$',views.detail,name="blogDetail"),
    url(r'^list/$',views.list,name="blogList"),
]
