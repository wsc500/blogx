#Common function related to blog app
from django.shortcuts import get_object_or_404,get_list_or_404
from .models import BlogInfo,BlogDetail,Category
from midware.midwares.markdown import RenderMarkdown

def getCategoryStr(category):
    # Replasc # to -> in category.pathStr
    if isinstance(category,list):
        # return a list if category is a list.
        result = [x.pathStr.replace('#',' -> ') for x in category]
        return result
    else:
        return category.pathStr.replace('#',' -> ')



def getBlogList(stickTop=False,filters={}):
    # filters is a map:
    #   title_contain : string
    #   category      : list[]
    #   id            : int
    #   createtime    : (datetime,datetime)  : (start,end)

    kwargs = {}
    if 'title_contain' in filters:
        kwargs['title__contains']=filters['title_contain']
    if 'createtime' in filters:
        kwargs['createdTime__range']=filters['createtime']
    if 'category' in filters:
        kwargs['categoryid__in']=filters['category']
    if 'id' in filters:
        kwargs['id']=filters['id']

    
    if stickTop:
        topBlogs = BlogInfo.objects.filter(ontop=True)
        kwargs['ontop']=False
    else:
        topBlogs = []

    normalBlogs = BlogInfo.objects.filter(**kwargs) 
   
    result = []
    for blog in topBlogs:
        if stickTop:
            content = BlogDetail.objects.get(blogid=blog.id).content
            blog.shortcut = RenderMarkdown(content)
        blog.category = getCategoryStr(Category.objects.get(id=blog.categoryid))
        result.append(blog)


    for blog in normalBlogs:
        blog.category = getCategoryStr(Category.objects.get(id=blog.categoryid))
        result.append(blog)
         
    return result


def handleSearchQuery(key):
    # resolve GET request for blog search and call getBlogList()
    filters = {}
    if 'title' in key:
        filters['title_contain'] = key['title']
    if 'category' in key:
        target = [int(x) for x in key.getlist('category')]
        categorys = Category.objects.all()
        for cate in categorys:
            if cate.fatherid in target:
                target.append(cate.id)
        filters['category'] = target
    if 'id' in key:
        filters['id'] = int(key['id'])
    if 'startime' in key and 'endtime' in key:
        #TODO : time search
        print (key['startime'],key['endtime'])
    
    return getBlogList(filters = filters)

def getBlogDetail(bid):
    # return a dict about blog detail
    info = get_object_or_404(BlogInfo,id=bid)
    detail = get_object_or_404(BlogDetail,blogid=bid)
    category = get_object_or_404(Category,id=info.categoryid)
     
    return {
        'detail'  : RenderMarkdown(detail.content),
        'info'    : info,
        'category': getCategoryStr(category),
        'origin'  : detail.content,
    }

def getPreviousAndNext(bid):
    pre = BlogInfo.objects.filter(id__lt=bid).order_by('-id')[:1]
    nxt = BlogInfo.objects.filter(id__gt=bid)[:1]
    if len(pre) == 0:
        preid = -1
    else:
        preid = pre[0].id

    if len(nxt) == 0:
        nxtid = -1
    else:
        nxtid = nxt[0].id

    return {
        'preid' : preid,
        'nxtid' : nxtid,
    }
