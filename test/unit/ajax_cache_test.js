new Test.Unit.Runner({
  setup: function() {
    AjaxCache.self();
  },
  
  teardown: function() {
    AjaxCache.instance = null;
  },
  
  testInitialize: function() { with(this) {
    assertNotNull(AjaxCache.self().cache);
    assert(AjaxCache.self().cache instanceof Hash);
  }},
  
  testStore: function() { with(this) {
    assertUndefined(AjaxCache.self().find('foo'));
    AjaxCache.self().store('foo', 'bar');
    assertNotNull(AjaxCache.self().find('foo'));
    assertEqual(AjaxCache.self().find('foo'), 'bar');
  }},
  
  testClear: function() { with(this) {
    assertUndefined(AjaxCache.self().find('foo'));
    AjaxCache.self().store('foo', 'bar');
    assertNotNull(AjaxCache.self().find('foo'));
    assertEqual(AjaxCache.self().find('foo'), 'bar');

    AjaxCache.self().clear();
    assertUndefined(AjaxCache.self().find('foo'));
  }}
});
