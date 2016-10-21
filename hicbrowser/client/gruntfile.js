module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['gruntfile.js', 'index.js', 'js/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        browserify: {
            '../static/js/App.js': ['index.js']
        },
        handlebars: {
            compile: {
                options: {
                    node: true,
                    namespace: 'Templates',
                    partialsUseNamespace: true,
                    processName: function(filePath) {
                        var file = filePath.replace(/.*\/(\w+)\.hbs/, '$1');
                        return file;
                    }
                },
                files:{
                    'js/templates.js': ['templates/*.hbs']
                }
            }
        },
        stylus: {
            '../static/css/App.css': ['styl/*.styl'], // compile and concat into single file
            options: {
                urlfunc: {
                    name:'embedurl',
                    limit:false
                },
                'include css':true
            }
        },
        processhtml: {
           dist: {
               files: {
                   '../templates/index.html': ['html/index.html']
               }
           }
        },
        uglify: {
            my_target: {
                files: {
                    '../static/js/App.min.js': ['../static/js/App.js']
                }
            }
        },
        'http-server': {

            'dev': {

                // the server root directory
                //root: <path>,

                // the server port
                // can also be written as a function, e.g.
                // port: function() { return 8282; }
                port: 8282,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                host: "0.0.0.0",

                // Tell grunt task to open the browser
                openBrowser : true,
                root : "../"

            }

        },
        watch: {
            scripts: {
                files: ['index.js', 'styl/*.styl', 'templates/*.hbs'],
                tasks: ['dist']
            },
        }
    });

    //Tasks
    grunt.registerTask('dist', ['jshint', 'handlebars', 'stylus', 'browserify', 'processhtml', 'uglify']);
    grunt.registerTask('serve', ['http-server']);

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-http-server');

};
