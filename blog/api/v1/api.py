from .tree import getJsonTree,getSelectTree
from .search import search,getDetail
from .update import updateShortcut,toggleStick,deleteBlog,postBlog,addCategory,deleteCategory
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required as needLogin

statusSuccess = {"status":"success"}

def getCategoryApi(request):
    if request.method == "GET":
        requestType = request.GET['type']
        canSelectParent = request.GET['canSelectParent']=="true"
        selectedNode = [int(x) for x in request.GET.getlist('selectedNode')]
        if requestType == 'json':
            return JsonResponse({'treeData':getJsonTree(canSelectParent,selectedNode)})
        elif requestType == 'select':
            return JsonResponse({'treeData':getSelectTree()})



def searchBlogApi(request):
    if request.method == "GET":
        return JsonResponse(search(request.GET),safe=False)



def getBlogDetailApi(request):
    if request.method == "GET":
        return JsonResponse(getDetail(request.GET['id']))


@needLogin
def updateShortcutApi(request):
    if request.method == "POST":
        updateShortcut(request.POST['id'],request.POST['shortcut'])
        return JsonResponse(statusSuccess)



@needLogin
def toggleStickApi(request):
    if request.method == "POST":
        toggleStick(request.POST['id'])
        return JsonResponse(statusSuccess)

@needLogin
def deleteBlogApi(request):
    if request.method == "POST":
        deleteBlog(request.POST['id'])
        return JsonResponse(statusSuccess)


@needLogin
def submitBlogApi(request):
    if request.method == "POST":
        blogid = int(request.POST['blogid'])
        title = request.POST['title']
        content = request.POST['content']
        category = request.POST['category']

        postBlog(blogid,title,content,category)

        return JsonResponse(statusSuccess)
 

def addCategoryApi(request):
    if request.method == "POST":
        fatherid = int(request.POST['fatherid'])
        name = request.POST['name']
        addCategory(fatherid,name)
        return JsonResponse(statusSuccess)


def deleteCategoryApi(request):
    if request.method == "POST":
        deleteCategory(request.POST['id'])
        return JsonResponse(statusSuccess)
