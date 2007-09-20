var SignupWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.overlay = $('signup_overlay');
    this.signupWindow = $('signup_window');
    $('cancel_signup').observe('click', this.cancel.bindAsEventListener(this));
    this.show.bind(this).delay(1);
  },
  
  show: function() {
    this.positionWindow();
    this.overlay.style.display = 'block';
    new Effect.Fade(this.overlay, {
        from: 0, 
        to: 0.75, 
        duration: 6, 
        afterFinish: function() {
          new Effect.SlideDown(this.signupWindow, {
            duration: 1, 
            afterFinish: function(){ 
              this.positionWindow(); 
            }.bind(this)
          });
        }.bind(this)
    });
  },
  
  hide: function() {
    new Effect.SlideUp(this.signupWindow, {
      duration: 0.5,
      afterFinish: function(){
        new Effect.Fade(this.overlay, {
            from: 0.75,
            to: 0.0,
            duration: 0.5,
            afterFinish: function() {
            }.bind(this)
        });
      }.bind(this)
    });
  },
  
  cancel: function(event) {
    this.hide();
    event.stop();
  },
  
  positionWindow: function() {
    var vs = document.viewport.getDimensions();
    var ws = this.signupWindow.getDimensions();
    
    this.signupWindow.style.left = ((vs.width - ws.width) / 2) + "px";
    this.signupWindow.style.top = ((vs.height - ws.height) / 2) + "px";
  }
});

CurrentPage.registerBehaviour("thc2-signup-widget", SignupWidget);
