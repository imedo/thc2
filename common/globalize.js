var Globalize = {
  currentLanguage: "German",
  
  English: {},
  German: {}
};

Object.extend(String.prototype, {
  t: function() {
    if (Globalize.currentLanguage == "") {
      Logger.error('Current Language is undefined');
      return "";
    } else {
      var result = Globalize[Globalize.currentLanguage][this];
      if (isString(result)) {
        return result;
      } else {
        Logger.warning('String "' + this + '" is not translated');
        return this;
      }
    }
  }
});
