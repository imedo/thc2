new Test.Unit.Runner({
  setup: function() {
    this.mockup(Logger, 'log', function(text) {
      this.loggedText = text;
    }.bind(this));
  },
  
  teardown: function() {
    this.undoMockup(Logger, 'log');
    this.loggedText = null;
  },
  
  testInfo: function() { with(this) {
    Environment.setDebugLevel('info');
    Logger.info('test');
    assertEqual(this.loggedText, 'test');

    this.loggedText = null;

    Environment.setDebugLevel('warning');
    Logger.info('test');
    assertNotEqual(this.loggedText, 'test');
  }},
  
  testWarning: function() { with(this) {
    Environment.setDebugLevel('warning');
    Logger.warning('test');
    assertEqual(this.loggedText, 'test');

    this.loggedText = null;

    Environment.setDebugLevel('error');
    Logger.warning('test');
    assertNotEqual(this.loggedText, 'test');
  }},
  
  testError: function() { with(this) {
    Environment.setDebugLevel('error');
    Logger.error('test');
    assertEqual(this.loggedText, 'test');
  }}
});
