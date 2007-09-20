// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function set_border(index) {
    for (i = 1; i <= 12; i++) {
        if (i == index) $("avatar_" + i).style.border="2px solid #66CC00";
        else {
            $("avatar_" + i).style.border="1px solid #888888";
        }
    }
}

function set_contacter_name() {
  $("contacter_name").innerHTML = $('contact_item_first_name').value + ' ' + $('contact_item_last_name').value;
}
