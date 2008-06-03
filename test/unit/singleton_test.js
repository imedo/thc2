new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
  },
  
  testCreate: function() { with(this) {
    var s = Singleton.create({b: function() {}});
    assertRespondsTo('self', s);
    assertRespondsTo('b', s.self());
    assertInstanceOf(s, s.self());
  }},
  
  testCreateWithSuperclass: function() { with(this) {
    var c = Class.create({a: function() {}});
    var s = Singleton.create(c, {b: function() {}})
    assertRespondsTo('self', s);
    assertRespondsTo('a', s.self());
    assertRespondsTo('b', s.self());
    assertInstanceOf(s, s.self());
    assertInstanceOf(c, s.self());
  }},
  
  testSelf: function() { with(this) {
    var s = Singleton.create({a: function() {}});
    assertUndefined(s.instance);
    s.self();
    assertNotNull(s.instance);
    assertInstanceOf(s, s.instance);
  }}
});
