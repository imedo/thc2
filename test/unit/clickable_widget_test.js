new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    Event.stopObserving($('clickable'), 'click');
    Event.stopObserving($('clickable_without_link'), 'click');
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click'], function() {
      var w = new ClickableWidget($('clickable'));
      assertNotNull(w.element);
    }.bind(this));

    assertObserved(['click'], function() {
      var w = new ClickableWidget($('clickable_without_link'));
      assertNotNull(w.element);
    }.bind(this));
  }},
  
  testFindLink: function() { with(this) {
    var w = new ClickableWidget($('clickable'));
    w.findLink();
    assertEqual('http://www.wikipedia.org/', w.href);
  }},
  
  testClick: function() { with(this) {
    var w = new ClickableWidget($('clickable'));
    var called = false;
    mockup(w, 'followLink', function() {
      called = true;
    }.bind(this));
    assertEqual(false, called);
    Event.simulateMouse(w.element, 'click');
    assertEqual(true, called);
    undoMockup(w, 'followLink');
  }},
  
  testSetURL: function() { with(this) {
    var w = new ClickableWidget($('clickable_without_link'));
    w.setURL('http://www.google.com/');
    assertEqual('http://www.google.com/', w.href);
  }},
  
  testConstructorURL: function() { with(this) {
    var w = new ClickableWidget($('clickable_without_link'), { href: 'http://www.google.com/' });
    assertEqual('http://www.google.com/', w.href);
  }},
  
  testPrecedenceOfConstructorURLOverLink: function() { with(this) {
    var w = new ClickableWidget($('clickable'), { href: 'http://www.google.com/' });
    assertEqual('http://www.google.com/', w.href);
    mockup(w, 'followLink', function() {});
    Event.simulateMouse(w.element, 'click');
    assertEqual('http://www.google.com/', w.href);
    undoMockup(w, 'followLink');
    
    w.findLink();
    assertEqual('http://www.wikipedia.org/', w.href);
  }}
});
