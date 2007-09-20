/*
  Save link as Bookmark
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var BookmarkWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    // replace text with addthis button:
    this.element.update('<img src="http://s9.addthis.com/button0-bm.gif" width="83" height="16" />');    
    Event.observe(this.element, "click", this.bookmark.bindAsEventListener(this));
  },
  
  bookmark: function(event) {
    event.stop();
    addthis_url = location.href; 
    addthis_title = document.title;
    return addthis_click(this);    
  } 
});
var addthis_pub = 'marcel.scherf';
CurrentPage.registerBehaviour("thc2-bookmark", BookmarkWidget);
