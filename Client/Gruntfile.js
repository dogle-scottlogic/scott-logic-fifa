module.exports = function(grunt) {

    grunt.initConfig({

        paths: {
            bowerAssets: 'lib/',
            lessSrc : ['less/site.less', '<%= paths.bowerAssets %>/angular-wizard/dist/angular-wizard.less'],
            lessDest: 'app/style.css',
            jsSrc: [
                'lib/jquery/dist/jquery.js',
                'lib/bootstrap/dist/js/bootstrap.js',
                'lib/underscore/underscore.js'
            ],
            jsDest: 'app/script.js',
            typescriptSrc: [
                'app/typescript/**/*.ts',
            ],
            typescriptDest: 'app/leagueManager.js',
            htmlSrc: 'app/**/*.html'
        },

        less: {
            options: {
                paths: ['less']
            },
            development: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'style.css.map',
                    outputSourceFiles: true
                },
                files: {
                    '<%= paths.lessDest %>': '<%= paths.lessSrc %>'
                }
            },
            production: {
                options: {
                    compress: true,
                    ieCompat: true
                },
                files: {
                    '<%= paths.lessDest %>': '<%= paths.lessSrc %>'
                }
            }
        },

        typescript: {
            base: {
                src: '<%= paths.typescriptSrc %>',
                dest: '<%= paths.typescriptDest %>',
                options: {
                    sourceMap: false, // (optional) Generates corresponding .map file.
                    target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
                    module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
                    noImplicitAny: false, // (optional) Warn on expressions and declarations with an implied 'any' type.
                    removeComments: true // (optional) Do not emit comments to output.
                }
            }
        },

        clean: {
            styleMap: ['style.css.map'],
            scriptMap: ['script.js.map']
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.bowerAssets %>/angular/',
                        src: ['angular.js'],
                        dest: 'app/lib/angular/'
                    },
                    {
                        expand: true,
                        cwd: '<%= paths.bowerAssets %>/angular-route/',
                        src: ['angular-route.js'],
                        dest: 'app/lib/angular-route/'
                    },
                    {
                         expand: true,
                         cwd: '<%= paths.bowerAssets %>/angular-bootstrap/',
                         src: ['ui-bootstrap-tpls.js'],
                         dest: 'app/lib/angular-bootstrap/'
                     },
                    {
                        expand: true,
                        cwd: '<%= paths.bowerAssets %>/angular-busy/dist/',
                        src: ['angular-busy.js', 'angular-busy.css'],
                        dest: 'app/lib/angular-busy/'
                    },
                   {
                       expand: true,
                       cwd: '<%= paths.bowerAssets %>/underscore/',
                       src: ['underscore-min.js'],
                       dest: 'app/lib/underscore/'
                   },
                   {
                       expand: true,
                       cwd: '<%= paths.bowerAssets %>/angular-wizard/dist/',
                       src: ['angular-wizard.js'],
                       dest: 'app/lib/angular-wizard/'
                   }
                ]
            }
        },

        uglify: {
            development: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    '<%= paths.jsDest %>': '<%= paths.jsSrc %>'
                }
            },
            production: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    '<%= paths.jsDest %>': '<%= paths.jsSrc %>'
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: 'app/',
                    livereload : true
        }
            }
        },

        watch: {
            files: [
                '<%= paths.lessSrc %>',
                '<%= paths.typescriptSrc %>',
                '<%= paths.htmlSrc %>'
            ],
            tasks: ['build'],
            options : {
                livereload : true
            }
        },

        open: {
            dev: {
                path: 'http://localhost:8080/'
            }
        },

        karma: {
          unit: {
            configFile: 'karma.conf.js',
            autoWatch: true
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dependencies', ['scripts', 'copy']);
    grunt.registerTask('build', ['typescript', 'styles']);
    grunt.registerTask('styles', ['clean:styleMap', 'less:production']);
    grunt.registerTask('scripts', ['clean:scriptMap', 'uglify:production']);
    grunt.registerTask('default', ['dependencies','build', 'connect', 'open', 'watch']);
};
