/*
  Extensions to the Prototype JavaScript Framework.
   (c) 2007 imedo GmbH
 
  Prototype Extensions are freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/


String.prototype.format = function() {
  return $A(arguments).inject(this, function(str, val, i) {
    return str.replace(new RegExp('#\\{' + (i + 1) + '\\}', 'g'), val);
  });
};

if (typeof TinyMCE != "undefined") {
  TinyMCE.Observer = Class.create(new Abstract.TimedObserver(), {
    getValue: function() {
      if (tinyMCE.selectedInstance)
        return tinyMCE.selectedInstance.getHTML();
      else
        return "";
    }
  });
}
