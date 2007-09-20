var AjaxCache = Singleton.create({
  initialize: function() {
    this.clear();
  },
  
  find: function(key) {
    return this.cache[key];
  },
  
  store: function(key, value) {
    this.cache[key] = value;
  },
  
  clear: function() {
    this.cache = new Hash();
  }
});
