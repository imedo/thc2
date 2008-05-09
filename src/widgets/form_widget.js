/*
  Base class for forms
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var FormWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    
    this.validators = new Array();
    this.form = this.element;
    this.element.observe('submit', this.submit.bindAsEventListener(this));
  },
  
  submit: function(event) {
    if (!this.validate())
      event.stop();
  },
  
  validate: function() {
    var valid = true;
    this.validators.each(function(validator) {
      if (!validator()) {
        valid = false;
        throw $break;
      }
    });
    return valid;
  },
  
  validatesPresenceOf: function(id, message) {
    var field = $(id);
    this.validators.push(function() {
      if (field && (field.value == "" || $F(id) == null)) {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  validatesFormatOf: function(id, format, message) {
    var field = $(id);
    this.validators.push(function() {
      if (field && (field.type != 'text' || !format.match(field.value))) {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  validatesConfirmationOf: function(id_first, id_second, message){
    var field_first = $(id_first);
    var field_second = $(id_second);
    this.validators.push(function() {
      if (field_first && field_second && $F(id_first) != $F(id_second) ) {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  validatesLengthOf: function(id, minlength, maxlength, message) {
    var field = $(id);
    this.validators.push(function() {
      if (field && ((field.type != 'text') || (minlength != null && field.value.length < minlength) || (maxlength != null && field.value.length > maxlength))) {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  }
});

Object.extend(FormWidget, {
  handleError: function(field, message) {
    alert(message);
    field.focus();
  }
});
