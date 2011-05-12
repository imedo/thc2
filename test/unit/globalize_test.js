new Test.Unit.Runner({
  setup: function() {
    Object.extend(thc2.Globalize.German, {
      'foo' : 'fu',
      'baz' : 'bar'
    });
  },
  
  teardown: function() {
    thc2.Globalize.German = {};
    thc2.Globalize.currentLanguage = "";
  },
  
  testTranslationWithoutCurrentLanguage: function() { with(this) {
    assertEqual('foo'.t(), 'foo');
    assertEqual('baz'.t(), 'baz');
  }},

  testTranslationWithCurrentLanguage: function() { with(this) {
    thc2.Globalize.currentLanguage = 'German';
    assertEqual('foo'.t(), 'fu');
    assertEqual('baz'.t(), 'bar');
  }}
});
