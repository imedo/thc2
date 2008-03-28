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
  }

});

CurrentPage.registerBehaviour("thc2-carousel-widget", CarouselWidget);
