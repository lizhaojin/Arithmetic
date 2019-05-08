/* 
事件处理部份
 */
;(function($) {
  var $$ = $.zepto.qsa,
    handlers = {}, _zid = 1,
    specialEvents = {},
    hover = {
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  //取element的唯一标示符，如果没有，则设置一个并返回

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  //查找绑定在元素上的指定类型的事件处理函数集合

  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler && (!event.e || handler.e == event.e) //判断事件类型是否相同
      &&
      (!event.ns || matcher.test(handler.ns)) //判断事件命名空间是否相同
      //注意函数是引用类型的数据zid(handler.fn)的作用是返回handler.fn的标示符，如果没有，则给它添加一个，
      //这样如果fn和handler.fn引用的是同一个函数，那么fn上应该也可相同的标示符，
      //这里就是通过这一点来判断两个变量是否引用的同一个函数
      &&
      (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector)
    })
  }
  //解析事件类型，返回一个包含事件名称和事件命名空间的对象

  function parse(event) {
    var parts = ('' + event).split('.')
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(' ')
    }
  }
  //生成命名空间的正则

  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }
  //遍历events

  function eachEvent(events, fn, iterator) {
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type) {
      iterator(type, fn)
    })
  }
  //通过给focus和blur事件设置为捕获来达到事件冒泡的目的

  function eventCapture(handler, captureSetting) {
    return handler.del && (handler.e == 'focus' || handler.e == 'blur') || !! captureSetting
  }

  //修复不支持mouseenter和mouseleave的情况

  function realEvent(type) {
    return hover[type] || type
  }

  //给元素绑定监听事件,可同时绑定多个事件类型，如['click','mouseover','mouseout'],也可以是'click mouseover mouseout'

  function add(element, events, fn, selector, getDelegate, capture) {
    var id = zid(element),
      set = (handlers[id] || (handlers[id] = [])) //元素上已经绑定的所有事件处理函数
      eachEvent(events, fn, function(event, fn) {
        var handler = parse(event)
        //保存fn,下面为了处理mouseenter, mouseleave时，对fn进行了修改
        handler.fn = fn
        handler.sel = selector
        // 模仿 mouseenter, mouseleave
        if (handler.e in hover) fn = function(e) {
          /* 
            relatedTarget为事件相关对象，只有在mouseover和mouseout事件时才有值
            mouseover时表示的是鼠标移出的那个对象，mouseout时表示的是鼠标移入的那个对象
            当related不存在，表示事件不是mouseover或者mouseout,mouseover时!$.contains(this, related)当相关对象不在事件对象内
            且related !== this相关对象不是事件对象时，表示鼠标已经从事件对象外部移入到了对象本身，这个时间是要执行处理函数的
            当鼠标从事件对象上移入到子节点的时候related就等于this了，且!$.contains(this, related)也不成立，这个时间是不需要执行处理函数的
        */
          var related = e.relatedTarget
          if (!related || (related !== this && !$.contains(this, related))) return handler.fn.apply(this, arguments)
        }
        //事件委托
        handler.del = getDelegate && getDelegate(fn, event)
        var callback = handler.del || fn
        handler.proxy = function(e) {
          var result = callback.apply(element, [e].concat(e.data))
          //当事件处理函数返回false时，阻止默认操作和冒泡
          if (result === false) e.preventDefault(), e.stopPropagation()
          return result
        }
        //设置处理函数的在函数集中的位置
        handler.i = set.length
        //将函数存入函数集中
        set.push(handler)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
  }
  //删除绑定在元素上的指定类型的事件监听函数，可同时删除多种事件类型指定的函数，用数组或者还空格的字符串即可，同add

  function remove(element, events, fn, selector, capture) {
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn) {
      findHandlers(element, event, fn, selector).forEach(function(handler) {
        delete handlers[id][handler.i]
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = {
    add: add,
    remove: remove
  }

  //设置代理
  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      //如果fn是函数，则申明一个新的函数并用context作为上下文调用fn
      var proxyFn = function() {
        return fn.apply(context, arguments)
      }
      //引用fn标示符
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback) {
    return this.each(function() {
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback) {
    return this.each(function() {
      remove(this, event, callback)
    })
  }
  //绑定一次性事件监听函数
  $.fn.one = function(event, callback) {
    return this.each(function(i, element) {
      //添加函数，然后在回调函数里再删除绑定。达到一次性事件的目的
      add(this, event, callback, null, function(fn, type) {
        return function() {
          var result = fn.apply(element, arguments) //这里执行绑定的回调
          remove(element, type, fn) //删除上面的绑定
          return result
        }
      })
    })
  }

  var returnTrue = function() {
    return true
  },
  returnFalse = function() {
    return false
  },
  ignoreProperties = /^([A-Z]|layer[XY]$)/,
    eventMethods = {
      preventDefault: 'isDefaultPrevented', //是否调用过preventDefault方法
      //取消执行其他的事件处理函数并取消事件冒泡.如果同一个事件绑定了多个事件处理函数, 在其中一个事件处理函数中调用此方法后将不会继续调用其他的事件处理函数.
      stopImmediatePropagation: 'isImmediatePropagationStopped', //是否调用过stopImmediatePropagation方法，
      stopPropagation: 'isPropagationStopped' //是否调用过stopPropagation方法
    }
    //创建事件代理

    function createProxy(event) {
      var key, proxy = {
        originalEvent: event
      } //保存原始event
      for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key] //复制event属性至proxy

      //将preventDefault，stopImmediatePropagatio,stopPropagation方法定义到proxy上
      $.each(eventMethods, function(name, predicate) {
        proxy[name] = function() {
          this[predicate] = returnTrue
          return event[name].apply(event, arguments)
        }
        proxy[predicate] = returnFalse
      })
      return proxy
    }

    // emulates the 'defaultPrevented' property for browsers that have none
    //event.defaultPrevented返回一个布尔值,表明当前事件的默认动作是否被取消,也就是是否执行了 event.preventDefault()方法.

    function fix(event) {
      if (!('defaultPrevented' in event)) {
        event.defaultPrevented = false //初始值false
        var prevent = event.preventDefault // 引用默认preventDefault
        event.preventDefault = function() { //重写preventDefault
          this.defaultPrevented = true
          prevent.call(this)
        }
      }
    }
    //事件委托
    $.fn.delegate = function(selector, event, callback) {
      return this.each(function(i, element) {
        add(element, event, callback, selector, function(fn) {
          return function(e) {
            //如果事件对象是element里的元素,取与selector相匹配的
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match) {
              //evt成了一个拥有preventDefault，stopImmediatePropagatio,stopPropagation方法，currentTarge,liveFiredn属性的对象,另也有e的默认属性
              evt = $.extend(createProxy(e), {
                currentTarget: match,
                liveFired: element
              })
              return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
            }
          }
        })
      })
    }
    //取消事件委托
    $.fn.undelegate = function(selector, event, callback) {
      return this.each(function() {
        remove(this, event, callback, selector)
      })
    }

  $.fn.live = function(event, callback) {
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback) {
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  //on也有live和事件委托的效果，所以可以只用on来绑定事件
  $.fn.on = function(event, selector, callback) {
    return !selector || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback) {
    return !selector || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }
  //主动触发事件
  $.fn.trigger = function(event, data) {
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function() {
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if ('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  //触发元素上绑定的指定类型的事件，但是不冒泡
  $.fn.triggerHandler = function(event, data) {
    var e, result
    this.each(function(i, element) {
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      //遍历元素上绑定的指定类型的事件处理函数集，按顺序执行，如果执行过stopImmediatePropagation，
      //那么e.isImmediatePropagationStopped()就会返回true,再外层函数返回false
      //注意each里的回调函数指定返回false时，会跳出循环，这样就达到的停止执行回面函数的目的
      $.each(findHandlers(element, event.type || event), function(i, handler) {
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;
  ('focusin focusout load resize scroll unload click dblclick ' +
    'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
    'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
      //如果有callback回调，则认为它是绑定
      this.bind(event, callback) :
      //如果没有callback回调，则让它主动触发
      this.trigger(event)
    }
  })

  ;
  ['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function() {
        try {
          this[name]()
        } catch (e) {}
      })
      return this
    }
  })

  //根据参数创建一个event对象
  $.Event = function(type, props) {
    //当type是个对象时
    if (typeof type != 'string') props = type, type = props.type
    //创建一个event对象，如果是click,mouseover,mouseout时，创建的是MouseEvent,bubbles为是否冒泡
    var event = document.createEvent(specialEvents[type] || 'Events'),
      bubbles = true
      //确保bubbles的值为true或false,并将props参数的属性扩展到新创建的event对象上
    if (props) for (var name in props)(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name])
    //初始化event对象，type为事件类型，如click，bubbles为是否冒泡，第三个参数表示是否可以用preventDefault方法来取消默认操作
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    //添加isDefaultPrevented方法，event.defaultPrevented返回一个布尔值,表明当前事件的默认动作是否被取消,也就是是否执行了 event.preventDefault()方法.
    event.isDefaultPrevented = function() {
      return this.defaultPrevented
    }
    return event
  }
})(Zepto)