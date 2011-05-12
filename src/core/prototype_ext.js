/*
  Extensions to the Prototype JavaScript Framework.
   (c) 2007 imedo GmbH
 
  Prototype Extensions are freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

String.prototype.format = function() {
  return $A(arguments).inject(this, function(str, val, i) {
    return str.replace(new RegExp('#\\{' + (i + 1) + '\\}', 'g'), val);
  });
};

if (Prototype.Browser.IE) {
  // this actually improves performance in IE 6
  Event.allEvents = [];

  Event.oldObserve = Event.observe;
  Event.observe = function(element, eventName, handler) {
    var event = {
            element: element,
            name: eventName,
            handler: handler
        };

    Event.allEvents.push(event);
    Event.oldObserve.apply(Event, arguments);
  }
  
  Element.Methods.observe = Event.observe.methodize();
  Element.prototype.observe = Event.observe.methodize();

  Event.stopObservingEverything = function() {
    $A(Event.allEvents).each(function(event) {
      try {
        Event.stopObserving(event.element, event.name, event.handler);
      } finally {
        event.element = null;
        event.handler = null;
      }
    });
    Event.allEvents = [];
    thc2.CurrentPage.initialize();
  }

  Event.oldObserve(window, "unload", Event.stopObservingEverything.bind(Event));
}
