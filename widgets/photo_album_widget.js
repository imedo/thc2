/*
  This Widget adds search dropdowns to profile links.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PhotoAlbumWidget = Class.create(Widget, {
  numPhotos: 5,
  initialize: function(element) {
    PhotoAlbumWidget.self = this;
    Widget.prototype.initialize.apply(this, arguments);
    this.getDimensions();
    this.photos = $A(this.element.getElementsByTagName('li'));
    var index = 0;
    this.photos.each(function(photo) {
      photo.index = index;
      photo.img = $(photo).down('img');
      photo.a = $(photo).down('a');
      var size = photo.img.getDimensions();
      photo.ratio = 3/4; //size.width / size.height;
      photo.style.left = this.left + this.width + "px";
      photo.style.top = this.top + (this.height / 2) + "px";
      photo.style.width = "0px";
      photo.style.height = "0px";
      $(photo.img).addClassName('reflect');
      
      photo.a.observe('click', function(event) { this.photoClick(photo, event) }.bindAsEventListener(this));
      index++;
    }.bind(this));
    this.currentIndex = 0;
    this.resize();
  },
  
  getDimensions: function() {
    this.left = this.element.positionedOffset().left;
    this.top = this.element.positionedOffset().top;
    this.width = this.element.getDimensions().width;
    this.height = this.element.getDimensions().height;
  },
  
  resize: function() {
    this.getDimensions();
    this.animate();
  },
  
  animate: function() {
    var coordinates = [];
    var beforeMiddle = Math.floor(this.numPhotos / 2);
    for (var i = 0; i < this.photos.length; ++i) {
      var photo = this.photos[i];
      if (i < this.currentIndex - beforeMiddle) {
        coordinates = [this.left, this.top + this.height / 2, 0, 0, this.zIndex(i), 0];
      } else if (i >= this.currentIndex - beforeMiddle && i < this.currentIndex + beforeMiddle + 1) {
        var dist = this.currentIndex - i;
        var diff = Math.abs(dist) + 1;
        var scale = Math.sqrt(diff);
        var width = (this.height * photo.ratio) / scale;
        var height = (this.height) / scale;
        coordinates = [this.left + (this.width / 2) - (dist * (this.width / this.numPhotos)) - (width / 2),
                       this.top + (this.height - height) / 2,
                       width,
                       height, this.zIndex(i), 1.0 - Math.abs(dist) / (beforeMiddle + 2.0)];
      } else if (i >= this.currentIndex + beforeMiddle) {
        coordinates = [this.left + this.width, this.top + this.height / 2, 0, 0, this.zIndex(i)];
      }
      
      if (i >= this.currentIndex - beforeMiddle - 1 && i < this.currentIndex + beforeMiddle + 2) {
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






/**
 * reflection.js v1.7
 *
 * Contributors: Cow http://cow.neondragon.net
 *               Gfx http://www.jroller.com/page/gfx/
 *               Sitharus http://www.sitharus.com
 *               Andreas Linde http://www.andreaslinde.de
 *               Tralala, coder @ http://www.vbulletin.org
 *
 * Freely distributable under MIT-style license.
 */
 
/* From prototype.js */
// document.getElementsByClassName = function(className) {
//  var children = document.getElementsByTagName('*') || document.all;
//  var elements = new Array();
//   
//  for (var i = 0; i < children.length; i++) {
//    var child = children[i];
//    var classNames = child.className.split(' ');
//    for (var j = 0; j < classNames.length; j++) {
//      if (classNames[j] == className) {
//        elements.push(child);
//        break;
//      }
//    }
//  }
//  return elements;
// }

