
//CSS3动画
;(function($, undefined) {
  var prefix = '',
    eventPrefix, endEventName, endAnimationName,
    vendors = {
      Webkit: 'webkit',
      Moz: '',
      O: 'o',
      ms: 'MS'
    },
    document = window.document,
    testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming,
    animationName, animationDuration, animationTiming,
    cssReset = {}
    //将驼峰式的字符串转成用-分隔的小写形式，如borderWidth ==> border-width

    function dasherize(str) {
      return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2'))
    }

    function downcase(str) {
      return str.toLowerCase()
    }
    //用于修正事件名

    function normalizeEvent(name) {
      return eventPrefix ? eventPrefix + name : downcase(name)
    }

    //根据浏览器的特性设置CSS属性前轻辍和事件前辍，比如浏览器内核是webkit
    //那么用于设置CSS属性的前辍prefix就等于'-webkit-',用来修正事件名的前辍eventPrefix就是Webkit
    $.each(vendors, function(vendor, event) {
      if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        prefix = '-' + downcase(vendor) + '-'
        eventPrefix = event
        return false
      }
    })

    transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] = cssReset[transitionDuration = prefix + 'transition-duration'] = cssReset[transitionTiming = prefix + 'transition-timing-function'] = cssReset[animationName = prefix + 'animation-name'] = cssReset[animationDuration = prefix + 'animation-duration'] = cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: {
      _default: 400,
      fast: 200,
      slow: 600
    },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback) {
    if ($.isPlainObject(duration)) ease = duration.easing, callback = duration.complete, duration = duration.duration
    //如果duration是数字时，表示动画持续时间，如果是字符串，则从$.fx.speeds中取出相对应的值，如果没有找到相应的值，对取默认值
    if (duration) duration = (typeof duration == 'number' ? duration : ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback) {
    var key, cssValues = {}, cssProperties, transforms = '',
      that = this,
      wrappedCallback, endEvent = $.fx.transitionEnd
      //动画持续时间默认值
    if (duration === undefined) duration = 0.4
    //如果浏览器不支持CSS3的动画，则duration=0，意思就是直接跳转最终值
    if ($.fx.off) duration = 0

    //如果properties是一个动画名keyframe
    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
      //如果设置 的CSS属性是变形之类的
      if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
      else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event) {
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      }
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    //当可以执行动画的时候，那么动画结束后会执行回调，
    //如果不支持持续动画,在直接设置最终值后，不会执行动画结束回调
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    //设置
    this.css(cssValues)

    //当持续时间小于等于0时，立刻还原
    if (duration <= 0) setTimeout(function() {
      that.each(function() {
        wrappedCallback.call(this)
      })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)