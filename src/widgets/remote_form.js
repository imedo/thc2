/*
  Change HTML forms to AJAX forms on the fly
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget turns a form into a remote form (aka Ajax form). It provides many
 * callback methods. To use it, you should subclass it and override the callback
 * methods, or just overwrite the methods for an instance of this class.
 *
 * It also automatically detects spinner elements in the form (elements with
 * class name <code>thc2-spinner</code>), which are shown on submit and hidden
 * on complete.
 *
 * @class
 * @extends FormWidget
 */
var RemoteForm = Class.create(FormWidget,
/** @scope RemoteForm.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    FormWidget.prototype.initialize.apply(this, arguments);
    this.action = this.element.action;
    this.spinner = $(this.element.getElementsByClassName('thc2-spinner')[0]);
  },
  
  /**
   * @inner
   * This method is called when the form is submitted. It sends an Ajax request
   * to the form's target URL.
   */
  submit: function(event) {
    FormWidget.prototype.submit.apply(this, arguments);
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
  
  /**
   * This callback is called as soon as the Ajax request is sent. The default
   * implementation shows the auto-detected spinner, if available.
   * See the Prototype documentation of Ajax.Request for details.
   */
  loading: function() {
    if (this.spinner) {
      this.showSpinner();
    }
  },
  
  /**
   * This callback is called as soon as the Ajax request is finished loading.
   * See the Prototype documentation of Ajax.Request for details.
   */
  loaded: function() {
  },
  
  /**
   * See the Prototype documentation of Ajax.Request for details.
   */
  interactive: function() {
  },
  
  /**
   * This callback is called as soon as the Ajax request is finished loading
   * successfully.
   * See the Prototype documentation of Ajax.Request for details.
   */
  success: function() {
  },
  
  /**
   * This callback is called as soon as the Ajax request is finished loading
   * without success.
   * See the Prototype documentation of Ajax.Request for details.
   */
  failure: function() {
  },

  /**
   * This callback is called as soon as the Ajax request is finished loading.
   * The default implementation hides the auto-detected spinner.
   * See the Prototype documentation of Ajax.Request for details.
   */
  complete: function() {
    if (this.spinner) {
      this.hideSpinner();
    }
  },
  
  /**
   * Show the auto-detected spinner.
   */
  showSpinner: function() {
    this.spinner.show();
  },
  
  /**
   * Hide the auto-detected spinner.
   */
  hideSpinner: function() {
    this.spinner.hide();
  }
});

CurrentPage.registerBehaviour('thc2-remote-form', RemoteForm);
