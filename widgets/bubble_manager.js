/*
  Manage different kind of Help and Info Bubbles and also cache XHR requests
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var BubbleManager = Singleton.create({
  currentBubble: {
    visible: function() {
      return false;
    },
    show: function() {},
    hide: function() {},
    appear: function() {},
    disappear: function() {}
  },
  
  initialize: function() {
    // Need to implement handler for bubble, otherwise no links in it can be clicked
    //Event.observe(document.body, 'click', this.disappearBubble.bind(this));
  },

  startShowTimeout: function() {
    this.endTimeout();
    this.timeout = setTimeout(this.appearBubble.bind(this), 900);
  },
  
  startHideTimeout: function(){
    this.endTimeout();
    this.timeout = setTimeout(this.disappearBubble.bind(this), 900);
  },
  
  endTimeout: function(){
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
  
  appearBubble: function() {
    this.endTimeout();
    this.currentBubble.appear();
  },
  
  disappearBubble: function() {
    this.endTimeout();
    this.currentBubble.disappear();
  },
  
  hideBubbleNow: function() {
    this.endTimeout();
    this.currentBubble.hide();
  },
  
  showBubbleNow: function() {
    this.endTimeout();
    this.currentBubble.show();
  },
  
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
  
  hideBubble: function(event) {
    this.endTimeout();
    this.startHideTimeout();
  }
});
