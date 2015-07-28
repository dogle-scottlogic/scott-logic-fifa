var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    replace = require('gulp-replace'),
    karma = require('gulp-karma');


// Source path
var bowerAssets= "lib/";
var typescriptSrc = ["typescript/**/*.ts","typings/**/*.d.ts"];
var lessSrc = ['less/site.less', bowerAssets+'/angular-wizard/dist/angular-wizard.less'];
var htmlSrc = 'app/**/*.html';
var jsSrc= [
        bowerAssets+'jquery/dist/jquery.js',
        bowerAssets+'bootstrap/dist/js/bootstrap.js',
        bowerAssets+'underscore/underscore.js'
    ];

// Destination path
var destPath="app/";
var isDevelopment = true;

// converting the less files in css
gulp.task('less', function() {

  // defining the src and the dest
  var lessDest = destPath;

   gulp.src(lessSrc)
      .pipe(less())
      .pipe(concat('style.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest(lessDest));
});

gulp.task('typescript', ['ts-lint', 'compile-ts']);
/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(typescriptSrc).pipe(tslint()).pipe(tslint.report('prose'));
});

// compiling the typescript files
gulp.task('compile-ts', function() {

  // defining the src and the dest
  var typescriptDest = destPath;

  var tsResult = gulp.src(typescriptSrc)
                   .pipe(tsc({
                       target: 'ES5',
                       declarationFiles: false,
                       noExternalResolve: true,
                       removeComments: true,
                       module: 'amd',
                       sortOutput: true,
                       out: 'leagueManager.js'
                   }));

   // If we are in production, we also replace localhost by / and uglify the file
    if(isDevelopment == true){
        return tsResult.js.pipe(gulp.dest(typescriptDest));
    }else{
      return tsResult.js.pipe(replace("http://localhost:65158/", "/")).pipe(uglify()).pipe(gulp.dest(typescriptDest));
    }


});


// Creating a js file for jquery, bootstrap and underscore
gulp.task('script', function () {

   gulp.src(jsSrc)
     .pipe(uglify())
     .pipe(concat('script.js'))
     .pipe(gulp.dest(destPath));
});

  var fontSrc = 'bootstrap/dist/fonts/',
      fontDest = 'fonts/';

var files = [
        {
            cwd: 'angular/',
            src: ['angular.js'],
            srcProd: ['angular.min.js'],
            dest: 'lib/angular/'
        },
        {
            cwd: 'angular-route/',
            src: ['angular-route.js'],
            srcProd: ['angular-route.min.js'],
            dest: 'lib/angular-route/'
        },
        {
             cwd: 'angular-bootstrap/',
             src: ['ui-bootstrap-tpls.js'],
             srcProd: ['ui-bootstrap-tpls.min.js'],
             dest: 'lib/angular-bootstrap/'
         },
        {
            cwd: 'angular-busy/dist/',
            src: ['angular-busy.js', 'angular-busy.css'],
            srcProd: ['angular-busy.min.js', 'angular-busy.min.css'],
            dest: 'lib/angular-busy/'
        },
       {
           cwd: 'underscore/',
           src: ['underscore-min.js'],
           srcProd: ['underscore-min.js'],
           dest: 'lib/underscore/'
       },
       {
           cwd: 'angular-wizard/dist/',
           src: ['angular-wizard.js'],
           srcProd: ['angular-wizard.min.js'],
           dest: 'lib/angular-wizard/'
       },
       {
           cwd: fontSrc,
           src: ['*.*'],
           srcProd: ['*.*'],
           dest: fontDest
       }
    ];

// Copying the usefull libraries
gulp.task('copy', function () {


      for(var i=0; i<files.length; i++){
        for(var j=0;j<files[i].src.length;j++){
          if(isDevelopment == true){
            gulp.src(bowerAssets+files[i].cwd+files[i].src[j])
                .pipe(gulp.dest(destPath+files[i].dest));
          }else{
              gulp.src(bowerAssets+files[i].cwd+files[i].srcProd[j])
                  .pipe(gulp.dest(destPath+files[i].dest));
          }
        }
      }

});



// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('build-sync', ['build'], browserSync.reload);


// used to refresh the browser
gulp.task('browser-sync', function () {

   browserSync.init({
      server: {
         baseDir: './'+destPath
      }
   });

   // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    var filesToWatch = [
        htmlSrc,
        typescriptSrc,
        lessSrc
    ];

    gulp.watch(filesToWatch, ['build-sync']);
});



// This task setup the paths used for production, it have be the first task launched
gulp.task('setupAndBuild:production', function(){
  // The dest path is now dist
  destPath = "dist/";
  isDevelopment = "false";
  gulp.run('dependency');
  gulp.run('build');
})

// used to deploy the application in production
gulp.task('deploy:production',['setupAndBuild:production'], function () {

    // deploy the html files (except the index)
    gulp.src("app/views/**/*.html")
            .pipe(gulp.dest(destPath+"views/"));


    // Deploy the index.html file (replacing the libs import)
    var index = gulp.src(['app/index.html']);
    // In the end, we replace the import js files for the index.html
    for(var i=0; i<files.length; i++){
      for(var j=0;j<files[i].src.length;j++){
        index.pipe(replace(files[i].src[j],files[i].srcProd[j]));
      }
    }

    index.pipe(gulp.dest(destPath));

   // deploy the images files
   gulp.src("app/**/*.gif")
           .pipe(gulp.dest(destPath));
   gulp.src("app/**/*.png")
           .pipe(gulp.dest(destPath));


});

// we make sure to run after deploying and building
gulp.task('run:production',['deploy:production'], function(){
    // in the end we run in production
    gulp.run('browser-sync');
});

var testFiles = [
  'lib/angular/angular.js',
  'lib/angular-route/angular-route.js',
  'lib/angular-mocks/angular-mocks.js',
  'lib/angular-bootstrap/ui-bootstrap-tpls.js',
  'lib/angular-busy/angular-busy.js',
  'lib/angular-wizard/dist/angular-wizard.js',
  'app/leagueManager.js',
  'test/**/*.js',
  // Loading the html files
  'app/views/**/*.html'
];

// defining the karma task
gulp.task('karma', function() {
  // Be sure to return the stream
  return gulp.src(testFiles).pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('dependency', ['copy','script']);
gulp.task('build', ['typescript', 'less']);
gulp.task('default', ['dependency', 'build', 'browser-sync']);
gulp.task('production', ['deploy:production', 'browser-sync']);
