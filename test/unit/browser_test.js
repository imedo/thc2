new Test.Unit.Runner({
  testDetect: function() { with(this) {
    var browser = Browser.detect();
    assertNotNull(browser.browser);
    assertNotNull(browser.os);
  }}
});
