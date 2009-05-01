/*
  This Widget provides select all/deselect all capabilities to a list of check box items.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * For a list with one check box per item, this widget adds support for buttons
 * to select all, deselect all and to invert the selection.
 *
 * <p>This widget must be applied to a <code>form</code> element. All elements with
 * class</p>
 *
 * <ul>
 * <li><code>select_all</code> select all check boxes,</li>
 * <li><code>deselect_all</code> deselect all check boxes,</li>
 * <li><code>invert_all</code> invert the selection</li>
 * </ul>
 *
 * <p>on click.</p>
 * @class
 * @extends Widget
 */
var CheckListWidget = Class.create(Widget,
/** @scope CheckListWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    var selectAllElements = this.element.getElementsByClassName('select_all');
    var deselectAllElements = this.element.getElementsByClassName('deselect_all');
    var invertAllElements = this.element.getElementsByClassName('invert_all');
    
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
  
  /**
   * @inner
   * Finds all check boxes in the form.
   */
  findCheckBoxes: function() {
    this.checkboxes = this.element.getInputs('checkbox');
  },
  
  /**
   * Selects all check boxes.
   * @param {Event} event The click event object.
   */
  selectAll: function(event) {
    if (!this.checkboxes) {
      this.findCheckBoxes();
    }

    this.checkboxes.each(function(checkbox) {
      checkbox.checked = true;
    });
    event.stop();
  },
  
  /**
   * Deselects all check boxes.
   * @param {Event} event The click event object.
   */
  deselectAll: function(event) {
    if (!this.checkboxes) {
      this.findCheckBoxes();
    }

    this.checkboxes.each(function(checkbox) {
      checkbox.checked = false;
    });
    event.stop();
  },
  
  /**
   * Inverts the selection.
   * @param {Event} event The click event object.
   */
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
