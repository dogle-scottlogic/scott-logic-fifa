var SpecReporter = require('jasmine-spec-reporter');

exports.config = {
  seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    print: function () {
    }
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
