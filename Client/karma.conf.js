// Karma configuration
// Generated on Fri Jul 03 2015 13:45:24 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'lib/angular-busy/angular-busy.js',
      'app/leagueManager.js',
      'test/*.js',
      // Loading the html files
      'app/views/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/views/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('templates')
      moduleName: 'templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['story'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-story-reporter',
      'karma-ng-html2js-preprocessor'
    ]
  })
}
