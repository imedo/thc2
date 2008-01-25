/*
  This Widget makes the the element togglable
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ToggleWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    
    var target = $w($(element).className).find(function(klass){ return klass.startsWith("toggle_"); });
    if(target){
      this.link = $(element);
      this.child = $(target.gsub("toggle_", ''));
      this.duration = 0.5;
      this.effect = null;
    } else{
      this.link = element.getElementsByTagName("a")[0];
      this.child = element.getElementsBySelector("div")[0];
      this.duration = 2.0;
      this.effect = "blind";
    }
    
    Event.observe(this.link, "click", this.click.bindAsEventListener(this));
  },
  
  click: function(event) {
    Effect.toggle(this.child, this.effect, {duration: this.duration});
    event.stop();
  }
});

CurrentPage.registerBehaviour("thc2-toggle-widget", ToggleWidget);
