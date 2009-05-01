<%= include 'HEADER' %>

<%= include 'core/core.js', 'core/browser.js', 'core/environment.js', 'core/logger.js', 'core/globalize.js', 'core/benchmark.js', 'core/singleton.js', 'core/ajax_cache.js', 'core/page.js', 'core/widget.js', 'core/prototype_ext.js' %>

if (typeof tinymce != "undefined") {
<%= include 'core/tiny_mce_observer.js' %>
}

<%= include 'widgets/bubble.js', 'widgets/ajax_bubble.js', 'widgets/bookmark_widget.js', 'widgets/bubble_manager.js', 'widgets/bubble_trigger_widget.js', 'widgets/clickable_widget.js', 'widgets/code_input_widget.js', 'widgets/form_widget.js', 'widgets/limited_textarea_widget.js', 'widgets/mnemonic_form.js', 'widgets/placeholder_input_widget.js', 'widgets/popup_widget.js', 'widgets/rating_widget.js', 'widgets/remote_form.js', 'widgets/remote_link_widget.js', 'widgets/slideshow_widget.js', 'widgets/tab_widget.js', 'widgets/toggle_widget.js', 'widgets/check_list_widget.js', 'widgets/dropdown_menu_widget.js', 'widgets/photo_album_widget.js', 'widgets/zooming_teaser_widget.js', 'widgets/autocomplete_widget.js', 'widgets/combo_box_widget.js' %>

if (typeof tinymce != "undefined") {
<%= include 'widgets/tiny_mce_widget.js' %>
<%= include 'widgets/editor_tab_widget.js' %>
}
