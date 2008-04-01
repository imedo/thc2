/*
  Widget that shows a bubble popup on mouse over.
   (c) 2007 imedo GmbH

  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Base class for widgets that show bubbles on mouse over.
 */
var BubbleTriggerWidget = Class.create(Widget, {
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "mouseover", this.showBubble.bindAsEventListener(this));
    Event.observe(this.element, "mouseout", this.hideBubble.bindAsEventListener(this));
  },
  
  /**
   * Abstract method that returns the widget's bubble object. Reimplement
   * for your own bubble type.
   */
  bubble: function() {
    throw "BubbleTriggerWidget.bubble not implemented";
  },
  
  /**
   * Event handler that shows the bubble.
   */
  showBubble: function(event) {
    BubbleManager.self().showBubble(this.bubble());
  },
  
  /**
   * Event handler that hides the bubble.
   */
  hideBubble: function(event) {
    BubbleManager.self().hideBubble(this.bubble());
  }
});
