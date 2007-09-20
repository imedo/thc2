/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Widget = Class.create({
  initialize: function(element) {
    this.element = $(element).cleanWhitespace();
  }
});

Object.extend(Widget, {
  ApplyBehaviours: function(parent, behaviours) {
    var objects = new Array();
    
    $A($(parent || document.body).getElementsByTagName("*")).each(function(element) {
      $(element).classNames().select(function(c) { return new String(c).startsWith("thc2-"); }).each(function(className) {
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
      });
    });
    return objects;
  }
});
