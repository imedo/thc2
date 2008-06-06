/*
  Save link as Bookmark
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This widget adds the current page to the browser's bookmarks on click.
 * @class
 * @extends Widget
 */
var BookmarkWidget = Class.create(Widget,
/** @scope BookmarkWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.bookmark.bindAsEventListener(this));
  },
  
  /**
   * Bookmarks the current page. The bookmark name used is the current page's
   * title. This method is called on click.
   * @param {Event} event The click event object.
   */
  bookmark: function(event) {
    var url = location.href; 
    var title = document.title;
    bookmark(url, title);
    event.stop();
  } 
});

CurrentPage.registerBehaviour("thc2-bookmark", BookmarkWidget);

/**
 * Creates a new bookmark, if supported by the browser. If not, it shows an
 * alert with instructions on how to bookmark the current page, depending
 * on the browser.
 *
 * @param {String} url The bookmark's URL.
 * @param {String} title The bookmark's title.
 */
function bookmark(url, title) {
  var ua = navigator.userAgent.toLowerCase();
  
  var bookmarkCode = {
    ie: function() { window.external.AddFavorite(url, title); },
    konq: function() { alert('You need to press CTRL + B to bookmark our site.'.t()); },
    opera: function() {  },
    safari: function() { (ua.indexOf('mac') != -1) ? alert('You need to press Command/Cmd + D to bookmark our site.'.t()) : alert('You need to press CTRL + D to bookmark our site.'.t()); },
    misc: function() { alert('In order to bookmark this site you need to do so manually through your browser.'.t()); }
  };
  
  var browser = (window.external && (!document.createTextNode || (typeof(window.external.AddFavorite) == 'unknown'))) ? ie :
                (ua.indexOf('konqueror') != -1) ? 'konq' :
                (window.opera) ? 'opera' :
                (window.home || (ua.indexOf('webkit') != -1 || !window.print || (ua.indexOf('mac') != -1))) ? 'safari' :
                'misc';
  bookmarkCode[browser]();
}

Object.extend(Globalize.German, {
  'You need to press CTRL + B to bookmark our site.' : 'Sie müssen STRG + B drücken, um diese Seite zu Ihren Favoriten hinzuzufügen.',
  'In order to bookmark this site you need to do so manually through your browser.' : 'Sie können diese Seite leider nur manuell zu Ihren Favoriten hinzufügen. Bitte lesen Sie dazu die Hilfe Ihres Browsers.',
  'You need to press Command/Cmd + D to bookmark our site.' : 'Sie müssen Apfel + D drücken, um diese Seite zu Ihren Lesezeichen hinzuzufügen.',
  'You need to press CTRL + D to bookmark our site.' : 'Sie müssen STRG + D drücken, um diese Seite zu Ihren Lesezeichen hinzuzufügen.'
});
