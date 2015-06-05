module.exports = function(grunt) {

    grunt.initConfig({

        paths: {
            lessSrc : 'less/site.less',
            lessDest: 'app/style.css'
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
            styleMap: ['style.css.map']
        },

        nodemon: {
            dev: {
                script: 'run.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('build', ['styles', 'nodemon']);
    grunt.registerTask('styles', ['clean:styleMap', 'less:production']);
    grunt.registerTask('default', ['build']);
};
