/*
  Personal chat window
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var PersonalChatWidget = Class.create(Widget, {
  IdRegexp: /^id_(\d+)$/,
  
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    PersonalChatWidget.self = this;
    
    var id = this.element.classNames().grep(this.IdRegexp)[0];
    if (id) {
      var match = id.match(this.IdRegexp);
      this.id = parseInt(match[1]);
    }
    
    this.waitNotice = $(this.element.getElementsByClassName('wait-notice')[0]);
    this.soundOnLink = $(this.element.getElementsByClassName('sound_on')[0]);
    this.soundOffLink = $(this.element.getElementsByClassName('sound_off')[0]);
    if (this.soundOffLink.hasClassName('by_default')) {
      Sound.disable();
    }
    this.closeLink = $(this.element.getElementsByClassName('close')[0]);
    
    this.textForm = $(this.element.getElementsByTagName('form')[0]);
    this.inputField = $(this.textForm.getElementsByTagName('input')[0]);
    this.spinner = $(this.element.getElementsByClassName('thc2-spinner')[0]);
    
    this.chatContainer = $(this.element.getElementsByClassName('chat_container')[0]);
    this.scrollContainer = $(this.element.getElementsByClassName('scroll_container')[0]);
    this.scrollArea = $(this.element.getElementsByClassName('scroll_area')[0]);
    
    Event.observe(this.soundOnLink, 'click', this.soundOn.bindAsEventListener(this));
    Event.observe(this.soundOffLink, 'click', this.soundOff.bindAsEventListener(this));
    Event.observe(this.closeLink, 'click', this.close.bindAsEventListener(this));
    
    Event.observe(this.textForm, 'submit', this.talk.bindAsEventListener(this));
    
    Event.observe(window, 'unload', this.exit.bindAsEventListener(this));
    Event.observe(window, 'focus', this.windowFocus.bindAsEventListener(this));
    Event.observe(window, 'blur', this.windowBlur.bindAsEventListener(this));
    
    this.scroll();
    window.focus();
    this.focused = true;
    this.inputField.focus();
  },
  
  soundOn: function(event) {
    Sound.enable();
    this.soundOffLink.show();
    this.soundOnLink.hide();
    Event.stop(event);
  },
  
  soundOff: function(event) {
    Sound.disable();
    this.soundOffLink.hide();
    this.soundOnLink.show();
    Event.stop(event);
  },
  
  close: function(event) {
    if (confirm('By closing this window or navigating away the chat will be finished. Do you want to proceed?'.t())) {
      window.close();
    }
    Event.stop(event);
  },
  
  windowFocus: function(event) {
    this.clearHighlight();
    this.focused = true;
    if (!this.inputField.disabled) {
      this.inputField.focus();
    }
  },
  
  windowBlur: function(event) {
    this.focused = false;
  },
  
  exit: function(event) {
    new Ajax.Request("/personal_chat/exit/" + this.id, { asynchronous: false });
  },
  
  join: function() {
    new Effect.Fade(this.waitNotice);
  },
  
  talk: function(event) {
    if (!this.finished) {
      new Ajax.Request(this.textForm.action, {
        asynchronous:true,
        evalScripts:true,
        onLoading: function() { this.inputField.value = ""; this.inputField.blur(); this.inputField.disable(); this.spinner.show(); }.bind(this),
        onComplete: function() { this.spinner.hide(); this.inputField.enable(); this.inputField.focus(); }.bind(this),
        parameters:Form.serialize(this.textForm)
      });
    }
    event.stop();
  },
  
  receive: function(html) {
    this.chatContainer.insert(html);
    this.scroll();
    if (!this.focused) {
      this.highlight();
    }
    this.pling();
  },
  
  systemMessage: function(html) {
    this.chatContainer.insert(html);
    this.scroll();
  },
  
  finish: function() {
    this.finished = true;
    this.textForm.disable();
  },
  
  scroll: function() {
    this.scrollArea.scrollTop = this.scrollArea.scrollHeight;
  },
  
  highlight: function() {
    this.scrollContainer.style.border = "1px solid #f90";
  },
  
  clearHighlight: function() {
    this.scrollContainer.style.border = "none";
  },
  
  pling: function() {
    Sound.play('/sounds/message.wav');
  }
});

Object.extend(Globalize.German, {
  'By closing this window or navigating away the chat will be finished. Do you want to proceed?': 'Durch Schließen des Fensters oder durch Navigation von dieser Seite beenden Sie den Chat. Wollen Sie fortfahren?'
});

CurrentPage.registerBehaviour('thc2-personal-chat', PersonalChatWidget);
