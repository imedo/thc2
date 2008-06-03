/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Namespace.
 */
var THC2 = new Object();

/**
 * @class THC2.Page
 *
 * Class representing a HTML page. Do not instantiate this class, use the
 * CurrentPage global variable.
 *
 * The CurrentPage serves mainly two purposes:
 *
 * <ol>
 * <li>it is a registry for behaviours and connections and</li>
 * <li>it applies the behaviours and connections to the current DOM tree.</li>
 * </ol>
 *
 * Behaviours and connections are unobstrusive ways to apply functionality to
 * the DOM tree, without a single trace of javascript in the HTML. Behaviours
 * are intended for more complex tasks then connections: examples for when behaviours
 * should be used are javascript driven forms, ajax forms, buttons for popup windows,
 * etc. They are the equivalent of long inline javascript or inline javascript that
 * calls functions which operate heavily on the DOM tree. Connections should be used
 * for simpler tasks, e.g. to show an alert. For an example of how to use behaviours,
 * consider this HTML code for opening a popup window:
 *
 * <pre>
 *   &lt;a href="#" onclick="window.open('/some/url', 'width=640,height=480'); return false;"&gt;Click&lt;/a&gt;
 * </pre>
 *
 * The problem with this code is two-fold: first, javascript does not really belong
 * in HTML source, just as inline style information is better kept in CSS files.
 * Second, if something fails along the execution, or if javascript is disabled, no
 * window is opened, and the browser jumps to "#", i.e. the document top. To have
 * the popup window appear in any case, you could improve the above code to the
 * following:
 *
 * <pre>
 *   &lt;a href="/some/url" target="_blank" onclick="window.open('/some/url', 'width=640,height=480'); return false;"&gt;Click&lt;/a&gt;
 * </pre>
 *
 * Now, when javascript is disabled, or the execution fails, the window will be
 * opened with target="_blank". It may not be perfect, but it is better than nothing.
 * But the problem remains, that javascript appears in the HTML source. And another
 * problem just emerged: the url ('/some/url') appears twice in the source, which
 * is a possible source for typos, and a waste of bandwidth.
 *
 * Behaviours decouple the HTML from the javascript. That means that the HTML code
 * is written separately from the javascript, and both are connected at a later
 * point. With behaviours, you would write the above link as follows:
 *
 * <pre>
 *   &lt;a href="/some/url" target="_blank" class="thc2-popup"&gt;Click&lt;/a&gt;
 * </pre>
 *
 * which is 1) shorter, 2) more readable, and 3) contains no javascript, while
 * working in any situation. The javascript for the popup behaviour could look like
 * this:
 *
 * <pre>
 *   var PopupWidget = Class.create(Widget, {
 *     initialize: function(element) {
 *       Widget.prototype.initialize.apply(this, arguments);
 *       this.url = this.element.href;
 *       Event.observe(this.element, "click", this.showPopup.bindAsEventListener(this));
 *     },
 *
 *     showPopup: function(event) {
 *       event.stop();
 *       win = window.open(this.url, 'popup', "width=640,height=480");
 *     } 
 *   });
 *   CurrentPage.registerBehaviour("thc2-popup", PopupWidget);
 * </pre>
 *
 * On the first sight, this seems like a lot of code for a trivial example like
 * a popup window. But considering that the code can be reused for every popup link, and
 * that javascript files are cached by the browser, while javascript inside HTML can
 * not be cached, there will be bandwidth savings while improving functionality.
 *
 * Connections are for those cases, when behaviours would be overkill, but you still want
 * to keep the javascript separate from the HTML. A connection connects an element's event
 * handler with a javascript function. As a simple example, consider a link which displays
 * an alert on click:
 *
 * <pre>
 *   &lt;a href="#" onclick="alert('hello!');return false;"&gt;Click&lt;/a&gt;
 * </pre>
 *
 * With connections, you would write the above link as follows:
 *
 * <pre>
 *   &lt;a href="#" id="alert"&gt;Click&lt;/a&gt;
 * </pre>
 *
 * which, again, is both shorter and more readable than the traditional inline javascript.
 * In the javascript file, you would connect the link tag with id "alert" with a function
 * that displays the alert:
 *
 * <pre>
 *   CurrentPage.connect('#alert', 'click', function(event) { alert('hello'); event.stop(); });
 *   CurrentPage.reconnect();
 * </pre>
 *
 * The first line registers the connection between the CSS selector "#alert", i.e. the
 * element with id "alert" and a function that displays the alert. The second line applies
 * all registered connections to the current document. In design pattern terms, connections
 * implement the observer pattern.
 *
 * Whether to use behaviours or connections depends on the complexity of the problem
 * at hand. As a rule of thumb, you could say that a behaviour is the way to go for elements
 * which contain a lot and possibly a varying number of child elements that interact
 * with each other. Connections, on the other hand, are for single elements and code that
 * would fit into one line, e.g. show an alert, let an element appear/disappear, go back in
 * history and so on.
 */
