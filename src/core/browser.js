/**
 * Provides a method to detect the current browser and operating system. This is particularly
 * useful for browser specific CSS selectors.
 *
 * @static
 * @class
 */
thc2.Browser = {
  /**
   * Detects the current browser / engine with version information and operating system via user agent sniffing.
   *
   * <p>It detects the following browsers:</p>
   *
   * <table>
   *   <thead>
   *     <tr>
   *       <th>thc2.Browser / Engine</th>
   *       <th>Return Value</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Internet Explorer</td>
   *       <td><code>ie ie</code><em>version</em></td>
   *     </tr>
   *     <tr>
   *       <td>Firefox / Gecko</td>
   *       <td><code>gecko</code></td>
   *     </tr>
   *     <tr>
   *       <td>Opera</td>
   *       <td><code>opera opera</code><em>version</em></td>
   *     </tr>
   *     <tr>
   *       <td>Konqueror</td>
   *       <td><code>konqueror</code></td>
   *     </tr>
   *     <tr>
   *       <td>Safari / Webkit</td>
   *       <td><code>webkit</code></td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * <p>And the following operating systems:</p>
   *
   * <table>
   *   <thead>
   *     <tr>
   *       <th>Operating System</th>
   *       <th>Return Value</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Linux / X11</td>
   *       <td><code>linux</code></td>
   *     </tr>
   *     <tr>
   *       <td>Mac OS</td>
   *       <td><code>mac</code></td>
   *     </tr>
   *     <tr>
   *       <td>Windows</td>
   *       <td><code>win</code></td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @returns A hash containing the browser name with version and the operating system.
   */
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

    if (b == 'gecko') {
      if (is('firefox/2')) {
        b += ' firefox2';
      } else if (is('firefox/3')) {
        b += ' firefox3';
      }
    }
    // see: http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
    var os = (is('x11')||is('linux'))?' linux':is('mac')?' mac':is('win')?' win':'';
    var css = {browser:b,os:os};
    return css;
  }
};
