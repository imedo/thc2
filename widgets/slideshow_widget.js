/*
  Simple slideshow widget
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var SlideshowWidget = Class.create(Widget, {
  current: 0,
  stopped: true,
  cycles: 0,
  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    
    this.slides = $A(this.element.getElementsByTagName('li'));
    this.slides.each(function(slide) {
      slide.xOpacity = 0;
    });
    
    if (this.slides.size() == 0) {
      return;
    }
    
    this.slides.first().style.display = "block";
    this.slides.first().xOpacity = .99;
    
    this.speed = 3000;
    this.startLater();
  },
  
  startLater: function() {
    this.stopped = false;
    setTimeout(this.fade.bind(this), this.speed);
  },
  
  start: function() {
    if (!this.stopped) return;
    
    this.stopped = false;
    this.fade();
  },
  
  stop: function() {
    if (this.stopped) return;
    
    this.jump(this.current);
  },
  
  next: function() {
    this.jump(this.nextIndex());
  },
  
  previous: function() {
    this.jump(this.previousIndex());
  },
  
  jump: function(slide) {
    this.current = slide;
    this.hideAll();
    this.currentSlide().xOpacity = .99;
    this.setOpacity(this.currentSlide());
    this.currentSlide().style.display = "block";
    this.stopped = true;
  },
  
  hideAll: function() {
    var slideshow = this;
    this.slides.each(function(slide) {
      slide.style.display = "none";
      slide.xOpacity = 0;
      slideshow.setOpacity(slide);
    });
  },
  
  fade: function() {
    if (this.stopped) return;
    
    var currentOpacity = (this.currentSlide().xOpacity) - .05;
    var nextOpacity = (this.nextSlide().xOpacity) + .05;
    
    this.nextSlide().style.display = "block";
    this.currentSlide().xOpacity = currentOpacity;
    this.nextSlide().xOpacity = nextOpacity;
    this.setOpacity(this.currentSlide());
    this.setOpacity(this.nextSlide());
    
    if (currentOpacity <= 0) {
      this.currentSlide().style.display = "none";
      this.current = this.nextIndex();
      if (!this.stopped) {
        setTimeout(this.fade.bind(this), this.speed);
      }
    } else if (!this.stopped) {
      setTimeout(this.fade.bind(this), 50);
    }
  },
  
  nextIndex: function() {
    return this.slides[this.current + 1] ? this.current + 1 : 0;
  },
  
  previousIndex: function() {
    return this.slides[this.current - 1] ? this.current - 1 : this.slides.length - 1;
  },
  
  currentSlide: function() {
    return this.slides[this.current];
  },
  
  nextSlide: function() {
    return this.slides[this.nextIndex()];
  },
  
  setOpacity: function(obj) {
    if (obj.xOpacity > .99) {
      obj.xOpacity = .99;
      return;
    }
    
    obj.style.opacity = obj.xOpacity;
    obj.style.MozOpacity = obj.xOpacity;
    obj.style.filter = "alpha(opacity=" + (obj.xOpacity * 100) + ")";
  }
});

var SlideshowControls = {
  connect: function() {
    CurrentPage.connectAll({
      '#start-slideshow': { click: $S(SlideshowControls, 'start') },
      '#stop-slideshow': { click: $S(SlideshowControls, 'stop') },
      '#next-slide': { click: $S(SlideshowControls, 'next') },
      '#previous-slide': { click: $S(SlideshowControls, 'previous') }
    });
  },
  
  start: function(event) {
    $S('slideshow', 'start')(event);
    this.showStop();
  },
  
  stop: function(event) {
    $S('slideshow', 'stop')(event);
    this.showStart();
  },
  
  next: function(event) {
    $S('slideshow', 'next')(event);
    this.showStart();
  },
  
  previous: function(event) {
    $S('slideshow', 'previous')(event);
    this.showStart();
  },
  
  showStart: function() {
    $('stop-slideshow').className = 'none';
    $('start-slideshow').className = '';
  },
  
  showStop: function() {
    $('stop-slideshow').className = '';
    $('start-slideshow').className = 'none';
  }
};

CurrentPage.registerBehaviour("thc2-slideshow", SlideshowWidget);
SlideshowControls.connect();
