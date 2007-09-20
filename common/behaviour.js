/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var THC2 = new Object();
THC2.Page = Class.create({
  initialize: function() {
    this.behaviours = new Hash();
    this.objects = new Array();
    this.connections = new Array();
    this.elementConnections = new Array();
  },
  
  registerBehaviour: function(behaviour, klass) {
    this.behaviours[behaviour] = {klass: klass};
  },
  
  registerBehaviours: function(hash) {
    var page = this;
    $H(hash).each(function(pair) {
      page.registerBehaviour(pair.key, pair.value);
    });
  },
  
  unregisterBehaviour: function(behaviour) {
    this.behaviours.remove(behaviour);
  },
  
  applyBehaviours: function(element) {
    this.objects.push(Widget.ApplyBehaviours(element, this.behaviours));
    this.objects = this.objects.flatten();
  },
  
  find: function(element, behaviour) {
    return this.objects.select(function (obj) {
      return (obj.element == element && obj.behaviour == behaviour);
    });
  },
  
  findObjects: function(element) {
    return this.objects.select(function (obj) {
      return (obj.element == element);
    });
  },
  
  findElementConnection: function(element, selector, event, func) {
    return this.elementConnections.find(function(item) {
      return (item.element == element && item.selector == selector && item.event == event && item.func == func);
    });
  },

  findConnection: function(selector, event, func) {
    return this.connections.find(function(item) {
      return (item.selector == selector && item.event == event && item.func == func);
    });
  },
  
  connect: function(selector, event, func) {
    if (!this.findConnection(selector, event, func)) {
      this.connections.push({selector:selector, event:event, func:func});
    }
  },
  
  // disconnect: function(element, selector, event, func) {
  //   var conn = this.findElementConnection(element, selector, event, func);
  //   if (conn) {
  //     Event.stopObserving(element, conn.event, conn.func);
  //   }
  // },

  connectAll: function(hash) {
    for (var selector in hash) {
      for (var event in hash[selector]) {
        this.connect(selector, event, hash[selector][event]);
      }
    }
  },
  
  connectElement: function(element, selector, event, func) {
    if (!this.findElementConnection(element, selector, event, func)) {
      Event.observe(element, event, func);
      this.elementConnections.push({element:element, selector:selector, event:event, func:func});
    }
  },
  
  doConnect: function(parent, selector, event, func) {
    var page = this;
    $A($(parent).getElementsBySelector(selector)).each(function(element) {
      var e = $(element);
      page.connectElement(e, selector, event, func.bind(e));
    });
  },
  
  reconnect: function(parent) {
    var page = this;
    this.connections.each(function(item) {
      page.doConnect(parent, item.selector, item.event, item.func);
    });
  }
});

var CurrentPage = new THC2.Page();


var Widget = Class.create({
  initialize: function(element) {
    this.element = $(element).cleanWhitespace();
  }
});

Object.extend(Widget, {
  ApplyBehaviours: function(parent, behaviours) {
    var objects = new Array();
    
    $A($(parent || document.body).getElementsByTagName("*")).each(function(element) {
      $(element).classNames().select(function(c) { return new String(c).startsWith("thc2-"); }).each(function(className) {
        var mapping = behaviours[className];
        if (mapping && CurrentPage.find(element, className).length == 0) {
          try {
            var obj = new mapping.klass(element);
            obj.behaviour = className;
          } catch(e) {
            Logger.error("Could not create class " + className + ", error: " + e.message);
            return;
          }
          objects.push(obj);
        }
      });
    });
    return objects;
  }
});

function $S(obj, funcname) {
  return function(event) {
    var o = $O(obj);
    return o[funcname].bind(o)(event);
  }
}

function $O(obj) {
  if (Object.isString(obj)) {
    obj = CurrentPage.findObjects($(obj))[0];
  }
  return obj;
}
