/*
  Handles tabs for text area fields (tinymce vs plain text area)
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  TODO:
  -----
  
  - more view modes (textile, ...)
*/

/**
 * This widget provides a tabbed interface for a TinyMCE editor to switch rich
 * text on or off.
 *
 * Like for all tab widgets, the markup should look something like this:
 *
 * <pre>
 * &lt;div&gt;
 *   &lt;ul class=&quot;tab-list&quot;&gt;
 *     &lt;li class=&quot;rich-text on&quot; title=&quot;Formatiert&quot;&gt;
 *       &lt;a href=&quot;#&quot;&gt;Rich text&lt;/a&gt;
 *     &lt;/li&gt;
 *     &lt;li class=&quot;plain-text&quot; title=&quot;HTML-Code&quot;&gt;
 *       &lt;a href=&quot;#&quot;&gt;Plain text&lt;/a&gt;
 *     &lt;/li&gt;
 *   &lt;/ul&gt;
 *   &lt;div class=&quot;box-wrapper&quot;&gt;
 *     &lt;div&gt;
 *       &lt;div class=&quot;tab-container&quot;&gt;
 *         &lt;textarea id=&quot;mytext&quot; name=&quot;mytext&quot; cols=&quot;40&quot;&gt;Text is going here.&lt;/textarea&gt;
 *       &lt;/div&gt;
 *     &lt;/div&gt;
 *   &lt;/div&gt;
 * &lt;/div&gt;
 * </pre>
 *
 * The widget is applied to the outermost <code>div</code> element.
 * @class
 * @extends TabWidget
 */
var EditorTabWidget = Class.create(TabWidget,
/** @scope EditorTabWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    TabWidget.prototype.initialize.apply(this, arguments);
    this.tabs.each(function(tab) {
      tab.name = $A(tab.button.classNames())[0];
    }.bind(this));
    this.editor = new TinyMCEWidget(this.element.getElementsByTagName('textarea')[0]);
  },
  
  /**
   * @inner
   * Switches tabs.
   */
  doSwitch: function(oldTab, newTab) {
    switch (newTab.name) {
      case 'rich-text': {
        this.editor.show();
        break;
      }
      case 'plain-text': {
        this.editor.hide();
        break;
      }
    }
  }
});

CurrentPage.registerBehaviour("thc2-editor-tab-widget", EditorTabWidget);
