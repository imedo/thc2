/*
  Implementation of the singleton pattern.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Implements the singleton pattern. To define a singleton class, use
 * <code>thc2.Singleton.create()</code>.
 * @static
 * @class
 */
thc2.Singleton =
/** @scope thc2.Singleton */
{
  /**
   * Creates a new singleton class. See the Prototype Class.create documentation
   * for details on parameters.
   *
   * The singleton instance is available to the <code>self()</code> method.
   */
  create: function() {
    var klass = Class.create.apply(Class, arguments);
    this.singletonize(klass);
    return klass;
  },

  singletonize: function(klass) {
    Object.extend(klass, {
      self: function() {
        if (!klass.instance) {
          klass.instance = new klass();
        }
        return klass.instance;
      }
    });
  }
};
