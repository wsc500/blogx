/**
* Django CSRF Token
*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var GLOBAL_BLOG = undefined;
var GLOBAL_CURRENT_NODE = undefined;

var setBlogDetail = function (blog) {//call by setBlogInfo()
  $("#toolbar").attr("style","display:inline");
  $("#blogContent").html(blog.detail);
  $("#shortcut").val(blog.shortcut);
  GLOBAL_BLOG = blog;
  if (blog.ontop){
    $("#stick-btn").html('<i class="fa fa-arrow-down" aria-hidden="true"></i> unstick');
  }else{
    $("#stick-btn").html('<i class="fa fa-arrow-up" aria-hidden="true"></i> stick');
  };
  $("#delete-blog-name").html(blog.title);
}

var setBlogInfo = function(blog){
  //console.log(blog);
  var newblog = $("<div></div>").attr("style","margin-bottom:50px").append(
    $("<h3></h3>").attr("style","margin-bottom:5px").append(
      $("<a></a>").attr("id","blogtitle"+blog.blogid).attr("href","#").html(blog.title),
    ),
    $("<p></p>").attr("style","margin-bottom:20px;color:#999;").append(
      blog.createdTime
    ),
    $("<div></div>").attr("id","shortcut"+blog.blogid).html(blog.shortcut),

  );

  $("#blogList").append(newblog);

  $("#blogtitle"+blog.blogid).click(function () {//搜索并设置blog detail
    $.ajax({
      url : GLOBAL_API_URL.getBlogDetail,
      data : {
        id: blog.blogid
      },
      type : 'GET',
      beforeSend:function(){
        //console.log("querying...",GLOBAL_API_URL.searchBlog);
        //$("#blogList").html( '<i class=\"fa fa-spinner fa-spin fa-2x fa-fw\"></i>');
      },
      success : function(blog) {
        //console.log(blog);
        //$("#blogList").html("");
        setBlogDetail(blog);
      },
      error : function(response) {
        console.log(response);
      }
    });
  });


};


var searchQuery = function(data){//根据分类搜索blog
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
        setBlogInfo(blogs[i]);
      }{}
    },
    error : function(response) {
      console.log(response);
    }
  });
};

var refreshEditableTree = function (isfirst=false) {
  var tree = [];
  if ( isfirst === false ){
    $("#editable-tree").treeview("remove");
  }
  $.ajax({
    url : GLOBAL_API_URL.getCategoryTree,
    data : {
      type: "json",
      canSelectParent: true
    },
    type : 'GET',
    //async : false,
    beforeSend:function(){
      //console.log("loading editable category tree...");
    },
    success : function(response) {
      tree = response.treeData;
      $("#editable-tree").treeview({
        data:tree,
        showBorder:false,
        showTags:true,
        levels:5,
      });
      $("#editable-tree").on('nodeSelected',function(event,data){
        $("#current-category").html(data.text);
        $("#del-category-name").val(data.text);
        GLOBAL_CURRENT_NODE = data;
      });
      $("#editable-tree").on('nodeUnselected',function(event,data){
        $("#current-category").html("ROOT");
        $("#del-category-name").val("Select a category");
        GLOBAL_CURRENT_NODE = undefined;
      });
    },
    error : function(response) {
      console.log(response);
    }
  });
}

$(document).ready(function () {
  var tree = [];
  $.ajax({//初始化分类树
    url : GLOBAL_API_URL.getCategoryTree,
    data : {
      type: "json",
      canSelectParent: true
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
        searchQuery(data);
      });
      $("#tree").on('nodeUnselected',function(event,data){
        searchQuery({categoryid:0});
      });
    },
    error : function(response) {
      console.log(response);
    }
  });
  refreshEditableTree(isfirst=true);
  searchQuery({categoryid:0});
});



$(document).ready(function () {//编辑按钮的行为
  $("#submit-shortcut-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    var newshortcut = $("#shortcut").val();
    var blog = GLOBAL_BLOG;
    $.ajax({
      url : GLOBAL_API_URL.updateShortcut,
      data : {
        id: blog.blogid,
        shortcut : newshortcut,
      },
      type : 'POST',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      },
      success : function(response) {
        $("#shortcut"+blog.blogid).html(newshortcut);
        $('#shortcutModal').modal('hide');
      },
      error : function(response) {
        console.log(response);
      }
    });
  });
  $("#stick-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    var blog = GLOBAL_BLOG;
    $.ajax({
      url : GLOBAL_API_URL.toggleStick,
      data : {
        id: blog.blogid,
      },
      type : 'POST',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      },
      success : function(response) {
        blog.ontop = !blog.ontop;
        if (blog.ontop){
          $("#stick-btn").html('<i class="fa fa-arrow-down" aria-hidden="true"></i> unstick');
        }else{
          $("#stick-btn").html('<i class="fa fa-arrow-up" aria-hidden="true"></i> stick');
        }
        //$("#shortcut"+blog.blogid).html(newshortcut);
        //$('#shortcutModal').modal('hide');
      },
      error : function(response) {
        console.log(response);
      }
    });
  });
  $("#deltet-blog-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    var blog = GLOBAL_BLOG;
    $.ajax({
      url : GLOBAL_API_URL.deleteBlog,
      data : {
        id: blog.blogid,
      },
      type : 'POST',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      },
      success : function(response) {
        window.location.reload();
      },
      error : function(response) {
        console.log(response);
      }
    });
  });
  $("#edit-btn").click(function () {
    console.log(GLOBAL_API_URL.updateBlogPage+"?id="+GLOBAL_BLOG.blogid);
    window.location.href=GLOBAL_API_URL.updateBlogPage+"?id="+GLOBAL_BLOG.blogid;
  });
  $("#delete-category-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    categoryid = -1;
    if (GLOBAL_CURRENT_NODE !== undefined){
      categoryid = GLOBAL_CURRENT_NODE.categoryid;
    }
    $.ajax({
      url : GLOBAL_API_URL.deleteCategory,
      data : {
        id: categoryid,
      },
      type : 'POST',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      },
      success : function(response) {
        refreshEditableTree();
      },
      error : function(response) {
        console.log(response);
      }
    });
  });
  $("#add-category-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    var fatherid = 1;
    if (GLOBAL_CURRENT_NODE !== undefined){
      fatherid = GLOBAL_CURRENT_NODE.categoryid;
    }
    $.ajax({
      url : GLOBAL_API_URL.addCategory,
      data : {
        fatherid: fatherid,
        name : $("#add-category-name").val()
      },
      type : 'POST',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      },
      success : function(response) {
        refreshEditableTree();
      },
      error : function(response) {
        console.log(response);
      }
    });
  });
  $('#categoryModal').on('hidden.bs.modal', function (e) {
    window.location.reload();
  });
});
