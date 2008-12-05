var PhotoCarouselWidget = Class.create(Widget,
{
  scrollStep: 5,
  current: 0,
  
  initialize: function(element) {
    PhotoCarouselWidget.self = this;
    Widget.prototype.initialize.apply(this, arguments);
    this.showControls();
    this.inner = this.element.down('.inner-scroll-content');
    this.scrollee = this.element.down('ul');
    Event.observe(this.scrollLeft, 'click', this.scrollToLeft.bindAsEventListener(this));
    Event.observe(this.scrollRight, 'click', this.scrollToRight.bindAsEventListener(this));
  },
  
  showControls: function(){
    this.scrollLeft = this.element.down('.scroll-left');
    this.scrollRight = this.element.down('.scroll-right');
    this.element.select('.scroll-bg').each(function(elem){ elem.show(); });
    this.scrollLeft.show();
    this.scrollRight.show();
    this.element.down('.scroll-content').style.width = this.calcInnerWidth() + 'px';
  },
  
  scrollToRight: function(event){
    if(this.rightOutOfBounds(this.current + this.scrollStep)){
      this.scrollToElement(this.calcLastElement());
    }else{
      this.scrollToElement(this.current + this.scrollStep);
    }
    event.stop();
  },
  
  scrollToLeft: function(event){
    if(this.leftOutOfBounds(this.current - this.scrollStep)){
      this.scrollToElement(this.scrollableElements().length-1);
    }else{
      this.scrollToElement(this.current - this.scrollStep);
    }
    event.stop();
  },
  
  scrollToElement: function(index){
    var scrollTo = this.scrollableElements()[index];
    if(scrollTo){
      var elemOffset = scrollTo.offsetLeft;
      this.morphScroll('-' + elemOffset);
      this.current = index;
    } else {
      this.scrollToElement(0);
    }
  },
  
  leftOutOfBounds: function(index){
    
  },
  
  rightOutOfBounds: function(index){
    
  },
  
  
  calcLastElement: function(){
    
  },
  
  morphScroll: function(offset){
    new Effect.Morph(this.inner, { style: { left: offset+'px' }, duration: 0.5, queue: 'end', scope:'photo-carousel' });
  },
  
  scrollToLeft: function(event){
    event.stop();
  },
  
  // make sure the scoll container fits between the controls
  calcInnerWidth: function(){
    var containerWidth = this.element.getWidth();
    return containerWidth - 78;
  },
  
  scrollableElements: function(){
    return this.element.select('ul>li');
  }
});

CurrentPage.registerBehaviour("thc2-photo-carousel", PhotoCarouselWidget);