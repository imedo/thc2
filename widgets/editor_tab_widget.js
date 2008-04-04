/*
  Handles tabs for text area fields (tinymce vs plain text area)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var EditorTabWidget = Class.create(TabWidget, {
  initialize: function(element) {
    TabWidget.prototype.initialize.apply(this, arguments);
    this.tabs.each(function(tab) {
      tab.name = $A(tab.button.classNames())[0];
    }.bind(this));
    this.textarea = $(this.element.getElementsByTagName('textarea')[0]);
    if (!this.tinyMceInstance()) {
      tinyMCE.execCommand('mceAddControl', false, this.textarea.id);
    }
  },
  
  doSwitch: function(oldTab, newTab) {
    switch (newTab.name) {
      case 'rich-text': {
        this.tinyMceInstance().show();
        break;
      }
      case 'plain-text': {
        this.tinyMceInstance().hide();
        break;
      }
    }
  },
  
  tinyMceInstance: function() {
    if (!this.editorInstance) {
      this.editorInstance = tinyMCE.getInstanceById(this.textarea.id);
    }
    return this.editorInstance;
  }
});

CurrentPage.registerBehaviour("thc2-editor-tab-widget", EditorTabWidget);
