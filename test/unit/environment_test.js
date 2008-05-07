new Test.Unit.Runner({
  setup: function() {
    this.defaultDebugLevel = Environment.DebugLevel;
  },
  
  teardown: function() {
    Environment.DebugLevel = this.defaultDebugLevel;
  },
  
  testDebugLevel: function() { with(this) {
    Environment.setDebugLevel('info');
    assert( Environment.debugLevelIncludes('info'));
    assert( Environment.debugLevelIncludes('warning'));
    assert( Environment.debugLevelIncludes('error'));
    Environment.setDebugLevel('warning');
    assert(!Environment.debugLevelIncludes('info'));
    assert( Environment.debugLevelIncludes('warning'));
    assert( Environment.debugLevelIncludes('error'));
    Environment.setDebugLevel('error');
    assert(!Environment.debugLevelIncludes('info'));
    assert(!Environment.debugLevelIncludes('warning'));
    assert( Environment.debugLevelIncludes('error'));
  }},
  
  testSetDebugLevel: function() { with(this) {
    ['info', 'warning', 'error'].each(function(level) {
      assertNothingRaised(function() {
        Environment.setDebugLevel(level)
      }.bind(this));
    }.bind(this));
    
    assertRaise('UnknownDebugLevelException', function() {
      Environment.setDebugLevel('foo');
    }.bind(this));
  }}
});
