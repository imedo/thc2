/*
  This Widget provides select all/deselect all capabilities to a list of check box items.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var CheckListWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    var selectAllElements = this.element.select('.select_all');
    var deselectAllElements = this.element.select('.deselect_all');
    var invertAllElements = this.element.select('.invert_all');
    
    selectAllElements.each(function(element) {
      Event.observe(element, 'click', this.selectAll.bindAsEventListener(this));
    }.bind(this));

    deselectAllElements.each(function(element) {
      Event.observe(element, 'click', this.deselectAll.bindAsEventListener(this));
    }.bind(this));
    
    invertAllElements.each(function(element) {
      Event.observe(element, 'click', this.invertAll.bindAsEventListener(this));
    }.bind(this));
  },
  
  findCheckBoxes: function() {
    this.checkboxes = this.element.getInputs('checkbox');
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
  },
  
  invertAll: function(event) {
    if (!this.checkboxes) {
      this.findCheckBoxes();
    }

    this.checkboxes.each(function(checkbox) {
      checkbox.checked = !checkbox.checked;
    });
    event.stop();
  }
});

CurrentPage.registerBehaviour("thc2-check-list", CheckListWidget);
