/*
  This Widget adds search dropdowns to profile links.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

// <ul class="profile-links">
//   <li class="thc2-profile-link">
//     <a href="/search/f00">f00</a><span class="search-trigger hidden"></span>
//     <ul class="search-options hidden">
//       <li><a href="/search/f00">Search people with f00</a></li>
//       <li><a href="/practice/treatments/f00">Search for treatment f00</a></li>
//       <li><a href="/my_treatments/new/f00">Rate treatment f00</a></li>
//     </ul>
//   </li>
//   <li class="separator">, </li>
// </ul>

var ProfileLinkWidget = Class.create(Widget, {
  showSpeed: 0.3,
  hideSpeed: 0.3,

  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.element.observe("mouseover", this.startShowTimeout.bindAsEventListener(this));
  },
  
  lazyInit: function() {
    if (!this.init) {
      this.init = true;
      this.positionizer = $(this.element.getElementsByTagName('span')[0]);
      this.trigger = $(this.element.getElementsByTagName('span')[1]);
      this.menu = $(this.element.getElementsByTagName('ul')[0]);
      this.element.observe("mouseout", this.startHideTimeout.bindAsEventListener(this));
      this.trigger.observe("click", this.showMenu.bindAsEventListener(this));
    }
  },
  
  startShowTimeout: function() {
    this.lazyInit();
    this.endTimeout();
    this.timeout = setTimeout(this.showTrigger.bind(this), 10);
  },
  
  startHideTimeout: function(){
    this.endTimeout();
    this.timeout = setTimeout(this.hideTrigger.bind(this), 500);
  },
  
  endTimeout: function(){
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  },
  
  showTrigger: function() {
    if (!this.trigger.visible()) {
      var pos = this.positionizer.positionedOffset();
      this.trigger.style.left = pos.left + 1 + "px";
      this.trigger.style.top = pos.top - 2 + "px";
      this.trigger.style.height = this.positionizer.getDimensions().height + "px";
      new Effect.Appear(this.trigger, { duration: this.showSpeed });
      new Effect.Morph(this.element, { style: "border-color:#aaa", duration: this.showSpeed });
    }
  },
  
  hideTrigger: function() {
    new Effect.Fade(this.trigger, { duration: this.hideSpeed });
    new Effect.Morph(this.element, { style: "border-color:#fff", duration: this.hideSpeed });
    this.hideMenu();
  },
  
  showMenu: function() {
    var pos = this.element.positionedOffset();
    if (this.positionizer.positionedOffset().left < pos.left) {
      var parent = this.element.up();
      this.menu.style.left = parent.positionedOffset().left + "px";
    } else {
      this.menu.style.left = pos.left + "px";
    }
    this.menu.style.top = pos.top + this.element.getDimensions().height + "px";
    new Effect.Appear(this.menu, { duration: this.showSpeed });
  },
  
  hideMenu: function() {
    new Effect.Fade(this.menu, { duration: this.hideSpeed });
  }
});

CurrentPage.registerBehaviour("thc2-profile-link", ProfileLinkWidget);
