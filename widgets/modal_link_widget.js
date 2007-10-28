/*
  Change links to open in a modal box window
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ModalLinkWidget = Class.create(Widget, {
  SizeRegexp: /^box_size_(\d+)x(\d+)$/,
  init: false,
  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.showModalBox.bindAsEventListener(this));
  },
  
  showModalBox: function(event) {
    if(!this.init) {
      var size = this.element.classNames().grep(this.SizeRegexp)[0];
       this.url = this.element.href;
       if (size) {
         var match = size.match(this.SizeRegexp);
         this.width = parseInt(match[1]);
         this.height = parseInt(match[2]);
       } else {
         this.width = 600;
         this.height = 275;
       }
       this.init = true;
    }
    this.element.blur();
    Modalbox.show(this.extendUrl(this.url), { width: this.width, title: this.element.innerHTML });
    event.stop();
  },

  extendUrl: function(url) {
    if (url.include("?")) {
      return url + '&modal=1'
    } else {
      return url + '?modal=1'
    }
  }
});

var ModalCancelWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.closeModalBox.bindAsEventListener(this));
    Event.observe(this.element, "submit", this.closeModalBox.bindAsEventListener(this));
  },
  
  closeModalBox: function(event) {
    Modalbox.hide();
    event.stop();
  }
});

CurrentPage.registerBehaviours({
  "thc2-modal-link": ModalLinkWidget,
  "thc2-modal-cancel": ModalCancelWidget
});
