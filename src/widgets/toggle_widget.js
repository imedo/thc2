/*
  This Widget makes the the element togglable
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget toggles the visibility of a DOM element, when a certain link is
 * clicked. The toggled DOM element is called the <em>target</em>.
 *
 * There are several ways to specify which element is the link and which is the
 * target (in order of precendence):
 *
 * <ul>
 * <li> Given by a constructor parameter. When the <code>options</code> hash of the
 *      constructor contains a <code>target</code> parameter (element or ID), the
 *      widget element is considered the link, and the given parameter the target.</li>
 * <li> Given by a class parameter. When a class parameter of the format
 *      <code>toggle_</code><em>element_id</em> is given, the element with ID
 *      <code>element_id</code> is used as the target, while the widget element is
 *      used as the link.</li>
 * <li> Given by DOM Structure. When the widget is applied to an element, say, a
 *      <code>div</code>, which contains at least one link (<code>a</code>) and
 *      one <code>div</code> element as direct targetren, the link element is
 *      considered the link, and the <code>div</code> is considered the target.</li>
 * </ul>
 *
 * Another class parameter is the effect, which is used for the transition
 * between visible and invisible. The effect is given by a parameter of the form
 * <code>effect_</code><em>effect_name</em>. For a list of available effects,
 * please refer to the script.aculo.us documentation.
 *
 * To use this widget, simply add the class "thc2-toggle-widget" to your input
 * field.
 * @class
 * @extends Widget
 */
var ToggleWidget = Class.create(Widget,
/** @scope ToggleWidget.prototype */
{
  init: false,
  defaultEffect: 'blind',
  defaultDuration: 0.5,

  /**
   * Constructor.
   * @param {HTMLElement,String} element The element to which this widget is connected.
   * @param {Hash} options An options hash for this widget. The available options are
   *   - target: the element which is toggled on click.
   */
  initialize: function(element, options) {
    Widget.prototype.initialize.apply(this, arguments);
    this.effect = this.defaultEffect;
    this.duration = this.defaultDuration;
    
    if (options && options['target']) {
      this.setLink(this.element);
      this.target = $(options['target']);
    } else {
      this.extractTarget();
    }
  },
  
  /**
   * Click handler.
   */
  click: function(event) {
    if (!this.init) {
      this.extractParameters();
    }
    Effect.toggle(this.target, this.effect, {duration: this.duration});
    event.stop();
  },
  
  /**
   * Sets the link to <code>link</code> and observes the click event.
   * If another link has been set before, the old click event handler
   * is removed.
   * @param {HTMLElement,String} link The link that initiates the toggle.
   */
  setLink: function(link) {
    if (link) {
      if (this.link) {
        Event.stopObserving(this.link, 'click');
      }
      this.link = $(link);
      Event.observe(this.link, "click", this.click.bindAsEventListener(this));
    }
  },
  
  /**
   * Sets the target. See this class' documentation for details.
   * @params {HTMLElement,String} target The target.
   */
  setTarget: function(target) {
    this.target = $(target);
  },
  
  /**
   * Sets the transition effect. See the script.aculo.us docs for available
   * toggle effects, as well as the class documentation for other ways to
   * set this parameter. The default is <code>blind</code>.
   * @params {String} effect The transition effect.
   */
  setEffect: function(effect) {
    this.effect = effect;
  },
  
  /**
   * Sets the duration for the transition effect. The default is 0.5 seconds.
   * @params {Float} duration The duration for the transition effect.
   */
  setDuration: function(duration) {
    this.duration = duration;
  },
  
  /**
   * @inner
   * Extracts the class parameters.
   */
  extractParameters: function() {
    this.extractEffect();
    this.init = true;
  },
  
  /**
   * @inner
   * Extracts the target from the class parameters. This method is called by
   * the constructor, unless the constructor was called with a target parameter
   * in the options hash.
   */
  extractTarget: function() {
    var target = $w($(this.element).className).find(function(klass) { return klass.startsWith("toggle_"); });
    if (target) {
      this.setLink(this.element);
      this.target = $(target.gsub("toggle_", ''));
    } else {
      this.setLink(this.element.getElementsByTagName("a")[0]);
      targetElement = this.element.getElementsBySelector("div")[0];
      if (targetElement) {
        this.target = targetElement;
      }
    }
  },
  
  /**
   * @inner
   * Extracts the effect from the class parameters.
   */
  extractEffect: function() {
    var effect = $w($(this.element).className).find(function(klass) { return klass.startsWith("effect_"); });
    
    if (effect) {
      this.effect = effect.gsub('effect_', '');
    }
  }
});

// TODO: rename to thc2-toggle for consistency
CurrentPage.registerBehaviour("thc2-toggle-widget", ToggleWidget);
