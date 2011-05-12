new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    ['code-input', 'code-area'].each(function(w) {
      var c = $(w);
      c.setSelectionRange(0, 0);
      c.blur();
    });
    
    Event.stopObserving($('code-input'), 'click');
    Event.stopObserving($('code-input'), 'focus');
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['focus', 'click'], function() {
      var c = new thc2.CodeInputWidget($('code-input'));
      assertNotNull(c.element);
    }.bind(this));
    
    assertObserved(['focus', 'click'], function() {
      var c = new thc2.CodeInputWidget($('code-area'));
      assertNotNull(c.element);
    }.bind(this));
  }},
  
  testSelectOnInput: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-input'));
    c.element.value = "foo";
    $('code-input').setSelectionRange(0, 0);
    assertSelected(c.element, "");
    c.select();
    assertSelected(c.element, "foo");
  }},
  
  testClickOnInput: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    Event.simulateMouse(c.element, 'click');
    assertSelected(c.element, "foo");
  }},

  testFocusOnInput: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-input'));
    c.element.value = 'foo';
    assertSelected(c.element, "");
    c.element.focus();
    assertSelected(c.element, "foo");
  }},

  testSelectOnArea: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-area'));
    c.element.value = "foo\nbar";
    $('code-input').setSelectionRange(0, 0);
    assertSelected(c.element, "");
    c.select();
    assertSelected(c.element, "foo\nbar");
  }},
  
  testClickOnArea: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-area'));
    c.element.value = "foo\nbar";
    assertSelected(c.element, "");
    Event.simulateMouse(c.element, 'click');
    assertSelected(c.element, "foo\nbar");
  }},

  testFocusOnArea: function() { with(this) {
    var c = new thc2.CodeInputWidget($('code-area'));
    c.element.value = "foo\nbar";
    assertSelected(c.element, "");
    c.element.focus();
    assertSelected(c.element, "foo\nbar");
  }}
});
