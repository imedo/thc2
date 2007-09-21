/*
  Simple javascript benchmarking class
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the imedo.de web site: http://www.imedo.de
*/

/**
 * Class for benchmarking the execution of javascript code.
 *
 * The easiest way to use this class is through the benchmark() method:
 *
 * <pre>
 *   new Benchmark("time-consuming operation").benchmark(function() {
 *     // your code here
 *   });
 * </pre>
 *
 * You can also use the start() and stop() methods to start and stop the
 * timer. Use duration() to query the measured runtime.
 *
 * @class Benchmark
 */
var Benchmark = Class.create(
/** @scope Benchmark.prototype */
{
  /**
   * Constructor.
   *
   * @param {string} what A string containing a description of what is benchmarked.
   */
  initialize: function(what) {
    this.what = what;
  },
  
  /**
   * Starts the timer.
   */
  start: function() {
    this.start_time = new Date();
  },
  
  /**
   * Stops the timer.
   */
  stop: function() {
    this.stop_time = new Date();
  },
  
  /**
   * Returns the elapsed time between the start() and stop() calls.
   * @return {integer} the elapsed time.
   */
  duration: function() {
    return this.stop_time - this.start_time;
  },
  
  /**
   * Convenience method that logs the measured time with log level <code>"info"</code>.
   * See the Logger class for details about log levels.
   */
  log: function() {
    if (this.what) {
      Logger.info("#{1} took #{2} ms".t().format(this.what, this.duration()));
    } else {
      Logger.info("Benchmark took #{1} ms".t().format(this.duration()));
    }
  },
  
  /**
   * Convenience function that measures the time it takes to execute the
   * given code block.
   *
   * @param {function} func The code block of which the execution time is measured.
   * @return {Benchmark} <code>this</code> object.
   */
  benchmark: function(func) {
    this.start();
    func();
    this.stop();
    this.log();
    return this;
  }
});

Object.extend(Globalize.German, {
  "#{1} took #{2} ms": "#{1} hat #{2} ms gedauert",
  "Benchmark took #{1} ms": "Benchmark hat #{1} ms gedauert"
});
