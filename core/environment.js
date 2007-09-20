/*
  Helper methods for environment handling
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Environment = {
  DebugLevel: 'info',
  
  debugLevelIncludes: function(level) {
    return (Environment.DebugLevel == 'info') ||
           (Environment.DebugLevel == 'warning' && (level == 'warning' || level == 'error')) ||
           (Environment.DebugLevel == 'error' && level == 'error');
  }
};
