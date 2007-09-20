var BubbleTriggerWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "mouseover", this.showBubble.bindAsEventListener(this));
    Event.observe(this.element, "mouseout", this.hideBubble.bindAsEventListener(this));
  },
  
  bubble: function() {},

  showBubble: function(event) {
    BubbleManager.self().showBubble(this.bubble());
  },
  
  hideBubble: function(event) {
    BubbleManager.self().hideBubble(this.bubble());
  }
});
