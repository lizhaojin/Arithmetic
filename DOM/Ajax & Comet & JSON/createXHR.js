/**
 * 关于Ajax
 * open()方法和send()方法
 * 分别用于打开请求并准备，send()用于发送
 * 
 * 相应之后 数据 会自动填充 XRH 对象的属性，他包括:
 *  responseText ：作为响应主体被返回的文本。
 *  responseXML ：如果响应的内容类型是 "text/xml" 或 "application/xml" ，
 * 这个属性中将保存包含着响应数据的 XML DOM 文档。
 *  status ：响应的 HTTP 状态。
 *  statusText ：HTTP 状态的说明
 * 
 * 关于异步请求：
 * 可以检测 XHR 对象的 readyState 属性，该属性表示请求/响应过程的当前活动阶段
 *  0 ：未初始化。尚未调用 open() 方法。
 *  1 ：启动。已经调用 open() 方法，但尚未调用 send() 方法。
 *  2 ：发送。已经调用 send() 方法，但尚未接收到响应。
 *  3 ：接收。已经接收到部分响应数据。
 *  4 ：完成。已经接收到全部响应数据，而且已经可以在客户端使用了
 * 
 * 只要 readyState 属性的值由一个值变成另一个值，
 * 都会触发一次 readystatechange 事件。
 * 我们只对 readyState 值为 4 的阶段感兴趣，
 * 因为这时所有数据都已经就绪。
 * 
 * 不过，
 * 必须在调用 open() 之前指定 onreadystatechange事件处理程序
 * 才能确保跨浏览器兼容性
 */

function createXHR() {
    // if (typeof XMLHttpRequest != 'undefined') {
    //     return new XMLHttpRequest();
    // } else if (typeof ActiveXObject != 'undefined') {
    //     if (typeof arguments.callee.activeXString != 'string') {
    //         var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", 
    //                         "MSXML2.XMLHttp"],
    //             i, len;
            
    //         for (i = 0, len = versions.length; i < len; i++) {
    //             try {
    //                 new ActiveXObject(versions[i]);
    //                 arguments.callee.activeXString = versions[i];
    //                 break;
    //             } catch (e) {
    //                 //跳过
    //             }
    //         }
    //     }

    //     return new ActiveXObject(arguments.callee.activeXString);
    // } else {
    //     throw new Error("No XHR object available");
    // }

    if (window.XMLHttpRequest) {
        //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        return new XMLHttpRequest();
    } else {
        // IE6, IE5 浏览器执行代码
        return new ActiveXObject("Microsoft.XMLHTTP");
    }

}

var xhr = createXHR();
// 调用open()方法并不会真正发送请求
// 而只是启动一个请求以备发送。
// true代表异步请求,false为同步请求
xhr.open("get", "example.txt", false);

// 要发送请求，需要调用send()方法
xhr.send(null);

// 接受到响应后，第一步：检查status属性，以确定响应已经成功返回。
// 其中200代表成功，此时responseText属性的内容已经就绪
// 304表示请求的资源并没有被修改，可以直接使用浏览器中的缓存的版本。

if ((xhr.status >= 200 && xhr.status < 300) || shr.status == 304) {
    alert(xhr.responseText);
} else {
    alert("Request was unsuccessful: " + xhr.status);
}

// 异步请求例子,上面是同步请求的例子
var xhr = createXHR();
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
// 此时第三个参数为true，代表异步
xhr.open("get", "example.txt", true);
xhr.send(null);

// 接收到响应之前还可以调用 abort() 方法来取消异步请求
// xhr.abort();