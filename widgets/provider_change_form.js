/*
  Form for proposing changes to a provider
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ProviderChangeForm = Class.create(MnemonicForm, {
  initialize: function(element) {
    MnemonicForm.prototype.initialize.apply(this, arguments);
    var obj = this;
    var radioButtons = $A(this.element.getElementsByClassName('radio-button'));
    radioButtons.each(function(button) {
      Event.observe(button, 'click', obj[$(button).classNames().toArray().last()].bindAsEventListener(obj));
    });
    
    this.changeForm = $('change-form');
    this.validatesPresenceOf('reporter_name', 'Please enter your name'.t());
    this.validatesPresenceOf('reporter_email', 'Please enter your email address'.t());
  },
  
  correction: function(event) {
    this.restore();
    this.showForm();
  },
  
  takeOver: function(event) {
    this.restore();
    $('provider_change_first_name').value = "";
    $('provider_change_last_name').value = "";
    this.showForm();
  },
  
  stopped: function(event) {
    this.restore();
    this.hideForm();
  },
  
  newEntry: function(event) {
    this.clear();
    this.showForm();
    $('reporter_name').value = (this.values['reporter_name'] || "");
    $('reporter_email').value = (this.values['reporter_email'] || "");
  },
  
  showForm: function() {
    if (!this.changeForm.visible()) {
      new Effect.BlindDown(this.changeForm, { duration: 0.5 }); new Effect.Appear(this.changeForm, { duration: 0.5 });
    }
  },
  
  hideForm: function() {
    if (this.changeForm.visible()) {
      new Effect.Fade(this.changeForm, { duration: 0.5 }); new Effect.BlindUp(this.changeForm, { duration: 0.5 });
    }
  },
});

CurrentPage.registerBehaviour('thc2-provider-change-form', ProviderChangeForm);

Object.extend(Globalize.German, {
  'Please enter your name': 'Bitte geben Sie Ihren Namen ein',
  'Please enter your email address': 'Bitte geben Sie Ihre E-Mail-Adresse ein'
});
