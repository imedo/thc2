/*
  An input widget that selects all text on focus and doesnt allow editing.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var CodeInputWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "focus", this.select.bindAsEventListener(this));
    Event.observe(this.element, "click", this.select.bindAsEventListener(this));
  },
  
  select: function(event) {
    this.element.select();
  }
});

CurrentPage.registerBehaviour("thc2-code-input", CodeInputWidget);
