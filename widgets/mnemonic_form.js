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
