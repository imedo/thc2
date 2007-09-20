/*
  Change HTML forms to AJAX forms on the fly
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var RemoteForm = Class.create(FormWidget, {
  initialize: function(element) {
    FormWidget.prototype.initialize.apply(this, arguments);
    this.action = this.element.action;
    this.spinner = $(this.element.getElementsByClassName('thc2-spinner')[0]);
    Event.observe(this.element, "submit", this.submit.bindAsEventListener(this));
  },
  
  submit: function(event) {
    new Ajax.Request(this.action, {
      asynchronous:true,
      evalScripts:true,
      onLoading:this.loading.bind(this),
      onLoaded:this.loaded.bind(this),
      onInteractive:this.interactive.bind(this),
      onSuccess:this.success.bind(this),
      onFailure:this.failure.bind(this),
      onComplete:this.complete.bind(this),
      parameters:Form.serialize(this.element)
    });
    event.stop();
  },
  
  loading: function() {
    if (this.spinner) {
      this.showSpinner();
    }
  },
  
  loaded: function() {
  },
  
  interactive: function() {
  },
  
  success: function() {
  },
  
  failure: function() {
  },

  complete: function() {
    if (this.spinner) {
      this.hideSpinner();
    }
  },
  
  showSpinner: function() {
    this.spinner.show();
  },
  
  hideSpinner: function() {
    this.spinner.hide();
  }
});

CurrentPage.registerBehaviour('thc2-remote-form', RemoteForm);

var TinyMCERemoteForm = Class.create(RemoteForm, {
  submit: function(event) {
    tinyMCE.triggerSave(true, true);
    RemoteForm.prototype.submit.apply(this, arguments);
  },
  
  loaded: function() {
    $A(this.element.getElementsByClassName("thc2-tiny-mce")).each(function(editor) {
      tinyMCE.execCommand('mceRemoveControl', true, editor.id);
    });
  }
});

CurrentPage.registerBehaviour('thc2-tiny-mce-remote-form', TinyMCERemoteForm);
