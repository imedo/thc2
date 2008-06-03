/*
  Open link url as Popup
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget turns a DOM element (e.g. a link) into an element which opens
 * an URL in a new window. If the DOM element is a link, the link's href is
 * chosen as the URL. Otherwise, the href of this element's first link child
 * is chosen.
 *
 * There are two optional class parameters to configure the widget:
 *
 * <ul>
 * <li><code>box_size_</code><em>width</em><code>_</code><em>height</em>. This
 *     class parameter specifies the popup window's width and height.</li>
 * <li><code>popup_id_</code><em>id</em>. This parameter sets the popups window
 *     id. This is important to distinguish different popups coming from the
 *     same page.</li>
 * </ul>
 *
 * To keep your page working even when Javascript is disabled, it is advisable
 * to add a <code>target="_blank"</code> to your link.
 *
 * Example:
 * <pre>
 * &lt;a href=&quot;http://www.wikipedia.org&quot;
 *    target=&quot;_blank&quot;
 *    class=&quot;thc2-popup box_size_1024x768 popup_id_wikipedia&quot;&gt;Wikipedia&lt;/a&gt;
 * </pre>
 *
 * @class
 * @extends Widget
 */
var PopupWidget = Class.create(Widget,
/** @scope PopupWidget.prototype */
{
  SizeRegexp: /^box_size_(\d+)x(\d+)$/,
  IdRegexp: /^popup_id_(\w+)$/,
  init: false,
  
  /**
   * The default paramters for the popup window.
   */
  Format: 'width=#{1},height=#{2},location=no,menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes',
  
  /**
   * The default width of the popup window.
   */
  defaultWidth: 690,
  
  /**
   * The default height of the popup window.
   */
  defaultHeight: 480,
  
  /**
   * The default ID of the popup window.
   */
  defaultId: 'popup',
  
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.showPopup.bindAsEventListener(this));
  },
  
  /**
   * @inner
   * Finds the popup link's target URL.
   */
  findLink: function() {
    return this.element.href ? this.element.href : this.element.down('a', 0).href;
  },
  
  /**
   * Opens the popup window and gives it focus.
   */
  showPopup: function(event) {
    if(!this.init) {
      this.extractParams();
    }
    
    event.stop();
    this.window = window.open(this.url, this.id, this.Format.format(this.width, this.height));
    this.window.resizeTo(this.width, this.height);
    this.window.focus();
  },
  
  /**
   * @inner
   * Extracts the class parameters.
   */
  extractParams: function() {
    var size = this.element.classNames().grep(this.SizeRegexp)[0];
    this.url = this.findLink();
    if (size) {
      var match = size.match(this.SizeRegexp);
      this.width = parseInt(match[1]);
      this.height = parseInt(match[2]);
    } else {
      this.width = this.defaultWidth;
      this.height = this.defaultHeight;
    }
    
    var id = this.element.classNames().grep(this.IdRegexp)[0];
    if (id) {
      var match = id.match(this.IdRegexp);
      this.id = 'popup_' + match[1];
    } else {
      this.id = this.defaultId;
    }
    
    this.init = true;
  }
});

CurrentPage.registerBehaviour("thc2-popup", PopupWidget);
