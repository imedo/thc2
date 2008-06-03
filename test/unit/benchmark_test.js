new Test.Unit.Runner({
  setup: function() {
  },
  
  teardown: function() {
  },
  
  testInitialize: function() { with(this) {
    bench = new Benchmark('test');
    assertEqual(bench.what, 'test');
  }},
  
  testStartAndStop: function() { with(this) {
    bench = new Benchmark('test');
    bench.start();
    assertNotNull(bench.start_time);
    pause(100);
    bench.stop();
    assertNotNull(bench.stop_time);
    assert(bench.duration() > 0);
    assertNotEqual(bench.start_time, bench.stop_time);
  }},
  
  testDuration: function() { with(this) {
    bench = new Benchmark('test');
    bench.start();
    pause(100);
    bench.stop();
    assert(bench.duration() > 90);
  }},
  
  testLog: function() { with(this) {
    var log_text = "";
    mockup(Logger, 'info', function(text) {
      log_text = text;
    }.bind(this));
    
    bench = new Benchmark('test');
    bench.benchmark(function() {}); // this calls log()
    assert(/test/.match(log_text));

    bench = new Benchmark();
    bench.benchmark(function() {});
    assert(!/test/.match(log_text));
  }},
  
  testBenchmark: function() { with(this) {
    bench = new Benchmark().benchmark(function() {
      pause(100);
    });
    assertNotNull(bench.start_time);
    assertNotNull(bench.stop_time);
    assertNotNull(bench.duration());
    assert(bench.duration() > 0);
  }}
});
