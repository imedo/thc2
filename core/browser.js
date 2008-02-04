var Browser = {
  detect: function() {
    // see: http://rafael.adm.br/css_browser_selector/
    var ua = navigator.userAgent.toLowerCase();
    var is = function(t){ return ua.indexOf(t) != -1; };
    var b = (!(/opera|webtv/i.test(ua)) && /msie (\d)/.test(ua)) ?
               ('ie ie'+RegExp.$1) :
                 is('gecko/') ? 'gecko' :
                 is('opera/9') ? 'opera opera9' :
                 /opera (\d)/.test(ua) ? 'opera opera'+RegExp.$1 :
                 is('konqueror')?'konqueror' :
                 is('applewebkit/') ? 'webkit safari':
                 is('mozilla/')?'gecko':'';
    // see: http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
    var os = (is('x11')||is('linux'))?' linux':is('mac')?' mac':is('win')?' win':'';
    var css = {browser:b,os:os};
    return css;
  }
};
