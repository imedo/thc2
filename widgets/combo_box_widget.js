/*
  This Widget simulates the behaviour of a combo box with a text input field and a select box.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ComboBoxWidget = Class.create(Widget, {
  init: false,
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.textField = this.element.getElementsByTagName('input')[0];
    this.select = this.element.getElementsByTagName('select')[0];
    Event.observe(this.select, "change", this.change.bindAsEventListener(this));
  },
  
  change: function(event) {
    this.textField.value = this.select.options[this.select.selectedIndex].value;
  }
});

CurrentPage.registerBehaviour("thc2-combo-box", ComboBoxWidget);
