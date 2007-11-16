var ClickTracker = Singleton.create({
  initialize: function() {
    this.url = '/click_tracker/track/'
  },
  
  attach: function() {
    $A(document.getElementsByTagName('a')).each(function(element) {
      $(element).observe('click', function() { this.track(element) }.bind(this));
      // It is le shit. This makes clickable widget behaviours work with click tracking. Because only custom can be fired with teh pr0t0typ3
      $(element).observe('clicky', function() { this.track(element) }.bind(this));
    }.bind(this));
  },
  
  track: function(element) {
    new Ajax.Request(this.url + element.id, {
      asynchronous:false,
      evalScripts:false
    });
  }
});
