var handler = function() {
   alert(event.type);
};

var EventUtil = {

   //增加事件监听
   addHandler: function(elem, type, handler) {
      if (elem.addEventListener){
         elem.addEventListener(type, handler, false);
      } else if (elem.attachEvent) {
         elem.attachEvent("on" + type, handler);
      } else {
         elem["on" + type] = handler;
      }
   },
     //移除事件监听
     removeHandler: function (elem, type, handler) {
      if (elem.removeEventListener) {
         elem.removeEventListener(type, handler, false);
      } else if (elem.detachEvent) {
         elem.detachEvent("on" + type, handler);
      } else {
         elem["on" + type] = null;
      }
   },

   //返回对event对象的引用
   getEvent: function(event) {
     return event ? event : window.event;
   },
   //获得事件实际目标
   getTarget: function(event) {
      return event.target || event.srcElement;
   },
   //阻止默认事件
   preventDefault: function(event) {
      if (event.preventDefaul) {
         event.preventDefaul();
      } else {
         //IE中的选项
         event.returnValue = false;
      }
   },
 
   //阻止冒泡
   stopPropagation: function(event) {
      if (event.stopPropagation) {
         event.stopPropagation();
      } else {
         //IE中的选项
         event.cancelBubble = true;
      }
   },
   //通过event提供相关元素的信息.
   getRelatedTarget: function(event) {
      if (event.relatedTarget) {
         return event.relatedTarget;
      } else if (event.toElement) {
         return event.toElement;
      } else if (event.fromElement) {
         return event.fromElement;
      } else {
         return null;
      }
   },
   //添加getButton()方法
   getButton: function(event) {
      if (document.implementation.hasFeature('MouseEvents', '2.0')) {
         return event.button;
      } else {
         switch (event.button) {
            case 0:
            case 1:
            case 3:
            case 5:
            case 7:
               return 0;
            case 2:
            case 6:
               return 2;
            case 4:
               return 1;
         }
      }
   }
};


function addEvent(){
   var btn = document.getElementById('myBtn');
   var divs = document.getElementById('myDiv');
   var htmo = document.getElementsByTagName('body')[0];
   // EventUtil.addHandler(btn, 'click',handler);
   // EventUtil.addHandler(window, 'load', function(event) {
   //    alert('Loaded!');
   // });
   // EventUtil.addHandler(divs, 'click', function(event) {
   //    event = EventUtil.getEvent(event);
   //    alert('Client: ' + event.clientX + ',' + event.clientY);
   // });
   // EventUtil.addHandler(htmo, 'click', function(event) {
   //    event = EventUtil.getEvent(event);
   //    alert('Client: ' + event.pageX + ',' + event.pageY);
   // });
   //
   // //关于鼠标事件和修改值
   // EventUtil.addHandler(divs, 'click', function(event) {
   //    event = EventUtil.getEvent(event);
   //    var keys = new Array();
   //
   //    if (event.shiftKey) {
   //       keys.push('shift');
   //    }
   //
   //    if (event.ctrlKey) {
   //       keys.push('ctrl');
   //    }
   //
   //    if (event.altKey) {
   //       keys.push('alt');
   //    }
   //
   //    if (event.metaKey) {
   //       keys.push('meta');
   //    }
   //
   //    alert('keys: ' +  keys.join(','));
   // })

   //显示鼠标移除和移入的元素信息
   EventUtil.addHandler(divs, 'mouseout', function(event) {
      event = EventUtil.getEvent(event);
      target = EventUtil.getTarget(event);
      var relateTarget = EventUtil.getRelatedTarget(event);
      alert('mouse out of: ' + target.tagName + 'to' + relateTarget.tagName);
   });

   // ------------------------------
   // 跨文档消息传递 XDM
   EventUtil.addHandler(window, "message", function(event) {

      // 确保发送消息的域是已知死亡域
      if (event.origin == "http://www.wrox.com") {

         // 处理接收到的数据
         processMessage(event.data);

         // 可选： 向来源窗口发送回执
         event.source.postMessage("Received", "http://p2p.wrox.com");
      }
   });


}
window.onload = addEvent();
