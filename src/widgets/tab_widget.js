/*
  Simple widget for tabbed layouts using AJAX requests (yes, it supports caching)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This class is a base class for tab widgets.
 *
 * <p>Subclass this class to implement your own tab widgets. But before you do,
 * check out {@link thc2.AjaxTabWidget}, which loads the contents of new tabs on
 * the fly.</p>
 *
 * <p>The general markup for a tab widget is like follows:</p>
 *
 * <pre>
 * &lt;div&gt;
 *   &lt;ul class=&quot;tab-list&quot;&gt;
 *     &lt;li class=&quot;select&quot; title=&quot;First tab&quot;&gt;
 *       &lt;a href=&quot;/first/tab&quot;&gt;First tab&lt;/a&gt;
 *     &lt;/li&gt;
 *     &lt;li title=&quot;Second tab&quot;&gt;
 *       &lt;a href=&quot;/second/tab&quot;&gt;Second tab&lt;/a&gt;
 *     &lt;/li&gt;
 *   &lt;/ul&gt;
 *   &lt;div class=&quot;box-wrapper&quot;&gt;
 *     &lt;div class=&quot;tab-content&quot;&gt;
 *       &lt;div class=&quot;tab-container&quot;&gt;
 *         &lt;p&gt;This is the content of the first tab, since the first tab is selected.&lt;/p&gt;
 *       &lt;/div&gt;
 *     &lt;/div&gt;
 *   &lt;/div&gt;
 * &lt;/div&gt;
 * </pre>
 *
 * @class
 * @extends thc2.Widget
 */
thc2.TabWidget = Class.create(thc2.Widget,
/** @scope thc2.TabWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    this.initTabs();
  },

  /**
   * Initializes the tabs.
   * Call again if tab element reloaded/changed via AJAX.
   */
  initTabs: function() {
    this.list = $A(this.element.getElementsByClassName('tab-list')[0].getElementsByTagName("li"));
    this.tabs = this.list.collect(function(item) {
      var tab = new thc2.Tab(this, $(item));
      if (item.hasClassName(thc2.Tab.activeClassName))
        this.currentTab = tab;
      return tab;
    }.bind(this));
  },
  
  /**
   * Returns the tab container, which is the element that contains the tab's
   * content as immediate children.
   * @return {HTMLElement} The tab container.
   */
  tabContainer: function() {
    return $(this.element.getElementsByClassName('tab-container')[0]);
  },
  
  /**
   * Switches from the current tab to a new tab.
   * @param {thc2.Tab} newTab The tab to switch to.
   */
  switchTab: function(newTab) {
    this.beforeSwitch(this.currentTab, newTab);
    
    this.doSwitch(this.currentTab, newTab);

    var oldTab = this.currentTab;
    this.switchCurrent(this.currentTab, newTab);
    
    this.afterSwitch(oldTab, this.currentTab);
  },
  
  /**
   * Updates the internal currentTab property.
   * @param {thc2.Tab} oldTab The old tab.
   * @param {thc2.Tab} newTab The new tab.
   */
  switchCurrent: function(oldTab, newTab) {
    oldTab.turnOff();
    newTab.turnOn();
    this.currentTab = newTab;
  },
  
  /**
   * Callback method that is called before the tab is switched.
   * @param {thc2.Tab} oldTab The old tab.
   * @param {thc2.Tab} newTab The new tab.
   */
  beforeSwitch: function(oldTab, newTab) {
  },
  
  /**
   * Perform the actual switching of the tabs. Reimplement to add
   * your own behaviour.
   * @param {thc2.Tab} oldTab The old tab.
   * @param {thc2.Tab} newTab The new tab.
   */
  doSwitch: function(oldTab, newTab) {
  },
  
  /**
   * Callback method that is called after the tab is switched.
   * @param {thc2.Tab} oldTab The old tab.
   * @param {thc2.Tab} newTab The new tab.
   */
  afterSwitch: function(oldTab, newTab) {
  }
});

/**
* FUCKO: Move effect to some better place. It's shit here
*/
Effect.PhaseIn = function(element, options) {
  return new Effect.Parallel([
    new Effect.Appear(element, { sync: true }),
    new Effect.BlindDown(element, { sync: true, scaleFrom: 10})
  ], options);
}

Effect.PhaseOut = function(element, options) {
  return new Effect.Parallel([
    new Effect.BlindUp(element, { sync: true, scaleTo: 10}),
    new Effect.Fade(element, { sync: true })
  ], options);
}

