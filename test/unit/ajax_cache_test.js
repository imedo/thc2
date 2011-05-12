new Test.Unit.Runner({
  setup: function() {
    thc2.AjaxCache.self();
  },
  
  teardown: function() {
    thc2.AjaxCache.instance = null;
  },
  
  testInitialize: function() { with(this) {
    assertNotNull(thc2.AjaxCache.self().cache);
    assert(thc2.AjaxCache.self().cache instanceof Hash);
  }},
  
  testStore: function() { with(this) {
    assertUndefined(thc2.AjaxCache.self().find('foo'));
    thc2.AjaxCache.self().store('foo', 'bar');
    assertNotNull(thc2.AjaxCache.self().find('foo'));
    assertEqual(thc2.AjaxCache.self().find('foo'), 'bar');
  }},
  
  testClear: function() { with(this) {
    assertUndefined(thc2.AjaxCache.self().find('foo'));
    thc2.AjaxCache.self().store('foo', 'bar');
    assertNotNull(thc2.AjaxCache.self().find('foo'));
    assertEqual(thc2.AjaxCache.self().find('foo'), 'bar');

    thc2.AjaxCache.self().clear();
    assertUndefined(thc2.AjaxCache.self().find('foo'));
  }}
});
