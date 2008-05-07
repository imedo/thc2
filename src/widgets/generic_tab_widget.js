/*
  A generic tab navigation widget.
  (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var GenericTabWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.element.down('li').each(function(elem){
      Event.observe(elem, "click", function(event, elem){
        this.currentTab.hide();
        this.currentTab = elem;
        elem.show();
      }.bindAsEventListener(this));
    });
  }  
});

CurrentPage.registerBehaviour("thc2-generic-tab-widget", GenericTabWidget);


function toggleTab(elem){
  elem = $(elem);       
  var parent = elem.parentNode;
  parent.immediateDescendants().each(function(element){
    if(elem == element){
      element.show();
    } else {
      element.hide();
    }
  });
  Modalbox._putContent();
};
