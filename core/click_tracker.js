var ClickTracker = Singleton.create({
  initialize: function() {
    this.url = '/click_tracker/track/'
  },
  
  attach: function() {
    $A(document.getElementsByTagName('a')).each(function(element) {
      Event.observe(element, 'click', ClickTracker.track.bind(element));
      // It is le shit. This makes clickable widget behaviours work with click tracking. Because only custom can be fired with teh pr0t0typ3
      // memory leak in IE
      // Event.observe(element, 'clicky', ClickTracker.track.bind(element));
    }.bind(this));
  }
});

ClickTracker.track = function() {
  new Ajax.Request(ClickTracker.self().url + this.id, {
    asynchronous:false,
    evalScripts:false
  });
}
