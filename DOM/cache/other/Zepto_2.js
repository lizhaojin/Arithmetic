var Zepto = (function() {
  var undefined,
      key,
      $,
      classList,
      emptyArray = [],
  
    slice = emptyArray.slice,
    filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, 
    classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    //设置CSS时，不用加px单位的属性
    cssNumber = {
      'column-count': 1,
      'columns': 1,
      'font-weight': 1,
      'line-height': 1,
      'opacity': 1,
      'z-index': 1,
      'zoom': 1
    },
    //HTML代码片断的正则
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    //匹配非单独一个闭合标签的标签，类似将<div></div>写成了<div/>
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    //根节点
    rootNodeRE = /^(?:body|html)$/i,

    //需要提供get和set的方法名
    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
    //相邻节点的一些操作
    adjacencyOperators = ['after', 'prepend', 'before', 'append'],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),

    //这里的用途是当需要给tr,tbody,thead,tfoot,td,th设置innerHTMl的时候，需要用其父元素作为容器来装载HTML字符串
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table,
      'thead': table,
      'tfoot': table,
      'td': tableRow,
      'th': tableRow,
      '*': document.createElement('div')
    },

    //当DOM ready的时候，document会有以下三种状态的一种
    readyRE = /complete|loaded|interactive/,

    //class选择器的正则
    classSelectorRE = /^\.([\w-]+)$/,
    //id选择器的正则
    idSelectorRE = /^#([\w-]*)$/,
    //DOM标签正则
    tagSelectorRE = /^[\w-]+$/,
    
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div');

  //判断一个元素是否匹配给定的选择器
  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    //引用浏览器提供的MatchesSelector方法
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector);
    //如果浏览器不支持MatchesSelector方法，则将节点放入一个临时div节点，
    //再通过selector来查找这个div下的节点集，再判断给定的element是否在节点集中，如果在，则返回一个非零(即非false)的数字
    // fall back to performing a selector:
    var match, parent = element.parentNode,temp = !parent
    //当element没有父节点，那么将其插入到一个临时的div里面
    if (temp)(parent = tempParent).appendChild(element)
    //将parent作为上下文，来查找selector的匹配结果，并获取element在结果集的索引，不存在时为－1,再通过~-1转成0，存在时返回一个非零的值
    match = ~zepto.qsa(parent, selector).indexOf(element)
    //将插入的节点删掉
    temp && tempParent.removeChild(element)
    return match
  }

  //获取对象类型 

  function type(obj) {
    //obj为null或者undefined时，直接返回'null'或'undefined'
    return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) {
    return type(value) == "function"
  }

  function isWindow(obj) {
    return obj != null && obj == obj.window
  }

  function isDocument(obj) {
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE
  }

  function isObject(obj) {
    return type(obj) == "object"
  }
  //对于通过字面量定义的对象和new Object的对象返回true，new Object时传参数的返回false
  //可参考http://snandy.iteye.com/blog/663245

  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
  }

  function isArray(value) {
    return value instanceof Array
  }
  //类数组，比如nodeList，这个只是做最简单的判断，如果给一个对象定义一个值为数据的length属性，它同样会返回true

  function likeArray(obj) {
    return typeof obj.length == 'number'
  }

  //清除给定的参数中的null或undefined，注意0==null,'' == null为false

  function compact(array) {
    return filter.call(array, function(item) {
      return item != null
    })
  }
  //类似得到一个数组的副本

  function flatten(array) {
    return array.length > 0 ? $.fn.concat.apply([], array) : array
  }
  //将字符串转成驼峰式的格式
  camelize = function(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : ''
    })
  }

  //将字符串格式化成-拼接的形式,一般用在样式属性上，比如border-width
  function dasherize(str) {
    return str.replace(/::/g, '/') //将：：替换成/
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2') //在大小写字符之间插入_,大写在前，比如AAAbb,得到AA_Abb
    .replace(/([a-z\d])([A-Z])/g, '$1_$2') //在大小写字符之间插入_,小写或数字在前，比如bbbAaa,得到bbb_Aaa
    .replace(/_/g, '-') //将_替换成-
    .toLowerCase() //转成小写
  }

  //数组去重，如果该条数据在数组中的位置与循环的索引值不相同，则说明数组中有与其相同的值
  uniq = function(array) {
    return filter.call(array, function(item, idx) {
      return array.indexOf(item) == idx
    })
  }

  //将给定的参数生成正则
  function classRE(name) {
    //classCache,缓存正则
    return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  //给需要的样式值后面加上'px'单位，除了cssNumber里面的指定的那些
  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  //获取节点的默认display属性
  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) { //缓存里不存在
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block") //当display等于none时，设置其值为block,搞不懂为毛要这样
      elementDisplay[nodeName] = display //缓存元素的默认display属性
    }
    return elementDisplay[nodeName]
  }

  //获取指定元素的子节点(不包含文本节点),Firefox不支持children，所以只能通过筛选childNodes
  function children(element) {
    return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
      if (node.nodeType == 1) return node
    })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    //将类似<div class="test"/>替换成<div class="test"></div>,算是一种修复吧
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
    //给name取标签名
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    //设置容器标签名，如果不是tr,tbody,thead,tfoot,td,th，则容器标签名为div
    if (!(name in containers)) name = '*'

    var nodes, dom, container = containers[name] //创建容器
    container.innerHTML = '' + html //将html代码片断放入容器
    //取容器的子节点，这样就直接把字符串转成DOM节点了
    dom = $.each(slice.call(container.childNodes), function() {
      container.removeChild(this) //逐个删除
    })
    //如果properties是对象, 则将其当作属性来给添加进来的节点进行设置
    if (isPlainObject(properties)) {
      nodes = $(dom) //将dom转成zepto对象，为了方便下面调用zepto上的方法
      //遍历对象，设置属性
      $.each(properties, function(key, value) {
        //如果设置的是'val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'，则调用zepto上相对应的方法
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }
    //返回将字符串转成的DOM节点后的数组，比如'<li></li><li></li><li></li>'转成[li,li,li]
    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn //通过给dom设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  //判断给定的参数是否是Zepto集
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z() //没有参数，返回空数组
    //如果selector是个函数，则在DOM ready的时候执行它
    else if (isFunction(selector)) return $(document).ready(selector)
    //如果selector是一个zepto.Z实例，则直接返回它自己
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      //如果selector是一个数组，则将其里面的null,undefined去掉
      if (isArray(selector)) dom = compact(selector)
      //如果selector是个对象，注意DOM节点的typeof值也是object，所以在里面还要再进行一次判断
      else if (isObject(selector))
      //如果是申明的对象，如{}， 则将selector属性copy到一个新对象，并将结果放入数组
      //如果是该对象是DOM，则直接放到数组中
      dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
      //如果selector是一段HTML代码片断，则将其转换成DOM节点
      else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      //如果存在上下文context，则在上下文中查找selector，此时的selector为普通的CSS选择器
      else if (context !== undefined) return $(context).find(selector)
      //如果没有给定上下文，则在document中查找selector，此时的selector为普通的CSS选择器
      else dom = zepto.qsa(document, selector)
      //最后将查询结果转换成zepto集合
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context) {
    return zepto.init(selector, context)
  }

  //扩展，deep表示是否深度扩展

  function extend(target, source, deep) {
    for (key in source)
    //如果深度扩展
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      //如果要扩展的数据是对象且target相对应的key不是对象
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {}
      //如果要扩展的数据是数组且target相对应的key不是数组
      if (isArray(source[key]) && !isArray(target[key])) target[key] = []
      extend(target[key], source[key], deep)
    } else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target) {
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') { //当第一个参数为boolean类型的值时，表示是否深度扩展
      deep = target
      target = args.shift() //target取第二个参数
    }
    //遍历后面的参数，全部扩展到target上
    args.forEach(function(arg) {
      extend(target, arg, deep)
    })
    return target
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

  //在结果中进行过滤

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }
  //判断parent是否包含node
  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  //这个函数在整个库中取着很得要的作用，处理arg为函数或者值的情况
  //下面很多设置元素属性时的函数都有用到

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    //如果设置的值为null或undefined,则相当于删除该属性，否则设置name属性为value
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString

  function className(node, value) {
    var klass = node.className,
      svg = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self

  function deserializeValue(value) {
    var num
    try {
      return value ? value == "true" || (value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value
    } catch (e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  //空对象
  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  //获取指定的值在数组中的位置
  $.inArray = function(elem, array, i) {
    return emptyArray.indexOf.call(array, elem, i)
  }
  //将字符串转成驼峰式的格式
  $.camelCase = camelize
  //去字符串头尾空格
  $.trim = function(str) {
    return str.trim()
  }

  // plugin compatibility
  $.uuid = 0
  $.support = {}
  $.expr = {}

  //遍历elements，将每条记录放入callback里进宪处理，保存处理函数返回值不为null或undefined的结果
  //注意这里没有统一的用for in,是为了避免遍历数据默认属性的情况，如数组的toString,valueOf
  $.map = function(elements, callback) {
    var value, values = [],
      i, key
      //如果被遍历的数据是数组或者nodeList
    if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
      value = callback(elements[i], i)
      if (value != null) values.push(value)
    } else
    //如果是对象
    for (key in elements) {
      value = callback(elements[key], key)
      if (value != null) values.push(value)
    }
    return flatten(values)
  }

  //遍历数组，将每条数据作为callback的上下文，并传入数据以及数据的索引进行处理，如果其中一条数据的处理结果明确返回false，
  //则停止遍历，并返回elements
  $.each = function(elements, callback) {
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
      if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
      if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }
  //过滤
  $.grep = function(elements, callback) {
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  //填充class2type的值
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase()
  })

  //针对DOM的一些操作
  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn) {
      return $($.map(this, function(el, i) {
        return fn.call(el, i, el)
      }))
    },
    slice: function() {
      return $(slice.apply(this, arguments))
    },
    //DOM Ready
    ready: function(callback) {
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function() {
        callback($)
      }, false)
      return this
    },
    //取集合中对应指定索引的值，如果idx小于0,则idx等于idx+length,length为集合的长度
    get: function(idx) {
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    //将集合转换为数组
    toArray: function() {
      return this.get()
    },
    //获取集合长度
    size: function() {
      return this.length
    },
    //将集合从dom中删除
    remove: function() {
      return this.each(function() {
        if (this.parentNode != null) this.parentNode.removeChild(this)
      })
    },
    //遍历集合，将集合中的每一项放入callback中进行处理，去掉结果为false的项，注意这里的callback如果明确返回false
    //那么就会停止循环了
    each: function(callback) {
      emptyArray.every.call(this, function(el, idx) {
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    //过滤集合，返回处理结果为true的记录
    filter: function(selector) {
      //this.not(selector)取到需要排除的集合，第二次再取反(这个时候this.not的参数就是一个集合了)，得到想要的集合
      if (isFunction(selector)) return this.not(this.not(selector))
      //filter收集返回结果为true的记录
      return $(filter.call(this, function(element) {
        return zepto.matches(element, selector) //当element与selector匹配，则收集
      }))
    },
    //将由selector获取到的结果追加到当前集合中
    add: function(selector, context) {
      return $(uniq(this.concat($(selector, context)))) //追加并去重
    },
    //返回集合中的第1条记录是否与selector匹配
    is: function(selector) {
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    //排除集合里满足条件的记录，接收参数为：css选择器，function, dom ,nodeList
    not: function(selector) {
      var nodes = []
      //当selector为函数时，safari下的typeof odeList也是function，所以这里需要再加一个判断selector.call !== undefined
      if (isFunction(selector) && selector.call !== undefined) {
        this.each(function(idx) {
          //注意这里收集的是selector.call(this,idx)返回结果为false的时候记录
          if (!selector.call(this, idx)) nodes.push(this)
        })
      } else {
        //当selector为字符串的时候，对集合进行筛选，也就是筛选出集合中满足selector的记录
        var excludes = typeof selector == 'string' ? this.filter(selector) :
        //当selector为nodeList时执行slice.call(selector),注意这里的isFunction(selector.item)是为了排除selector为数组的情况
        //当selector为css选择器，执行$(selector)
        (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el) {
          //筛选出不在excludes集合里的记录，达到排除的目的
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes) //由于上面得到的结果是数组，这里需要转成zepto对象，以便继承其它方法，实现链写
    },
    /*
        接收node和string作为参数，给当前集合筛选出包含selector的集合
        isObject(selector)是判断参数是否是node，因为typeof node == 'object'
        当参数为node时，只需要判读当前记当里是否包含node节点即可
        当参数为string时，则在当前记录里查询selector，如果长度为0，则为false，filter函数就会过滤掉这条记录，否则保存该记录
    */
    has: function(selector) {
      return this.filter(function() {
        return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size()
      })
    },
    /* 
        选择集合中指定索引的记录，当idx为-1时，取最后一个记录
    */
    eq: function(idx) {
      return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
    },
    /* 
        取集合中的第一条记录
    */
    first: function() {
      var el = this[0] //取集合中的第一条记录
      //如果集合中的第一条数据本身就已经是zepto对象则直接返回本身，否则转成zepto对象
      //el && !isObject(el)在这里取到一个判断el是否为节点的情况，因为如果el是节点，那么isObject(el)的结果就是true
      return el && !isObject(el) ? el : $(el)
    },
    /* 
        取集合中的最后一条记录
    */
    last: function() {
      var el = this[this.length - 1] //取集合中的最后一条记录
      //如果el为node,则isObject(el)会为true,需要转成zepto对象
      return el && !isObject(el) ? el : $(el)
    },
    /* 
        在当前集合中查找selector，selector可以是集合，选择器，以及节点
    */
    find: function(selector) {
      var result, $this = this
      //如果selector为node或者zepto集合时
      if (typeof selector == 'object')
      //遍历selector，筛选出父级为集合中记录的selector
      result = $(selector).filter(function() {
        var node = this
        //如果$.contains(parent, node)返回true，则emptyArray.some也会返回true,外层的filter则会收录该条记录
        return emptyArray.some.call($this, function(parent) {
          return $.contains(parent, node)
        })
      })
      //如果selector是css选择器
      //如果当前集合长度为1时，调用zepto.qsa，将结果转成zepto对象
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      //如果长度大于1，则调用map遍历
      else result = this.map(function() {
        return zepto.qsa(this, selector)
      })
      return result
    },
    //取集合中第一记录的最近的满足条件的父级元素
    closest: function(selector, context) {
      var node = this[0],
        collection = false
      if (typeof selector == 'object') collection = $(selector)
      //当selector是node或者zepto集合时，如果node不在collection集合中时需要取node.parentNode进行判断
      //当selector是字符串选择器时，如果node与selector不匹配，则需要取node.parentNode进行判断
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
      //当node 不是context,document的时候，取node.parentNode
      node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    //取集合所有父级元素
    parents: function(selector) {
      var ancestors = [],
        nodes = this
        //通过遍历nodes得到所有父级，注意在while里nodes被重新赋值了
        //本函数的巧妙之处在于，不停在获取父级，再遍历父级获取父级的父级
        //然后再通过去重，得到最终想要的结果，当到达最顶层的父级时，nodes.length就为0了
      while (nodes.length > 0)
      //nodes被重新赋值为收集到的父级集合
      nodes = $.map(nodes, function(node) {
        //遍历nodes，收集集合的第一层父级
        //ancestors.indexOf(node) < 0用来去重复
        if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
          ancestors.push(node) //收集已经获取到的父级元素，用于去重复
          return node
        }
      })
      //上面还只是取到了所有的父级元素，这里还需要对其进行筛选从而得到最终想要的结果
      return filtered(ancestors, selector)
    },
    //获取集合的父节点
    parent: function(selector) {
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector) {
      return filtered(this.map(function() {
        return children(this)
      }), selector)
    },
    contents: function() {
      return this.map(function() {
        return slice.call(this.childNodes)
      })
    },
    siblings: function(selector) {
      return filtered(this.map(function(i, el) {
        //先获取该节点的父节点中的所有子节点，再排除本身
        return filter.call(children(el.parentNode), function(child) {
          return child !== el
        })
      }), selector)
    },
    empty: function() {
      return this.each(function() {
        this.innerHTML = ''
      })
    },
    //根据属性来获取当前集合的相关集合
    pluck: function(property) {
      return $.map(this, function(el) {
        return el[property]
      })
    },
    show: function() {
      return this.each(function() {
        //清除元素的内联display="none"的样式
        this.style.display == "none" && (this.style.display = null)
        //当样式表里的该元素的display样式为none时，设置它的display为默认值
        if (getComputedStyle(this, '').getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName) //defaultDisplay是获取元素默认display的方法
      })
    },
    replaceWith: function(newContent) {
      //将要替换的内容插入到被替换的内容前面，然后删除被替换的内容
      return this.before(newContent).remove()
    },
    wrap: function(structure) {
      var func = isFunction(structure)
      if (this[0] && !func)
      //如果structure是字符串，则将其转成DOM
      var dom = $(structure).get(0),
        //如果structure是已经存在于页面上的节点或者被wrap的记录不只一条，则需要clone dom
        clone = dom.parentNode || this.length > 1

      return this.each(function(index) {
        $(this).wrapAll(
        func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom)
      })
    },
    wrapAll: function(structure) {
      if (this[0]) {
        //将要包裹的内容插入到第一条记录的前面，算是给structure定位围置
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        //取structure里的第一个子节点的最里层
        while ((children = structure.children()).length) structure = children.first()
        //将当前集合插入到最里层的节点里，达到wrapAll的目的
        $(structure).append(this)
      }
      return this
    },
    //在匹配元素里的内容外包一层结构
    wrapInner: function(structure) {
      var func = isFunction(structure)
      return this.each(function(index) {
        //原理就是获取节点的内容，然后用structure将内容包起来，如果内容不存在，则直接将structure append到该节点
        var self = $(this),
          contents = self.contents(),
          dom = func ? structure.call(this, index) : structure
          contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function() {
      //用子元素替换掉父级
      this.parent().each(function() {
        $(this).replaceWith($(this).children())
      })
      return this
    },
    //clone node
    clone: function() {
      return this.map(function() {
        return this.cloneNode(true)
      })
    },
    //隐藏集合
    hide: function() {
      return this.css("display", "none")
    },
    toggle: function(setting) {
      return this.each(function() {
        var el = $(this);
        /* 
            这个setting取得作用就是控制显示与隐藏，并不切换，当它的值为true时，一直显示，false时，一直隐藏
            这个地方的判断看上去有点绕，其实也简单，意思是说，当不给toogle参数时，根据元素的display是否等于none来决定显示或者隐藏元素
            当给toogle参数，就没有切换效果了，只是简单的根据参数值来决定显示或隐藏。如果参数true,相当于show方法，false则相当于hide方法
        */
        (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector) {
      return $(this.pluck('previousElementSibling')).filter(selector || '*')
    },
    next: function(selector) {
      return $(this.pluck('nextElementSibling')).filter(selector || '*')
    },
    //当有参数时，设置集合每条记录的HTML，没有参数时，则为获取集合第一条记录的HTML，如果集合的长度为0,则返回null
    html: function(html) {
      return html === undefined ?
      //参数html不存在时，获取集合中第一条记录的html
      (this.length > 0 ? this[0].innerHTML : null) :
      //否则遍历集合，设置每条记录的html
      this.each(function(idx) {
        //记录原始的innerHTMl
        var originHtml = this.innerHTML
        //如果参数html是字符串直接插入到记录中，
        //如果是函数，则将当前记录作为上下文，调用该函数，且传入该记录的索引和原始innerHTML作为参数
        $(this).empty().append(funcArg(this, html, idx, originHtml))
      })
    },
    text: function(text) {
      //如果不给定text参数，则为获取功能，集合长度大于0时，取第一条数据的textContent，否则返回null,
      //如果给定text参数，则为集合的每一条数据设置textContent为text
      return text === undefined ? (this.length > 0 ? this[0].textContent : null) : this.each(function() {
        this.textContent = text
      })
    },
    attr: function(name, value) {
      var result
      //当只有name且为字符串时，表示获取第一条记录的属性
      return (typeof name == 'string' && value === undefined) ?
      //集合没有记录或者集合的元素不是node类型，返回undefined
      (this.length == 0 || this[0].nodeType !== 1 ? undefined :
      //如果取的是input的value
      (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
      //注意直接定义在node上的属性，在标准浏览器和ie9,10中用getAttribute取不到,得到的结果是null
      //比如div.aa = 10,用div.getAttribute('aa')得到的是null,需要用div.aa或者div['aa']这样来取
      (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result) :
      this.each(function(idx) {
        if (this.nodeType !== 1) return
        //如果name是一个对象，如{'id':'test','value':11},则给数据设置属性
        if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
        //如果name只是一个普通的属性字符串，用funcArg来处理value是值或者function的情况最终返回一个属性值
        //如果funcArg函数返回的是undefined或者null，则相当于删除元素的属性
        else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
      })
    },
    removeAttr: function(name) {
      return this.each(function() {
        this.nodeType === 1 && setAttribute(this, name)//setAttribute的第三个参数为null时，效果是删除name属性
      })
    },
    //获取第一条数据的指定的name属性或者给每条数据添加自定义属性，注意和setAttribute的区别
    prop: function(name, value) {
      //没有给定value时，为获取，给定value则给每一条数据添加，value可以为值也可以是一个返回值的函数
      return (value === undefined) ? (this[0] && this[0][name]) : this.each(function(idx) {
        this[name] = funcArg(this, value, idx, this[name])
      })
    },
    data: function(name, value) {
      //通过调用attr方法来实现获取与设置的效果，注意attr方法里，当value存在的时候，返回的是集合本身，如果不存在，则是返回获取的值
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value) {
      return (value === undefined) ?
      //如果是多选的select，则返回一个包含被选中的option的值的数组
      (this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function(o) {
        return this.selected
      }).pluck('value') : this[0].value)) : this.each(function(idx) {
        this.value = funcArg(this, value, idx, this.value)
      })
    },
    offset: function(coordinates) {
      if (coordinates) return this.each(function(index) {
        var $this = $(this),
          //coordinates为{}时直接返回，为函数时返回处理结果给coords
          coords = funcArg(this, coordinates, index, $this.offset()),
          //取父级的offset
          parentOffset = $this.offsetParent().offset(),
          //计算出它们之间的差，得出其偏移量  
          props = {
            top: coords.top - parentOffset.top,
            left: coords.left - parentOffset.left
          }
          //注意元素的position为static时，设置top,left是无效的
        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      //取第一条记录的offset,包括offsetTop,offsetLeft,offsetWidth,offsetHeight
      if (this.length == 0) return null
      var obj = this[0].getBoundingClientRect()
      //window.pageYOffset就是类似Math.max(document.documentElement.scrollTop||document.body.scrollTop)
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value) {
      //获取指定的样式
      if (arguments.length < 2 && typeof property == 'string') return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))
      //设置样式
      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0) //当value的值为非零的可以转成false的值时如(null,undefined)，删掉property样式
        this.each(function() {
          //style.removeProperty 移除指定的CSS样式名(IE不支持DOM的style方法)
          this.style.removeProperty(dasherize(property))
        })
        else css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        //当property是对象时
        for (key in property)
        if (!property[key] && property[key] !== 0)
        //当property[key]的值为非零的可以转成false的值时，删掉key样式
        this.each(function() {
          this.style.removeProperty(dasherize(key))
        })
        else css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }
      //设置
      return this.each(function() {
        this.style.cssText += ';' + css
      })
    },
    index: function(element) {
      //这里的$(element)[0]是为了将字符串转成node,因为this是个包含node的数组
      //当不指定element时，取集合中第一条记录在其父节点的位置
      //this.parent().children().indexOf(this[0])这句很巧妙，和取第一记录的parent().children().indexOf(this)相同
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name) {
      return emptyArray.some.call(this, function(el) {
        //注意这里的this是classRE(name)生成的正则
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name) {
      return this.each(function(idx) {
        classList = []
        var cls = className(this),
          newName = funcArg(this, name, idx, cls)
          //处理同时多个类的情况，用空格分开
          newName.split(/\s+/g).forEach(function(klass) {
            if (!$(this).hasClass(klass)) classList.push(klass)
          }, this)
          classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name) {
      return this.each(function(idx) {
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when) {
      return this.each(function(idx) {
        var $this = $(this),
          names = funcArg(this, name, idx, className(this))
          names.split(/\s+/g).forEach(function(klass) {
            (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass)
          })
      })
    },
    scrollTop: function() {
      if (!this.length) return
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset()

        // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0
        offset.top -= parseFloat($(elem).css('margin-top')) || 0
        offset.left -= parseFloat($(elem).css('margin-left')) || 0

        // Add offsetParent borders
        parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
        parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

        // Subtract the two offsets
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function() {
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
        parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;
  ['width', 'height'].forEach(function(dimension) {
    $.fn[dimension] = function(value) {
      var offset, el = this[0],
        //将width,hegiht转成Width,Height，用于取window或者document的width和height
        Dimension = dimension.replace(/./, function(m) {
          return m[0].toUpperCase()
        })
        //没有参数为获取，获取window的width和height用innerWidth,innerHeight
      if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
      //获取document的width和height时，用offsetWidth,offsetHeight
      isDocument(el) ? el.documentElement['offset' + Dimension] : (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx) {
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function() {
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
        argType = type(arg)
        return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg)
      }),
        parent, copyByClone = this.length > 1 //如果集合的长度大于集，则需要clone被插入的节点
      if (nodes.length < 1) return this

      return this.each(function(_, target) {
        parent = inside ? target : target.parentNode

        //通过改变target将after，prepend，append操作转成before操作，insertBefore的第二个参数为null时等于appendChild操作
        target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null

        nodes.forEach(function(node) {
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          //插入节点后，如果被插入的节点是SCRIPT，则执行里面的内容并将window设为上下文
          traverseNode(parent.insertBefore(node, target), function(el) {
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function(html) {
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})();

window.Zepto = Zepto;
'$' in window || (window.$ = Zepto);

;(function($) {
  function detect(ua) {
    var os = this.os = {}, browser = this.browser = {},
    webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/)

      // Todo: clean this up with a better OS/browser seperation:
      // - discern (more) between multiple browsers on android
      // - decide if kindle fire in silk mode is android or not
      // - Firefox on Android doesn't specify the Android version
      // - possibly devide in os, device and browser hashes

    if (browser.webkit = !! webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]

    os.tablet = !! (ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
    os.phone = !! (!os.tablet && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)