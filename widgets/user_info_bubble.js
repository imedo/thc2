var UserInfoBubble = Class.create(AjaxBubble, {
  userInfoUrl: "/community/profiles/user_bubble/",
  
  initialize: function(parent) {
    AjaxBubble.prototype.initialize.apply(this, arguments);
  },
  
  bubbleElement: function() {
    var element = UserInfoBubble.createBubble();
    document.body.appendChild(element);
    return element;
  },
  
  url: function() {
    return this.userInfoUrl + this.parent.userName;
  },
  
  switchLoadText: function() {
    switch(this.calculated_style['horizontal']){
      case 'right':
        this.element.update(UserInfoBubble.bubbleLoadText['upRight']);
      break;
      case 'left':
        this.element.update(UserInfoBubble.bubbleLoadText['upLeft']);
      break;
    };
    Bubble.prototype.updatePosition.apply(this, arguments);
  }
});

Object.extend(UserInfoBubble, {
  bubbleLoadText: $H({upRight: '<div class="up-top right"><div class="center"><br/><br/><br/><br/><img src="http://www.imedo.de/images/spinner.gif" /><br/><br/><br/><br/></div></div><div class="up-bottom right2"><br/><br/><br/></div>',
                      upLeft: '<div class="up-top left"><div class="center"><br/><br/><br/><br/><img src="http://www.imedo.de/images/spinner.gif" /><br/><br/><br/><br/></div></div><div class="up-bottom left2"><br/><br/><br/></div>'
                    }),

  createBubble: function() {
    var element = Builder.node('div', {className: 'bubble-details', style: 'display:none'});
    return element;
  }
});
