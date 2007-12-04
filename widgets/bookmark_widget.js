/*
  Save link as Bookmark
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var BookmarkWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    Event.observe(this.element, "click", this.bookmark.bindAsEventListener(this));
  },
  
  bookmark: function(event) {
    event.stop();
    var url = location.href; 
    var title = document.title;

    if (window.sidebar){
      window.sidebar.addPanel(title, url, "");
    } else if(window.opera && window.print){
      return true;
    } else if(document.all){
      window.external.AddFavorite(url, title);
    }
  } 
});

CurrentPage.registerBehaviour("thc2-bookmark", BookmarkWidget);

function bookmark(event){
  var url = location.href; 
  var title = document.title;
  
  if (window.sidebar){
    window.sidebar.addPanel(title, url, "");
  } else if(window.opera && window.print){
    return true;
  } else if(document.all){
    window.external.AddFavorite(url, title);
  }
}