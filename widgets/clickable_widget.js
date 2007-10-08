/*
  This Widget makes the whole Element clickable, based on the first link within the widget.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ClickableWidget = Class.create(Widget, {
  init: false,
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.click.bindAsEventListener(this));
  },
  
  click: function(event) {
    if (!this.init) {
      this.href = this.element.down("a", 0).href;
      this.init = true;
    }
    window.location.href = this.href;
  }
});

CurrentPage.registerBehaviour("thc2-clickable-widget", ClickableWidget);
