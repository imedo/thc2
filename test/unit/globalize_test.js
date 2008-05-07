new Test.Unit.Runner({
  setup: function() {
    Object.extend(Globalize.German, {
      'foo' : 'fu',
      'baz' : 'bar'
    });
  },
  
  teardown: function() {
    Globalize.German = {};
    Globalize.currentLanguage = "";
  },
  
  testTranslationWithoutCurrentLanguage: function() { with(this) {
    assertEqual('foo'.t(), 'foo');
    assertEqual('baz'.t(), 'baz');
  }},

  testTranslationWithCurrentLanguage: function() { with(this) {
    Globalize.currentLanguage = 'German';
    assertEqual('foo'.t(), 'fu');
    assertEqual('baz'.t(), 'bar');
  }}
});
