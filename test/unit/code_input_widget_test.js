new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    var c = $('code-input');
    c.setSelectionRange(0, 0);
    c.blur();
    
    Event.stopObserving($('code-input'), 'click');
    Event.stopObserving($('code-input'), 'focus');
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['focus', 'click'], function() {
      var c = new CodeInputWidget($('code-input'));
      assertNotNull(c.element);
    }.bind(this));
  }},
  
  testSelect: function() { with(this) {
    var c = new CodeInputWidget($('code-input'));
    c.element.value = "foo";
    $('code-input').setSelectionRange(0, 0);
    assertSelected(c.element, "");
    c.select();
    assertSelected(c.element, "foo");
  }},
  
  testClick: function() { with(this) {
    var c = new CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    Event.simulateMouse(c.element, 'click');
    assertSelected(c.element, "foo");
  }},

  testFocus: function() { with(this) {
    var c = new CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    c.element.focus();
    assertSelected(c.element, "foo");
  }}
});
