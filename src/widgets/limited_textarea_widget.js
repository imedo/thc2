/*
  Limit the number of characters in a textarea
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var LimitedTextareaWidget = Class.create(Widget, {
  LengthRegexp: /^maxlength_(\d+)$/,

  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "keypress", this.keypress.bindAsEventListener(this));
    Event.observe(this.element, "keyup", this.keyup.bindAsEventListener(this));

    var length = this.element.classNames().grep(this.LengthRegexp)[0];
    if (length) {
      var match = length.match(this.LengthRegexp);
      this.maximum = parseInt(match[1]);
    } else {
      this.maximum = 100;
    }

    try {
      this.span = $(this.element.parentNode).getElementsByTagName("span")[0];
    } catch (e) {
    }
  },
  
  keypress: function(event) {
    if (this.element.value.length >= this.maximum) {
      this.element.value = this.element.value.substring(0, this.maximum);
      if (event.keyCode == 0) {
        event.stop();
      }
    }
  },
  
  keyup: function(event) {
    if (this.span) {
      this.updateDisplay();
    }
  },
  
  updateDisplay: function() {
    chars = this.maximum - this.element.value.length;
    this.span.innerHTML = chars;
  }
});

CurrentPage.registerBehaviour("thc2-limited-textarea", LimitedTextareaWidget);
