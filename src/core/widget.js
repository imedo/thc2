/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Represents a DOM element that gains complex behaviour. Subclass <code>thc2.Widget</code>
 * to create your own behaviours.
 * @class thc2.Widget
 */
thc2.Widget = Class.create(
/** @scope thc2.Widget.prototype */
{
  /**
   * Initializes the element. Call this method from your overridden constructor.
   */
  initialize: function(element) {
    this.element = $(element).cleanWhitespace();
  }
});

Object.extend(thc2.Widget,
/** @scope thc2.Widget */
{
  /**
   * Applies <code>behaviours</code> on all elements under <code>parent</code>. Behaviour names must
   * start with <code>thc2-</code>.
   *
   * <p>Instead of this method, you should probably call <code>thc2.CurrentPage.applyBehaviours</code>.</p>
   */
  ApplyBehaviours: function(parent, behaviours) {
    var objects = [];
    var elements = $(parent || document.body).getElementsByTagName("*");
    var behaviourElements = [];
    for (var k = 0; k != elements.length; ++k) {
      var element = elements[k];
      var names = element.className;
      if (/thc2-/.match(names) > 0) {
        behaviourElements.push(element);
      }
    }
    for (var k = 0; k != behaviourElements.length; ++k) {
      var element = behaviourElements[k];
      var names = element.className;
      var matching_classes = names.split(' ').select(function(c) { return c.startsWith("thc2-"); });
      for (var i = 0; i != matching_classes.length; i++) {
        var className = matching_classes[i];
        var mapping = behaviours[className];
        if (mapping && thc2.CurrentPage.find(element, className).length == 0) {
          try {
            // thc2.Logger.info('' + Initializer.benchmark.lapTime() + ': Creating Behaviour of type ' + className);
            var obj = new mapping.klass(element);
            obj.behaviour = className;
          } catch(e) {
            thc2.Logger.error("Could not create class " + className + ", error: " + e.message);
            return;
          }
          objects.push(obj);
        }
      }
    }
    try {
      return objects;
    } finally {
      if (Prototype.Browser.IE) {
        objects = null;
      }
    }
  }
});
