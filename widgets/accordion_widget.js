/*
  acts_as_accordion ;)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  Parts of this file are modified from an original version Copyright (c) 2007 stickmanlabs.
  See below for details.
*/

/* 
  accordion.js v2.0

  Copyright (c) 2007 stickmanlabs
  Author: Kevin P Miller | http://www.stickmanlabs.com

  Accordion is freely distributable under the terms of an MIT-style license.

  I don't care what you think about the file size...
    Be a pro: 
       http://www.thinkvitamin.com/features/webapps/serving-javascript-fast
       http://rakaz.nl/item/make_your_pages_load_faster_by_combining_and_compressing_javascript_and_css_files
*/

var Accordion = Class.create({
  showAccordion : null,
  animating : false,
  
  initialize: function(container, options) {
    if (!$(container)) {
      throw(container+" doesn't exist!");
      return false;
    }
    
    this.options = Object.extend({
      duration : 0.3,
      classNames : {
        toggle : 'accordion_toggle',
        toggleActive : 'accordion_toggle_active',
        content : 'accordion_content'
      },
      onEvent : 'click'
    }, options || {});

    var accordions = $$('#'+container+' .'+this.options.classNames.toggle);
    accordions.each(function(accordion) {
      accordion.observe(this.options.onEvent, this.toggle.bind(this, accordion), false);
      var options = {display: 'none'};
      this.currentAccordion = $(accordion.next(0)).setStyle(options);      
    }.bind(this));
  },
  
  toggle: function(accordion){
    if (this.animating) {
      return false;
    }
  
    var currentAccordion = $(accordion.next(0));  
    
    if (this.showAccordion == currentAccordion) {
      this.deactivate(this.showAccordion);
    } else {
      if(this.showAccordion){
        this.deactivate(this.showAccordion);
      }
      this.activate(currentAccordion);
    }
  },
  
  activate : function(accordion) {
    var options = {
      transition: Effect.Transitions.sinoidal,
      duration: this.options.duration,
      beforeStart: function() {
        this.animating = true;
      }.bind(this),
      afterFinish: function() {
        this.showAccordion = accordion;
        this.animating = false;
      }.bind(this)
    };
    accordion.previous(0).addClassName(this.options.classNames.toggleActive);
    new Effect.BlindDown(accordion, options);
  },
  
  deactivate: function(accordion){
    var options = {
      transition: Effect.Transitions.sinoidal,
      duration: this.options.duration,
      beforeStart: function() {
        this.animating = true;
      }.bind(this),
      afterFinish: function() {
        this.showAccordion = null;
        this.animating = false;
      }.bind(this)
    };
    accordion.previous(0).removeClassName(this.options.classNames.toggleActive);
    new Effect.BlindUp(accordion, options);
  }
});


var AccordionWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.accordion = new Accordion("accordion", { duration: 0.4, classNames : {
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