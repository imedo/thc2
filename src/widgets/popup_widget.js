/*
  Open link url as Popup
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This widget turns a DOM element (e.g. a link) into an element which opens
 * an URL in a new window.
 *
 * <p>If the DOM element is a link, the link's href is chosen as the URL.
 * Otherwise, the href of this element's first link child is chosen.</p>
 *
 * <p>There are two optional class parameters to configure the widget:</p>
 *
 * <ul>
 * <li><code>box_size_</code><em>width</em><code>_</code><em>height</em>. This
 *     class parameter specifies the popup window's width and height.</li>
 * <li><code>popup_id_</code><em>id</em>. This parameter sets the popups window
 *     id. This is important to distinguish different popups coming from the
 *     same page.</li>
 * </ul>
 *
 * <p>To keep your page working even when Javascript is disabled, it is advisable
 * to add a <code>target="_blank"</code> to your link.</p>
 *
 * <p>Example:</p>
 * <pre>
 * &lt;a href=&quot;http://www.wikipedia.org&quot;
 *    target=&quot;_blank&quot;
 *    class=&quot;thc2-popup box_size_1024x768 popup_id_wikipedia&quot;&gt;Wikipedia&lt;/a&gt;
 * </pre>
 *
 * @class
 * @extends thc2.Widget
 */
thc2.PopupWidget = Class.create(thc2.Widget,
/** @scope thc2.PopupWidget.prototype */
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
    thc2.Widget.prototype.initialize.apply(this, arguments);
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
   * @param {Event} event The click event object.
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

thc2.CurrentPage.registerBehaviour("thc2-popup", thc2.PopupWidget);
