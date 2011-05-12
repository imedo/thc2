new Test.Unit.Runner({
  setup: function() {
    this.defaultDebugLevel = thc2.Environment.DebugLevel;
  },
  
  teardown: function() {
    thc2.Environment.DebugLevel = this.defaultDebugLevel;
  },
  
  testDebugLevel: function() { with(this) {
    thc2.Environment.setDebugLevel('info');
    assert( thc2.Environment.debugLevelIncludes('info'));
    assert( thc2.Environment.debugLevelIncludes('warning'));
    assert( thc2.Environment.debugLevelIncludes('error'));
    thc2.Environment.setDebugLevel('warning');
    assert(!thc2.Environment.debugLevelIncludes('info'));
    assert( thc2.Environment.debugLevelIncludes('warning'));
    assert( thc2.Environment.debugLevelIncludes('error'));
    thc2.Environment.setDebugLevel('error');
    assert(!thc2.Environment.debugLevelIncludes('info'));
    assert(!thc2.Environment.debugLevelIncludes('warning'));
    assert( thc2.Environment.debugLevelIncludes('error'));
  }},
  
  testSetDebugLevel: function() { with(this) {
    ['info', 'warning', 'error'].each(function(level) {
      assertNothingRaised(function() {
        thc2.Environment.setDebugLevel(level)
      }.bind(this));
    }.bind(this));
    
    assertRaise('UnknownDebugLevelException', function() {
      thc2.Environment.setDebugLevel('foo');
    }.bind(this));
  }}
});
