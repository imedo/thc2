/*
  acts_as_accordion ;)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var AccordionWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.accordion = new accordion("accordion", { duration: 0.4, classNames : {
      toggle : 'accordion-toggle',
      toggleActive : 'accordion-toggle-active',
      content : 'accordion-collapsable'
    }});
    this.accordion.toggle($$('.accordion-toggle')[0]);
  }
});

CurrentPage.registerBehaviour("thc2-accordion", AccordionWidget);

CurrentPage.connectAll({
  '.accordion-next': {
    click: function(event) {
      Event.stop(event);
      elem = Event.element(event);
      next = elem.up(3).next('.accordion-toggle');
      if(next){
        $O('accordion').accordion.toggle(next);
      }
    }
  },

  '.accordion-prev': {
    click: function(event) {
      Event.stop(event);
      elem = Event.element(event);
      prev = elem.up(3).previous('.accordion-toggle', 1);
      if(prev){
        $O('accordion').accordion.toggle(prev);
      }
    }
  }
});