module.exports = function(grunt) {

    grunt.initConfig({

        paths: {
            lessSrc : 'less/site.less',
            lessDest: 'app/style.css',
            bowerAssets: 'lib/',
            jsSrc: [
                'lib/jquery/dist/jquery.js',
                'lib/bootstrap/dist//js/bootstrap.js',
            ],
            jsDest: 'app/script.js',
            typescriptSrc: [
                'app/typescript/**/*.ts',
            ],
            typescriptDest: 'app/leagueManager.js',
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
                        cwd: '<%= paths.bowerAssets %>/angular',
                        src: ['*'],
                        dest: 'app/lib/angular'
                    }
                ]
            }
        },

        nodemon: {
            dev: {
                script: 'run.js'
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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.registerTask('build', ['typescript', 'styles', 'scripts', 'copy', 'nodemon']);
    grunt.registerTask('styles', ['clean:styleMap', 'less:production']);
    grunt.registerTask('scripts', ['clean:scriptMap', 'uglify:production']);
    grunt.registerTask('default', ['build']);
};
