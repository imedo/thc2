new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    c = $('code-input');
    c.setSelectionRange(0, 0);
    c.blur();
  },
  
  testEventHandlers: function() { with(this) {
    var eventsObserved = [];
    mockup(Event, 'observe', function(element, event, handler) {
      eventsObserved.push(event);
    }.bind(this));
    
    c = new CodeInputWidget($('code-input'));
    
    assertNotNull(c.element);
    assertHashEqual(eventsObserved, ['focus', 'click']);
    
    undoMockup(Event, 'observe');
  }},
  
  testSelect: function() { with(this) {
    c = new CodeInputWidget($('code-input'));
    c.element.value = "foo";
    $('code-input').setSelectionRange(0, 0);
    assertSelected(c.element, "");
    c.select();
    assertSelected(c.element, "foo");
  }},
  
  testClick: function() { with(this) {
    c = new CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    Event.simulateMouse(c.element, 'click');
    assertSelected(c.element, "foo");
  }},

  testFocus: function() { with(this) {
    c = new CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    c.element.focus();
    assertSelected(c.element, "foo");
  }}
});
