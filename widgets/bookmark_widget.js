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
    Event.observe(this.element, "click", this.bookmark.bindAsEventListener(this));
  },
  
  bookmark: function(event) {
    event.stop();
    var url = location.href; 
    var title = document.title;

    if ((navigator.appName == "Microsoft Internet Explorer") && (parseInt(navigator.appVersion) >= 4)) {
      window.external.AddFavorite(url,title);
      } else if (navigator.appName == "Netscape") {
        window.sidebar.addPanel(title,url,"");
      } else {
        alert("Drücken Sie CTRL-D (Netscape) oder CTRL-T (Opera) um die Seite zu ihren Favoriten hinzuzufügen.");
      }
    
  } 
});

CurrentPage.registerBehaviour("thc2-bookmark", BookmarkWidget);
