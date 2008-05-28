/*
  Open link url as Popup
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PopupWidget = Class.create(Widget, {
  SizeRegexp: /^box_size_(\d+)x(\d+)$/,
  IdRegexp: /^popup_id_(\w+)$/,
  Format: 'width=#{1},height=#{2},location=no,menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes',
  init: false,
  defaultWidth: 690,
  defaultHeight: 480,
  defaultId: 'popup',
  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.showPopup.bindAsEventListener(this));
  },
  
  findLink: function() {
    return this.element.href ? this.element.href : this.element.down('a', 0).href;
  },
  
  showPopup: function(event) {
    if(!this.init) {
      this.extractParams();
    }
    
    event.stop();
    this.window = window.open(this.url, this.id, this.Format.format(this.width, this.height));
    this.window.resizeTo(this.width, this.height);
    this.window.focus();
  },
  
  extractParams: function() {
    var size = this.element.classNames().grep(this.SizeRegexp)[0];
    this.url = this.findLink();
    if (size) {
      var match = size.match(this.SizeRegexp);
      this.width = parseInt(match[1]);
      this.height = parseInt(match[2]);
    } else {
      this.width = this.defaultWidth;
      this.height = this.defaultHeight;
    }
    
    var id = this.element.classNames().grep(this.IdRegexp)[0];
    if (id) {
      var match = id.match(this.IdRegexp);
      this.id = 'popup_' + match[1];
    } else {
      this.id = this.defaultId;
    }
    
    this.init = true;
  }
});

function showPopup(url, width, height){
  var format = "width=#{w},height=#{h},location=no,menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes".interpolate({w:width, h:height});
  var win = window.open(url, 'popup', format);
  win.resizeTo(width, height);
  win.focus();
}

CurrentPage.registerBehaviour("thc2-popup", PopupWidget);
