Design principles of this library
---------------------------------

1. Be unobstrusive.

For a Javascript library, being unobstrusive means leaving as few traces of Javascript code in the markup as possible. In fact, you can build rich user interfaces with this library with little or no Javascript in the markup. This is accomplished by a few conventions:

- all elements that should gain javascript controlled behaviors need to add a CSS class. The class must have the prefix "thc2-", for example "thc2-popup".
- To customize the behavior for certain elements, additional parameters are given in additional classes (so called class parameters), such as "thc2-popup box_size_1024x768".

2. Work even without javascript support.

To support older browsers, and to limit the damage when Javascript does not work correctly, almost all user interface elements in this library either also work without Javascript (though not that comfortably), or have a fallback interface that is visible when Javascript is turned off.

3. Be reusable.

It is the goal of this library to provide small reusable building blocks of Javascript, which can be combined to bigger compositions. For example, the EditorTabWidget subclasses the TabWidget class, and contains a TinyMCEWidget instance.
