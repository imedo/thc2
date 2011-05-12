/*
  Unobstrusive javascript using css classes and selectors
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * With this class, you can observe TinyMCE fields for changes, just like you
 * can observe text fields or forms with the Prototype observers.
 *
 * <p>To observe a TinyMCE field, create a new observer like so:</p>
 *
 * <pre>
 * new thc2.TinyMCEObserver(editor_id, frequency, callback)
 * </pre>
 *
 * @class
 * @extends Abstract.TimedObserver
 */
thc2.TinyMCEObserver = Class.create(Abstract.TimedObserver,
/** @scope TinyMCE.Observer.prototype */
{
  /**
   * Used internally to get the contents of the observed TinyMCE input field.
   */
  getValue: function() {
    if (tinyMCE.selectedInstance)
      return tinyMCE.activeEditor.getContent();
    else
      return "";
  }
});
