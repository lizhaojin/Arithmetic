### 1.1 事件处理程序
    click 、 load 和 mouseover ，都是事件的名字
    响应某个事件的函数就叫做事件处理程序（或事件侦听器）
    事件处理程序的名字以 "on" 开头

### 1.2 DOM0 级事件处理程序
    至今仍然为所有现代浏览器所支持。
    原因一是简单，二是具有跨浏览器的优势
        var btn = document.getElemenetById('myBtn');
        btn.onclick = function() {
            console.log('clicked');
            console.log(this.id);   //'mybtn'
        };

        btn.onclick = null;  //删除事件处理程序

    一般程序中的 this 引用当前元素

### 1.3 DOM2 级事件处理程序
    2个方法：用于删除和指定事件处理程序操作
        addEventListener()/removeEventListener()
        接受3个参数：
            要处理的事件名
            事件处理的函数
            布尔值（true:捕获阶段处理，false:冒泡阶段处理）

        var btn = document.getElemenetById('myBtn');
        btn.addEventListener('clicl', function() {
            console.log(this.id);
        }, false);

        var btn = document.getElementById("myBtn");
        //必须报处理函数拿出，才能在监听中去除事件监听
        var handler = function(){
            alert(this.id);
        };
        btn.addEventListener("click", handler, false);
        // 这里省略了其他代码
        btn.removeEventListener("click", handler, false); //有效

### 1.4 IE事件处理程序
    attachEvent()/detachEvent()
    这两个方法接受相同的两个参数：
        事件处理程序 名称
        事件处理程序 函数

    attachEvent() 以相反的顺序被触发
    DOM0 级方法中，在使用 attachEvent() 方法的情况下，事件处理程序会在全局作用域中运行，因此 this 等于 window

### 1.5 快浏览器的事件处理程序
    EventUtil 对象
        addHandler() 方法
        removeHandler() 方法


## 2. 事件对象
    触发DOM上某个事件时， 会产生一个事件对象 event
    包含着多有与事件相关的信息


### 关于距离
    clientX / clientY (鼠标指针在视口中的水平 和 垂直坐标)
    视口：浏览器的内容显示区域，不包含右侧滚动条

    pageX / pageY (鼠标在页面中的位置， 是从 页面本身测量，即使滚动了，
    不见的top距离也要算进去，还有左侧)

    screenX / screenY (鼠标相对于整个屏幕的坐标信息)

    其实在靠近景区的建筑顶层，可以看到乌鸦在四出张望，
    对面的白墙凝视久了，会让人忘记时间，其实也不知道
    是什么时间，只是觉得能够在游离的阳光下让人分辨不出
    什么是幻想，什么是真实。