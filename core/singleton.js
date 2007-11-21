var Singleton = {
  create: function() {
    try {
      
    var klass = Class.create.apply(Class, arguments);
    Object.extend(klass, {
      self: function() {
        if (!klass.instance) {
          klass.instance = new klass();
        }
        return klass.instance;
      }
    });
    
    return klass;
    } catch(e) {
      alert(e.message);
    }
    
  }
};
