/*
  Implementation of the singleton pattern.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Implements the singleton pattern. To define a singleton class, use
 * <code>Singleton.create()</code>.
 * @static
 * @class
 */
var Singleton =
/** @scope Singleton */
{
  /**
   * Creates a new singleton class. See the prototype Class.create documentation
   * for details on parameters.
   *
   * The singleton instance is available to the <code>self()</code> method.
   */
  create: function() {
    var klass = Class.create.apply(Class, arguments);
    Object.extend(klass, {
      self: function() {
        if (!klass.instance) {
          klass.instance = new klass();
        }
        return klass.instance;
      }
    });
    
    return klass;
  }
};
