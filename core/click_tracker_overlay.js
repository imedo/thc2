var ClickTrackerOverlay = Singleton.create({
  initialize: function() {
    this.url = '/click_tracker/data';
    this.overlays = [];
  },
  
  show: function() {
    this.links = $A(document.getElementsByTagName('a'));
    var ids = this.links.inject({}, function(hash, link) { hash[$(link).classNames().grep(/link/)[0]] = "1"; return hash; });
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
      this.showOverlay($(document.body.getElementsByClassName(pair.key)[0]), pair.value);
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
      this.overlays.push(overlay);
    }
  },
  
  hide: function() {
    $A(this.overlays).each(function(overlay) {
      overlay.remove();
    });
    this.overlays = [];
  },
  
  reload: function() {
    this.hide();
    this.show();
  }
});

Initializer.afterInit.push(function() { ClickTrackerOverlay.self().show(); });
