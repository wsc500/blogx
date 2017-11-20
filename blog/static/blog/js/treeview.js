var getUrlParam = function(name){
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]); return -1;
}
var searchQuery = function(event,data){
  queryString = "?category=" + data.categoryid;
  window.location.href=GLOBAL_API_URL.blogList+queryString;
};

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
      });
    },
    error : function(response) {
      console.log(response);
    }
  });
});
