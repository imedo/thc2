/*
  Limit the number of characters in a textarea
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
  
  TODO:
  -----
  
  - remove the display from this class
  - create another class that wraps a limited text area with a display
*/

/**
 * This widget limits the maximum characters allowed in a textarea.
 *
 * <p>The maximum number of characters is determined by a class parameter of the form
 * <code>maxlength_</code><em>length</em>, where <em>length</em> must be a parseable
 * integer number.</p>
 *
 * <p>Example:</p>
 *
 * <pre>
 *   &lt;textarea class=&quot;thc2-limited-textarea maxlength_200&quot;&gt;some text&lt;/textarea&gt;
 * </pre>
 *
 * @class
 * @extends thc2.Widget
 */
thc2.LimitedTextareaWidget = Class.create(thc2.Widget,
/** @scope thc2.LimitedTextareaWidget.prototype */
{
  LengthRegexp: /^maxlength_(\d+)$/,
  
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
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
   * @param {Event} event The key event object.
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
   * @param {Event} event The key event object.
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

thc2.CurrentPage.registerBehaviour("thc2-limited-textarea", thc2.LimitedTextareaWidget);
