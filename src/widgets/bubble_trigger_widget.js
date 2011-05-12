/*
  thc2.Widget that shows a bubble popup on mouse over.
   (c) 2007 imedo GmbH

  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Base class for widgets that show bubbles on mouse over.
 * @class
 * @extends thc2.Widget
 */
thc2.BubbleTriggerWidget = Class.create(thc2.Widget,
/** @scope thc2.BubbleTriggerWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "mouseover", this.showBubble.bindAsEventListener(this));
    Event.observe(this.element, "mouseout", this.hideBubble.bindAsEventListener(this));
  },
  
  /**
   * Abstract method that returns the widget's bubble object. Reimplement
   * for your own bubble type.
   */
  bubble: function() {
    throw "thc2.BubbleTriggerWidget.bubble not implemented";
  },
  
  /**
   * Event handler that shows the bubble.
   * @param {Event} event The mouse event object.
   */
  showBubble: function(event) {
    thc2.BubbleManager.self().showBubble(this.bubble());
  },
  
  /**
   * Event handler that hides the bubble.
   * @param {Event} event The mouse event object.
   */
  hideBubble: function(event) {
    thc2.BubbleManager.self().hideBubble(this.bubble());
  }
});
