from django.contrib import admin
from django.conf.urls import url, include
from django.contrib.auth.models import User
from django.conf.urls.static import static
from django.conf import settings

from midware.api.v1 import api as midwareApi
from blog.api.v1 import api as blogApi
from blog import views as superindex
#api url. Namespace is "api"
api_patterns = ([
    url(r'^renderMarkdown/$',midwareApi.renderMarkdownApi,
        name="renderMarkdown"),

    url(r'^uploadFile/$',midwareApi.uploadFilesApi,
        name="uploadFile"),

    url(r'^getCategoryTree/$',blogApi.getCategoryApi,
        name="getCategoryTree"),


    url(r'^searchBlog/$',blogApi.searchBlogApi,
        name="searchBlog"),

    url(r'^getBlogDetail/$',blogApi.getBlogDetailApi,
        name="getBlogDetail"),

    url(r'^updateShortcut/$',blogApi.updateShortcutApi,
        name="updateShortcut"),

    url(r'^toggleStick/$',blogApi.toggleStickApi,
        name="toggleStick"),

    url(r'^deleteBlog/$',blogApi.deleteBlogApi,
        name="deleteBlog"),

    url(r'^submitBlog/$',blogApi.submitBlogApi,
        name="submitBlog"),


    url(r'^addCategory/$',blogApi.addCategoryApi,
        name="addCategory"),



    url(r'^deletCategory/$',blogApi.deleteCategoryApi,
        name="deleteCategory"),





],"api")

urlpatterns = [
    #url(r'^admin/', admin.site.urls),
    url(r'^$',superindex.superindex),
    url(r'^blog/',include('blog.urls')),
    url(r'^abracadabra/',include('adminx.urls')),

    #apis
    url(r'^api/v1/',include(api_patterns)),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

