/*
  Simple javascript benchmarking class
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

var Benchmark = Class.create({
  initialize: function() {
  },
  
  start: function() {
    this.start_time = new Date();
  },
  
  stop: function() {
    this.stop_time = new Date();
  },
  
  duration: function() {
    return this.stop_time - this.start_time;
  },
  
  log: function() {
    Logger.info("Page initialization took " + this.duration() + " ms");
  },
  
  benchmark: function(func) {
    this.start();
    func();
    this.stop();
    this.log();
  }
});
