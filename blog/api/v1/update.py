from blog.models import BlogInfo,BlogDetail,Category
from blog import common
from django.http import JsonResponse
from django.core.urlresolvers import reverse
from midware.midwares import shortcut
import datetime

def _updateCategoryCnt(cid,delta):
    #Update all category's cnt who has cid as a son.
    #Delta can be positive or negative.
    curCate = Category.objects.get(id=cid)
    curCate.cnt += delta
    curCate.save()
    if curCate.name != 'root':
        _updateCategoryCnt(curCate.fatherid,delta)

    


def updateShortcut(blogid,newshortcut):
    blogInfo = BlogInfo.objects.get(id = blogid)
    blogInfo.shortcut = newshortcut
    blogInfo.save()


def toggleStick(blogid):
    blogInfo = BlogInfo.objects.get(id = blogid)
    if not blogInfo.ontop:
        blogInfo.ontop = True
    else:
        blogInfo.ontop = False
    blogInfo.save()


def deleteBlog(blogid):
    info = BlogInfo.objects.get(id=blogid)
    detail = BlogDetail.objects.get(blogid=blogid)
    _updateCategoryCnt(info.categoryid,-1)
    detail.delete()
    info.delete()



def postBlog(blogid,ntitle,ncontent,ncategory):
    
    if blogid == -1:#new Blog
        newBlogInfo = BlogInfo()
        newBlogDetail = BlogDetail()
    else:
        newBlogInfo = BlogInfo.objects.get(id=blogid)
        newBlogDetail = BlogDetail.objects.get(blogid=blogid)
        oldCategory = Category.objects.get(id=newBlogInfo.categoryid)
    category = Category.objects.get(name=ncategory)

    newBlogInfo.title = ntitle
    newBlogInfo.categoryid = category.id
    newBlogInfo.shortcut = shortcut.GetShortCut(ncontent)
    newBlogInfo.save()
    
    newBlogDetail.blogid = newBlogInfo.id
    newBlogDetail.content = ncontent
    newBlogDetail.save()

    #Update categoy cnt
    if blogid !=-1:
        _updateCategoryCnt(cid = oldCategory.id , delta = -1)
    _updateCategoryCnt(cid = category.id , delta = 1)
    

def addCategory(fatherid,name):
    father = Category.objects.get(id=fatherid)
    if fatherid != 1:
        pathStr = father.pathStr+"#"+name
    else:
        pathStr = name
    newCategory = Category(
        name = name,
        fatherid = fatherid,
        pathStr = pathStr,
        cnt = 0,
    )
    newCategory.save()
    
def deleteCategory(categoryid):
    allCategory = Category.objects.all()
    category = Category.objects.get(id=categoryid)
    if category.cnt != 0:#Can not delete
        return
    
    for cate in allCategory:
        if cate.fatherid == category.id:
            return

    category.delete()

