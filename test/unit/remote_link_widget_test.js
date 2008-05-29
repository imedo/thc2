new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
    ['remote_link'].each(function(w) {
      Event.stopObserving(w, 'click');
    });
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click'], function() {
      var w = new RemoteLinkWidget($('remote_link'));
      assertNotNull(w.element);
    }.bind(this));
  }},
  
  testClick: function() { with(this) {
    var w = new RemoteLinkWidget($('remote_link'));
    Event.simulateMouse(w.element, 'click');
    
  }}

  // this doesn't work
  // testCallbacks: function() { with(this) {
  //   var w = new RemoteLinkWidget($('remote_link'));
  //   var numCalled = 0;
  //   var callbacks = ['loading', 'loaded', 'interactive', 'success', 'failure', 'complete'];
  //   callbacks.each(function(callback) {
  //     mockup(w, callback, function() {
  //       numCalled++;
  //     }.bind(this));
  //   }.bind(this));
  //   Event.simulateMouse(w.element, 'click');
  //   assertEqual(callbacks.length, numCalled);
  // }}
});
