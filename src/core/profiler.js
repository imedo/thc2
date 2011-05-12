/*
  Cross-browser javascript profiler; tested with IE 6, IE 7 and Firefox 2
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Javascript profiler written in javascript.
 *
 * <p>The profiler works by rewriting every javascript function and event handler
 * such that before and after execution the current time is measured. Before the
 * profiler can start, it needs to be attached to the objects that should be
 * profiled.</p>
 *
 * <h1>Design goals</h1>
 * 
 * <ul>
 * <li>The thc2.Profiler is easy to integrate.</li>
 * <li>It should not break any functionality.</li>
 * <li>It also should be universal, which means that it should be able
 *     to profile any javascript function.</li>
 * <li>It does not have any dependencies besides core Javascript.</li>
 * <li>It is possible to enable or disable the profiler on the fly.</li>
 * <li>It is be unobstrusive, i.e. integration should be painless.</li>
 * <li>Execution times with profiling enabled should be tolerable (for
 *     patient developers).</li>
 * </ul>
 * 
 * <h1>Using it</h1>
 * 
 * <p>The profiler is extremely easy to integrate. You need to include the
 * <code>profiler.js</code> in your HTML file and call</p>
 * 
 * <pre>
 *   thc2.Profiler.init();
 * </pre>
 * 
 * <p>after your javascript code is loaded and before any of the code is
 * executed that you want to profile. If you are using Internet Explorer,
 * you might need to tell the profiler about your javascript objects and
 * functions. See below on how to do that. You’ll get a popup windows
 * for controlling the profiler. Of course, you need to disable the popup
 * blocker for your website. To create a profile of your javascript, click
 * “Enable thc2.Profiler”, reload the page and have your thc2.Browser execute the
 * code you want to profile. After it is finished, click on “Show Report”
 * to get the execution profile.</p>
 * 
 * <h1>How it works</h1>
 * 
 * <p>First, the thc2.Profiler scans the javascript object tree and stores all
 * objects it finds in an array (the discover phase). Herein lies the first
 * problem: There is no way to enumerate all user-defined global functions
 * or variables just with javascript in Internet Explorer. So you have to
 * help out a little. There are several solutions to this problem, but since
 * we recursively discover the whole object tree anyways, our solution is
 * to make all global variables known to the window object (which equals
 * the this-object in the global scope). Suppose we have a Greeter object:</p>
 * 
 * <pre>
 * var Greeter = {
 *   greet: function() {
 *     alert('Hello');
 *   }
 * };
 * </pre>
 * 
 * <p>You tell the profiler about this object by by making it available as a
 * property to the window object (in global scope):</p>
 * 
 * <pre>
 * this._$_Greeter = Greeter;
 * </pre>
 * 
 * <p>Now, when browsing the object tree with root window, the Greeter object
 * will be found.</p>
 * 
 * <p>The second phase is the rewrite phase: it takes all scanned objects and
 * replaces each of their function properties with a wrapped version that
 * measures the execution time. See {@link Function#profiledFunction} for
 * details on how this happens.</p>
 * 
 * <p>One of the problems here is that there are enumerable and not enumerable
 * properties in javascript. All enumerable properties can be discovered by
 * using the for (var ... in ...) construct. A kind of important non-enumerable
 * property is the prototype property, which needs to be discovered separately.</p>
 * 
 * <p>Again, Internet Explorer has a problem with global functions: They are not
 * known to the window object, so they are not discoverable by the thc2.Profiler.
 * However, it is easy to profile them anyway. Suppose we have a function
 * called greet():</p>
 * 
 * <pre>
 * function greet() {
 *   alert('hello');
 * }
 * </pre>
 * 
 * <p>We profile the greet() function by replacing it with its profiled version
 * like so:</p>
 * 
 * <pre>
 * greet = greet.profiledFunction('greet');
 * </pre>
 * 
 * <h1>Known issues</h1>
 * 
 * <ul>
 * <li>You need to reload the page after enabling the profiler. We tried to
 *     enable it on the fly, but that just doesn’t work in IE.</li>
 * <li>There is no way to detach the profiler from your javascript yet.</li>
 * <li>The control window is ugly. So is the report window.</li>
 * <li>The percentage value is not really usable at the moment, since we
 *     don’t measure the function’s “own time” yet.</li>
 * </ul>
 * @static
 * @class
 */
