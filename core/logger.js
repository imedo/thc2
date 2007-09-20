/*
  Simple environment-dependent logger
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Logger = {
  log: function(text) {
    try {
      console.debug(text);
    } catch(e) {}
  },
  
  info: function(text) {
    if (Environment.debugLevelIncludes('info')) {
      Logger.log(text);
    }
  },
  
  warning: function(text) {
    if (Environment.debugLevelIncludes('warning')) {
      Logger.log(text);
    }
  },
  
  error: function(text) {
    if (Environment.debugLevelIncludes('error')) {
      Logger.log(text);
    }
  }
};
