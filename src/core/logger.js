/*
  Simple environment-dependent logger
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

thc2.NullLogger = {
  log: function(text) {}
}

thc2.ConsoleLogger = {
  log: function(text) {
    if (window.console.debug === undefined) {
      window.console.log(text);
    } else {
      window.console.debug(text);
    }
  }
};

thc2.DocumentLogger = {
  log: function(text) {
    var element = new Element('p').update(text);
    $('logger').insert(element);
  }
};

thc2.AlertLogger = {
  log: function(text) {
    alert(text);
  }
}

/**
 * Namespace for logging functions. See the {@link Environment} namespace for log level
 * information.
 * @static
 * @class
 */
thc2.Logger = {
  logger: window.console ? thc2.ConsoleLogger :
          thc2.Environment.DebugLevel == 'info' ? thc2.NullLogger : thc2.NullLogger,
  
  /**
   * Logs a message in the javascript console. If no javascript console is
   * available, nothing happens.
   *
   * @param {string} text The message.
   */
  log: function(text) {
    this.logger.log(text);
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least <code>"info"</code>.
   *
   * @param {string} text The message.
   */
  info: function(text) {
    if (thc2.Environment.debugLevelIncludes('info')) {
      this.log(text);
    }
  },
  
  /**
   * Logs a message in the javascript console, if the current debug level is
   * at least <code>"warning"</code>.
   *
   * @param {string} text The message.
   */
  warning: function(text) {
    if (thc2.Environment.debugLevelIncludes('warning')) {
      this.log(text);
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
      this.log(text);
    }
  }
};
