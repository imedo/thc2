/*
  Change links to remote links on the fly
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var RemoteLink = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.url = this.element.href;
    Event.observe(this.element, "click", this.click.bindAsEventListener(this));
  },
  
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
  
  loading: function() {
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
  }
});

CurrentPage.registerBehaviour('thc2-remote-link', RemoteLink);
