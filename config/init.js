var Initializer = {
  init: function() {
    new Benchmark().benchmark(function() {
      Initializer.hideElements();
      Initializer.showElements();
      CurrentPage.applyBehaviours(document.body);
      CurrentPage.reconnect(document.body);
      Initializer.showFlash();
    });
  },
  
  hideElements: function() {
    $A(document.getElementsByClassName('hidden')).each(function(element) {
      element.style.display = 'none';
      element.removeClassName('hidden');
    });
  },
  
  showElements: function() {
    $A(document.getElementsByClassName('visible')).each(function(element) {
      element.removeClassName('visible');
    });
  },
  
  showFlash: function() {
    if ($('info-message')) {
      Effect.BlindDown('flash')
    }
  }
};

document.observe("contentloaded", Initializer.init);
