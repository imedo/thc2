/*
  Simple slideshow widget
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget provides a cross-fading slide show for pictures of a photo album.
 *
 * <p>The pictures are given in a list tag. Each picture can have a description
 * below it in a <code>span</code> tag.</p>
 *
 * <p>The markup for this widget looks like this:</p>
 *
 * <pre>
 * &lt;div class=&quot;thc2-slideshow&quot; id=&quot;slideshow&quot;&gt;
 *   &lt;ul&gt;
 *     &lt;li&gt;
 *       &lt;img alt=&quot;Sunset&quot; src=&quot;/images/sunset.jpg&quot; /&gt;&lt;br/&gt;
 *       &lt;span&gt;Sunset&lt;/span&gt;
 *     &lt;/li&gt;
 *     &lt;li style=&quot;display:none&quot;&gt;
 *       &lt;img alt=&quot;Sunrise&quot; src=&quot;/images/sunrise.jpg&quot; /&gt;&lt;br/&gt;
 *       &lt;span&gt;Sunrise&lt;/span&gt;
 *     &lt;/li&gt;
 *   &lt;/div&gt;
 * &lt;/div&gt;
 * </pre>
 * @class
 * @extends Widget
 */
var SlideshowWidget = Class.create(Widget,
/** @scope SlideshowWidget.prototype */
{
  current: 0,
  stopped: true,
  cycles: 0,
  
  /**
   * Constructor.
   */
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
  
  /**
   * @inner
   * Starts the slideshow a few seconds after the page finished loading.
   */
  startLater: function() {
    this.stopped = false;
    setTimeout(this.fade.bind(this), this.speed);
  },
  
  /**
   * Starts the slide show.
   */
  start: function() {
    if (!this.stopped) return;
    
    this.stopped = false;
    this.fade();
  },
  
  /**
   * Stops the slide show.
   */
  stop: function() {
    if (this.stopped) return;
    
    this.jump(this.current);
  },
  
  /**
   * Stops the slide show and jumps to the next image.
   */
  next: function() {
    this.jump(this.nextIndex());
  },
  
  /**
   * Stops the slide show and jumps to the previous image.
   */
  previous: function() {
    this.jump(this.previousIndex());
  },
  
  /**
   * Jumps to the image with number <code>slide</code>, and stops
   * the slide show.
   * @param {int} slide The number of the image to jump to.
   */
  jump: function(slide) {
    this.current = slide;
    this.hideAll();
    this.currentSlide().xOpacity = .99;
    this.setOpacity(this.currentSlide());
    this.currentSlide().style.display = "block";
    this.stopped = true;
  },
  
  /**
   * @inner
   * Hides all images.
   */
  hideAll: function() {
    var slideshow = this;
    this.slides.each(function(slide) {
      slide.style.display = "none";
      slide.xOpacity = 0;
      slideshow.setOpacity(slide);
    });
  },
  
  /**
   * @inner
   * Fades to the next image.
   */
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
  
  /**
   * @inner
   * Returns the index of the next image, if it exists, otherwise
   * the index of the first image.
   * @return {int} The index of the next image, according to the round-robin
   *               principle.
   */
  nextIndex: function() {
    return this.slides[this.current + 1] ? this.current + 1 : 0;
  },
  
  /**
   * @inner
   * Returns the index of the previous image, if it exists, otherwise
   * the index of the last image.
   * @return {int} The index of the previous image, according to the round-robin
   *               principle.
   */
  previousIndex: function() {
    return this.slides[this.current - 1] ? this.current - 1 : this.slides.length - 1;
  },
  
  /**
   * Returns the current image.
   * @return {HTMLElement} The list item containing the current image.
   */
  currentSlide: function() {
    return this.slides[this.current];
  },
  
  /**
   * Returns the next image.
   * @return {HTMLElement} The list item containing the next image.
   */
  nextSlide: function() {
    return this.slides[this.nextIndex()];
  },
  
  /**
   * @inner
   * Sets the opacity of an image in a cross-browser compatible fashion.
   */
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
