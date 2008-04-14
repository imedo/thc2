/*
  Wrapper for Autocompleter.Local
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
  
  Parts of this file are modified from an original version Copyright (c) 2007 stickmanlabs.
  See below for details.
*/

var AutocompleteWidget = Class.create(Widget, {
  initialize: function(element) {
    Widget.prototype.initialize.apply(this, arguments);
    this.autocompleteBox = $('autocomplete');
    this.options = $('autocomplete-options').childElements().map(function(e){ return e.innerHTML; })
    this.completer = new Autocompleter.Local(this.element, this.autocompleteBox, this.options);
  }
});

CurrentPage.registerBehaviour("thc2-autocomplete", AutocompleteWidget);