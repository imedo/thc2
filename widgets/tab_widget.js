/*
  Simple widget for tabbed layouts using AJAX requests (yes, it supports caching)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var TabWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    var i = 0;
    this.list = $A($('side-tab-blank').getElementsByTagName("li"));
    var tabwidget = this;
    this.tabs = this.list.collect(function(item) {
      return new TabButtonWidget($(item), tabwidget, i++, $(item).firstChild);
    });
  },
  
  switchTab: function(newTab) {
    $($(this.list[0].parentNode).getElementsBySelector(".on")[0]).removeClassName("on");
    this.list[newTab].addClassName("on");
  },
  
  beforeFade: function() {
  },
  
  afterFade: function() {
  },
  
  beforeAppear: function() {
    CurrentPage.applyBehaviours(this.tabContent());
    CurrentPage.reconnect(this.tabContent());
  },
  
  afterAppear: function() {
  },
  
  tabContent: function() {
    return $(this.element.getElementsBySelector("div.tab-content")[0]);
  }
});

var TabButtonWidget = Class.create({
  visible: false,
  
  initialize: function(element, tabwidget, id, link) {
    this.tabwidget = tabwidget;
    this.tabid = id;
    this.link = link.href;
    this.element = element;
    Event.observe(link, "click", this.changeTab.bindAsEventListener(this));
  },
  
  changeTab: function(e) {
    if (!this.changing) {
      this.changing = true;
      
      this.tabwidget.beforeFade();

      this.fadeEffect = new Effect.Fade($$("div.tab-container")[0], {
        queue: { position: 'end', scope:'a' },
        afterFinish:this.fadeCallback.bind(this)
      });
      if (!AjaxCache.self().find(this.link)) {
        new Ajax.Request(this.link, { method:'get', onComplete:this.storeTab.bind(this) });
      }
    }
    e.stop();
  },
  
  storeTab: function(req) {
    AjaxCache.self().store(this.link, req.responseText);
  },
  
  showTab: function() {
    var html = AjaxCache.self().find(this.link);
    if (html) {
      if (!this.contentBox) {
        this.contentBox = this.tabwidget.tabContent();
      }
      this.contentBox.update(html);
      this.tabwidget.beforeAppear();
      this.appearEffect = new Effect.Appear($$("div.tab-container")[0], {
        queue: { position: 'end', scope:'b' },
        afterFinish:this.appearCallback.bind(this)
      });
      this.changing = false;
    } else {
      this.waitForResponse();
    }
  },
  
  waitForResponse: function() {
    setTimeout(this.showTab.bind(this), 100);
  },
  
  fadeCallback: function() {
    this.tabwidget.afterFade();
    this.showTab();
    this.tabwidget.switchTab(this.tabid);
  },
  
  appearCallback: function() {
    this.tabwidget.afterAppear();
  }
});

CurrentPage.registerBehaviour("thc2-tab-widget", TabWidget);
