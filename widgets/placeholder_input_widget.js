/*
  Show a descriptive text in a text input; hide it as soon as the widget gets focus.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PlaceholderInputWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.placeholder = this.element.value;
    Event.observe(this.element, "focus", this.focus.bindAsEventListener(this));
    Event.observe(this.element, "blur", this.blur.bindAsEventListener(this));
    
    this.element.addClassName("placeholder-input")
  },
  
  focus: function(event) {
    if (this.element.value == this.placeholder) {
      this.element.value = "";
      this.element.removeClassName("placeholder-input");
    }
  },
  
  blur: function(event) {
    if (this.element.value == "") {
      this.element.value = this.placeholder;
      this.element.addClassName("placeholder-input");
    }
  }
});

CurrentPage.registerBehaviour("thc2-placeholder-input", PlaceholderInputWidget);
