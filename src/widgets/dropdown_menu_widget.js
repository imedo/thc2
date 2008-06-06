/*
  Dropdown menu fix for IE
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

var DropdownMenuWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    
    this.applyDropDownBehaviour(this.element);
  },

  applyDropDownBehaviour: function(element){
    element.select('ul li > ul').each(function(node){
      var parent = $(node.up('li'));
      parent.observe('mouseover', this.mouseover.bindAsEventListener(parent));
      parent.observe('mouseout', this.mouseout.bindAsEventListener(parent));
    }.bind(this));
  },
  
  mouseover: function(event) {
    this.addClassName('sfhover');
  },
  
  mouseout: function(event) {
    this.removeClassName('sfhover');
  }
});

if (Prototype.Browser.IE) {
  CurrentPage.registerBehaviour("thc2-dropdown-menu", DropdownMenuWidget);
}