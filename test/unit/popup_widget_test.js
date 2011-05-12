new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    ['popup', 'popup_with_size', 'popup_with_id'].each(function(w) {
      Event.stopObserving(w, 'click');
    });
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click'], function() {
      var c = new thc2.PopupWidget($('popup'));
      assertNotNull(c.element);
    }.bind(this))
  }},
  
  testSizeParameter: function() { with(this) {
    var w = new thc2.PopupWidget($('popup'));
    assertEqual(w.init, false);
    w.extractParams();
    assertEqual(w.init, true);
    assertEqual(w.width, w.defaultWidth);
    assertEqual(w.height, w.defaultHeight);
    
    w = new thc2.PopupWidget($('popup_with_size'));
    w.extractParams();
    assertEqual(w.width, 1024);
    assertEqual(w.height, 768);
  }},
  
  testIdParameter: function() { with(this) {
    var w = new thc2.PopupWidget($('popup'));
    w.extractParams();
    assertEqual(w.id, w.defaultId);

    w = new thc2.PopupWidget($('popup_with_id'));
    w.extractParams();
    assertEqual(w.id, 'popup_mypopup');
  }},
  
  testFindLink: function() { with(this) {
    var w = new thc2.PopupWidget($('popup_paragraph'));
    var href = w.findLink();
    assertEqual(href, "http://www.wikipedia.org/");
  }},
  
  testClick: function() { with(this) {
    var w = new thc2.PopupWidget($('popup'));
    Event.simulateMouse(w.element, 'click');
    assertEqual(w.init, true);
    assertNotNull(w.window);
    w.window.close();
  }}
});
