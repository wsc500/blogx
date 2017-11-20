var getUrlParam = function(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return -1;
}

var setBlog = function(blog){
  var blog = $("<div></div>").addClass("blog-post").append(
    $("<h2></h2>").addClass("blog-post-title").append(
      $("<a></a>").attr("href",blog.link).html(blog.title),
    ),
    $("<p></p>").addClass("blog-post-meta").append(
      $("<i></i>").addClass("fa fa-book fa-1x").attr("aria-hidden","true"),
      blog.category,
      " @ ",
      blog.createdTime
    ),
    blog.shortcut,
  );

  $("#blogList").append(blog);
};

var searchQuery = function(event,data){
  $.ajax({
    url : GLOBAL_API_URL.searchBlog,
    data : {
      category: data.categoryid,
    },
    type : 'GET',
    beforeSend:function(){
      console.log("querying...",GLOBAL_API_URL.searchBlog);
      $("#blogList").html( '<i class=\"fa fa-spinner fa-spin fa-2x fa-fw\"></i>');
    },
    success : function(blogs) {
      $("#blogList").html("");
      for (var i=0;i<blogs.length;i++){
        setBlog(blogs[i]);
      }{}
    },
    error : function(response) {
      console.log(response);
    }
  });
};

var replaceUrl = function (data) {
  var url = window.location.href.split('?')
  window.history.replaceState(null,null,url[0]+"?category="+data.categoryid);
}

$(document).ready(function () {
  var tree = [];
  $.ajax({
    url : GLOBAL_API_URL.getCategoryTree,
    data : {
      type: "json",
      canSelectParent: true,
      selectedNode: getUrlParam("category")
    },
    type : 'GET',
    //async : false,
    beforeSend:function(){
      console.log("loading category tree...");
    },
    success : function(response) {
      tree = response.treeData;
      $("#tree").treeview({
        data:tree,
        showBorder:false,
        showTags:true,
        levels:5,
      });
      $("#tree").on('nodeSelected',function(event,data){
        searchQuery(event,data);
        replaceUrl(data);
      });
    },
    error : function(response) {
      console.log(response);
    }
  });
});
