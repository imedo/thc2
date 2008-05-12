/*
  Teaser that switches between two versions (i.e. small and large) on mouseover
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ZoomingTeaserWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.items = $A(this.element.getElementsByTagName('li'));
    this.items.each(function(item) {
      Event.observe($(item), 'mouseover', function(event) { this.mouseOver(item); }.bind(this));
    }.bind(this));
  },
  
  mouseOver: function(item) {
    this.resetItems(item);
  },
  
  resetItems: function(item){
    var self = this;
    this.findChildren(item);
    this.items.each(function(subitem){
      self.findChildren(subitem);
      if(item != subitem){
        subitem.over.hide();
        subitem.out.show();
      }
    });
    item.out.hide();
    item.over.show();
  },
  
  findChildren: function(item) {
    if (!item.over || !item.out) {
      item.out = $(item).getElementsByClassName('mouseout')[0];
      item.over = $(item).getElementsByClassName('mouseover')[0];
    }
  }
});

CurrentPage.registerBehaviour("thc2-zooming-teaser", ZoomingTeaserWidget);