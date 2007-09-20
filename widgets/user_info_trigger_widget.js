var UserInfoTriggerWidget = Class.create(BubbleTriggerWidget, {
  UsernameRegexp: /^user-([-_a-zA-Z0-9]+)$/,

  initialize: function(element) {
    BubbleTriggerWidget.prototype.initialize.apply(this, arguments);
    this.userName = (this.element.classNames().grep(this.UsernameRegexp)[0]).substr('user-'.length);
    this.element.up('a').title = "";
  },
  
  bubble: function() {
    if (!this.cachedBubble) {
      this.cachedBubble = new UserInfoBubble(this);
    }
    return this.cachedBubble;
  }
});
CurrentPage.registerBehaviour("thc2-user-info-trigger", UserInfoTriggerWidget);
