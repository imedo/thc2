/*
  Extensions to the Prototype JavaScript Framework.
   (c) 2007 imedo GmbH
 
  Prototype Extensions are freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

String.prototype.format = function() {
  return $A(arguments).inject(this, function(str, val, i) {
    return str.replace(new RegExp('#\\{' + (i + 1) + '\\}', 'g'), val);
  });
};
