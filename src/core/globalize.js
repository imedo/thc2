/*
  Simple javascript benchmarking class
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Namespace for languages and translations
 * @static
 * @class
 */
thc2.Globalize = {
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
    if (thc2.Globalize.currentLanguage == "") {
      thc2.Logger.error('Current Language is undefined');
      return this;
    } else {
      var result = thc2.Globalize[thc2.Globalize.currentLanguage][this];
      if (Object.isString(result)) {
        return result;
      } else {
        thc2.Logger.warning('String "' + this + '" is not translated');
        return this;
      }
    }
  }
});
