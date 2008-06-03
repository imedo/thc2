/*
  Base class for forms that remember their contents
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This class adds mnemonic support to a form element, i.e. it remembers the
 * contents of the form's input elements.
 *
 * <p>These contents can be restored at any time. This class must be applied
 * to <code>form</code> elements.</p>
 * @class
 * @extends FormWidget
 */
var MnemonicForm = Class.create(FormWidget,
/** @scope MnemonicForm.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    FormWidget.prototype.initialize.apply(this, arguments);
    
    var self = this;
    this.inputs = new Array();
    this.element.getInputs().each(function(element) {
      if (element.type != 'submit')
        self.inputs.push(element);
      if (element.type == 'text')
        element.observe('keyup', self.storeValues.bindAsEventListener(self));
    });
    this.values = new Hash();
    this.storeValues();
  },
  
  /**
   * Stores the values of all of the form's fields.
   */
  storeValues: function() {
    this.values.merge(this.inputs.inject(new Hash(), function(hash, element) {
      if (element.value && element.value != "") {
        if(element.type !== 'radio')
          hash[element.identify()] = element.value;
      }
      return hash;
    }));
    this.values.merge(this.radios());
  },
  
  /**
   * Clears all the form's fields.
   */
  clear: function() {
    this.values.keys().each(function(key) {
      $(key).value = "";
    });
  },
  
  /**
   * Restores all the form's fields to the values they had, before the
   * {@link MnemonicForm#storeValues} method was called last.
   */
  restore: function() {
    this.values.each(function(pair) {
      $(pair.key).value = pair.value;
    });
  },
  
  /**
   * @inner
   */
  radios: function(){
    var hash = new Hash();
    this.element.getInputs('radio').each(function(element){
      element.name.scan(/\[([_a-z]*)\]/, function(match){
        if(element.checked)
          hash[match[1]] = element.value;
      });
    });
    return hash;
  }
});
