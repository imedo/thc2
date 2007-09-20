function createBookmark(title, url) {
  if (window.sidebar) { // Mozilla Firefox Bookmark
    window.sidebar.addPanel(title, url,"");
  } else if( window.external ) { // IE Favorite
    window.external.AddFavorite(url, title);
  } else if(window.opera && window.print) { // Opera Hotlist
    return true;
  }
}