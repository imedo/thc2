/*
  Simple cache for ajax requests.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Singleton class that caches results of ajax requests.
 * The unique instance is obtained through
 *
 * <pre>
 *   AjaxCache.self()
 * </pre>
 *
 * Do not call the <code>new</code>-Operator on AjaxCache.
 *
 * @class AjaxCache
 */
var AjaxCache = Singleton.create(
/** @scope AjaxCache.prototype */
{
  /**
   * Constructor. Initializes the cache.
   */
  initialize: function() {
    this.clear();
  },
  
  /**
   * Finds a value stored in the hash by <code>key</code>.
   *
   * @param {string} key The key.
   * @return The value stored under key <code>key</code>, or <code>undefined</code>, if no such
   *         key exists
   */
  find: function(key) {
    return this.cache[key];
  },
  
  /**
   * Stores a value in the cache. Any existing value with the same
   * <code>key</code> will be overwritten.
   *
   * @param {string} key The key under which the <code>value</code> is stored. A convenient
   *            key would be the url of the ajax request.
   * @param value The value to be stored, i.e. the request response text.
   */
  store: function(key, value) {
    this.cache[key] = value;
  },
  
  /**
   * Clears the cache.
   */
  clear: function() {
    this.cache = new Hash();
  }
});
