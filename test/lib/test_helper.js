Object.extend(Test.Unit.Testcase.prototype, {
  __mockUps: {},
  pause: function(millis) {
    var date = new Date();
    var curDate = null;

    do { curDate = new Date(); } 
    while(curDate-date < millis);
  },
  
  mockup: function(object, name, mock) {
    if (!object[name]) throw "The object has no method '"+name+"' to mock up";
    object.__mocking_key = object.__mocking_key || object.toString() + Math.random();

    this.__mockUps = this.__mockUps || {};
    this.__mockUps[object.__mocking_key] = this.__mockUps[object.__mocking_key] || {};
    this.__mockUps[object.__mocking_key][name] = this.__mockUps[object.__mocking_key][name] || object[name];
    return object[name] = mock;
  },

  undoMockup: function(object, name) {
    if (object[name] && object.__mocking_key && this.__mockUps && 
    this.__mockUps[object.__mocking_key] && this.__mockUps[object.__mocking_key][name]) {
      object[name] = this.__mockUps[object.__mocking_key][name];
      this.__mockUps[object.__mocking_key][name] = null;
      return object[name];
    }
  },
  
  assertSelected: function(element, text) {
    element = $(element);
    var selectedText = element.value.substr(element.selectionStart, element.selectionEnd);
    this.assertBlock('assertSelected failed: ' + text + ' != ' + selectedText, function() { return (selectedText == text) || selectedText === 'string' });
  },
  
  assertObserved: function(events, block) {
    var eventsObserved = [];
    this.mockup(Event, 'observe', function(element, event, handler) {
      eventsObserved.push(event);
    }.bind(this));
    
    block();
    
    this.assertHashEqual(eventsObserved, events);
    this.undoMockup(Event, 'observe');
  },
  
  assertNotEmpty: function(array, message) {
    this.assertBlock(message, function() { return array.length > 0 });
  }
});

var MockEvent = Class.create({
  stop: function() {}
});
