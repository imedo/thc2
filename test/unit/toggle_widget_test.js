new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    ['auto-toggler', 'toggle_with_explicit_target', 'toggle_with_js_target',
     'auto-toggler-effect', 'toggle_with_explicit_target_and_effect', 'toggle_with_js_target_and_effect',
     'toggle_with_js_target_and_toggle_class'].each(function(w) {
      Event.stopObserving(w, 'click');
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

    assertObserved(['click'], function() {
      var w = new ToggleWidget($('toggle_with_js_target'), { target: 'target_js' });
      assertNotNull(w.element);
    }.bind(this));
  }},
  
  testClickOnAutoTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target'));
    Event.simulateMouse(w.link, 'click');
    assertEqual(true, w.init);
  }},

  testClickOnExplicitTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_explicit_target'));
    Event.simulateMouse(w.link, 'click');
    assertEqual(true, w.init);
  }},
  
  testClickOnJavascriptSpecifiedTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_js_target'), { target: 'target_js' });
    Event.simulateMouse(w.link, 'click');
    assertEqual(true, w.init);
  }},
  
  testSetTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_js_target'));
    w.setTarget('target_js');
    assertEqual($('target_js'), w.target);
    w.setTarget($('target_js'));
    assertEqual($('target_js'), w.target);
  }},

  testSetEffect: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_js_target'));
    assertEqual(w.defaultEffect, w.effect);
    w.setEffect('slide');
    assertEqual('slide', w.effect);
  }},

  testSetDuration: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_js_target'));
    assertEqual(w.defaultDuration, w.duration);
    w.setDuration(5.0);
    assertEqual(5.0, w.duration);
  }},

  testExtractParameters: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target'));
    w.extractParameters();
    assertEqual(w.defaultEffect, w.effect);
    assertEqual(true, w.init);
  }},

  testExtractTarget: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target'));
    w.extractTarget();
    assertEqual($('auto_target'), w.target);
    
    w = new ToggleWidget($('toggle_with_explicit_target'));
    w.extractTarget();
    assertEqual($('target'), w.target);

    w = new ToggleWidget($('toggle_with_js_target'), { target: 'target_js' });
    w.extractTarget();
    assertEqual($('target_js'), w.target);
  }},

  testPrecedenceOfConstructorTargetOverClassParameter: function() { with(this) {
    w = new ToggleWidget($('toggle_with_auto_target'), { target: 'target_js' });
    assertNotEqual($('auto_target'), w.target);
    assertEqual($('target_js'), w.target);
  }},

  testExtractEffect: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target_and_effect'));
    w.extractEffect();
    assertEqual('slide', w.effect);

    w = new ToggleWidget($('toggle_with_explicit_target_and_effect'));
    w.extractEffect();
    assertEqual('slide', w.effect);

    w = new ToggleWidget($('toggle_with_js_target_and_effect'));
    w.extractEffect();
    assertEqual('slide', w.effect);
  }},
  
  testDefaultEffectWhenNoneGiven: function() { with(this) {
    var w = new ToggleWidget($('toggle_with_auto_target'));
    w.extractParameters();
    assertEqual(w.defaultEffect, w.effect);
  }},
  
  testToggleClassesWhenClassOpenGiven: function(){ with(this) {
    var w = new ToggleWidget($('toggle_with_js_target_and_toggle_class'));
    assert(w.hasClassName('open'));
    Event.simulateMouse(w.link, 'click');
    assert(w.hasClassName('closed'));
    Event.simulateMouse(w.link, 'click');
    assert(w.hasClassName('open'));
  }}
});
