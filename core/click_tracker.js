var ClickTracker = Singleton.create({
  initialize: function() {
    this.url = '/click_tracker/track/'
  },
  
  attach: function() {
    $A(document.getElementsByTagName('a')).each(function(element) {
      $(element).observe('click', function() { this.track(element) }.bind(this));
    }.bind(this));
  },
  
  track: function(element) {
    new Ajax.Request(this.url + element.id, {
      asynchronous:true,
      evalScripts:false
    });
  }
});
