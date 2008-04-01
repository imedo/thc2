var MnemonicForm = Class.create(FormWidget, {
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
