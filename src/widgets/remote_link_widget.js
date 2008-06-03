/*
  Change links to remote links on the fly
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget turns a link into a remote link (aka Ajax link).
 *
 * <p>It provides many callback methods. To use it, you should subclass it and
 * override the callback methods, or just overwrite the methods for an instance
 * of this class.</p>
 *
 * @class
 * @extends Widget
 */
var RemoteLinkWidget = Class.create(Widget,
/** @scope RemoteLinkWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.url = this.element.href;
    Event.observe(this.element, "click", this.click.bindAsEventListener(this));
  },
  
  /**
   * @inner
   * This method is called when the link is clicked. It sends an Ajax request to
   * the URL specified by the link's <code>href</code> attribute.
   * @param {Event} event The click event object.
   */
  click: function(event) {
    new Ajax.Request(this.url, {
      asynchronous:true,
      evalScripts:true,
      onLoading:this.loading.bind(this),
      onLoaded:this.loaded.bind(this),
      onInteractive:this.interactive.bind(this),
      onSuccess:this.success.bind(this),
      onFailure:this.failure.bind(this),
      onComplete:this.complete.bind(this)
    });
    event.stop();
  },
  
  /**
   * This callback is called as soon as the Ajax request is sent.
   * See the Prototype documentation of Ajax.Request for details.
   */
  loading: function() {
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
   * See the Prototype documentation of Ajax.Request for details.
   */
  complete: function() {
  }
});

CurrentPage.registerBehaviour('thc2-remote-link', RemoteLinkWidget);
