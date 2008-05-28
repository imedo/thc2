new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    Event.stopObserving($('clickable'), 'click');
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click'], function() {
      var w = new ClickableWidget($('clickable'));
      assertNotNull(w.element);
    }.bind(this));
  }},
  
  testFindLink: function() { with(this) {
    var w = new ClickableWidget($('clickable'));
    w.findLink();
    assertEqual(w.href, 'http://www.wikipedia.org/');
  }},
  
  testClick: function() { with(this) {
    var w = new ClickableWidget($('clickable'));
    var called = false;
    mockup(w, 'followLink', function() {
      called = true;
    }.bind(this));
    assertEqual(called, false);
    Event.simulateMouse(w.element, 'click');
    assertEqual(called, true);
    undoMockup(w, 'followLink');
  }}
});
