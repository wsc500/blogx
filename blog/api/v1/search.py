from blog.models import BlogInfo,BlogDetail,Category
from blog import common
from django.http import JsonResponse
from django.core.urlresolvers import reverse
import datetime
def toDict(blog):
    realTime = blog.createdTime + datetime.timedelta(hours=8)
    createdTime = realTime.strftime("%Y-%m-%d %H:%M")
    link = reverse('blog:blogDetail',args=[blog.id]) 
    return {
        'categoryid' : blog.categoryid,
        'title'      : blog.title,
        'shortcut'   : blog.shortcut,
        'createdTime': createdTime,
        'category'   : blog.category,
        'blogid'     : blog.id,
        'link'       : link,
        'ontop'      : blog.ontop,
    }

def search(key):
    blogs = common.handleSearchQuery(key)
    dicts = [toDict(x) for x in blogs]
    return dicts

def getDetail(bid):
    info = common.handleSearchQuery({'id':bid})[0]

    detail = common.getBlogDetail(bid)
    return {
        **toDict(info),
        'detail' : detail['detail'],
        'origin' : detail['origin'],
    }
