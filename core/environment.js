/*
  Namespace common to all environments
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Namespace that contains variables and methods that depend on the current
 * environment (e.g. "development" or "production").
 */
var Environment = {
  /**
   * The default level of debugging information logged to the console. 
   * The debug levels are (in order of severety):
   *
   * @code
   *   'info' < 'warning' < 'error'
   * @endcode
   */
  DebugLevel: 'info',
  
  /**
   * Returns whether or not the current environment prints out debugging
   * information with debug level @p level.
   *
   * The following table shows the return values for each combination of
   * current debug level (columns) and @p level parameter (rows):
   *
   * @code
   *              |  Debug level
   *    Parameter |  info   warning  error
   *    ----------+-----------------------
   *    info      |  true   false    false
   *    warning   |  true   true     false
   *    error     |  true   true     true
   * @endcode
   *
   * @param level The debug level to test agains the current environment.
   * @return @c true if the current environment contains the debug level.
   */
  debugLevelIncludes: function(level) {
    return (Environment.DebugLevel == 'info') ||
           (Environment.DebugLevel == 'warning' && (level == 'warning' || level == 'error')) ||
           (Environment.DebugLevel == 'error' && level == 'error');
  }
};
