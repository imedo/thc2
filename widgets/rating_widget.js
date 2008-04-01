/*
  Some widget for star-style rating
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  BUT this only applies to this file. You'll need to come up with your own
  star image.
*/

var RatingWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.list = $A(this.element.getElementsByTagName('li'));
    this.ratingField = $(this.list.first());
    this.ratingText = this.ratingField.innerHTML;
    this.list.shift();
    var widget = this;
    var i = 0;
    this.stars = this.list.collect(function(item) {
      return new RatingStar(item, widget, i++);
    });
    
    Event.observe(this.element, "mouseout", this.starMouseOut.bindAsEventListener(this));
  },
  
  starClick: function(currentStar) {
    var rating = currentStar.number;
    this.setRating(rating);
  },
  
  setRating: function(rating) {
    this.stars.each(function(star) {
      if (rating >= star.number) {
        star.selected = true;
        star.update(4);
      } else {
        star.selected = false;
        star.update(0);
      }
    });
  },
  
  starMouseOver: function(currentStar) {
    var number = currentStar.number;
    this.stars.each(function(star) {
      if (star.selected) {
        if (number >= star.number) {
          star.update(3);
        } else {
          star.update(1);
        }
      } else {
        if (number >= star.number) {
          star.update(2);
        } else {
          star.update(0);
        }
      }
    });
    
    this.ratingField.innerHTML = currentStar.ratingText;
  },
  
  starMouseOut: function(event) {
    this.stars.each(function(star) {
      if (star.selected) {
        star.update(4);
      } else {
        star.update(0);
      }
    });
    
    this.ratingField.innerHTML = this.ratingText;
  }
});

var RatingStar = Class.create({
  starheight: 20,
  
  initialize: function(element, ratingwidget, number) {
    this.element = $(element);
    this.ratingwidget = ratingwidget;
    this.number = number;
    this.selected = (this.div().className == 'on');
    this.div().className = '';
    this.state = this.selected ? 4 : 0;
    this.image = this.link().getElementsByTagName("img")[0];
    this.ratingText = this.image.title
    this.update(this.state);
    
    Event.observe(this.link(), "click", this.starClick.bindAsEventListener(this));
    Event.observe(this.div(), "mouseover", this.starMouseOver.bindAsEventListener(this));
  },
  
  starClick: function(event) {
    this.ratingwidget.starClick(this);
    event.stop();
  },
  
  starMouseOver: function(event) {
    this.ratingwidget.starMouseOver(this);
    event.stop();
  },
  
  link: function() {
    return $(this.element.getElementsByTagName("a")[0]);
  },
  
  div: function() {
    return $(this.element.getElementsByTagName("div")[0]);
  },
  
  update: function(state) {
    this.state = state;
    this.image.style.top = "-" + this.starheight * state + "px";
  }
});

var OneClickRatingWidget = Class.create(RatingWidget, {
  starClick: function(star) {
    RatingWidget.prototype.starClick.apply(this, arguments);
    new Ajax.Request(star.link(), { method:'get', onComplete:this.replaceStars.bind(this) });
  },
  
  replaceStars: function(request) {
    this.element.replace(request.responseText);
  }
});

var InputRatingWidget = Class.create(RatingWidget, {
  ContainerRegexp: /^store_in_(\S+)$/,
  
  initialize: function(element) {
    RatingWidget.prototype.initialize.apply(this, arguments);
    var container = this.element.classNames().grep(this.ContainerRegexp)[0];
    if (container) {
      var match = container.match(this.ContainerRegexp);
      this.container = match[1];
    }
  },
  
  starClick: function(star) {
    RatingWidget.prototype.starClick.apply(this, arguments);
    $(this.container).value = (star.number + 1);
  }
});

CurrentPage.registerBehaviours({
  "thc2-one-click-rating": OneClickRatingWidget,
  "thc2-input-rating": InputRatingWidget
});
