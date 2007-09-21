/*
  Simple environment-dependent logger
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Namespace for logging functions. See the Environment namespace for log level
 * information.
 */
var Logger = {
  /**
   * Logs a message in the javascript console. If no javascript console is
   * available, nothing happens.
   *
   * @param text The message.
   */
  log: function(text) {
    try {
      console.debug(text);
    } catch(e) {}
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least 'info'.
   *
   * @param text The message.
   */
  info: function(text) {
    if (Environment.debugLevelIncludes('info')) {
      Logger.log(text);
    }
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least 'warning'.
   *
   * @param text The message.
   */
  warning: function(text) {
    if (Environment.debugLevelIncludes('warning')) {
      Logger.log(text);
    }
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least 'error'.
   *
   * @param text The message.
   */
  error: function(text) {
    if (Environment.debugLevelIncludes('error')) {
      Logger.log(text);
    }
  }
};
