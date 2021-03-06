/*
  Represents a bubble popup.
   (c) 2007 imedo GmbH

  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Base class for bubble popups. You should subclass this class to implement your
 * bubble. If you need to load the bubble's contents via Ajax, have a look at the
 * {@link thc2.AjaxBubble} class, which caches the Ajax request's response, to minimize
 * traffic.
 * @class
 */
thc2.Bubble = Class.create(
/** @scope thc2.Bubble.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(parent) {
    this.parent = parent;
    this.element = this.bubbleElement();
    this.updatePosition();
    
    Event.observe(this.element, "mouseover", this.onMouseOver.bindAsEventListener(this));
    Event.observe(this.element, "mouseout", this.onMouseOut.bindAsEventListener(this));
    // Event.observe(this.element, "click", this.onClick.bindAsEventListener(this));
  },
  
  /**
   * Recalculates the bubble's position.
   */
  updatePosition: function() {
    var offset = Position.cumulativeOffset(this.parent.element);
    var bubble_size = Element.getDimensions(this.element);
    var element_size = Element.getDimensions(this.parent.element);
    var body_size = Element.getDimensions(document.body);
    this.calculatedStyle = { horizontal:this.horizontalStyle(offset, body_size) };
    this.verticalPosition(offset, bubble_size);
    this.horizontalPosition(offset, element_size, bubble_size);
  },
  
  /**
   * @inner
   * Calculates the bubble's vertical position.
   */
  verticalPosition: function(element_offset, bubble_size){
    this.element.style.top = (( element_offset[1] - bubble_size['height'] + this.verticalOffset()) + "px");
  },
  
  /**
   * @inner
   * Calculates the bubble's horizontal position.
   */
  horizontalPosition: function(element_offset, element_size, bubble_size){
    var left = 0;
    switch(this.calculatedStyle['horizontal']){
      case 'right':
        left = element_offset[0]+element_size['width'];
      break;
      case 'left':
        left = element_offset[0]-bubble_size['width'];
      break;
    };
    this.element.style.left = (left + this.horizontalOffset()) + 'px';
  },
  
  /**
   * Override this method to specify a vertical offset for the bubble size.
   */
  verticalOffset: function() {
    return 0;
  },
  
  /**
   * Override this method to specify a horizontal offset for the bubble size.
   */
  horizontalOffset: function() {
    return 0;
  },
  
  /**
   * @inner
   * Returns the css class for the bubble, depending on the bubbles position
   * relative to the page.
   */
  horizontalStyle: function(offset, body_size){
    var left_space = offset[0];
    var right_space = body_size['width']-offset[0];
    return (left_space > right_space) ? 'left' : 'right';
  },
  
  /**
   * Returns <code>true</code> if the bubble is visible, <code>false</code> otherwise.
   */
  visible: function() {
    return Element.visible(this.element);
  },
  
  /**
   * Shows the bubble immediately. Override to get different effects.
   */
  show: function() {
    this.element.show();
  },
  
  /**
   * Hides the bubble immediately. Override to get different effects.
   */
  hide: function() {
    this.element.hide();
  },
  
  /**
   * Shows the bubble with an appear effect. Override to get different effects.
   */
  appear: function() {
    if (!this.visible()) {
      new Effect.Appear(this.element, { duration:0.3 });
    }
  },
  
  /**
   * Hides the bubble with a fade effect. Override to get different effects.
   */
  disappear: function() {
    if (this.visible()) {
      new Effect.Fade(this.element, { duration:0.3 });
    }
  },
  
  /**
   * @inner
   * Makes sure that the bubble stays visible when the mouse hovers over it.
   * @param {Event} event The mouse event object.
   */
  onMouseOver: function(event) {
    thc2.BubbleManager.self().showBubble(this);
  },
  
  /**
   * @inner
   * Makes sure that the bubble disappears when the mouse leaves it.
   * @param {Event} event The mouse event object.
   */
  onMouseOut: function(event) {
    thc2.BubbleManager.self().hideBubble(this);
  },
  
  /**
   * @inner
   * Eats onclick events.
   * @param {Event} event The click event object.
   */
  onClick: function(event) {
    event.stop();
  },
  
  /**
   * Returns the bubble's DOM element. You need to override this method for your type of bubble.
   */
  bubbleElement: function() {
    throw 'thc2.Bubble.bubbleElement not implemented!';
  }
});
