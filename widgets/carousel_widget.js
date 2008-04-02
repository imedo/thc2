/*
  Carousel widget using the Prototype UI Library
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var CarouselWidget = Class.create(Widget, {  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.carousel = new UI.Carousel($(this.element));
    this.preview_buttons = $(this.element.down(".preview-buttons"));
    this.buildPreviewButtons();
    this.carousel.observe('scroll:ended', this.updatePreviewButtons.bindAsEventListener(this));
    this.active_preview = $(this.preview_buttons.down(0));
    this.toggleCurrentActive();
  },
  
  buildPreviewButtons: function(){
    this.preview_buttons.update('');
    for(i = 0; i < this.slideCount(); ++i){
      inserted = this.preview_buttons.insert("<div class='preview-button'>&nbsp;</div>");
      Event.observe(inserted, 'click', function(){ alert(this.carousel); this.carousel.scrollTo(i*this.perSlide()) }.bind(this));
    }
  },
  
  perSlide: function(){
    return Math.floor(this.carousel.nbVisible);
  },
  
  slideCount: function(){
    return Math.floor(this.carousel.elements.length/this.carousel.nbVisible);
  },
  
  currentSlide: function(){
    return Math.floor(this.carousel.currentIndex()/this.carousel.nbVisible);
  },
  
  updatePreviewButtons: function(event){
    this.toggleCurrentActive();
    this.active_preview = this.preview_buttons.down(this.currentSlide());
    this.toggleCurrentActive();
  },
  
  toggleCurrentActive: function(){
    this.active_preview.toggleClassName('preview-button-current');
  }

});

CurrentPage.registerBehaviour("thc2-carousel-widget", CarouselWidget);
