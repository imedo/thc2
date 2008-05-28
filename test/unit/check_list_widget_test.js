new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
//    Event.stopObserving($('clickable'), 'click');
    for (var i = 1; i <= 5; ++i) {
      $('check' + i).checked = false;
    }
  },
  
  testEventHandlers: function() { with(this) {
    assertObserved(['click', 'click', 'click'], function() {
      var w = new CheckListWidget($('check-list'));
      assertNotNull(w.element);
    }.bind(this));
    var w = new CheckListWidget($('check-list'));
  }},
  
  testFindCheckBoxes: function() { with(this) {
    var w = new CheckListWidget($('check-list'));
    w.findCheckBoxes();
    assertNotEmpty(w.checkboxes);
    assertEqual(w.checkboxes.length, 5);
  }},

  testSelectAll: function() { with(this) {
    var w = new CheckListWidget($('check-list'));
    w.selectAll(new MockEvent());
    w.checkboxes.each(function(checkbox) {
      assertEqual(checkbox.checked, true);
    }.bind(this));
  }},

  testDeselectAll: function() { with(this) {
    var w = new CheckListWidget($('check-list'));
    w.deselectAll(new MockEvent());
    w.checkboxes.each(function(checkbox) {
      assertEqual(checkbox.checked, false);
    }.bind(this));
  }},

  testInvertAll: function() { with(this) {
    var w = new CheckListWidget($('check-list'));
    $('check1').checked = true;
    $('check3').checked = true;
    $('check5').checked = true;
    
    w.invertAll(new MockEvent());
    
    assertEqual($('check1').checked, false);
    assertEqual($('check2').checked, true);
    assertEqual($('check3').checked, false);
    assertEqual($('check4').checked, true);
    assertEqual($('check5').checked, false);
  }}
});
