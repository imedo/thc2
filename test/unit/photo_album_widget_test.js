new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
  },
  
  testEventHandlers: function() { with(this) {
    var w = new thc2.PhotoAlbumWidget($('photo_album'));
    // assertObserved(['click'], function() {
    //   var w = new thc2.ClickableWidget($('clickable'));
    //   assertNotNull(w.element);
    // }.bind(this));
  }}
});
