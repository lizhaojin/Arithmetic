/**
 * 用了三种方式来确定一个节点是不是另一个节点的后代
 * 
 * @param {参考节点} refNode 
 * @param {要检查的节点} otherNode 
 */

function contains(refNode, otherNode) {

    // 首先检测 refNode 中是否存在 contains() 方法，也就是能力检测
    // 另外还检查了当前浏览器所用的 WebKit 版本号
    // 如果方法存在且不是webkit则继续执行代码，如果是webkit则至少是不小于522的safari3才可以
    // 因为在522以下无法使用
    if (typeof refNode.contains == 'function' && 
    (!clientInformation.engine.webkit || clientInformation.engine.webkit >= 522)) {
        return refNode.contains(otherNode);

        // 检车是否存在  compareDocumentPosition() 方法
    } else if (typeof refNode.compareDocumentPosition == 'function') {
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        
        // 从otherNode开始向上遍历DOM结构，以递归的方式取得 parentNode，
        // 并检查其是否与refNode相等。在文档树的顶端，parentNode的值等于null,于是循环结束。
        var node = otherNode.parentNode;
        do {
            if (node === refNode) {
                return true;
            } else {
                node = node.parentNode;
            }
        } while (node !== null);

        return false;
    }
}