var ClickTrackerOverlay = Singleton.create({
  initialize: function() {
    this.url = '/click_tracker/data';
  },
  
  show: function() {
    this.links = $A(document.getElementsByTagName('a'));
    var ids = this.links.inject({}, function(hash, link) { hash[link.id] = "1"; return hash; });
    new Ajax.Request(this.url, {
      method: 'post',
      asynchronous:true,
      evalScripts:true,
      parameters: ids,
      onComplete: this.processData.bind(this)
    });
  },
  
  processData: function(transport) {
    var hash = transport.responseText.evalJSON();
    $H(hash).each(function(pair) {
      this.showOverlay($(pair.key), pair.value);
    }.bind(this));
  },
  
  showOverlay: function(element, clicks) {
    if (element) {
      element.title = element.title + ' [' + clicks + ' clicks] ';
      var pos = element.cumulativeOffset();
      var overlay = new Element('div');
      overlay.setStyle({ backgroundColor: '#fff', border: '1px solid #000', position: 'absolute', left:pos.left + 'px', top: pos.top + 'px'});
      overlay.insert((new Element('span')).setStyle({color:'#f00'}).update(clicks));
      $(document.body).insert(overlay);
    }
  }
});

Initializer.afterInit.push(function() { ClickTrackerOverlay.self().show(); });
