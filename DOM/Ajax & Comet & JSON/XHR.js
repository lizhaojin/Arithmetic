function createXHR () {

    var xhr;
    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xhr=new XMLHttpRequest();
    } else {
        // IE6, IE5 浏览器执行代码
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xhr.onreadystatechange = function() {
        // 异步请求之下需要检测readystatechange事件
        // 数值为4已经接收到全部响应数据，而且已经可以在客户端使用了。
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                alert(xhr.responseText);
            } else {
                alert("Request was unsuccessful: " + xhr.status);
            }
        }
    };

    xhr.open("get", "example.txt", true);
    xhr.send(null);  
}

