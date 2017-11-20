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
var getUrlParam = function(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return -1;
}



$("#submit-btn").click(function () {
  var csrftoken = getCookie('csrftoken');
  if ($("#blog-id").val() == ""){
    $("#errorinfo").html('<div class="alert alert-danger" role="alert">No blog id.</div>');
    return false;
  }
  if ($("#categoryInput").val() == ""){
    $("#errorinfo").html('<div class="alert alert-danger" role="alert">Please select category.</div>');
    return false;
  }
  if ($("#titleInput").val() == ""){
    $("#errorinfo").html('<div class="alert alert-danger" role="alert">Please input title.</div>');
    return false;
  }

  $.ajax({
    url : GLOBAL_API_URL.submitBlog,
    data : {
      blogid : $("#blog-id").val(),
      category : $("#categoryInput").val(),
      title : $("#titleInput").val(),
      content : $("#editor-textarea").val()
    },
    type : 'POST',
    //async : false,
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    },
    success : function(response) {
      window.location.href = GLOBAL_API_URL.blogAdminPage;
    },
    error : function(response) {
      console.log(response);
    }
  });
});

$(document).ready(function () {
  var tree = [];
  $.ajax({
    url : GLOBAL_API_URL.getCategoryTree,
    data : {
      type: "json",
      canSelectParent: false
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
        $("#categoryInput").val(data.text);
      });
      setBlogDetail();
    },
    error : function(response) {
      console.log(response);
    }
  });
});


var setBlogDetail = function () {
  var blogId = $("#blog-id").val();
  if (blogId == -1){
    return;
  }
  $.ajax({
    url : GLOBAL_API_URL.getBlogDetail,
    data : {
      id : blogId,
    },
    type : 'GET',
    beforeSend:function(){
      //console.log("loading category tree...");
    },
    success : function(blog) {
      $("#titleInput").val(blog.title);
      $("#editor-textarea").val(blog.origin);

      var nodeCnt = $(".list-group").children().length;
      for(var i=0;i<nodeCnt;i++){
        var node = $('#tree').treeview('getNode', i);
        if (node.categoryid === blog.categoryid){
          $("#tree").treeview('selectNode', [ i, { silent: true } ]);
          $("#categoryInput").val(node.text);
        }
      }
    },
    error : function(response) {
      console.log(response);
    }
  });
};
