/*
  Wrapper for Autocompleter.Local
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
  
  Parts of this file are modified from an original version Copyright (c) 2007 stickmanlabs.
  See below for details.
  
  
  TODO:
  -----
  
  - Support more than local autocompleter
  - Remove hard coded element IDs
  - Abstract data sources for autocomplete options (local, ajax)
*/

/**
 * Wrapper widget around Prototype's Autocompleter.
 *
 * <p><strong>Note:</strong> This still needs some work, as the autocomplete box and options
 * are hard-coded elements, and only the local autocompleter is supported
 * for now.</p>
 * @class
 * @extends thc2.Widget
 */
thc2.AutocompleteWidget = Class.create(thc2.Widget,
/** @scope thc2.AutocompleteWidget.prototype */
{
  /**
   * Constructor.
   */
  initialize: function(element) {
    thc2.Widget.prototype.initialize.apply(this, arguments);
    this.autocompleteBox = $('autocomplete');
    this.items = $('autocomplete-options').childElements().map(function(e){ return e.innerHTML; })
    this.completer = new Autocompleter.Local(this.element, this.autocompleteBox, this.items);
  }
});

thc2.CurrentPage.registerBehaviour("thc2-autocomplete", thc2.AutocompleteWidget);
