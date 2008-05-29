/*
  An input widget that selects all text on focus and doesnt allow editing.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget turns an text input field or a text area to readonly and selects
 * all text on focus or click. This is ideal for providing the user with
 * copy & paste code such as URLs or HTML code to embed something.
 *
 * To use this widget, simply add the class "thc2-code-input" to your input
 * field.
 * @class
 * @extends Widget
 */
var CodeInputWidget = Class.create(Widget,
/** @scope CodeInputWidget.prototype */
{
  /**
   * Constructor. Turns the element to readonly and observes the focus and
   * click events.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "focus", this.select.bindAsEventListener(this));
    Event.observe(this.element, "click", this.select.bindAsEventListener(this));
    this.element.readOnly = true;
  },
  
  /**
   * Call this method to select all text in the text input. This method is also
   * called by the click and focus event handlers.
   */
  select: function(event) {
    this.element.select();
  }
});

CurrentPage.registerBehaviour("thc2-code-input", CodeInputWidget);
