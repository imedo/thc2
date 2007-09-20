var Global = this;

var Core = {
  loadPath: 'javascripts',
  requiredFiles: [],
  
  fileLoaded: function(file) {
    return Core.requiredFiles.include(file);
  },
  
  fileNameFor: function(file) {
    return '/' + Core.loadPath + '/' + file + '.js';
  },
  
  loadFile: function(file) {
    console.debug("Loading file " + file);
    document.write('<scr' + 'ipt type="text/javascript" src="' + Core.fileNameFor(file) + '"></scr' + 'ipt>');
  },
  
  loadFileNow: function(file) {
    console.debug("Loading file " + file + " now!");
    var script = "";
    new Ajax.Request(Core.fileNameFor(file), { method:'get', onComplete: function(req) { script = req.responseText }, asynchronous: false });
    Global.eval(script);
  },
  
  require: function(file, blocking) {
    if (!Core.fileLoaded(file)) {
      if (blocking) {
        Core.loadFileNow(file);
      } else {
        Core.loadFile(file);
      }
      Core.requiredFiles.push(file);
    }
  }
};

function require(file, blocking) {
  Core.require(file, blocking);
}
