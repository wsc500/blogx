from blog.models import Category,BlogInfo

# getCategoryApi

def getJsonTree(canSelectParent=True,selectedNode=[]):
    categorys = Category.objects.all()
    # a bit magic to generate treeData
    treeData = []
    sonid = {'root':{}} 
    for cate in categorys:
        if cate.name == "root":
            continue
        path = ("root#"+cate.pathStr).split('#')
        cur = treeData # attition: cur is a pointer in fact.
        father = "root" # ONLY root's name is "root"!
        for element in path[:-1]:
            if element == "root":
                continue
            cur = cur[sonid[father][element]]['nodes']
            father = element

        nodeData = {
            'text':cate.name,
            'tags':[cate.cnt],
            'nodes':[],
            'categoryid':cate.id,
        }
        if cate.id in selectedNode:
            nodeData['state'] = {'selected':True}
        cur.append(nodeData)
        sonid[path[-1]]={}
        sonid[path[-2]][cate.name]=len(cur)-1
        
        
    
    def removeBlankList(cur):
        if len(cur['nodes']) == 0:
            cur.pop('nodes')
        else:
            if not canSelectParent:
                cur['selectable'] = False
            for node in cur['nodes']:
                removeBlankList(node)
    for node in treeData:
        removeBlankList(node)
    # TODO: should treeData be cached?
    return treeData

def getSelectTree():
    return ""

