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
  
  validatesPresenceOf: function(field, message) {
    field = $(field);
    this.validators.push(function() {
      if (field && field.value == "") {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  validatesFormatOf: function(field, format, message) {
    field = $(field);
    this.validators.push(function() {
      if (field && !format.match(field.value)) {
        FormWidget.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  validatesLengthOf: function(field, minlength, maxlength, message) {
    field = $(field);
    this.validators.push(function() {
      if (field) {
        if ((minlength != null && field.value.length < minlength) || (maxlength != null && field.value.length > maxlength)) {
          FormWidget.handleError(field, message);
          return false;
        }
        return true;
      }
    })
  }
});

Object.extend(FormWidget, {
  handleError: function(field, message) {
    alert(message);
    field.focus();
  }
});


var MnemonicForm = Class.create(FormWidget, {
  initialize: function(element) {
    FormWidget.prototype.initialize.apply(this, arguments);
    
    var self = this;
    this.inputs = new Array();
    $A(this.element.getElementsByTagName('input')).each(function(element) {
      if (element.type != 'submit')
        self.inputs.push(element);
      if (element.type == 'text')
        element.observe('keyup', self.storeValues.bindAsEventListener(self));
    });
    this.values = new Hash();
    this.storeValues();
  },
  
  storeValues: function() {
    this.values.merge(this.inputs.inject(new Hash(), function(hash, element) {
      if (element.value && element.value != "") {
        hash[element.identify()] = element.value;
      }
      return hash;
    }));
  },
  
  clear: function() {
    this.values.keys().each(function(key) {
      $(key).value = "";
    });
  },
  
  restore: function() {
    this.values.each(function(pair) {
      $(pair.key).value = pair.value;
    });
  },
});
