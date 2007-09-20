/*
  This Widget makes the the element togglable
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ToggleWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.link = element.getElementsByTagName("a")[0];
    this.child = element.getElementsBySelector("div")[0];
    Event.observe(this.link, "click", this.click.bindAsEventListener(this));
  },
  
  click: function(event) {
    Effect.toggle(this.child, "blind");
    event.stop();
  }
});

CurrentPage.registerBehaviour("thc2-toggle-widget", ToggleWidget);
