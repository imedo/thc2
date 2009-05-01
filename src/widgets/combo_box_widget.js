/*
  This Widget simulates the behaviour of a combo box with a text input field and a select box.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This widget connects an input field and a select field together such that
 * on change of the select field, it's value is written into the text field.
 * @class
 * @extends Widget
 */
var ComboBoxWidget = Class.create(Widget,
/** @scope ComboBoxWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.textField = this.element.getElementsByTagName('input')[0];
    this.select = this.element.getElementsByTagName('select')[0];
    Event.observe(this.select, "change", this.change.bindAsEventListener(this));
  },
  
  /**
   * @inner
   * Called on change of the select field. Changes the value of the text field.
   * @param {Event} event The event object.
   */
  change: function(event) {
    this.textField.value = this.select.options[this.select.selectedIndex].value;
  }
});

CurrentPage.registerBehaviour("thc2-combo-box", ComboBoxWidget);
