/*
  Cross-browser javascript profiler; tested with IE 6, IE 7 and Firefox 2
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Profiler = {
  objects: [],
  messages: [],
  data: {},
  reportWindow: null,
  controlWindow: null,
  
  log: function(text) {
    var message = (new Date()) + ': ' + text;
    Profiler.messages.push(message);
    var win = Profiler.getControlWindow();
    if (win) {
      win.document.getElementById('message').innerHTML = message;
    }
  },
  
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
  
  stop: function(name) {
    var e = Profiler.data[name];
    e.depth -= 1;
    if (e.depth <= 0) {
      e.time = (e.time || 0) + ((new Date()) - e.startTime);
    }
  },
  
  init: function() {
    window.profiler = Profiler;
    Profiler.showControlWindow();
    if (Profiler.isEnabled()) {
      Profiler.doEnable();
    }
  },
  
  createCookie: function(value) {
    var date = new Date();
    date.setTime(date.getTime()+(356*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = "profiler="+value+expires+"; path=/";
  },

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
  
  enable: function() {
    Profiler.createCookie('on');
  },
  
  doEnable: function() {
    Profiler.attach(Global, 'Global');
  },
  
  disable: function() {
    Profiler.createCookie('off');
  },
  
  isEnabled: function() {
    return Profiler.readCookie() == 'on';
  },
  
  reset: function() {
    Profiler.objects = [];
    Profiler.messages = [];
    Profiler.data = {};
    Profiler.clearReport();
  },
  
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

  compare: function(a, b) {
    return (a < b ? -1 : (a > b ? 1 : 0));
  },
  
  reverse: function(array) {
    var result = [];
    for (var i = array.length; i != 0; --i) {
      result.push(array[i - 1]);
    }
    return result;
  },

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
  
  clearReport: function() {
    var win = Profiler.getReportWindow();
    if (win) {
      win.document.getElementById('report').innerHTML = '';
    }
  },
  
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
