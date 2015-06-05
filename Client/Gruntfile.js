module.exports = function(grunt) {

    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'run.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['nodemon']);
};
