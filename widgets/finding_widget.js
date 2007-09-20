/*
  Widget that lets the user specify exactly how he or she feels.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  BUT this only applies to this file. You'll need to come up with your own
  images.
*/

var FindingWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.list = $A(this.element.getElementsByTagName('li'));
    this.image_tag = this.element.getElementsByClassName('big-finding')[0];
    this.current_image = this.image_tag.src;
    this.text_tag = this.element.getElementsByClassName('finding-text')[0];
    this.current_text = this.text_tag.innerHTML;
    this.spinner = this.element.getElementsByClassName('thc2-spinner')[0];

    var widget = this;
    var i = 0;
    this.faces = this.list.collect(function(item) {
      return new FindingFace(item, widget, i++);
    });
    
    Event.observe(this.element, "mouseout", this.faceMouseOut.bindAsEventListener(this));
  },
  
  faceMouseOver: function(current_face) {
    this.image_tag.src = current_face.bigImage();
    this.text_tag.innerHTML = current_face.finding_text;
  },
  
  faceMouseOut: function(event) {
    this.image_tag.src = this.current_image;
    this.text_tag.innerHTML = this.current_text;
  },
  
  showSpinner: function() {
    this.spinner.show();
  },
  
  hideSpinner: function() {
    this.spinner.hide();
  }
});

var FindingFace = Class.create({
  ImageRegexp: /^(.*)\.gif/,
  
  initialize: function(element, findingwidget) {
    this.element = $(element);
    this.findingwidget = findingwidget;
    this.image = this.link().getElementsByTagName("img")[0];
    this.finding_text = this.image.title
    
    Event.observe(this.link(), "click", this.faceClick.bindAsEventListener(this));
    Event.observe(this.span(), "mouseover", this.faceMouseOver.bindAsEventListener(this));
  },
  
  faceClick: function(event) {
    new Ajax.Request(this.link(), { method: 'get', onLoading: this.findingwidget.showSpinner.bind(this.findingwidget), onComplete: this.findingwidget.hideSpinner.bind(this.findingwidget) });
    event.stop();
  },
  
  faceMouseOver: function(event) {
    this.findingwidget.faceMouseOver(this);
    event.stop();
  },
  
  link: function() {
    return $(this.element.getElementsByTagName("a")[0]);
  },
  
  span: function() {
    return $(this.element.getElementsByTagName("span")[0]);
  },
  
  bigImage: function() {
    var match = this.image.src.match(this.ImageRegexp);
    return match[1] + "-l.gif";
  }
});

CurrentPage.registerBehaviours({
  "thc2-finding": FindingWidget
});
