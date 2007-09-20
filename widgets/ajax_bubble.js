var AjaxBubble = Class.create(Bubble, {
  show: function() {
    this.fetch();
    Bubble.prototype.show.apply(this, arguments);
  },
  
  appear: function() {
    this.fetch();
    Bubble.prototype.appear.apply(this, arguments);
  },

  requestCompleted: function(result) {
    AjaxCache.self().store(this.url(), result);
    this.updateBubble(result);
    this.updatePosition();
  },
  
  updateBubble: function(text) {
    this.element.innerHTML = text;
  },
  
  fetch: function() {
    this.contents = AjaxCache.self().find(this.url());
    if (this.contents) {
      this.requestCompleted(this.contents);
    } else {
      new Ajax.Request(this.url(), { method:'get', parameters:this.calculated_style, onSuccess: function(transport) { this.requestCompleted(transport.responseText).bind(this); }.bind(this) });
      this.switchLoadText();
    }
  }
});
