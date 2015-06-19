module.exports = function(grunt) {

    grunt.initConfig({

        paths: {
            lessSrc : 'less/site.less',
            lessDest: 'app/style.css',
            jsSrc: [
                'lib/jquery/dist/jquery.js',
                'lib/bootstrap/dist//js/bootstrap.js',
            ],
            jsDest: 'app/script.js',
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

        clean: {
            styleMap: ['style.css.map'],
            scriptMap: ['script.js.map']
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
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('build', ['styles', 'scripts', 'nodemon']);
    grunt.registerTask('styles', ['clean:styleMap', 'less:production']);
    grunt.registerTask('scripts', ['clean:scriptMap', 'uglify:production']);
    grunt.registerTask('default', ['build']);
};
