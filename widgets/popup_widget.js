/*
  Open link url as Popup
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PopupWidget = Class.create(Widget, {
  SizeRegexp: /^box_size_(\d+)x(\d+)$/,
  Format: 'width=#{1},height=#{2},location=no,menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes',
  init: false,
  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.showPopup.bindAsEventListener(this));
  },
  
  findLink: function() {
    return this.element.href ? this.element.href : this.element.down('a', 0).href;
  },
  
  showPopup: function(event) {
    if(!this.init) {
        var size = this.element.classNames().grep(this.SizeRegexp)[0];
        this.url = this.findLink();
        if (size) {
          var match = size.match(this.SizeRegexp);
          this.width = parseInt(match[1]);
          this.height = parseInt(match[2]);
        } else {
          this.width = 690;
          this.height = 480;
        }
      this.init = true;
    }
    
    event.stop();
    var win = window.open(this.url, 'popup', this.Format.format(this.width, this.height));
    win.resizeTo(this.width, this.height);
    win.focus();
  } 
});

function showPopup(url, width, height){
  var format = "width=#{w},height=#{h},location=no,menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes".interpolate({w:width, h:height});
  var win = window.open(url, 'popup', format);
  win.resizeTo(width, height);
  win.focus();
}

CurrentPage.registerBehaviour("thc2-popup", PopupWidget);
