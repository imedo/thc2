/*
  Dynamically change textarea widgets to TinyMCE widgets
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * This widget turns a text area into a Tiny MCE editor.
 *
 * @class
 * @extends thc2.Widget
 */
thc2.TinyMCEWidget = Class.create(thc2.Widget,
/** @scope thc2.TinyMCEWidget.prototype */
{
  /**
  * Settings for TinyMCE, which will be applied on initialization
  */
  settings: { relative_urls: false,
              convert_urls: false
            },
  
  /**
   * Constructor. Also applies settings to editor
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    tinyMCE.settings = this.settings;
    tinyMCE.execCommand('mceAddControl', true, this.element.id);
  },

  /**
   * Returns the TinyMCE editor instance for this widget.
   * @return {TinyMCE} The editor instance.
   */
  editor: function() {
    if (!this.editorInstance) {
      this.editorInstance = tinyMCE.getInstanceById(this.element.id);
    }
    return this.editorInstance;
  },
  
  /**
   * Shows the editor instance and hides the text area.
   */
  show: function() {
    this.editor().show();
  },
  
  /**
   * Hides the editor instance and shows the text area.
   */
  hide: function() {
    this.editor().hide();
  }
});

thc2.CurrentPage.registerBehaviour("thc2-tiny-mce", thc2.TinyMCEWidget);
