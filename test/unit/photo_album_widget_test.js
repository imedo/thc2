new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
  },
  
  testEventHandlers: function() { with(this) {
    var w = new PhotoAlbumWidget($('photo_album'));
    // assertObserved(['click'], function() {
    //   var w = new ClickableWidget($('clickable'));
    //   assertNotNull(w.element);
    // }.bind(this));
  }}
});
