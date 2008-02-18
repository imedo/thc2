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
  
  // Browser detection
  var ua=navigator.userAgent.toLowerCase();
  var isKonq=(ua.indexOf('konqueror')!=-1);
  var isSafari=(ua.indexOf('webkit')!=-1);
  var isMac=(ua.indexOf('mac')!=-1);
  var buttonStr=isMac?'Command/Cmd':'CTRL';

  if(window.external && (!document.createTextNode ||
    (typeof(window.external.AddFavorite)=='unknown'))) {
      window.external.AddFavorite(url, title); // IE/Win
  } else if(isKonq) {
    alert('You need to press CTRL + B to bookmark our site.');
  } else if(window.opera || window.home || isSafari) { // Firefox, Netscape, Safari, iCab, Opera
    alert('You need to press '+buttonStr+' + D to bookmark our site.');
  } else if(!window.print || isMac) { // IE5/Mac and Safari 1.0
    alert('You need to press Command/Cmd + D to bookmark our site.');    
  } else {
    alert('In order to bookmark this site you need to do so manually through your browser.');
  }
  
}