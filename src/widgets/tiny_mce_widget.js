/*
  Dynamically change textarea widgets to TinyMCE widgets
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var TinyMCEWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    tinyMCE.execCommand('mceAddControl', true, this.element.id);
  }
});

CurrentPage.registerBehaviour("thc2-tiny-mce", TinyMCEWidget);
