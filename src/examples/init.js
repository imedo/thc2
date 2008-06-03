/*
  Initialize Javascript after page loading.
   (c) 2007 imedo GmbH
  
  This is an example of how the initializer for the THC2 framework could look
  like. Feel free to modify this file.
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Initializer = {
  afterInit: [],
  
  init: function() {
    var d = (new Benchmark()).benchmark(function() {
      CurrentPage.applyBehaviours(document.body);
      CurrentPage.reconnect(document.body);
      Initializer.afterInit.each(function(func){ func(); })
    }).duration();
    Logger.info("Initialization took " + d + "ms.");
  },
  
  doAfterInit: function(func) {
    Initializer.afterInit.push(func);
  }
};

document.observe("dom:loaded", Initializer.init);
