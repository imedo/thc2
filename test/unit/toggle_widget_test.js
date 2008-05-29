new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    ['auto-toggler', 'toggle_with_explicit_target'].each(function(w) {
//      Event.stopObserving(w, 'click');
    });
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click'], function() {
      var w = new ToggleWidget($('toggle_with_auto_target'));
      assertNotNull(w.element);
    }.bind(this));

    assertObserved(['click'], function() {
      var w = new ToggleWidget($('toggle_with_explicit_target'));
      assertNotNull(w.element);
    }.bind(this));
  }},
  
  testClickOnAutoTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target'));
    Event.simulateMouse(w.link, 'click');
    assertEqual(w.init, true);
  }},

  testClickOnExplicitTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_explicit_target'));
    Event.simulateMouse(w.link, 'click');
    assertEqual(w.init, true);
  }}
});