var Reflection = {
	defaultHeight : 0.5,
	defaultOpacity: 0.5,
	
	add: function(image, options) {
		Reflection.remove(image);
		
		doptions = { "height" : Reflection.defaultHeight, "opacity" : Reflection.defaultOpacity }
		if (options) {
			for (var i in doptions) {
				if (!options[i]) {
					options[i] = doptions[i];
				}
			}
		} else {
			options = doptions;
		}
	
		try {
			var d = document.createElement('div');
			var p = image;
			
			var classes = p.className.split(' ');
			var newClasses = '';
			for (j=0;j<classes.length;j++) {
				if (classes[j] != "reflect") {
					if (newClasses) {
						newClasses += ' '
					}
					
					newClasses += classes[j];
				}
			}

			var reflectionHeight = Math.floor(p.height*options['height']);
			var divHeight = Math.floor(p.height*(1+options['height']));
			
			var reflectionWidth = p.width;
			
			if (document.all && !window.opera) {
				/* Fix hyperlinks */
                if(p.parentElement.tagName == 'A') {
	                var d = document.createElement('a');
	                d.href = p.parentElement.href;
                }  
                    
				/* Copy original image's classes & styles to div */
				d.className = newClasses;
				p.className = 'reflected';
				
				d.style.cssText = p.style.cssText;
				p.style.cssText = 'vertical-align: bottom';
			
				var reflection = document.createElement('img');
				reflection.src = p.src;
				reflection.style.width = reflectionWidth+'px';
				
				reflection.style.marginBottom = "-"+(p.height-reflectionHeight)+'px';
				reflection.style.filter = 'flipv progid:DXImageTransform.Microsoft.Alpha(opacity='+(options['opacity']*100)+', style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy='+(options['height']*100)+')';
				
				d.style.width = reflectionWidth+'px';
				d.style.height = divHeight+'px';
				p.parentNode.replaceChild(d, p);
				
				d.appendChild(p);
				d.appendChild(reflection);
			} else {
				var canvas = document.createElement('canvas');
				if (canvas.getContext) {
					/* Copy original image's classes & styles to div */
					d.className = newClasses;
					p.className = 'reflected';
					
					d.style.cssText = p.style.cssText;
					p.style.cssText = 'vertical-align: bottom';
			
					var context = canvas.getContext("2d");
				
					canvas.style.height = reflectionHeight+'px';
					canvas.style.width = reflectionWidth+'px';
					canvas.height = reflectionHeight;
					canvas.width = reflectionWidth;
					
					d.style.width = reflectionWidth+'px';
					d.style.height = divHeight+'px';
					p.parentNode.replaceChild(d, p);
					
					d.appendChild(p);
					d.appendChild(canvas);
					
					context.save();
					
					context.translate(0,image.height-1);
					context.scale(1,-1);
					
					context.drawImage(image, 0, 0, reflectionWidth, image.height);
	
					context.restore();
					
					context.globalCompositeOperation = "destination-out";
					var gradient = context.createLinearGradient(0, 0, 0, reflectionHeight);
					
					gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
					gradient.addColorStop(0, "rgba(255, 255, 255, "+(1-options['opacity'])+")");
		
					context.fillStyle = gradient;
					if (navigator.appVersion.indexOf('WebKit') != -1) {
						context.fill();
					} else {
						context.fillRect(0, 0, reflectionWidth, reflectionHeight*2);
					}
				}
			}
		} catch (e) {
	    }
	},
	
	remove : function(image) {
		if (image.className == "reflected") {
			image.className = image.parentNode.className;
			image.parentNode.parentNode.replaceChild(image, image.parentNode);
		}
	}
}

function addReflections() {
	var rimages = document.getElementsByClassName('reflect');
	for (i=0;i<rimages.length;i++) {
		var rheight = null;
		var ropacity = null;
		
		var classes = rimages[i].className.split(' ');
		for (j=0;j<classes.length;j++) {
			if (classes[j].indexOf("rheight") == 0) {
				var rheight = classes[j].substring(7)/100;
			} else if (classes[j].indexOf("ropacity") == 0) {
				var ropacity = classes[j].substring(8)/100;
			}
		}
		
		Reflection.add(rimages[i], { height: rheight, opacity : ropacity});
	}
}

//var previousOnload = window.onload;
//window.onload = function () { if(previousOnload) previousOnload(); addReflections(); }
