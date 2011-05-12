new Test.Unit.Runner({
  setup: function() {
    this.mockup(thc2.Logger, 'log', function(text) {
      this.loggedText = text;
    }.bind(this));
  },
  
  teardown: function() {
    this.undoMockup(thc2.Logger, 'log');
    this.loggedText = null;
  },
  
  testInfo: function() { with(this) {
    thc2.Environment.setDebugLevel('info');
    thc2.Logger.info('test');
    assertEqual(this.loggedText, 'test');

    this.loggedText = null;

    thc2.Environment.setDebugLevel('warning');
    thc2.Logger.info('test');
    assertNotEqual(this.loggedText, 'test');
  }},
  
  testWarning: function() { with(this) {
    thc2.Environment.setDebugLevel('warning');
    thc2.Logger.warning('test');
    assertEqual(this.loggedText, 'test');

    this.loggedText = null;

    thc2.Environment.setDebugLevel('error');
    thc2.Logger.warning('test');
    assertNotEqual(this.loggedText, 'test');
  }},
  
  testError: function() { with(this) {
    thc2.Environment.setDebugLevel('error');
    thc2.Logger.error('test');
    assertEqual(this.loggedText, 'test');
  }}
});
