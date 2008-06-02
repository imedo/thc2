/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * With this class, you can observe TinyMCE fields for changes, just like you
 * can observe text fields or forms with the Prototype observers.
 *
 * To observe a TinyMCE field, create a new observer like so:
 *
 * <pre>
 * new TinyMCE.Observer(editor_id, frequency, callback)
 * </pre>
 *
 * @class
 * @extends Abstract.TimedObserver
 */
TinyMCE.Observer = Class.create(Abstract.TimedObserver,
/** @scope TinyMCE.Observer.prototype */
{
  /**
   * Used internally to get the contents of the observed TinyMCE input field.
   */
  getValue: function() {
    if (tinyMCE.selectedInstance)
      return tinyMCE.selectedInstance.getHTML();
    else
      return "";
  }
});