thc2.Profiler =
/** @scope thc2.Profiler */
{
  objects: [],
  messages: [],
  data: {},
  reportWindow: null,
  controlWindow: null,
  
  /**
   * Logs <code>text</code> in the control window and the report window.
   */
  log: function(text) {
    var message = (new Date()) + ': ' + text;
    this.messages.push(message);
    var win = this.getControlWindow();
    if (win) {
      win.document.getElementById('message').innerHTML = message;
    }
  },
  
  /**
   * Attaches the profiler to all methods of <code>object</code> with name <code>name</code>.
   */
  attachTo: function(object, name) {
    for (var attr in object) {
      if (typeof(object[attr]) == 'function' && attr != 'apply' && attr != 'profiledFunction') {
        try {
          object[attr] = object[attr].profiledFunction(name + '.' + attr);
        } catch(e) {
          this.log("Can't profile " + name + '.' + attr + ': ' + e.message);
        }
      }
    }
  },
  
  /**
   * Recursively discovers all objects that are reachable from <code>object</code>
   * and attaches the profiler to them.
   *
   * @param object The root object.
   * @param name The name of the root object.
   */
  attach: function(object, name) {
    this.log('attaching to ' + name);
    try {
      this.discover(object, name);
      this.discoverPrototypes(object, name);
    } catch(e) {
      this.log(e.message);
    }
    
    this.log('discovered all objects');

    try {
      this.replace();
    } catch(e) {
      this.log(e.message);
    }
    this.log('finished attaching to ' + name);
  },
  
  /**
   * Discovers all objects reachable from <code>object</code>.
   */
  discover: function(object, name) {
    if (!object.__profiler_name || object.__profiler_name.length > name.length) {
      object.__profiler_name = name;
    }
    
    if (object && !object.__discovered && object != this) {
      object.__discovered = true;
      if (object.__discovered) {
        try {
          this.objects.push(object);
          for (var attr in object) {
            try {
              if (attr != '__discovered') {
                var prop = object[attr];
                if (prop) {
                  this.discover(prop, name + '.' + attr);
                }
              }
            } catch(e) {}
          }
          
          if (object.constructor === Array) {
            for (var i = 0, l = object.length; i != l; ++i) {
              var obj = object[i];
              if (obj) {
                this.discover(obj, name + '[' + i + ']');
              }
            }
          }
        } catch(e) {
          Profile.log('Some weird object discovered: ' + name);
        }
      }
    }
  },
  
  /**
   * Discovers all prototype objects reachable from <code>object</code>.
   */
  discoverPrototypes: function(object, name) {
    for (var i = 0, l = this.objects.length; i != l; ++i) {
      try {
        var object = this.objects[i];
        if (object.prototype) {
          this.discover(object.prototype, object.__profiler_name + '.prototype');
        }
      } catch(e) {}
    }
  },
  
  replace: function() {
    var objects = this.objects;
    for (var i = 0, l = objects.length; i != l; ++i) {
      var object = objects[i];
      if (object && object != this) {
        this.attachTo(object, object.__profiler_name);
      }
    }
  },

  /**
   * Starts the profiler for function <code>name</code>.
   */
  start: function(name) {
    var d = this.data;
    if (!d[name]) d[name] = {};
    var e = d[name];
    e.name = name;
    e.calls = ((e.calls || 0) + 1);
    e.depth = ((e.depth || 0) + 1);
    if (e.depth == 1) {
      e.startTime = new Date();
    }
  },
  
  /**
   * Stops the profiler for function <code>name</code>.
   */
  stop: function(name) {
    var e = this.data[name];
    e.depth -= 1;
    if (e.depth <= 0) {
      e.time = (e.time || 0) + ((new Date()) - e.startTime);
    }
  },
  
  /**
   * Initializes the profiler, honouring the enabled settings.
   */
  init: function() {
    window.profiler = this;
    this.showControlWindow();
    if (this.isEnabled()) {
      this.doEnable();
    }
  },
  
  /**
   * @inner
   * Creates a cookie with value <code>value</code>.
   */
  createCookie: function(value) {
    var date = new Date();
    date.setTime(date.getTime()+(356*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = "profiler="+value+expires+"; path=/";
  },

  /**
   * @inner
   * Reads data from the cookie.
   */
  readCookie: function() {
    var nameEQ = "profiler=";
    var ca = document.cookie.split(';');
    for (var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  
  /**
   * Enables the profiler, and stores the enabled setting.
   */
  enable: function() {
    this.createCookie('on');
  },
  
  /**
   * Attaches the profiler to the global window object.
   */
  doEnable: function() {
    this.attach(Global, 'Global');
  },
  
  /**
   * Disables the profiler, and stores the enabled setting.
   */
  disable: function() {
    this.createCookie('off');
  },
  
  /**
   * Returns <code>true</code> if the profiler is enabled, <code>false</code> otherwise.
   */
  isEnabled: function() {
    return this.readCookie() == 'on';
  },
  
  /**
   * Resets the profiler and profiler report.
   */
  reset: function() {
    this.objects = [];
    this.messages = [];
    this.data = {};
    this.clearReport();
  },
  
  /**
   * @inner
   * Stable sort method.
   */
  sortArray: function(list, comp_func) {
    // A stable sort function to allow multi-level sorting of data
    // see: http://en.wikipedia.org/wiki/Cocktail_sort
    // thanks to Joseph Nahmias
    var b = 0;
    var t = list.length - 1;
    var swap = true;

    while(swap) {
      swap = false;
      for(var i = b; i < t; ++i) {
        if ( comp_func(list[i], list[i+1]) > 0 ) {
          var q = list[i]; list[i] = list[i+1]; list[i+1] = q;
          swap = true;
        }
      }
      t--;

      if (!swap) break;

      for (var i = t; i > b; --i) {
        if (comp_func(list[i], list[i-1]) < 0 ) {
          var q = list[i]; list[i] = list[i-1]; list[i-1] = q;
          swap = true;
        }
      }
      b++;
    }
  },
  
  /**
   * @inner
   * Standard comparison function for the sort method.
   */
  compare: function(a, b) {
    return (a < b ? -1 : (a > b ? 1 : 0));
  },
  
  /**
   * @inner
   * Reverses the given array.
   */
  reverse: function(array) {
    var result = [];
    for (var i = array.length; i != 0; --i) {
      result.push(array[i - 1]);
    }
    return result;
  },
  
  /**
   * Generates the profiler report in a separate report window.
   * Normally, you wouldn't need to call this function directly, as
   * the control window offers this functionality.
   */
  report: function(column, reverse) {
    var win = this.getReportWindow();
    if (win) {
      // calculate percentages
      var completeTime = 0;
      var count = 0;
      var entries = [];
      for (var func in this.data) {
        var f = this.data[func];
        entries.push(f);
        if (f.time) {
          completeTime += f.time;
          count ++;
        }
      }
      
      // sort
      if (column) {
        this.sortArray(entries, function(a, b) { return this.compare(a[column], b[column]); });
        if (reverse) {
          entries = this.reverse(entries);
        }
      }
      
      // generate table
      var html = ['<table width="100%"><thead><tr>',
                  '<th><a href="#" onclick="window.opener.profiler.report(&quot;name&quot;, ' + (reverse ? 'false' : 'true') + ');return false;">Function</a></th>',
                  '<th><a href="#" onclick="window.opener.profiler.report(&quot;calls&quot;, ' + (reverse ? 'false' : 'true') + ');return false;">Calls</a></th>',
                  '<th>Percentage</th>',
                  '<th><a href="#" onclick="window.opener.profiler.report(&quot;time&quot;, ' + (reverse ? 'false' : 'true') + ');return false;">Time</a></th>',
                  '</tr></thead><tbody>'];
      html.push('<p>' + count + ' different functions called</p>');
      for (var i = 0, l = entries.length; i != l; ++i) {
        var entry = entries[i];
        if (i % 2 == 0) {
          html.push('<tr class="even"><td>');
        } else {
          html.push('<tr><td>');
        }
        html.push(entry.name);
        html.push('</td><td>');
        html.push(entry.calls);
        if (entry.time) {
          html.push('</td><td>');
          html.push(((entry.time / completeTime) * 100.0).toString());
          html.push('</td><td>');
          html.push(entry.time);
        } else {
          html.push('</td><td>N/A</td><td>N/A');
        }
        html.push('</td></tr>');
      }
      html.push('</tbody></table>');

      html.push('<h1>Messages</h1>');
      html.push('<ul>');
      for (var i = 0, l = this.messages.length; i != l; ++i) {
        html.push('<li>' + this.messages[i] + '</li>');
      }
      html.push('</ul>');

      win.document.getElementById('report').innerHTML = html.join('');
    } else {
      alert('Popups disabled, report cannot be shown');
    }
  },
  
  /**
   * Clears the report window.
   */
  clearReport: function() {
    var win = this.getReportWindow();
    if (win) {
      win.document.getElementById('report').innerHTML = '';
    }
  },
  
  /**
   * Opens and initializes the report window, or returns it, if it is already open.
   */
  getReportWindow: function() {
    if (!this.reportWindow || this.reportWindow.closed) {
      var win = window.open('', 'report', 'width=640,height=480,scrollbars=yes,resizable=yes');
      if (win) {
        var html = '<html><head><title>Profile</title><style>.even { background-color: #ccc }</style></head><body><div id="report"></div></body></html>';
        win.document.write(html);

        this.reportWindow = win;
      }
    }
    return this.reportWindow;
  },
  
  /**
   * Shows the control window.
   */
  showControlWindow: function() {
    var win = this.getControlWindow();
    if (win) {
      var html = ['<ul>',
                  '<li><a href="#" onclick="window.opener.profiler.enable(); return false;">Enable thc2.Profiler</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.disable(); return false;">Disable thc2.Profiler</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.report(); return false;">Show Report</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.reset(); return false;">Reset thc2.Profiler</a></li>',
                  '</ul>'].join('');
      win.document.getElementById('controls').innerHTML = html;
    } else {
      alert('Popups disabled, control window cannot be shown');
    }
  },
  
  /**
   * Opens and initializes the control window, or returns it, if it is already open.
   */
  getControlWindow: function() {
    if (!this.controlWindow || this.controlWindow.closed) {
      var win = window.open('', 'control', 'width=300,height=120,scrollbars=yes,resizable=yes');
      if (win) {
        var html = '<html><head><title>thc2.Profiler control</title></head><body><div id="controls"></div><div id="message"></div></body></html>';
        win.document.write(html);

        this.controlWindow = win;
      }
    }
    return this.controlWindow;
  }
};

/**
 * The heart of the profiler. For any function f, this function returns a
 * rewritten version of f that measures execution times.
 */
Function.prototype.profiledFunction = function(name) {
  var func = this;
  var f = function() {
    try {
      this.start(name);
      var result = func.apply(this, arguments);
      this.stop(name);
      return result;
    } catch(e) {
      this.stop(name);
      throw(e);
    }
  }
  f.prototype = this.prototype;
  for (var property in this) {
    f[property] = this[property];
  }
  return f;
}
