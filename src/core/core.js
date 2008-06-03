/*
  Namespace for javascript source file handling
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Name for the (otherwise anonymous) top level namespace.
 */
var Global = this;

/**
 * Namespace for source file handling.
 *
 * @static
 * @class
 */
var Core = {
  /**
   * The base path for javascript files on your web server.
   */
  loadPath: 'javascripts',
  
  /**
   * Contains a list of files that have been loaded dynamically, relative to
   * <code>loadPath</code> and without the file extensions.
   */
  requiredFiles: [],
  
  /**
   * Queries if a file has already benn loaded dynamically.
   *
   * @param {string} file The file name relative to <code>loadPath</code>, without the extension.
   * @return {boolean} <code>true</code>, if the file has been loaded, <code>false</code> otherwise.
   */
  fileLoaded: function(file) {
    return Core.requiredFiles.include(file);
  },
  
  /**
   * For a file name relative to the load path, this method returns the
   * file name relative to the server root.
   *
   * @param {string} file The file name relative to <code>loadPath</code>, without the extension.
   * @return {string} The file name relative to the server root with the file extension.
   */
  fileNameFor: function(file) {
    return '/' + Core.loadPath + '/' + file + '.js';
  },
  
  /**
   * Schedules a source file for loading, regardless of whether or not it has
   * already been loaded. The file will be loaded after the current source file
   * is finished executing.
   *
   * @param {string} file The file name relative to <code>loadPath</code>, without the extension.
   */
  loadFile: function(file) {
    // console.debug("Loading file " + file);
    document.write('<scr' + 'ipt type="text/javascript" src="' + Core.fileNameFor(file) + '"></scr' + 'ipt>');
  },
  
  /**
   * Loads a source file immediately, regardles of whether or not it has already
   * been loaded.
   *
   * @param {string} file The file name relative to <code>loadPath</code>, without the extension.
   */
  loadFileNow: function(file) {
    // console.debug("Loading file " + file + " now!");
    var script = "";
    new Ajax.Request(Core.fileNameFor(file), { method:'get', onComplete: function(req) { script = req.responseText }, asynchronous: false });
    Global.eval(script);
  },
  
  /**
   * Loads a source file, if it has not been loaded yet.
   *
   * @param {string} file The file name relative to <code>loadPath</code>, without the extension.
   * @param {boolean} blocking If <code>true</code>, the file will be loaded immediately; if <code>false</code>,
   *                           it will be scheduled for loading. See loadFile() and
   *                           loadFileNow() for details.
   */
  require: function(file, blocking) {
    if (!Core.fileLoaded(file)) {
      if (blocking) {
        Core.loadFileNow(file);
      } else {
        Core.loadFile(file);
      }
      Core.requiredFiles.push(file);
    }
  }
};

/**
 * Shortcut for Core.require().
 *
 * @param {string} file The file to load.
 * @param {boolean} blocking Load the file immediately.
 */
function require(file, blocking) {
  Core.require(file, blocking);
}

RegExp.prototype.argumentNames = function() { return []; }

