/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Represents a DOM element that gains complex behaviour. Subclass <code>Widget</code>
 * to create your own behaviours.
 * @class Widget
 */
var Widget = Class.create(
/** @scope Widget.prototype */
{
  /**
   * Initializes the element. Call this method from your overridden constructor.
   */
  initialize: function(element) {
    this.element = $(element).cleanWhitespace();
  }
});

Object.extend(Widget,
/** @scope Widget */
{
  /**
   * Applies <code>behaviours</code> on all elements under <code>parent</code>. Behaviour names must
   * start with <code>thc2-</code>.
   *
   * <p>Instead of this method, you should probably call <code>CurrentPage.applyBehaviours</code>.</p>
   */
  ApplyBehaviours: function(parent, behaviours) {
    var objects = new Array();
    try {
      $A($(parent || document.body).getElementsByTagName("*")).each(function(element) {
        var names = element.className;
        if (/thc2-/.match(names) > 0) {
          var matching_classes = names.split(' ').select(function(c) { return new String(c).startsWith("thc2-"); });
          for (var i = 0; i <= matching_classes.length; i++) {
            var className = matching_classes[i];
            var mapping = behaviours[className];
            if (mapping && CurrentPage.find(element, className).length == 0) {
              try {
                var obj = new mapping.klass(element);
                obj.behaviour = className;
              } catch(e) {
                Logger.error("Could not create class " + className + ", error: " + e.message);
                return;
              }
              objects.push(obj);
            }
          }
        }
      });
      return objects;
    } catch(e) {
    }
  }
});