/**
 * 关于不同浏览器的CORS
 * 跨源资源共享的测试与使用，
 * 可以在所有浏览器中使用的方案
 * 
 *  abort() ：用于停止正在进行的请求。
 *  onerror ：用于替代 onreadystatechange 检测错误。
 *  onload ：用于替代 onreadystatechange 检测成功。
 *  responseText ：用于取得响应内容。
 *  send() ：用于发送请求。
 * 
 * @param {*} method 
 * @param {*} url 
 * 
 */
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        vxhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

var request = createCORSRequest("get", "http://www.baidu.com/page/");
if(request) {
    request.onload = function() {
        //对request.responseText 进行处理
    };
    request.send();
}