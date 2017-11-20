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




/**
* 文本框根据输入内容自适应高度
* @param                {HTMLElement}        输入框元素
* @param                {Number}                设置光标与输入框保持的距离(默认0)
* @param                {Number}                设置最大高度(可选)
*/
var autoTextarea = function (elem, extra, maxHeight) {
  extra = extra || 0;
  var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
    isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
    addEvent = function (type, callback) {
      elem.addEventListener ?
        elem.addEventListener(type, callback, false) :
        elem.attachEvent('on' + type, callback);
    },
    getStyle = elem.currentStyle ? function (name) {
      var val = elem.currentStyle[name];

      if (name === 'height' && val.search(/px/i) !== 1) {
        var rect = elem.getBoundingClientRect();
        return rect.bottom - rect.top -
          parseFloat(getStyle('paddingTop')) -
          parseFloat(getStyle('paddingBottom')) + 'px';
      };

      return val;
    } : function (name) {
      return getComputedStyle(elem, null)[name];
    },
    minHeight = parseFloat(getStyle('height'));

  elem.style.resize = 'none';

  var change = function () {
    var scrollTop, height,
      padding = 0,
      style = elem.style;

    if (elem._length === elem.value.length) return;
    elem._length = elem.value.length;

    if (!isFirefox && !isOpera) {
      padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
    };
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    elem.style.height = minHeight + 'px';
    if (elem.scrollHeight > minHeight) {
      if (maxHeight && elem.scrollHeight > maxHeight) {
        height = maxHeight - padding;
        style.overflowY = 'auto';
      } else {
        height = elem.scrollHeight - padding;
        style.overflowY = 'hidden';
      };
      style.height = height + extra + 'px';
      scrollTop += parseInt(style.height) - elem.currHeight;
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      elem.currHeight = parseInt(style.height);
    };
  };

  addEvent('propertychange', change);
  addEvent('input', change);
  addEvent('focus', change);
  change();
};




$(document).ready(function () {
  $("#editor-preview-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    //while rendering...
    $("#editor-previewarea").html("<div class=\"alert alert-info\" role=\"alert\"><p>Rendering...Please wait...</p></div>")
    $.post(GLOBAL_API_URL.renderMarkdown,
    {original:$("#editor-textarea").val()},
    function(data,status){//render success
      $("#editor-previewarea").html("<div class=\"alert alert-success\" role=\"alert\"><p>Render Success.</p></div>"+data.mdhtml);
    });
  });
});



$(document).ready(function () {
  var text=document.getElementById("editor-textarea");
  autoTextarea(text);
});


$(document).ready(function () {
  $("#upload-file-btn").click(function () {
    var csrftoken = getCookie('csrftoken');
    var formData = new FormData();
    //var name = $("pic-input").val();
    formData.append("pic",$("#pic-input")[0].files[0]);
    //formData.append("name",name);
    $.ajax({
      url : GLOBAL_API_URL.uploadFile,
      type : 'POST',
      data : formData,
      processData : false,
      contentType : false,
      beforeSend:function(xhr, settings){
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
        //uploading...
        $("#upload-modal-icon").removeClass("fa-info-circle").addClass("fa-spinner fa-spin");
        $("#upload-modal-info").html("Uploading...");
      },
      success : function(response) {
        console.log(response.newFile);
        var addition = "![pic]"+"("+window.location.protocol+"//"+window.location.host+response.newFile+")";
        $('#editor-textarea').val($('#editor-textarea').val()+addition);
        $('#picUploadModal').modal('hide');
        $("#upload-modal-icon").removeClass("fa-spinner fa-spin").addClass("fa-info-circle");
        $("#upload-modal-info").html("Waiting upload");
      },
      error : function(responseStr) {
        $("#upload-modal-icon").removeClass("fa-spinner fa-spin").addClass("fa-times-circle");
        $("#upload-modal-alert").removeClass("alert-info").addClass("alert-danger");
        $("#upload-modal-info").html("Something wrong! Please contact admin.");
      }
    });
  });
});
