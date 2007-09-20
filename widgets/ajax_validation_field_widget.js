/*
  Prepare form for ajax validation
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var AjaxValidationFieldWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.do_effects = ($w('password text').indexOf(this.element.type) > -1)
    this.value = this.element.value;
    this.model = this.element.id.split('_')[0];
    this.attribute = this.element.id.split('_').without(this.model).join('-');
    this.url = "http://"+location.host+"/"+this.model+'s/validate';
    this.createUi();
    this.infoArea = $('ajax-validation-info');
    if(this.infoArea) this.oldText = this.infoArea.innerHTML;
    var infoTextNode = $('ajax-validation-'+this.attribute);
    if(infoTextNode){
      this.infoText = infoTextNode.innerHTML;
    } else {
      this.infoText = '';
    }
    var listener = this.element.type == "checkbox" ? "click" : 'blur';
    Event.observe(this.element, listener, this.validate.bindAsEventListener(this));
    Event.observe(this.element, 'focus', this.showInfoText.bindAsEventListener(this));
  },
  
  showInfoText: function(){
    if(this.infoText.length > 0){
      this.infoArea.update(this.infoText);
      new Effect.Highlight(this.infoArea);
    }
  },
  
  undoInfoText: function(){
    if(this.infoText.length > 0){
      this.infoArea.update(this.oldText);
    }
  },
  
  createUi: function(){
    new Insertion.Bottom(this.element.parentNode, "<span id='"+this.element.id+"_validation' class='ajax-validation-message comment s' style='display:none'></span>");
  },
  
  checkChanged: function(){
    switch(this.element.type){
      case 'checkbox': 
        return true;
      default: 
        return (this.value != this.element.value);
    }
  },
  
  setValue: function(){
    switch(this.element.type){
      case 'checkbox': 
        this.value = this.element.checked;
      break;
      default:
        return this.value = this.element.value;
    }
  },
  
  validate: function(event) {
    this.undoInfoText();
    if(this.checkChanged()){
      // Do validation call here
      new Ajax.Request(this.url, {parameters:this.element.form.serialize()});
      if(this.do_effects){
        this.element.removeClassName('ajax-validation-correct');
        this.element.removeClassName('ajax-validation-error');
        this.element.addClassName('ajax-validation-busy');
      }
    }
    this.value = this.element.value;
  }  
});

CurrentPage.registerBehaviour("thc2-ajax-validation-field", AjaxValidationFieldWidget);
