/*
  Represents a bubble popup which dynamically loaded content via ajax.
   (c) 2007 imedo GmbH

  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Base class for bubble popups which are loaded via Ajax. Subclass this class
 * if you want a bubble with dynamically loaded content.
 *
 * <p>In order for your class to work, you need to (at least) override the {@link thc2.AjaxBubble#url}
 * and {@link thc2.Bubble#bubbleElement} methods.</p>
 * @class
 * @extends thc2.Bubble
 */
thc2.AjaxBubble = Class.create(thc2.Bubble,
/** @scope thc2.AjaxBubble.prototype */
{
  /**
   * Fetches the bubble's contents and shows the bubble.
   */
  show: function() {
    this.fetch();
    thc2.Bubble.prototype.show.apply(this, arguments);
  },
  
  /**
   * Fetches the bubble's contents and lets the bubble appear.
   */
  appear: function() {
    this.fetch();
    thc2.Bubble.prototype.appear.apply(this, arguments);
  },
  
  /**
   * @inner
   * Gets called when the Ajax request response is ready. Stores the results in
   * the {@link thc2.AjaxCache} and updates the bubble's content and position.
   * @param {String} result The response body of the Ajax request.
   */
  requestCompleted: function(result) {
    thc2.AjaxCache.self().store(this.url(), result);
    this.updateBubble(result);
    this.updatePosition();
  },
  
  /**
   * Updates the bubble's contents with <code>text</code>.
   * @param {String} text The new bubble contents.
   */
  updateBubble: function(text) {
    this.element.innerHTML = text;
  },
  
  /**
   * Loads the bubble's contents via Ajax.
   */
  fetch: function() {
    this.contents = thc2.AjaxCache.self().find(this.url());
    if (this.contents) {
      this.requestCompleted(this.contents);
    } else {
      new Ajax.Request(this.url(), { method:'get', parameters:this.calculatedStyle, onSuccess: function(transport) { this.requestCompleted(transport.responseText).bind(this); }.bind(this) });
      this.switchLoadText();
    }
  },
  
  /**
   * Abstract method. Returns the url where the contents for this bubble are
   * loaded from.
   */
  url: function() {
    throw "thc2.AjaxBubble.url not implemented";
  },
  
  /**
   * Ajax bubbles can optionally show a text or spinner while the contents are
   * loaded. If you plan to do this, reimplement this method.
   */
  switchLoadText: function() {
    // do nothing
  }
});
