//将NodeList转换为数组，在所有浏览器下都可以运行。
//convert 美 /kən'vɝt/转变 改变
function convertToArray(nodes) {
    var array = null;
    try {
        array = Array.prototype.slice.call(nodes, 0); //针对非IE浏览器
    } catch (ex) {
        array = new Array();
        for(var i = 0, len=nodes.length; i < len; i++) {
            array.push(nodes[i]);
        }
    }

    return array;
}
