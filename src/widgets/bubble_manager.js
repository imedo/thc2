/*
  Manage different kind of Help and Info Bubbles and also cache XHR requests
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Singleton class that manages all bubble popup widgets on the current page.
 * @class
 */
var BubbleManager = Singleton.create(
/** @scope BubbleManager.prototype */
{
  /**
   * Points to the currently visible bubble. Defaults to a Null Object that
   * represents the initial (non-existent) bubble.
   */
  currentBubble: {
    visible: function() {
      return false;
    },
    show: function() {},
    hide: function() {},
    appear: function() {},
    disappear: function() {}
  },
  
  /**
   * Constructor.
   */
  initialize: function() {
    // Need to implement handler for bubble, otherwise no links in it can be clicked
    //Event.observe(document.body, 'click', this.disappearBubble.bind(this));
  },
  
  /**
   * @inner
   * Starts a timer which lets the current bubble appear.
   */
  startShowTimeout: function() {
    this.endTimeout();
    this.timeout = setTimeout(this.appearBubble.bind(this), 400);
  },
  
  /**
   * @inner
   * Starts a timer which lets the current bubble disappear.
   */
  startHideTimeout: function(){
    this.endTimeout();
    this.timeout = setTimeout(this.disappearBubble.bind(this), 400);
  },
  
  /**
   * @inner
   * Cancels the show / hide timeouts.
   */
  endTimeout: function(){
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
  
  /**
   * @inner
   * Lets the current bubble appear. This method calls the bubble's implementation
   * of {@link Bubble#appear}. Override the bubble's {@link Bubble#appear} method to
   * get different effects.
   */
  appearBubble: function() {
    this.endTimeout();
    this.currentBubble.appear();
  },
  
  /**
   * @inner
   * Lets the current bubble disappear. This method calls the bubble's implementation
   * of {@link Bubble#disappear}. Override the bubble's {@link Bubble#disappear} method
   * to get different effects.
   */
  disappearBubble: function() {
    this.endTimeout();
    this.currentBubble.disappear();
  },
  
  /**
   * @inner
   * Hides the current bubble. This method calls the bubble's implementation
   * of {@link Bubble#hide}. Override the bubble's {@link Bubble#hide} method to get
   * different effects.
   */
  hideBubbleNow: function() {
    this.endTimeout();
    this.currentBubble.hide();
  },
  
  /**
   * @inner
   * Shows the current bubble. This method calls the bubble's implementation
   * of {@link Bubble#show}. Override the bubble's {@link Bubble#show} method to get
   * different effects.
   */
  showBubbleNow: function() {
    this.endTimeout();
    this.currentBubble.show();
  },
  
  /**
   * Schedules the current bubble for appearing. The bubble will appear after
   * a certain timeout, or immediately if another bubble was visible.
   * @param {Bubble} bubble The bubble to show.
   */
  showBubble: function(bubble) {
    this.endTimeout();
    if (!this.currentBubble.visible()) {
      this.currentBubble = bubble;
      this.startShowTimeout();
    } else if (this.currentBubble != bubble) {
      this.hideBubbleNow();
      this.currentBubble = bubble;
      this.showBubbleNow();
    }
  },
  
  /**
   * Schedules the current bubble for disappearing. The bubble will disappear after
   * a certain timeout.
   */
  hideBubble: function() {
    this.endTimeout();
    this.startHideTimeout();
  }
});