THC2.Page = Class.create(
/** @scope THC2.Page.prototype */
{
  /**
   * Constructor. Initializes the page object.
   */
  initialize: function() {
    this.behaviours = new Hash();
    this.objects = new Array();
    this.connections = new Array();
    this.elementConnections = new Array();
  },
  
  /**
   * Associates a CSS class with a Widget subclass. Example:
   *
   * <pre>
   *   CurrentPage.registerBehaviour("thc2-limited-textarea", LimitedTextareaWidget);
   *   CurrentPage.applyBehaviours();
   * </pre>
   *
   * After the two above calls, every text area with the CSS class
   * <code>"thc2-limited-textarea"</code> will have the LimitedTextareaWidget behaviour
   * applied.
   *
   * @param behaviour The CSS class. Must start with "thc2-".
   * @param klass The javascript Widget subclass.
   */
  registerBehaviour: function(behaviour, klass) {
    this.behaviours[behaviour] = {klass: klass};
  },
  
  /**
   * Convenience method which registers multiple behaviours in one call.
   * See the registerBehaviour() method for details. Example:
   *
   * <pre>
   *   CurrentPage.registerBehaviours({
   *     "thc2-modal-link": ModalLinkWidget,
   *     "thc2-modal-cancel": ModalCancelWidget
   *   });
   * </pre>
   *
   * @param hash An object of key-value-pairs with the CSS classes as keys
   *             and the Widget subclasses as values.
   */
  registerBehaviours: function(hash) {
    var page = this;
    $H(hash).each(function(pair) {
      page.registerBehaviour(pair.key, pair.value);
    });
  },
  
  /**
   * Unregisters a behaviour. However, the already applied behaviours are not
   * unapplied.
   *
   * @param behaviour The CSS class of the behaviour to unregister. Must start
   *                  with "thc2-".
   */
  unregisterBehaviour: function(behaviour) {
    this.behaviours.remove(behaviour);
  },
  
  /**
   * Applies all behaviours to the children of <code>element</code>, which defaults to
   * <code>document.body</code>.
   *
   * @param element The parent element under which all behaviours are applied.
   *                This parameter is optional and defaults to <code>document.body</code>.
   */
  applyBehaviours: function(element) {
    this.objects.push(Widget.ApplyBehaviours((element || document.body), this.behaviours));
    this.objects = this.objects.flatten();
  },
  
  /**
   * Returns the instance(s) of the Widget subclass that was applied to the given
   * element.
   */
  find: function(element, behaviour) {
    return this.objects.select(function (obj) {
      return (obj.element == element && obj.behaviour == behaviour);
    });
  },
  
  /**
   * Returns all Widget instances associated with the given element.
   */
  findObjects: function(element) {
    return this.objects.select(function (obj) {
      return (obj.element == element);
    });
  },
  
  /**
   * Returns the connection that is associated with the given element,
   * selector, event and function.
   */
  findElementConnection: function(element, selector, event, func) {
    return this.elementConnections.find(function(item) {
      return (item.element == element && item.selector == selector && item.event == event && item.func == func);
    });
  },
  
  /**
   * Returns the connection that is associated with the given selector,
   * event and function.
   */
  findConnection: function(selector, event, func) {
    return this.connections.find(function(item) {
      return (item.selector == selector && item.event == event && item.func == func);
    });
  },
  
  /**
   * Connects all elements' <code>event</code> handler matching the given
   * selector with the function <code>func</code>
   */
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

  /**
   * Establishes multiple connections at once. The <code>hash</code> data structure
   * must look like this:
   *
   * <pre>
   * {
   *   'selector': {
   *     event: function
   *   },
   *   'selector': {
   *     event: function
   *   }
   * }
   * </pre>
   *
   * for example:
   *
   * <pre>
   * CurrentPage.connectAll({
   *   '#group_local': {
   *     click: function(event) { Effect.toggle('group_options', 'blind'); }
   *   },
   * 
   *   '#close-flash a': {
   *     click: function(event) { Effect.Fade('flash'); event.stop(); }
   *   }
   * }
   * </pre>
   */
  connectAll: function(hash) {
    for (var selector in hash) {
      for (var event in hash[selector]) {
        this.connect(selector, event, hash[selector][event]);
      }
    }
  },
  
  /**
   * Applies the connection for a single element that must match <code>selector</code>
   * with handler <code>event</code> and function <code>func</code>.
   */
  connectElement: function(element, selector, event, func) {
    if (!this.findElementConnection(element, selector, event, func)) {
      Event.observe(element, event, func);
      this.elementConnections.push({element:element, selector:selector, event:event, func:func});
    }
  },
  
  /**
   * Applies the connections for all elements under <code>parent</code>
   * matching <code>selector</code> with handler <code>event</code> and
   * function <code>func</code>.
   */
  doConnect: function(parent, selector, event, func) {
    var page = this;
    $A($(parent).getElementsBySelector(selector)).each(function(element) {
      var e = $(element);
      page.connectElement(e, selector, event, func.bind(e));
    });
  },
  
  /**
   * (Re)applies all connections for all elements under <code>parent</code>.
   */
  reconnect: function(parent) {
    var page = this;
    this.connections.each(function(item) {
      page.doConnect(parent || document.body, item.selector, item.event, item.func);
    });
  }
});

/**
 * Global variable representing the currently loaded page. Do not instantiate
 * the THC2.Page class; use this variable instead.
 */
var CurrentPage = new THC2.Page();

/**
 * Returns a function that, when called, calls the method <code>funcname</code>
 * of the Widget instance associated with element <code>obj</code>. This is
 * especially useful for event handlers.
 *
 * @param obj Element or Element ID.
 * @param funcname The name of the function to call.
 */
function $S(obj, funcname) {
  return function(event) {
    var o = $O(obj);
    return o[funcname].bind(o)(event);
  }
}

/**
 * Returns the first widget instance associated with the given element.
 *
 * @param obj Element or Element ID.
 */
function $O(obj) {
  if (Object.isString(obj)) {
    obj = CurrentPage.findObjects($(obj))[0];
  }
  return obj;
}
