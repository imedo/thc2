/*
  Base class for forms
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This is a base class for widgets that want local validation support
 * for forms.
 *
 * <p>Subclass this class and call the validator methods from
 * your class' constructor. The specified validations take place on submit
 * of the form. If one of them fail, the form submission is canceled.</p>
 *
 * <p>Currently, the following validators exist:</p>
 *
 * <ul>
 * <li><code>validatesPresenceOf</code> Validates that the specified field
 *     is not empty.</li>
 * <li><code>validatesFormatOf</code> Validates that the contents of the
 *     specified field have a certain format.</li>
 * <li><code>validatesConfirmationOf</code> Validates that the contents of
 *     the specified fields are equal.</li>
 * <li><code>validatesLengthOf</code> Validates that the contents of the
 *     specified field have a certain length.</li>
 * </ul>
 *
 * <p>Example:</p>
 *
 * <pre>
 * var SignupForm = Class.create(thc2.FormWidget, {
 *   initialize: function(element) {
 *     // call the base class' constructor
 *     thc2.FormWidget.prototype.initialize.apply(this, arguments);
 *     this.validatesPresenceOf('username', 'Please enter a user name');
 *     this.validatesLengthOf('username', 3, 40, 'Username must be 3 to 40 characters long');
 *     this.validatesPresenceOf('password', 'Please enter a password');
 *     this.validatesConfirmationOf('password', 'password_confirmation', 'Passwords dont match');
 *     this.validatesPresenceOf('email', 'Please enter your email address');
 *     this.validatesFormatOf('email', /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i, 'The email address is invalid');
 *   }
 * });
 * </pre>
 * @class
 * @extends thc2.Widget
 */
thc2.FormWidget = Class.create(thc2.Widget,
/** @scope thc2.FormWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    
    this.validators = [];
    this.form = this.element;
    Event.observe(this.element, 'submit', this.submit.bindAsEventListener(this));
  },
  
  /**
   * @inner
   * This method is called on form submission.
   * @param {Event} event The submit event object.
   */
  submit: function(event) {
    if (!this.validate())
      event.stop();
  },
  
  /**
   * Validates the form according to the specified validators.
   * @returns <code>true</code> if the validation succeeded, <code>false</code>
   *          otherwise.
   */
  validate: function() {
    var valid = true;
    this.validators.each(function(validator) {
      if (!validator()) {
        valid = false;
        throw $break;
      }
    });
    return valid;
  },
  
  /**
   * Adds a validator to this form that checks if the specified field is non-empty.
   * If it is, the validation fails.
   *
   * If your validate a radiogroup, the validator will check if at one of the radio buttons is selected.
   * For radiogroups you have to use the name property as id, for the following example:
   * 
   * <pre>
   * &lt;form class="thc2-form-validation-widget" action="/users" id="signup-form" method="post"&gt;
   *   &lt;input id="user_gender_male"  name="user[gender]" type="radio" id="user_gender" value="1" /&gt; male
   *   &lt;input id="user_gender_female" name="user[gender]" type="radio" id="user_gender" value="0" /&gt; female
   * &lt;input type="submit" value="submit" /&gt;
   * </pre>
   *
   * you should use this validator-code:
   *
   * <pre>
   * this.validatesPresenceOf('user[gender]', 'Please chose your gender.');
   * </pre>
   * @param {String,HTMLElement} id The form element that needs to be validated.
   * @message {String} An error message that is shown on failure.
   */
  validatesPresenceOf: function(id, message) {
    var field = $(id);
    this.validators.push(function() {
      if ((field && (field.value == "" || $F(id) == null)) 
      || (!field && ($$('input:checked[type="radio"][name="'+id+'"]') == 0))) {
        this.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  /**
   * Adds a validator to this form that checks if the content of the specified field
   * has a certain format. If it has not, the validation fails.
   *
   * @param {String,HTMLElement} id The form element that needs to be validated.
   * @param {Regexp} format The format of the field's content.
   * @message {String} An error message that is shown on failure.
   */
  validatesFormatOf: function(id, format, message) {
    var field = $(id);
    this.validators.push(function() {
      if (field && (field.type != 'text' || !format.match(field.value))) {
        this.handleError(field, message);
        return false;
      }
      return true;
    });
  },
  
  /**
   * Adds a validator to this form that checks if the contents of the specified
   * fields are equal. If they differ, the validation fails.
   *
   * @param {String,HTMLElement} id_first The first form element.
   * @param {String,HTMLElement} id_second The second form element.
   * @message {String} An error message that is shown on failure.
   */
  validatesConfirmationOf: function(id_first, id_second, message) {
    var field_first = $(id_first);
    var field_second = $(id_second);
    this.validators.push(function() {
      if (field_first && field_second && $F(id_first) != $F(id_second)) {
        this.handleError(field_first, message);
        return false;
      }
      return true;
    });
  },
  
  /**
   * Adds a validator to this form that checks if the content of the specified
   * field has a certain length. If it has not, the validation fails.
   *
   * @param {String,HTMLElement} id The form element that needs to be validated.
   * @param {int} minlength The minimum length of the field's content. If this
   *              value is <code>null</code>, it is ignored.
   * @param {int} maxlength The maximum length of the field's content. If this
   *              value is <code>null</code>, it is ignored.
   * @message {String} An error message that is shown on failure.
   */
  validatesLengthOf: function(id, minlength, maxlength, message) {
    var field = $(id);
    this.validators.push(function() {
      if (field && ((field.type != 'text') || (minlength != null && field.value.length < minlength) || (maxlength != null && field.value.length > maxlength))) {
        this.handleError(field, message);
        return false;
      }
      return true;
    });
  }
});

/**
 * Base class for validation error handlers. Subclass this class to handle
 * errors your own way. To make your subclass the default error handler,
 * change the thc2.FormWidget.defaultErrorHandler property.
 * @class
 */
thc2.FormWidget.ErrorHandler = Class.create(
/** @scope thc2.FormWidget.ErrorHandler.prototype */
{
  /**
   * Handle a validation error. You must implement this method in your
   * subclass.
   * @param {HTMLElement} field The input field for which the validation
   *         error occurred.
   * @param {String} message The error message to show.
   */
  handle: function(field, message) {
    throw "thc2.FormWidget.ErrorHandler.handle not implemented";
  }
});

/**
 * Validation error handler that shows an alert and gives focus to the
 * failing input field.
 * @class
 * @extends thc2.FormWidget.ErrorHandler
 */
thc2.FormWidget.AlertErrorHandler = Class.create(thc2.FormWidget.ErrorHandler,
/** @scope thc2.FormWidget.AlertErrorHandler.prototype */
{
  /**
   * Handles errors by showing the error message in an alert and giving
   * the failing field focus.
   */
  handle: function(field, message) {
    alert(message);
    field.focus();
  }
});

Object.extend(thc2.FormWidget,
/** @scope thc2.FormWidget */
{
  /**
   * The default error handler for validation errors. The value of this
   * property should be a subclass of thc2.FormWidget.ErrorHandler.
   */
  defaultErrorHandler: thc2.FormWidget.AlertErrorHandler,
  
  /**
   * Handles a validation error for the failing input field by instancing
   * the default error handler and delegating the error to it.
   *
   * @param {HTMLElement} field The failing field.
   * @param {String} message The error message to display.
   */
  handleError: function(field, message) {
    var handler = new thc2.FormWidget.defaultErrorHandler();
    handler.handle(field, message);
  }
});
