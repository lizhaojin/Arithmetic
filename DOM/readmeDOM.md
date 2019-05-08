## DOM

### 1. Node 类型
    DOM1 定义了一个Node接口，由DOM中所有节点类型实现。
        每个节点都有一个 nodeType 属性，用来表明节点类型
        12个类型：
             Node.ELEMENT_NODE (1)； //最常用
             Node.ATTRIBUTE_NODE (2)；
             Node.TEXT_NODE (3)；    //最常用
             Node.CDATA_SECTION_NODE (4)；
             Node.ENTITY_REFERENCE_NODE (5)；
             Node.ENTITY_NODE (6)；
             Node.PROCESSING_INSTRUCTION_NODE (7)；
             Node.COMMENT_NODE (8)；
             Node.DOCUMENT_NODE (9)；
             Node.DOCUMENT_TYPE_NODE (10)；
             Node.DOCUMENT_FRAGMENT_NODE (11)；
             Node.NOTATION_NODE (12)。

#### 1.1 nodeName 和 nodeValue 属性
    nodeName的值是 元素 的标签名
    nodeValue的值始终为 null

#### 1.2 节点关系
    每个节点都有一个 childNodes 属性，
        他保存着一个 NodeList 对象，是一个类数组对象。
        有 length，可以[]访问值，但不是Array的实例。
        也可以使用 item()方法访问值。

    对于arguments对象可以用 Array.prototype.slice()方法将其转换为数组。
    同样可以在 NodeList对象上使用
    var arrayOfNodes = Array.prototype.slice.call(someNode.childNodes, 0);

    每个节点都有一个 parentNode 属性，指向文档树中的父节点。
    父节点的  firstChild 和 lastChild 属性分别指向 childNodes 列表中的 第一个和最后一个节点。

    在 childNodes 列表中，可以使用 previousSibling 和 nextSibling 属性 访问上下节点。

    hasChildNodes() 方法可以在节点包含一个或多个子节点的情况下返回 true.

    节点最后一个属性是 ownerDocument，他指向 表示整个文档的文档节点。

#### 1.3 操作节点
    appendChild()
    insertBefore(newNode, refNode)
    replaceChild(newNode, repNode)

#### 1.4 其他方法
    cloneNode(true) //深复制
    false //浅复制

    normalize() //处理文档树中的 文本节点。
    可能会出现文本节点 不包含文本，或者接连出现 两个文本节点的情况
    当在某个节点上调用这个方法时，就会在该节点的后代节点中查找上述两种情况。
    如果找到了空文本节点，则删除它；如果找到相邻的文本节点，则将它们合并为一个文本节点


### 2. document 类型
    document对象 是 HTMLDocument 的一个实例。表示整个 HTML页面。
    nodeType: 9
    nodeName: "#document"
    nodeValue/parentNode/ownerDocument: null

#### 2.1 文档子节点

    2个内置访问子节点的快捷方式： 
        1.documentElement属性 始终指向 HTML页面中的 <html> 元素
        2.通过 childNodes 列表访问文档元素

    document.body属性 直接指向 <body> 元素。
    document.doctype //取得对<!DOCTYPE>的引用

#### 2.2 文档信息
    //取得文档标题
    var originalTitle = document.title;

    //设置文档标题
    document.title = "New page title";

    //取得完整的 URL
    var url = document.URL;

    //取得域名
    var domain = document.domain;

    //取得来源页面的 URL
    var referrer = document.referrer;

#### 2.3 查找元素
    getElementById() //不存在则返回null

    //返回的是包含0个或多的元素的 NodeList
    // 在HTML文档中，返回的是一个HTMLCollection对象，作为一个动态合集。与NodeList非常相似。
    getElementsByTagName()

    HTMLCollection对象 还有一个方法，namedItem()，可以通过元素的 name 特性取得 集合 中的项。

    getElementsByName()方法 //只有HTMLDocument类型才有的方法

### 3. element 类型
    nodeType: 1
    
    访问标签名： nodeName/tagName

#### 3.1 HTML 元素

    每个element包含下面特性
    id,
    title,
    lang,
    dir,
    className： 与元素的class特性对应。

#### 3.2 取得特性
    getAttribute()
    setAttribute("attributeName", "value")
    removeAttribute()