/**
 * This class provides a tab widget that loads the content of tabs
 * on the fly via ajax. The contents of already visited tabs are
 * cached. Note that this class automatically applies behaviours
 * to the elements which are loaded on the fly.
 *
 * Also, this class uses a fade-out effect before the switch, and a
 * fade-in effect after the switch.
 * @class
 * @extends thc2.TabWidget
 */
thc2.AjaxTabWidget = Class.create(thc2.TabWidget,
/** @scope thc2.AjaxTabWidget.prototype */
{
  initialize: function(element) {
    thc2.TabWidget.prototype.initialize.apply(this, arguments);
    thc2.AjaxCache.self().store(this.currentTab.link, this.tabContent().innerHTML);
  },
  
  /**
   * Callback before the fade before a tab switch.
   */
  beforeFade: function() {
  },
  
  /**
   * Callback after the fade before a tab switch.
   */
  afterFade: function() {
  },
  
  /**
   * Callback before the fade-in after a tab switch. The default
   * implementation of this method applies behaviours to the newly
   * loaded elements.
   */
  beforeAppear: function() {
    thc2.CurrentPage.applyBehaviours(this.tabContent());
    thc2.CurrentPage.reconnect(this.tabContent());
  },
  
  /**
   * Callback after the fade-in after a tab switch.
   */
  afterAppear: function() {
  },
  
  /**
   * Returns the element containing the tab container. This is the
   * element which should be replaced by the Ajax response.
   * @return {HTMLElement} The element containing the tab container.
   */
  tabContent: function() {
    return $(this.element.getElementsBySelector("div.tab-content")[0]);
  },
  
  /**
   * @inner
   * Switches the current tab to <code>newTab</code> using a fade effect.
   */
  switchTab: function(newTab) {
    if (!this.changing) {
      this.beforeSwitch(this.currentTab, newTab);

      this.nextTab = newTab;
      this.changing = true;

      this.beforeFade();

      this.fadeEffect = new Effect.PhaseOut(this.tabContainer(), {
        queue: { position: 'end', scope:'a' },
        afterFinish:this.fadeCallback.bind(this),
        duration: 0.5
      });
      if (!thc2.AjaxCache.self().find(this.nextTab.link)) {
        new Ajax.Request(this.nextTab.link, { method:'get', onComplete:this.storeTab.bind(this) });
      }
    }
  },
  
  /**
   * @inner
   * Stores the loaded tab's contents in the thc2.AjaxCache.
   */
  storeTab: function(req) {
    thc2.AjaxCache.self().store(this.nextTab.link, req.responseText);
  },
  
  /**
   * @inner
   * Shows the newly loaded tab content.
   */
  showTab: function() {
    this.doSwitch(this.currentTab, this.nextTab);
    
    clearTimeout(this.waitTimeout);
    var html = thc2.AjaxCache.self().find(this.nextTab.link);

    if (html) {
      if (!this.contentBox) {
        this.contentBox = this.tabContent();
      }
      this.contentBox.update(html);
      this.beforeAppear();
      this.switchCurrent(this.currentTab, this.nextTab);
      this.appearEffect = new Effect.PhaseIn(this.tabContainer(), {
        queue: { position: 'end', scope:'b' },
        afterFinish:this.appearCallback.bind(this),
        duration: 0.5
      });
      this.changing = false;
    } else {
      this.waitForResponse();
    }
  },

  /**
   * @inner
   * Polls for the Ajax request response.
   */
  waitForResponse: function() {
    this.waitTimeout = setTimeout(this.showTab.bind(this), 100);
  },
  
  /**
   * @inner
   */
  fadeCallback: function() {
    this.afterFade();
    this.showTab();
  },
  
  /**
   * @inner
   */
  appearCallback: function() {
    this.afterAppear();
  }
});

thc2.CurrentPage.registerBehaviour("thc2-tab-widget", thc2.AjaxTabWidget);

/**
 * This class represents a tab in a tab widget. You probably won't need
 * to use this class directly.
 * @class
 */
thc2.Tab = Class.create(
/** @scope thc2.Tab.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(tabWidget, button) {
    this.tabWidget = tabWidget;
    this.button = button;
    
    this.link = $(button).getElementsByTagName('a')[0];
    if (this.link) {
      Event.observe(this.link, 'click', function(event) { this.tabWidget.switchTab(this); event.stop(); }.bind(this));
    }
  },
  
  /**
   * Sets the tab to "on" state.
   */
  turnOn: function() {
    this.button.addClassName(thc2.Tab.activeClassName);
  },
  
  /**
   * Sets the tab to "off" state.
   */
  turnOff: function() {
    this.button.removeClassName(thc2.Tab.activeClassName);
  }
});

thc2.Tab.activeClassName = 'selected';
