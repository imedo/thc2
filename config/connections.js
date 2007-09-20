/*
  Global connections
   (c) 2007 imedo GmbH
  
  This file is *NOT* freely distributable. It is ours. Write your own.
*/

CurrentPage.connectAll({
  '#group_local': {
    click: function(event) { Effect.toggle('group_options', 'blind'); }
  },
  
  '#group_covers_condition': {
    click: function(event) { Effect.toggle('condition_options', 'blind'); }
  },
  
  '#close-flash a': {
    click: function(event) { Effect.Fade('flash'); event.stop(); }
  },
  
  '#answer_answer': {
    keyup: function(event) {
      if ($('quick-signup-form') && this.value.length >= 10 && $('quick-signup-form').style.display == 'none')
        new Effect.BlindDown('quick-signup-form');
    }
  }
  
});
