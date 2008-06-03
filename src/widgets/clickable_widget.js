/*
  This Widget makes the whole Element clickable, based on the first link within the widget.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This simple widget turns a DOM element with possibly many children into a
 * link. This is especially useful for block elements like <code>div</code>s,
 * which are not allowed in links. The target URL is either determined by the
 * <code>href</code> attribute of first link tag in the widgets element, or
 * by the <code>href</code> value in the constructors <code>options</code>
 * parameter hash.
 *
 * @class
 * @extends Widget
 */
var ClickableWidget = Class.create(Widget,
/** @scope ClickableWidget.prototype */
{
  init: false,
  
  /**
   * Constructor.
   * @param {HTMLElement,String} element The widgets element.
   * @param {Object} options An options hash. The following options are
   *   recognized:
   *     <ul>
   *       <li><code>href</code> - The target location when the widget
   *           element is clicked.</li>
   *     </ul>
   */
  initialize: function(element, options) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.click.bindAsEventListener(this));
    
    if (options && options['href']) {
      this.setURL(options['href']);
    }
  },
  
  /**
   * Click event handler.
   * @param {Event} event The click event object.
   */
  click: function(event) {
    if (!this.init && !this.href) {
      this.findLink();
    }
    this.followLink();
  },
  
  /**
   * Finds the first link inside the widget element, and sets the target location.
   */
  findLink: function() {
    this.a = $(this.element.getElementsByTagName('a')[0]);
    if (this.a) {
      this.setURL(this.a.href);
    }
    this.init = true;
  },
  
  /**
   * Set the target location manually.
   * @param {String} link The target location.
   */
  setURL: function(link) {
    this.href = link;
  },
  
  /**
   * @inner
   * Follow the target location.
   */
  followLink: function() {
    window.location.href = this.href;
  }
});

CurrentPage.registerBehaviour("thc2-clickable-widget", ClickableWidget);
