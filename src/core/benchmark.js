/*
  Simple javascript benchmarking class
   (c) 2007 imedo GmbH
 
  This file is freely distributable under the terms of an MIT-style license.
  For details, see the project home page: http://opensource.imedo.de/pages/show/thc2
*/

/**
 * Class for benchmarking the execution of javascript code.
 *
 * <p>The easiest way to use this class is through the benchmark() method:</p>
 *
 * <pre>
 *   new thc2.Benchmark("time-consuming operation").benchmark(function() {
 *     // your code here
 *   });
 * </pre>
 *
 * <p>You can also use the {@link thc2.Benchmark#start} and {@link thc2.Benchmark#stop}
 * methods to start and stop the timer. Use {@link thc2.Benchmark#duration} to
 * query the measured runtime.</p>
 *
 * @class thc2.Benchmark
 */
thc2.Benchmark = Class.create(
/** @scope thc2.Benchmark.prototype */
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
   * Returns the elapsed time between the {@link thc2.Benchmark#start} and {@link thc2.Benchmark#stop} calls.
   * @return {integer} the elapsed time.
   */
  duration: function() {
    return this.stop_time - this.start_time;
  },
  
  lapTime: function() {
    return (new Date()) - this.start_time;
  },
  
  /**
   * Convenience method that logs the measured time with log level <code>"info"</code>.
   * See the {@link thc2.Logger} class for details about log levels.
   */
  log: function() {
    if (this.what) {
      thc2.Logger.info("#{1} took #{2} ms".t().format(this.what, this.duration()));
    } else {
      thc2.Logger.info("thc2.Benchmark took #{1} ms".t().format(this.duration()));
    }
  },
  
  /**
   * Convenience function that measures the time it takes to execute the
   * given code block.
   *
   * @param {function} func The code block of which the execution time is measured.
   * @return {thc2.Benchmark} <code>this</code> object.
   */
  benchmark: function(func) {
    this.start();
    func();
    this.stop();
    this.log();
    return this;
  }
});

Object.extend(thc2.Globalize.German, {
  "#{1} took #{2} ms": "#{1} hat #{2} ms gedauert",
  "thc2.Benchmark took #{1} ms": "thc2.Benchmark hat #{1} ms gedauert"
});
