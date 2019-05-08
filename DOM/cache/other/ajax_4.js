/**
  Ajax处理部份
**/
;(function($) {
  var jsonpID = 0,
    document = window.document,
    key,
    name,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    scriptTypeRE = /^(?:text|application)\/javascript/i,
    xmlTypeRE = /^(?:text|application)\/xml/i,
    jsonType = 'application/json',
    htmlType = 'text/html',
    blankRE = /^\s*$/

    // trigger a custom event and return false if it was cancelled

    function triggerAndReturn(context, eventName, data) {
      var event = $.Event(eventName)
      $(context).trigger(event, data)
      return !event.defaultPrevented
    }

    // trigger an Ajax "global" event
    //触发 ajax的全局事件

    function triggerGlobal(settings, context, eventName, data) {
      if (settings.global) return triggerAndReturn(context || document, eventName, data)
    }

    // Number of active Ajax requests
    $.active = 0

    //settings.global为true时表示需要触发全局ajax事件
    //注意这里的$.active++ === 0很巧妙，用它来判断开始，因为只有$.active等于0时$.active++ === 0才成立

    function ajaxStart(settings) {
      if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
    }
    //注意这里的 !(--$.active)同上面的异曲同工，--$.active为0，则表示$.active的值为1，这样用来判断结束，也很有意思

    function ajaxStop(settings) {
      if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
    }

    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    //触发全局ajaxBeforeSend事件，如果返回false,则取消此次请求

    function ajaxBeforeSend(xhr, settings) {
      var context = settings.context
      if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false

      triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
    }

    function ajaxSuccess(data, xhr, settings) {
      var context = settings.context,
        status = 'success'
      settings.success.call(context, data, status, xhr)
      triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
      ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"

    function ajaxError(error, type, xhr, settings) {
      var context = settings.context
      settings.error.call(context, xhr, type, error)
      triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
      ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"

    function ajaxComplete(status, xhr, settings) {
      var context = settings.context
      settings.complete.call(context, xhr, status)
      triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
      ajaxStop(settings)
    }

    // Empty function, used as default callback

    function empty() {}
    //可参考http://zh.wikipedia.org/zh-cn/JSONP
    $.ajaxJSONP = function(options) {
      if (!('type' in options)) return $.ajax(options)

      var callbackName = 'jsonp' + (++jsonpID), //创建回调函数名
        script = document.createElement('script'),
        //js文件加载完毕
        cleanup = function() {
          clearTimeout(abortTimeout) //清除下面的timeout事件处理
          $(script).remove() //移除创建的script标签，因为该文件的JS内容已经解析过了
          delete window[callbackName] //清除掉指定的回调函数
        },
        //取消加载
        abort = function(type) {
          cleanup()
          // In case of manual abort or timeout, keep an empty function as callback
          // so that the SCRIPT tag that eventually loads won't result in an error.
          //这里通过将回调函数重新赋值为空函数来达到看似阻止加载JS的目的，实际上给script标签设置了src属性后，请求就已经产生了，并且不能中断
          if (!type || type == 'timeout') window[callbackName] = empty
          ajaxError(null, type || 'abort', xhr, options)
        },
        xhr = {
          abort: abort
        }, abortTimeout

      if (ajaxBeforeSend(xhr, options) === false) {
        abort('abort')
        return false
      }
      //成功加载后的回调函数
      window[callbackName] = function(data) {
        cleanup()
        ajaxSuccess(data, xhr, options)
      }

      script.onerror = function() {
        abort('error')
      }
      //将回调函数名追加到请求地址，并赋给script，至此请求产生
      script.src = options.url.replace(/=\?/, '=' + callbackName)
      $('head').append(script)

      //如果设置了超时处理
      if (options.timeout > 0) abortTimeout = setTimeout(function() {
        abort('timeout')
      }, options.timeout)

      return xhr
    }

    //ajax全局设置
    $.ajaxSettings = {
      // Default type of request
      type: 'GET',
      // Callback that is executed before request
      beforeSend: empty,
      // Callback that is executed if the request succeeds
      success: empty,
      // Callback that is executed the the server drops error
      error: empty,
      // Callback that is executed on request complete (both: error and success)
      complete: empty,
      // The context for the callbacks
      context: null,
      // Whether to trigger "global" Ajax events
      global: true,
      // Transport
      xhr: function() {
        return new window.XMLHttpRequest()
      },
      // MIME types mapping
      accepts: {
        script: 'text/javascript, application/javascript',
        json: jsonType,
        xml: 'application/xml, text/xml',
        html: htmlType,
        text: 'text/plain'
      },
      // Whether the request is to another domain
      crossDomain: false,
      // Default timeout
      timeout: 0,
      // Whether data should be serialized to string
      processData: true,
      // Whether the browser should be allowed to cache GET responses
      cache: true
    };

  //根据MIME返回相应的数据类型，用作ajax参数里的dataType用，设置预期返回的数据类型
  //如html,json,scirpt,xml,text

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text'
  }
  //将查询字符串追加到URL后面

  function appendQuery(url, query) {
    //注意这里的replace,将第一个匹配到的&或者&&,&?,? ?& ??替换成?,用来保证地址的正确性
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  //序列化发送到服务器上的数据，如果是GET请求，则将序列化后的数据追加到请求地址后面

  function serializeData(options) {
    //options.processData表示对于非Get请求,是否自动将 options.data转换为字符串,前提是options.data不是字符串
    if (options.processData && options.data && $.type(options.data) != "string")
    //options.traditional表示是否以$.param方法序列化
    options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
    //如果是GET请求，将序列化后的数据追加到请求地址后面
    options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options) {
    //注意这里不能直接将$.ajaxSettings替换掉$.extend的第一个参数,这样会改变 $.ajaxSettings里面的值
    //这里的做法是创建一个新对象
    var settings = $.extend({}, options || {})
    //如果它没有定义$.ajaxSettings里面的属性的时候，才去将$.ajaxSettings[key] 复制过来
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]
    //执行全局ajaxStart
    ajaxStart(settings)

    //通过判断请求地址和当前页面地址的host是否相同来设置是跨域
    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host
    //如果没有设置请求地址，则取当前页面地址
    if (!settings.url) settings.url = window.location.toString();
    //将data进行转换
    serializeData(settings);
    //如果不设置缓存
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    //如果请求的是jsonp，则将地址栏里的=?替换为callback=?,相当于一个简写
    var dataType = settings.dataType,
      hasPlaceholder = /=\?/.test(settings.url)
      if (dataType == 'jsonp' || hasPlaceholder) {
        if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
        return $.ajaxJSONP(settings)
      }

    var mime = settings.accepts[dataType],
      baseHeaders = {},
      //如果请求地址没有定请求协议，则与当前页面协议相同
      protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
      xhr = settings.xhr(),
      abortTimeout
      //如果没有跨域
    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    //如果不是GET请求，设置发送信息至服务器时内容编码类型
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')) baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        //根据状态来判断请求是否成功
        //状态>=200 && < 300 表示成功
        //状态 == 304 表示文件未改动过，也可认为成功
        //如果是取要本地文件那也可以认为是成功的，xhr.status == 0是在直接打开页面时发生请求时出现的状态，也就是不是用localhost的形式访问的页面的情况
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          //获取返回的数据类型
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')(1, eval)(result) //如果返回的数据类型是JS
            else if (dataType == 'xml') result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) {
            error = e
          }
          //如果解析出错，则执行全局parsererror事件
          if (error) ajaxError(error, 'parsererror', xhr, settings)
          //否则执行ajaxSuccess
          else ajaxSuccess(result, xhr, settings)
        } else {
          //如果请求出错，则根据xhr.status来执行相应的错误处理函数
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)
    //设置请求头信息
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    //如果ajaxBeforeSend函数返回的false，则取消此次请示
    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    //当设置了settings.timeout，则在超时后取消请求，并执行timeout事件处理函数
    if (settings.timeout > 0) abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, settings)
    }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  //将参数转换成ajax函数指定的参数格式

  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data) //如果data是function，则认为它是请求成功后的回调
    return {
      url: url,
      data: hasData ? data : undefined, //如果data不是function实例
      success: !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData ? dataType || success : success
    }
  }

  //简单的get请求
  $.get = function(url, data, success, dataType) {
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType) {
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success) {
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  //这里的url可以是http://www.xxxx.com selector这种形式，就是对加载进来的HTML对行一个筛选
  $.fn.load = function(url, data, success) {
    if (!this.length) return this
    //将请求地址用空格分开
    var self = this,
      parts = url.split(/\s/),
      selector,
      options = parseArguments(url, data, success),
      callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    //要对成功后的回调函数进行一个改写，因为需要将加载进来的HTML添加进当前集合
    options.success = function(response) {
      //selector就是对请求到的数据就行一个筛选的条件，比如只获取数据里的类名为.test的标签
      self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response)
      //这里才是你写的回调
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
      var type, array = $.isArray(obj)
      $.each(obj, function(key, value) {
        type = $.type(value)
        //scope用作处理value也是object或者array的情况
        //traditional表示是否以传统的方式拼接数据，
        //传统的意思就是比如现有一个数据{a:[1,2,3]},转成查询字符串后结果为'a=1&a=2&a=3'
        //非传统的的结果则是a[]=1&a[]=2&a[]=3
        if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
        // handle data in serializeArray() format
        //当处理的数据为[{},{},{}]这种情况的时候，一般指的是序列化表单后的结果
        if (!scope && array) params.add(value.name, value.value)
        // recurse into nested objects
        //当value值是数组或者是对象且不是按传统的方式序列化的时候，需要再次遍历value
        else if (type == "array" || (!traditional && type == "object")) serialize(params, value, traditional, key)
        else params.add(key, value)
      })
    }
    //将obj转换为查询字符串的格式，traditional表示是否转换成传统的方式，至于传统的方式的意思看上面的注释
    $.param = function(obj, traditional) {
      var params = []
      //注意这里将add方法定到params，所以下面serialize时才不需要返回数据
      params.add = function(k, v) {
        this.push(escape(k) + '=' + escape(v))
      }
      serialize(params, obj, traditional)
      return params.join('&').replace(/%20/g, '+')
    }
})(Zepto)


;(function($) {
  //序列化表单，返回一个类似[{name:value},{name2:value2}]的数组
  $.fn.serializeArray = function() {
    var result = [],
      el
      //将集合中的第一个表单里的所有表单元素转成数组后进行遍历
      $(Array.prototype.slice.call(this.get(0).elements)).each(function() {
        el = $(this)
        var type = el.attr('type')
        //判断其type属性，排除fieldset，submi,reset,button以及没有被选中的radio和checkbox
        if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        //注意这里的写法，当元素既不是radio也不是checkbox时,直接返回true，
        //当元素是radio或者checkbox时，会执行后面的this.checked，当radio或者checkbox被选中时this.checked得到true值
        //这样就可以筛选中被选中的radio和checkbox了
        ((type != 'radio' && type != 'checkbox') || this.checked)) result.push({
          name: el.attr('name'),
          value: el.val()
        })
      })
      return result
  }
  //将表单的值转成name1=value1&name2=value2的形式
  $.fn.serialize = function() {
    var result = []
    this.serializeArray().forEach(function(elm) {
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }
  //表单提交
  $.fn.submit = function(callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)