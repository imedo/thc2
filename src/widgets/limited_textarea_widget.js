/*
  Limit the number of characters in a textarea
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  TODO:
  -----
  
  - remove the display from this class
  - create another class that wraps a limited text area with a display
*/

/**
 * This widget limits the maximum characters allowed in a textarea. The maximum
 * number of characters is determined by a class parameter of the form
 * <code>maxlength_</code><em>length</em>, where length must be a parseable
 * integer number.
 * @class
 * @extends Widget
 */
var LimitedTextareaWidget = Class.create(Widget,
/** @scope LimitedTextareaWidget.prototype */
{
  LengthRegexp: /^maxlength_(\d+)$/,
  
  /**
   * Constructor.
   */
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
  
  /**
   * @inner
   * This method is called on keypress; when the maximum length is exceeded,
   * any more characters are discarded.
   */
  keypress: function(event) {
    if (this.element.value.length >= this.maximum) {
      this.element.value = this.element.value.substring(0, this.maximum);
      if (event.keyCode == 0) {
        event.stop();
      }
    }
  },
  
  /**
   * @inner
   * TODO: remove this method from this class
   */
  keyup: function(event) {
    if (this.span) {
      this.updateDisplay();
    }
  },
  
  /**
   * @inner
   * TODO: remove this method from this class
   */
  updateDisplay: function() {
    chars = this.maximum - this.element.value.length;
    this.span.innerHTML = chars;
  }
});

CurrentPage.registerBehaviour("thc2-limited-textarea", LimitedTextareaWidget);
