/*
  This Widget provides a fancy photo album browser.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PhotoAlbumWidget = Class.create(Widget, {
  numPhotos: 11,
  currentIndex: 0,
  initialize: function(element) {
    PhotoAlbumWidget.self = this;
    Widget.prototype.initialize.apply(this, arguments);
    
    this.measurer = new Element('div', { style: "visibility:hidden; position:absolute" });
    document.body.insert(this.measurer);
    
    this.ul = $(this.element.getElementsByTagName('ul')[0]);
    
    this.getDimensions();

    this.photos = $A(this.ul.getElementsByTagName('li'));
    var index = 0;
    this.photos.each(function(photo) {
      photo.index = index;
      if ($(photo).hasClassName('selected')) this.currentIndex = photo.index;
    
      photo.img = $(photo.getElementsByTagName('img')[0]);
      photo.a = $(photo.getElementsByTagName('a')[0]);
    
      photo.style.left = this.width + "px";
      photo.style.top = (this.height / 2) + "px";
    
      if (!Prototype.Browser.IE) {
        photo.img.observe('load', function() { this.photoLoaded(photo); }.bind(this));
      }
      Event.observe(photo.a, 'click', function(event) { this.photoClick(photo, event) }.bindAsEventListener(this));
      index++;
    }.bind(this));
    
    // find controls
    var controls = $A(this.element.getElementsByClassName('control'));
    controls.each(function(control) {
      if (control.hasClassName('prev')) {
        Event.observe(control, 'click', (function(event) { this.moveLeft(); Event.stop(event); }).bindAsEventListener(this));
      } else {
        Event.observe(control, 'click', (function(event) { this.moveRight(); Event.stop(event); }).bindAsEventListener(this));
      }
    }.bind(this));
    
    this.resize();
  },
  
  getDimensions: function() {
    var size = this.ul.getDimensions();
    this.width = size.width;
    this.height = size.height;
  },
  
  photoLoaded: function(photo) {
    var beforeMiddle = Math.floor(this.numPhotos / 2);
    if (this.photoVisible(photo)) {
      this.getAspectRatio(photo);
      this.resize();
    }
  },
  
  getAspectRatio: function(photo) {
    if (photo.ratio === undefined) {
      var measurement = new Element('img', { src: photo.img.src, style: "visibility:hidden;position:absolute" });
      this.measurer.insert(measurement);
      var size = measurement.getDimensions();
      if (size.height > 0) {
        photo.ratio = size.width / size.height;
      }
      measurement.remove();
    }
  },
  
  resize: function() {
    this.getDimensions();
    this.animate();
  },
  
  photoVisible: function(photo) {
    var beforeMiddle = Math.floor(this.numPhotos / 2);
    return photo.index >= this.currentIndex - beforeMiddle - 1 && photo.index < this.currentIndex + beforeMiddle + 2
  },
  
  animate: function() {
    var coordinates = [];
    var beforeMiddle = Math.floor(this.numPhotos / 2);
    for (var i = 0, l = this.photos.length; i < l; ++i) {
      var photo = this.photos[i];
      var visible = this.photoVisible(photo);
      if (visible) {
        this.getAspectRatio(photo);
      }

      if (i < this.currentIndex - beforeMiddle) {
        coordinates = [0, this.height / 2, 0, 0, this.zIndex(i), 0];
      } else if (i >= this.currentIndex - beforeMiddle && i < this.currentIndex + beforeMiddle + 1) {
        var dist = this.currentIndex - i;
        var diff = Math.abs(dist) + 1;
        var scale = Math.sqrt(diff);
        var width = (this.height * photo.ratio) / scale;
        var height = (this.height) / scale;
        if (width > (this.width / 2)) {
          width = this.width / 2;
          height = width / photo.ratio;
        }
        coordinates = [(this.width / 2) - (dist * (this.width / this.numPhotos)) - (width / 2),
                       (this.height - height) / 2,
                       width,
                       height, this.zIndex(i), 1.0 - Math.abs(dist) / (beforeMiddle + 2.0)];
      } else if (i >= this.currentIndex + beforeMiddle) {
        coordinates = [this.width, this.height / 2, 0, 0, this.zIndex(i)];
      }
      
      if (visible) {
        var c = coordinates;
        new Effect.Morph(photo, { style: "left:" + c[0] + "px;top:" + c[1] + "px;width:" + c[2] + "px;height:" + c[3] + "px;opacity:" + c[5], duration: 0.5 });
      } else {
        var c = coordinates;
        photo.style.left = c[0] + "px";
        photo.style.top = c[1] + "px";
        photo.style.width = c[2] + "px";
        photo.style.height = c[3] + "px";
      }

      photo.style.zIndex = c[4];
    }
  },
  
  zIndex: function(number) {
    return this.photos.length - Math.abs(this.currentIndex - number);
  },
  
  moveRight: function() {
    this.moveTo(this.currentIndex + 1);
  },
  
  moveLeft: function() {
    this.moveTo(this.currentIndex - 1);
  },
  
  moveTo: function(index) {
    if (index < 0) {
      this.currentIndex = 0;
    } else if (index > this.photos.length - 1) {
      this.currentIndex = this.photos.length - 1;
    } else {
      this.currentIndex = index;
    }
    this.resize();
  },
  
  photoClick: function(photo, event) {
    if (photo.index != this.currentIndex) {
      this.moveTo(photo.index);
      event.stop();
    }
  },
  
  setNumPhotos: function(num) {
    this.numPhotos = num;
    this.resize();
  }
});

CurrentPage.registerBehaviour("thc2-photo-album", PhotoAlbumWidget);
