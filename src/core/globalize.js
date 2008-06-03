/*
  Simple javascript benchmarking class
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Namespace for languages and translations
 * @static
 * @class
 */
var Globalize = {
  /**
   * The current language for translations.
   */
  currentLanguage: "",
  
  English: {},
  German: {}
};

Object.extend(String.prototype,
/** @scope String.prototype */
{
  /**
   * Translates <code>this</code> string into the currently active language. The method logs an
   * error message if no language is active. If the string is not available in the
   * current language, a warning is logged. In both cases, the original string is
   * returned.
   *
   * @return {string} The translated string on success, or the original string on error.
   */
  t: function() {
    if (Globalize.currentLanguage == "") {
      Logger.error('Current Language is undefined');
      return this;
    } else {
      var result = Globalize[Globalize.currentLanguage][this];
      if (Object.isString(result)) {
        return result;
      } else {
        Logger.warning('String "' + this + '" is not translated');
        return this;
      }
    }
  }
});
