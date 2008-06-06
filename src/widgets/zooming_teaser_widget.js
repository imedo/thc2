/*
  Teaser that switches between two versions (i.e. small and large) on mouseover
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * For a list of items, this widget changes the contents of a list item on
 * mouse over.
 *
 * <p>This is useful for showing more relevant information when
 * the user hovers the list item, hence the name zooming teaser. This is
 * accomplished by providing two different children for each list item,
 * one with class <code>mouseover</code> which is visible on mouse over and
 * one with class <code>mouseout</code> which is visible otherwise.</p>
 *
 * @class
 * @extends Widget
 */
var ZoomingTeaserWidget = Class.create(Widget,
/** @scope ZoomingTeaserWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.items = $A(this.element.getElementsByTagName('li'));
    this.items.each(function(item) {
      Event.observe($(item), 'mouseover', function(event) { this.mouseOver(item); }.bind(this));
    }.bind(this));
  },
  
  /**
   * @inner
   * This method is called when a list item is hovered.
   */
  mouseOver: function(item) {
    this.resetItems(item);
  },
  
  /**
   * @inner
   */
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
  
  /**
   * @inner
   */
  findChildren: function(item) {
    if (!item.over || !item.out) {
      item.out = $(item).getElementsByClassName('mouseout')[0];
      item.over = $(item).getElementsByClassName('mouseover')[0];
    }
  }
});

CurrentPage.registerBehaviour("thc2-zooming-teaser", ZoomingTeaserWidget);