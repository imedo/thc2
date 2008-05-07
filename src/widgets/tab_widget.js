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
    this.list = $A(this.element.getElementsByClassName('tab-list')[0].getElementsByTagName("li"));
    var tabwidget = this;
    
    this.tabs = this.list.collect(function(item) {
      var tab = new Tab(this, $(item));
      if (item.hasClassName('on'))
        this.currentTab = tab;
      return tab;
    }.bind(this));
  },
  
  tabContainer: function() {
    return $(this.element.getElementsByClassName('tab-container')[0]);
  },
  
  switchTab: function(newTab) {
    this.beforeSwitch(this.currentTab, newTab);
    
    this.doSwitch(this.currentTab, newTab);

    var oldTab = this.currentTab;
    this.switchCurrent(this.currentTab, newTab);
    
    this.afterSwitch(oldTab, this.currentTab);
  },
  
  switchCurrent: function(oldTab, newTab) {
    oldTab.turnOff();
    newTab.turnOn();
    this.currentTab = newTab;
  },
  
  beforeSwitch: function(oldTab, newTab) {
  },
  
  doSwitch: function(oldTab, newTab) {
  },
  
  afterSwitch: function(oldTab, newTab) {
  }
});

var AjaxTabWidget = Class.create(TabWidget, {
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
  },

  switchTab: function(newTab) {
    if (!this.changing) {
      this.beforeSwitch(this.currentTab, newTab);

      this.nextTab = newTab;
      this.changing = true;

      this.beforeFade();

      this.fadeEffect = new Effect.Fade(this.tabContainer(), {
        queue: { position: 'end', scope:'a' },
        afterFinish:this.fadeCallback.bind(this),
        duration: 0.5
      });
      if (!AjaxCache.self().find(this.nextTab.link)) {
        new Ajax.Request(this.nextTab.link, { method:'get', onComplete:this.storeTab.bind(this) });
      }
    }
  },

  storeTab: function(req) {
    AjaxCache.self().store(this.nextTab.link, req.responseText);
  },

  showTab: function() {
    this.doSwitch(this.currentTab, this.nextTab);
    
    clearTimeout(this.waitTimeout);
    var html = AjaxCache.self().find(this.nextTab.link);

    if (html) {
      if (!this.contentBox) {
        this.contentBox = this.tabContent();
      }
      this.contentBox.update(html);
      this.beforeAppear();
      this.switchCurrent(this.currentTab, this.nextTab);
      this.appearEffect = new Effect.Appear(this.tabContainer(), {
        queue: { position: 'end', scope:'b' },
        afterFinish:this.appearCallback.bind(this),
        duration: 0.5
      });
      this.changing = false;
    } else {
      this.waitForResponse();
    }
  },

  waitForResponse: function() {
    this.waitTimeout = setTimeout(this.showTab.bind(this), 100);
  },

  fadeCallback: function() {
    this.afterFade();
    this.showTab();
  },

  appearCallback: function() {
    this.afterAppear();
  }
});

CurrentPage.registerBehaviour("thc2-tab-widget", AjaxTabWidget);

var Tab = Class.create({
  initialize: function(tabWidget, button) {
    this.tabWidget = tabWidget;
    this.button = button;
    
    this.link = $(button).firstChild;
    if (this.link) {
      Event.observe(this.link, 'click', function(event) { this.tabWidget.switchTab(this); event.stop(); }.bind(this));
    }
  },
  
  turnOn: function() {
    this.button.addClassName('on');
  },
  
  turnOff: function() {
    this.button.removeClassName('on');
  }
});
