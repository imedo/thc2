new Test.Unit.Runner({
  testDetect: function() { with(this) {
    var browser = thc2.Browser.detect();
    assertNotNull(browser.browser);
    assertNotNull(browser.os);
  }}
});
