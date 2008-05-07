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
  }
});
