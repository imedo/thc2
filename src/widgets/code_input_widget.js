/*
  An input widget that selects all text on focus and doesnt allow editing.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This widget turns an text input field or a text area to readonly and selects
 * all text on focus or click. This is ideal for providing the user with
 * copy & paste code such as URLs or HTML code to embed something.
 *
 * <p>To use this widget, simply add the class <code>thc2-code-input</code> to your
 * input field.</p>
 * @class
 * @extends thc2.Widget
 */
thc2.CodeInputWidget = Class.create(thc2.Widget,
/** @scope thc2.CodeInputWidget.prototype */
{
  /**
   * Constructor. Turns the element to readonly and observes the focus and
   * click events.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "focus", this.select.bindAsEventListener(this));
    Event.observe(this.element, "click", this.select.bindAsEventListener(this));
    this.element.readOnly = true;
  },
  
  /**
   * Call this method to select all text in the text input. This method is also
   * called by the click and focus event handlers.
   * @param {Event} event The event object.
   */
  select: function(event) {
    this.element.select();
  }
});

thc2.CurrentPage.registerBehaviour("thc2-code-input", thc2.CodeInputWidget);
