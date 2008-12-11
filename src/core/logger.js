/*
  Simple environment-dependent logger
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

var NullLogger = {
  log: function(text) {}
}

var ConsoleLogger = {
  log: function(text) {
    console.debug(text);
  }
};

/**
 * Namespace for logging functions. See the {@link Environment} namespace for log level
 * information.
 * @static
 * @class
 */
var Logger = {
  logger: window.console ? ConsoleLogger : NullLogger,
  
  /**
   * Logs a message in the javascript console. If no javascript console is
   * available, nothing happens.
   *
   * @param {string} text The message.
   */
  log: function(text) {
    Logger.logger.log(text);
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least <code>"info"</code>.
   *
   * @param {string} text The message.
   */
  info: function(text) {
    if (Environment.debugLevelIncludes('info')) {
      Logger.log(text);
    }
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least <code>"warning"</code>.
   *
   * @param {string} text The message.
   */
  warning: function(text) {
    if (Environment.debugLevelIncludes('warning')) {
      Logger.log(text);
    }
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least <code>"error"</code>.
   *
   * @param {string} text The message.
   */
  error: function(text) {
    if (Environment.debugLevelIncludes('error')) {
      Logger.log(text);
    }
  }
};
