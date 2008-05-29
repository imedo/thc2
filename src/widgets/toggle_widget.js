/*
  This Widget makes the the element togglable
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ToggleWidget = Class.create(Widget, {
  init: false,
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.extractParameters();
    Event.observe(this.link, "click", this.click.bindAsEventListener(this));
  },
  
  click: function(event) {
    if (!this.init) {
      this.extractParameters();
    }
    Effect.toggle(this.child, this.effect, {duration: this.duration});
    event.stop();
  },
  
  extractParameters: function() {
    var target = $w($(this.element).className).find(function(klass) { return klass.startsWith("toggle_"); });
    if (target) {
      this.link = $(this.element);
      this.child = $(target.gsub("toggle_", ''));
      this.duration = 0.5;
      this.effect = null;
    } else {
      this.link = this.element.getElementsByTagName("a")[0];
      this.child = this.element.getElementsBySelector("div")[0];
      this.duration = 2.0;
      this.effect = "blind";
    }
    this.init = true;
  }
});

CurrentPage.registerBehaviour("thc2-toggle-widget", ToggleWidget);