#### 3.3 attributes 属性
    Element 类型是使用 attributes 属性的唯一一个 DOM 节点类型。
    此属性包含一个 NamedNodeMap, 与 NodeList 类似。
    元素的每个特性都由一个Attr节点表示，每个节点都保存在 NamedNodeMap 对象中
    他用于下列方法:
         getNamedItem(name) ：返回 nodeName 属性等于 name 的节点；
         removeNamedItem(name) ：从列表中移除 nodeName 属性等于 name 的节点；
         setNamedItem(node) ：向列表中添加节点，以节点的 nodeName 属性为索引；
         item(pos) ：返回位于数字 pos 位置处的节点。

#### 3.4 创建元素
    document.createElement()

### 4. text 类型
    nodeType: 3

    通过 nodeValue 属性 或 data 属性 访问 Text 节点中包含的文本。
    操作节点中文本：
         appendData(text) ：将 text 添加到节点的末尾。
         deleteData(offset, count) ：从 offset 指定的位置开始删除 count 个字符。
         insertData(offset, text) ：在 offset 指定的位置插入 text 。
         replaceData(offset, count, text) ：用 text 替换从 offset 指定的位置开始到 offset+count 为止处的文本。
         splitText(offset) ：从 offset 指定的位置将当前文本节点分成两个文本节点。
         substringData(offset, count) ：提取从 offset 指定的位置开始到 offset+count 为止处的字符串。

    文本还有一个 length 属性，保存着节点中的字符的数目。

    默认情况下包含内容元素最多只能有一个文本节点。

    <!-- 没有内容，也就没有文本节点 -->
    <div></div>

    <!-- 有空格，因而有一个文本节点 -->
    <div> </div>

    <!-- 有内容，因而有一个文本节点 -->
    <div>Hello World!</div>

#### 4.1 创建文本节点
    document.createTextNode()

### 5. attr 类型
    元素的 特性（属性）在DOM中用 Attr 类型表示
    nodeType: 2
    nodeName：属性名称
    nodeValue: 属性值

    getAttribute()/setAttribute()/removeAttribute()

    Attr 对象有3个属性： 
        name
        value
        specified //是一个布尔值

-------------------

## DOM 扩展

### 1. 选择符 API
#### 1.1 querySelector() 方法
    接受一个 css选择符，返回匹配的第一个元素。
    没有的话返回 null

#### 1.2 querySelectorAll() 方法
    返回一个 NodeList 的实例。
    没有找到返回 空

#### 1.3 matchesSelector() 方法
    接受一个css选择符
    如果调用元素与该选择符匹配，返回 true, 否则false.
    if (document.body.matchesSelector('body.page1')){
        // true
    }

### 2. 元素遍历
    对于元素间的空格，IE9及之前版本不会返回文本节点，而其他所有浏览器都会返回文本节点。这样，
    就导致了在使用 childNodes 和 firstChild 等属性时的行为不一致。为了弥补这一差异，而同时又保
    持 DOM规范不变，Element Traversal规范（www.w3.org/TR/ElementTraversal/）新定义了一组属性。
    Element Traversal API 为 DOM 元素添加了以下 5 个属性。
         childElementCount ：返回子元素（不包括文本节点和注释）的个数。
         firstElementChild ：指向第一个子元素； firstChild 的元素版。
         lastElementChild ：指向最后一个子元素； lastChild 的元素版。
         previousElementSibling ：指向前一个同辈元素； previousSibling 的元素版。
         nextElementSibling ：指向后一个同辈元素； nextSibling 的元素版。

### 3. HTML5

#### 3.1 与类相关的扩充
    getElementsByClassName() 方法
    classList 属性
        是新集合 DOMTokenList 的实例
         add(value) ：将给定的字符串值添加到列表中。如果值已经存在，就不添加了。
         contains(value) ：表示列表中是否存在给定的值，如果存在则返回 true ，否则返回 false 。
         remove(value) ：从列表中删除给定的字符串。
         toggle(value) ：如果列表中已经存在给定的值，删除它；如果列表中没有给定的值，添加它。

#### 3.2 焦点管理
    document.activeElement 属性
    这个属性始终会引用 DOM 中当前获得了焦点的元素

    document.hasFocus() 方法，用于确定文档是否获得了焦点

#### 3.3 自定义属性
    data- //为元素添加非标准的属性，目的提供与渲染无关或者语义信息
    之后可以通过元素的 dataset 属性访问他的值。