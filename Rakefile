require 'rake'
require 'rake/packagetask'

THC2_ROOT     = File.expand_path(File.dirname(__FILE__))
THC2_SRC_DIR  = File.join(THC2_ROOT, 'src')
THC2_DIST_DIR = File.join(THC2_ROOT, 'dist')
THC2_PKG_DIR  = File.join(THC2_ROOT, 'pkg')
THC2_DOC_DIR  = File.join(THC2_ROOT, 'doc')
THC2_VERSION  = '0.1'
JSDOC_DIR     = File.join(THC2_ROOT, 'lib/jsdoc')

task :default => [:dist, :document, :package, :clean_package_source]

desc "Builds the distribution."
task :dist do
  $:.unshift File.join(THC2_ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(THC2_SRC_DIR) do
    File.open(File.join(THC2_DIST_DIR, 'thc2.js'), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new('thc2.js')
    end
  end
end

desc "Create documentation."
task :document => :dist do
  Dir.chdir(JSDOC_DIR) do
    %x{java -jar jsrun.jar app/run.js -t=templates/jsdoc -d=#{THC2_DOC_DIR} #{THC2_DIST_DIR}/thc2.js #{THC2_SRC_DIR}/core/profiler.js}
  end
end

Rake::PackageTask.new('thc2', THC2_VERSION) do |package|
  package.need_tar_gz = true
  package.package_dir = THC2_PKG_DIR
  package.package_files.include(
    '[A-Z]*',
    'dist/thc2.js',
    'doc/**',
    'lib/**',
    'src/**',
    'test/**'
  )
end

desc "Builds the distribution and the test suite, runs the tests and collects their results."
task :test => [:dist, :test_units]

require 'test/lib/jstest'
desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:test_units) do |t|
  testcases        = ENV['TESTCASES']
  tests_to_run     = ENV['TESTS']    && ENV['TESTS'].split(',')
  browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
  tmp_dir          = "test/unit/tmp"
  
  t.mount("/dist")
  t.mount("/test")
  t.mount("/vendor")
  
  Dir.mkdir(tmp_dir) unless File.exist?(tmp_dir)
  
  Dir["test/unit/*_test.js"].each do |file|
    TestBuilder.new(file).render
    test_file = File.basename(file, ".js")
    test_name = test_file.sub("_test", "")
    unless tests_to_run && !tests_to_run.include?(test_name)
      t.run("/#{tmp_dir}/#{test_file}.html", testcases)
    end
  end
  
  %w( safari firefox ie konqueror opera ).each do |browser|
    t.browser(browser.to_sym) unless browsers_to_test && !browsers_to_test.include?(browser)
  end
end