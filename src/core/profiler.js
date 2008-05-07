/*
  Cross-browser javascript profiler; tested with IE 6, IE 7 and Firefox 2
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Javascript profiler written in javascript.
 *
 * The profiler works by rewriting every javascript function and event handler
 * such that before and after execution the current time is measured. Before the
 * profiler can start, it needs to be attached to the objects that should be
 * profiled.
 *
 * In most browsers, the profiler can discover all javascript objects by itself.
 * In IE, though, it needs some hints. The easiest way is to add all objects
 * as properties to <code>window</code> (this is the global namespace), e.g.:
 *
 * <pre>
 * this.__CurrentPage = CurrentPage;
 * </pre>
 *
 * The profiler comes with a control and report window. In the control window,
 * you can enable or disable profiling. This setting is persistent, i.e. you
 * can reload the page and the setting is remembered.
 *
 * This profiler has no javascript dependencies and therefore reimplements a few
 * methods from other javascript libraries.
 * @static
 */
var Profiler = {
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
    Profiler.messages.push(message);
    var win = Profiler.getControlWindow();
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
          Profiler.log("Can't profile " + name + '.' + attr + ': ' + e.message);
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
    Profiler.log('attaching to ' + name);
    try {
      Profiler.discover(object, name);
      Profiler.discoverPrototypes(object, name);
    } catch(e) {
      Profiler.log(e.message);
    }
    
    Profiler.log('discovered all objects');

    try {
      Profiler.replace();
    } catch(e) {
      Profiler.log(e.message);
    }
    Profiler.log('finished attaching to ' + name);
  },
  
  /**
   * Discovers all objects reachable from <code>object</code>.
   */
  discover: function(object, name) {
    if (!object.__profiler_name || object.__profiler_name.length > name.length) {
      object.__profiler_name = name;
    }
    
    if (object && !object.__discovered && object != Profiler) {
      object.__discovered = true;
      if (object.__discovered) {
        try {
          Profiler.objects.push(object);
          for (var attr in object) {
            try {
              if (attr != '__discovered') {
                var prop = object[attr];
                if (prop) {
                  Profiler.discover(prop, name + '.' + attr);
                }
              }
            } catch(e) {}
          }
          
          if (object.constructor === Array) {
            for (var i = 0, l = object.length; i != l; ++i) {
              var obj = object[i];
              if (obj) {
                Profiler.discover(obj, name + '[' + i + ']');
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
    for (var i = 0, l = Profiler.objects.length; i != l; ++i) {
      try {
        var object = Profiler.objects[i];
        if (object.prototype) {
          Profiler.discover(object.prototype, object.__profiler_name + '.prototype');
        }
      } catch(e) {}
    }
  },
  
  replace: function() {
    var objects = Profiler.objects;
    for (var i = 0, l = objects.length; i != l; ++i) {
      var object = objects[i];
      if (object && object != Profiler) {
        Profiler.attachTo(object, object.__profiler_name);
      }
    }
  },

  /**
   * Starts the profiler for function <code>name</code>.
   */
  start: function(name) {
    var d = Profiler.data;
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
    var e = Profiler.data[name];
    e.depth -= 1;
    if (e.depth <= 0) {
      e.time = (e.time || 0) + ((new Date()) - e.startTime);
    }
  },
  
  /**
   * Initializes the profiler, honouring the enabled settings.
   */
  init: function() {
    window.profiler = Profiler;
    Profiler.showControlWindow();
    if (Profiler.isEnabled()) {
      Profiler.doEnable();
    }
  },
  
  /**
   * @internal
   * Creates a cookie with value <code>value</code>.
   */
  createCookie: function(value) {
    var date = new Date();
    date.setTime(date.getTime()+(356*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = "profiler="+value+expires+"; path=/";
  },

  /**
   * @internal
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
    Profiler.createCookie('on');
  },
  
  /**
   * Attaches the profiler to the global window object.
   */
  doEnable: function() {
    Profiler.attach(Global, 'Global');
  },
  
  /**
   * Disables the profiler, and stores the enabled setting.
   */
  disable: function() {
    Profiler.createCookie('off');
  },
  
  /**
   * Returns <code>true</code> if the profiler is enabled, <code>false</code> otherwise.
   */
  isEnabled: function() {
    return Profiler.readCookie() == 'on';
  },
  
  /**
   * Resets the profiler and profiler report.
   */
  reset: function() {
    Profiler.objects = [];
    Profiler.messages = [];
    Profiler.data = {};
    Profiler.clearReport();
  },
  
  /**
   * @internal
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
   * @internal
   * Standard comparison function for the sort method.
   */
  compare: function(a, b) {
    return (a < b ? -1 : (a > b ? 1 : 0));
  },
  
  /**
   * @internal
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
    var win = Profiler.getReportWindow();
    if (win) {
      // calculate percentages
      var completeTime = 0;
      var count = 0;
      var entries = [];
      for (var func in Profiler.data) {
        var f = Profiler.data[func];
        entries.push(f);
        if (f.time) {
          completeTime += f.time;
          count ++;
        }
      }
      
      // sort
      if (column) {
        Profiler.sortArray(entries, function(a, b) { return Profiler.compare(a[column], b[column]); });
        if (reverse) {
          entries = Profiler.reverse(entries);
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
      for (var i = 0, l = Profiler.messages.length; i != l; ++i) {
        html.push('<li>' + Profiler.messages[i] + '</li>');
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
    var win = Profiler.getReportWindow();
    if (win) {
      win.document.getElementById('report').innerHTML = '';
    }
  },
  
  /**
   * Opens and initializes the report window, or returns it, if it is already open.
   */
  getReportWindow: function() {
    if (!Profiler.reportWindow || Profiler.reportWindow.closed) {
      var win = window.open('', 'report', 'width=640,height=480,scrollbars=yes,resizable=yes');
      if (win) {
        var html = '<html><head><title>Profile</title><style>.even { background-color: #ccc }</style></head><body><div id="report"></div></body></html>';
        win.document.write(html);

        Profiler.reportWindow = win;
      }
    }
    return Profiler.reportWindow;
  },
  
  /**
   * Shows the control window.
   */
  showControlWindow: function() {
    var win = Profiler.getControlWindow();
    if (win) {
      var html = ['<ul>',
                  '<li><a href="#" onclick="window.opener.profiler.enable(); return false;">Enable Profiler</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.disable(); return false;">Disable Profiler</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.report(); return false;">Show Report</a></li>',
                  '<li><a href="#" onclick="window.opener.profiler.reset(); return false;">Reset Profiler</a></li>',
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
    if (!Profiler.controlWindow || Profiler.controlWindow.closed) {
      var win = window.open('', 'control', 'width=300,height=120,scrollbars=yes,resizable=yes');
      if (win) {
        var html = '<html><head><title>Profiler control</title></head><body><div id="controls"></div><div id="message"></div></body></html>';
        win.document.write(html);

        Profiler.controlWindow = win;
      }
    }
    return Profiler.controlWindow;
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
      Profiler.start(name);
      var result = func.apply(this, arguments);
      Profiler.stop(name);
      return result;
    } catch(e) {
      Profiler.stop(name);
      throw(e);
    }
  }
  f.prototype = this.prototype;
  for (var property in this) {
    f[property] = this[property];
  }
  return f;
}
