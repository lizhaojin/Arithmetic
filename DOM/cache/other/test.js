//判断一个元素是否匹配给定的选择器

var tempParent = document.createElement('div');

zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    //引用浏览器提供的MatchesSelector方法
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector
    
    if (matchesSelector) {
        return matchesSelector.call(element, selector);
    } 

    //如果浏览器不支持MatchesSelector方法，则将节点放入一个临时div节点，
    //再通过selector来查找这个div下的节点集，再判断给定的element是否在节点集中，
    //如果在，则返回一个非零(即非false)的数字。

    // fall back to performing a selector:
    // var match, parent = element.parentNode,temp = !parent
    var match = element.parentNode;
    var parent = element.parentNode;
    var temp = !parent;
    //当element没有父节点，那么将其插入到一个临时的div里面
    if (temp)(parent = tempParent).appendChild(element)
    //将parent作为上下文，来查找selector的匹配结果，并获取element在结果集的索引，不存在时为－1,再通过~-1转成0，存在时返回一个非零的值
    match = ~zepto.qsa(parent, selector).indexOf(element)
    //将插入的节点删掉
    temp && tempParent.removeChild(element)
    return match
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector) {
    var found
    //当element为document,且selector为ID选择器时
    return (isDocument(element) && idSelectorRE.test(selector)) ?
    //直接返回document.getElementById,RegExp.$1为ID的值,当没有找节点时返回[]
    ((found = element.getElementById(RegExp.$1)) ? [found] : []) :
    //当element不为元素节点或者document时，返回[]
    (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
    //否则将获取到的结果转成数组并返回
    slice.call(
    //如果selector是标签名,直接调用getElementsByClassName
    classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
    //如果selector是标签名,直接调用getElementsByTagName
    tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
    //否则调用querySelectorAll
    element.querySelectorAll(selector))
  }