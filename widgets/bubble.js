var Bubble = Class.create({
  initialize: function(parent) {
    this.parent = parent;
    this.element = this.bubbleElement();
    this.updatePosition();
    
    Event.observe(this.element, "mouseover", this.onMouseOver.bindAsEventListener(this));
    Event.observe(this.element, "mouseout", this.onMouseOut.bindAsEventListener(this));
    // Event.observe(this.element, "click", this.onClick.bindAsEventListener(this));
  },
  
  updatePosition: function() {
    var offset = Position.cumulativeOffset(this.parent.element);
    var bubble_size = Element.getDimensions(this.element);
    var element_size = Element.getDimensions(this.parent.element);
    var body_size = Element.getDimensions(document.body);
    this.calculated_style = $H({horizontal:this.horizontalStyle(offset, body_size)});
    this.verticalPosition(offset, bubble_size);
    this.horizontalPosition(offset, element_size, bubble_size);
  },
  
  verticalPosition: function(element_offset, bubble_size){
    this.element.style.top = (( element_offset[1] - bubble_size['height']) + "px");
  },
  
  horizontalPosition: function(element_offset, element_size, bubble_size){
    var left = 0;
    switch(this.calculated_style['horizontal']){
      case 'right':
        left = element_offset[0]+element_size['width'];
      break;
      case 'left':
        left = element_offset[0]-bubble_size['width'];
      break;
    };
    this.element.style.left = left + 'px';
  },
  
  horizontalStyle: function(offset, body_size){
    var left_space = offset[0];
    var right_space = body_size['width']-offset[0];
    return (left_space > right_space) ? 'left' : 'right';
  },
  
  visible: function() {
    return Element.visible(this.element);
  },
  
  show: function() {
    this.element.show();
  },
  
  hide: function() {
    this.element.hide();
  },
  
  appear: function() {
    if (!this.visible()) {
      new Effect.Appear(this.element, { duration:0.3 });
    }
  },
  
  disappear: function() {
    if (this.visible()) {
      new Effect.Fade(this.element, { duration:0.3 });
    }
  },
  
  onMouseOver: function(event) {
    BubbleManager.self().showBubble(this);
  },
  
  onMouseOut: function(event) {
    BubbleManager.self().hideBubble(this);
  },
  
  onClick: function(event) {
    event.stop();
  }
});
