/*
  Dynamically change buttons to links
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var ButtonLinkWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.url = this.element.action;
    this.insertLink();
    
    Event.observe(this.element, "click", this.followLink.bindAsEventListener(this));
  },
  
  insertLink: function() {
    var link = Builder.node("a", {href:this.url}, this.element.innerHTML);
    this.element.replace(link);
  },
  
  followLink: function(event) {
    var f = this.createForm();
    f.submit();
    event.stop();
  },
  
  createForm: function() {
    var f = document.createElement('form');
    f.style.display = 'none';
    this.parentNode.appendChild(f);
    f.method = 'POST';
    f.action = this.url;
    return f;
  }
});

var DeleteButtonLinkWidget = Class.create(ButtonLinkWidget, {
  createForm: function() {
    var f = ButtonLinkWidget.prototype.createForm.apply(this, arguments);
    var m = document.createElement('input');
    m.setAttribute('type', 'hidden');
    m.setAttribute('name', '_method');
    m.setAttribute('value', 'delete');
    f.appendChild(m);
    return f;
  }
});

CurrentPage.registerBehaviours({
  "thc2-button-link": ButtonLinkWidget,
  "thc2-delete-button-link": DeleteButtonLinkWidget
});
