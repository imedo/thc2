/*
  Some widget for star-style rating
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
  
  BUT this only applies to this file. You'll need to come up with your own
  star image.
*/

/**
 * This class is the base class for rating widgets with five stars.
 *
 * <p>There are two subclasses, {@link thc2.OneClickRatingWidget} and
 * {@link thc2.InputRatingWidget}, that send the selected rating via Ajax to the
 * server, or store it in a hidden field, respectively. Do not use this class
 * directly, use one of the subclasses instead.</p>
 *
 * <p>The star image must consist of 5 stars below each other. For now, each star
 * must have the size of 20 x 20 pixels (To change this size, see the
 * {@link RatingStar#starheight} property).</p>
 * 
 * <p>From top to bottom, the stars represent:</p>
 *
 * <ul>
 * <li>Unselected star, not hovered, or unselected star, after click</li>
 * <li>Selected star, not hovered</li>
 * <li>Unselected star, hovered</li>
 * <li>Selected star, hovered</li>
 * <li>Selected star, after click</li>
 * <ul>
 *
 * @class
 * @extends thc2.Widget
 */
thc2.RatingWidget = Class.create(thc2.Widget,
/** @scope thc2.RatingWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    this.list = $A(this.element.getElementsByTagName('li'));
    this.ratingField = $(this.list.first());
    this.ratingText = this.ratingField.innerHTML;
    this.list.shift();
    var widget = this;
    var i = 0;
    this.stars = this.list.collect(function(item) {
      return new RatingStar(item, widget, i++);
    });
    
    this.stars.each(function(star){
      if(star.selected){
        this.currentStar = star;
        this.ratingField.innerHTML = this.ratingText = this.currentStar.ratingText;
      }
    }.bind(this));
    Event.observe(this.element, "mouseout", this.starMouseOut.bindAsEventListener(this));
  },
  
  /**
   * @inner
   * This method is called when the 
   */
  starClick: function(currentStar) {
    var rating = currentStar.number;
    this.setRating(rating);
    this.ratingField.innerHTML = this.ratingText = currentStar.ratingText;
  },
  
  /**
   * Use this method to manually set the rating displayed on the rating
   * widget.
   * @param {int} rating The rating (number of stars turned on) that this widget
   *              should display.
   */
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
  
  /**
   * @inner
   * Event handler for mouse over event.
   */
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
  
  /**
   * @inner
   * Event handler for mouse out event.
   * @param {Event} event The mouse event object.
   */
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

/**
 * This class represents a star in the rating widget. You probably don't
 * need to use this class.
 *
 * Generally, the markup for a star looks like this:
 *
 * <pre>
 * &lt;div&gt;&lt;a href=&quot;/rating/rate/1&quot;&gt;&lt;img alt=&quot;good&quot; src=&quot;/images/star.gif&quot; title=&quot;Good&quot; /&gt;&lt;/a&gt;&lt;/div&gt;
 * </pre>
 *
 * Depending on the state of the star, the image (which contains 5 different
 * possible states of the star), is automatically shifted to show the correct
 * state.
 *
 * The link's href is used to determine the URL for any ajax request that
 * happens on click. Since the markup contains the URL, the widget also works
 * when Javascript, and hence Ajax, is not available.
 * @class
 */
thc2.RatingStar = Class.create(
/** @scope RatingStar.prototype */
{
  /**
   * Default star height. Adjust this property to use differently sized stars.
   */
  starheight: 14,
  
  /**
   * Constructor.
   */
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
  
  /**
   * @inner
   * This method is called when the star is clicked. Calls the starClick method
   * of the owning rating widget.
   * @param {Event} event The click event object.
   */
  starClick: function(event) {
    this.ratingwidget.starClick(this);
    event.stop();
  },
  
  /**
   * @inner
   * This method is called when the star is hovered. Calls the starMouseOver method
   * of the owning rating widget.
   * @param {Event} event The mouse event object.
   */
  starMouseOver: function(event) {
    this.ratingwidget.starMouseOver(this);
    event.stop();
  },
  
  /**
   * Returns the star's link element.
   * @return {HTMLElement} The star's link.
   */
  link: function() {
    return $(this.element.getElementsByTagName("a")[0]);
  },
  
  /**
   * Returns the star's enclosing <code>div</code> tag.
   * @return {HTMLElement} The star's <code>div</code> tag.
   */
  div: function() {
    return $(this.element.getElementsByTagName("div")[0]);
  },
  
  /**
   * @inner
   * Updates the star's image's offset to correctly reflect the star's state.
   */
  update: function(state) {
    this.state = state;
    this.image.style.top = "-" + this.starheight * state + "px";
  }
});

/**
 * This rating widget sends an Ajax request on click. It also takes the response
 * and replaces itself with the response's content on success. This way, you can
 * prevent duplicate ratings.
 *
 * The markup for the rating widget should look something like:
 *
 * <pre>
 * &lt;ul class=&quot;stars thc2-one-click-rating&quot;&gt;
 *   &lt;li&gt;&lt;span class=&quot;rating&quot;&gt;Be the first to rate this!&amp;nbsp;Your rating:&amp;nbsp;&lt;/span&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;/rating/rate/1&quot;&gt;&lt;img alt=&quot;good&quot; src=&quot;/images/star.gif&quot; title=&quot;Good&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;/rating/rate/2&quot;&gt;&lt;img alt=&quot;better&quot; src=&quot;/images/star.gif&quot; title=&quot;Better&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;/rating/rate/3&quot;&gt;&lt;img alt=&quot;very good&quot; src=&quot;/images/star.gif&quot; title=&quot;Very good&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;/rating/rate/4&quot;&gt;&lt;img alt=&quot;excellent&quot; src=&quot;/images/star.gif&quot; title=&quot;Excellent&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;/rating/rate/5&quot;&gt;&lt;img alt=&quot;unbeatable&quot; src=&quot;/images/star.gif&quot; title=&quot;Unbeatable&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 * &lt;/ul&gt;
 * </pre>
 *
 * @class
 * @extends thc2.RatingWidget
 */
thc2.OneClickRatingWidget = Class.create(thc2.RatingWidget,
/** @scope thc2.OneClickRatingWidget.prototype */
{
  /**
   * @inner
   * This method is called when a star is clicked. Sends an Ajax request
   * to the URL specified by the clicked star.
   */
  starClick: function(star) {
    thc2.RatingWidget.prototype.starClick.apply(this, arguments);
    new Ajax.Request(star.link(), { method:'get', onComplete:this.replaceStars.bind(this) });
  },
  
  /**
   * @inner
   * This method is called when the Ajax request is completed successfully.
   * It takes the request's response and replaces the widget's element with
   * the response's content.
   */
  replaceStars: function(request) {
    this.element.replace(request.responseText);
  }
});

/**
 * This widget provides a star rating which stores the rating value in a
 * hidden field on click. The ID of the hidden field is given by a class
 * parameter of the form <code>store_in_</code><em>id</em>, where <em>id</em>
 * is the ID of the hidden field.
 *
 * The markup of the widget should look like this:
 *
 * <pre>
 * &lt;ul class=&quot;stars thc2-input-rating store_in_rating_field&quot;&gt;
 *   &lt;li&gt;&lt;span class=&quot;rating&quot;&gt;Be the first to rate this!&amp;nbsp;Your rating:&amp;nbsp;&lt;/span&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;#&quot;&gt;&lt;img alt=&quot;good&quot; src=&quot;/images/star.gif&quot; title=&quot;Good&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;#&quot;&gt;&lt;img alt=&quot;better&quot; src=&quot;/images/star.gif&quot; title=&quot;Better&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;#&quot;&gt;&lt;img alt=&quot;very good&quot; src=&quot;/images/star.gif&quot; title=&quot;Very good&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;#&quot;&gt;&lt;img alt=&quot;excellent&quot; src=&quot;/images/star.gif&quot; title=&quot;Excellent&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 *   &lt;li&gt;&lt;div&gt;&lt;a href=&quot;#&quot;&gt;&lt;img alt=&quot;unbeatable&quot; src=&quot;/images/star.gif&quot; title=&quot;Unbeatable&quot; /&gt;&lt;/a&gt;&lt;/div&gt;&lt;/li&gt;
 * &lt;/ul&gt;
 * &lt;input type=&quot;hidden&quot; id=&quot;rating_field&quot; /&gt;
 * </pre>
 *
 * @class
 * @extends thc2.RatingWidget
 */
thc2.InputRatingWidget = Class.create(thc2.RatingWidget,
/** @scope thc2.InputRatingWidget.prototype */
{
  ContainerRegexp: /^store_in_(\S+)$/,
  
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.RatingWidget.prototype.initialize.apply(this, arguments);
    var container = this.element.classNames().grep(this.ContainerRegexp)[0];
    if (container) {
      var match = container.match(this.ContainerRegexp);
      this.container = match[1];
    }
    if (this.resetLink()) {
      Event.observe(this.resetLink(), "click", this.reset.bindAsEventListener(this));
    }
  },

  resetLink: function() {
    return this.element.next(".thc2-input-rating-reset")
  },

  reset: function(event) {
    this.setRating(-1)
    $(this.container).value = "";
    event.stop()
  },

  /**
   * @inner
   * This method is called when a star is clicked. It stores the rating value
   * in the widget's associated hidden field.
   */
  starClick: function(star) {
    thc2.RatingWidget.prototype.starClick.apply(this, arguments);
    $(this.container).value = (star.number + 1);
  }
});

thc2.CurrentPage.registerBehaviours({
  "thc2-one-click-rating": thc2.OneClickRatingWidget,
  "thc2-input-rating": thc2.InputRatingWidget
});
