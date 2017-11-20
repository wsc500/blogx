import markdown2

def RenderMarkdown(text):
    markdowner = markdown2.Markdown(extras={
        'fenced-code-blocks':None,
        'footnotes':None,
        'nofollow':None,
        'tables':None,
        'html-classes':{
            'table':'table',
        },
    })
    return markdowner.convert(text)



