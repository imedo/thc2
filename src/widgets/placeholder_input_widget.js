/*
  Show a descriptive text in a text input; hide it as soon as the widget gets focus.
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * This widget displays a placeholder in a text input field that disappears on focus.
 *
 * <p>The placeholder is the value of the text input field. If the field is empty on
 * blur, the placeholder appears again. Because of that, it is possible that the
 * placeholder is sent along with the enclosing form on submit.</p>
 *
 * <p>When the placeholder is displayed, the text field has the CSS class
 * <code>placeholder-input</code>. You can use this fact for shading the text field
 * when the placeholder is shown.</p>
 *
 * @class
 * @extends Widget
 */
var PlaceholderInputWidget = Class.create(Widget,
/** @scope PlaceholderInputWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
		this.element.value = this.element.value || this.element.title;
    this.placeholder = this.element.title || this.element.value;
		
    Event.observe(this.element, "focus", this.focus.bindAsEventListener(this));
    Event.observe(this.element, "blur", this.blur.bindAsEventListener(this));
    Event.observe(this.findForm(this.element), 'submit', this.submit.bindAsEventListener(this));

		if((this.element.title && this.element.title == this.element.value) || !this.element.title) {
    	this.element.addClassName("placeholder-input");
		}
  },
  
  /**
   * @inner
   * This method is called on focus. It lets the placeholder disappear.
   * @param {Event} event The focus event object.
   */
  focus: function(event) {
    if (this.element.value == this.placeholder) {
      this.element.value = "";
      this.element.removeClassName("placeholder-input");
    }
  },
  
  /**
   * @inner
   * This method is called on blur. It shows the placeholder, if the text field
   * is empty.
   * @param {Event} event The blur event object.
   */
  blur: function(event) {
    if (this.element.value == "") {
      this.element.value = this.placeholder;
      this.element.addClassName("placeholder-input");
    }
  },

	submit: function(event) {
		if(this.element.value == this.placeholder) {
			this.element.value = '';
		}
	},
	
	findForm: function(element) {
	  if (element.tagName.toUpperCase() == 'HTML') {
	    return undefined;
	  } else if (element.tagName.toUpperCase() == 'FORM') {
	    return element;
	  } else {
	    return this.findForm(element.parentNode);
	  }
	}
});

CurrentPage.registerBehaviour("thc2-placeholder-input", PlaceholderInputWidget);