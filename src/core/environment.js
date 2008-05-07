/*
  Namespace common to all environments
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This exception is thrown, when an unknown debug level is chosen in
 * Environment.
 * @class
 */
var UnknownDebugLevelException = function(level) {
  this.name = 'UnknownDebugLevelException';
  this.message = 'Unknown debug level ' + level;
  this.toString = (function () { return this.name + ': ' + this.message });
}

/**
 * @static
 * @class
 *
 * Namespace that contains variables and methods that depend on the current
 * environment (e.g. "development" or "production").
 */
var Environment = {
  /**
   * The default level of debugging information logged to the console. 
   * The debug levels are (in order of severety):
   *
   * <pre>
   *   'info' &lt; 'warning' &lt; 'error'
   * </pre>
   */
  DebugLevel: 'info',
  
  /**
   * Contains available debug levels.
   */
  AvailableDebugLevels: ['info', 'warning', 'error'],
  
  /**
   * Globally sets the debug level to <code>level</code>. If the specified
   * debug level does not exist, a <code>UnknownDebugLevelException</code>
   * is thrown.
   */
  setDebugLevel: function(level) {
    if (!Environment.AvailableDebugLevels.include(level)) {
      throw new UnknownDebugLevelException(level);
    }
    Environment.DebugLevel = level;
  },
  
  /**
   * Returns whether or not the current environment prints out debugging
   * information with debug level <code>level</code>.
   *
   * The following table shows the return values for each combination of
   * current debug level (columns) and <code>level</code> parameter (rows):
   *
   * <pre>
   *              |  Debug level
   *    Parameter |  info   warning  error
   *    ----------+-----------------------
   *    info      |  true   false    false
   *    warning   |  true   true     false
   *    error     |  true   true     true
   * </pre>
   *
   * @param {string} level The debug level to test agains the current environment.
   * @return {boolean} <code>true</code> if the current environment contains the debug level,
   *                   <code>false</code> otherwise.
   */
  debugLevelIncludes: function(level) {
    return (Environment.DebugLevel == 'info') ||
           (Environment.DebugLevel == 'warning' && (level == 'warning' || level == 'error')) ||
           (Environment.DebugLevel == 'error' && level == 'error');
  }
};
