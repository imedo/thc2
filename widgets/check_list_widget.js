/*
  This Widget provides select all/deselect all capabilities to a list of check box items.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var CheckListWidget = Class.create(Widget, {
  init: false,
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    var selectAllElements = $A(this.element.getElementsByClassName('select_all'));
    var deselectAllElements = $A(this.element.getElementsByClassName('deselect_all'));
    
    selectAllElements.each(function(element) {
      element.observe('click', this.selectAll.bindAsEventListener(this));
    }.bind(this));

    deselectAllElements.each(function(element) {
      element.observe('click', this.deselectAll.bindAsEventListener(this));
    }.bind(this));
  },
  
  findCheckBoxes: function() {
    this.checkboxes = $A(this.element.getElementsByTagName('input')).select(function(element) {
      return element.type == 'checkbox';
    });
  },
  
  selectAll: function(event) {
    if (!this.checkboxes) {
      this.findCheckBoxes();
    }

    this.checkboxes.each(function(checkbox) {
      checkbox.checked = true;
    });
    event.stop();
  },
  
  deselectAll: function(event) {
    if (!this.checkboxes) {
      this.findCheckBoxes();
    }

    this.checkboxes.each(function(checkbox) {
      checkbox.checked = false;
    });
    event.stop();
  }
});

CurrentPage.registerBehaviour("thc2-check-list", CheckListWidget);
