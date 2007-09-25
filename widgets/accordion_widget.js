/*
  acts_as_accordion ;)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var AccordionWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.accordion = new accordion("accordion", { resizeSpeed: 20, classNames : {
      toggle : 'accordion-toggle',
      toggleActive : 'accordion-toggle-active',
      content : 'accordion-collapsable'
    }});
    this.accordion.activate($$('.accordion-toggle')[0]);
  }
});

CurrentPage.registerBehaviour("thc2-accordion", AccordionWidget);
