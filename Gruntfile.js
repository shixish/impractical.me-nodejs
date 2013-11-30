//useful link: http://pletscher.org/blog/2013/05/27/website.html
module.exports = function(grunt) {
  grunt.initConfig({
    compass: {
      dist: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'dist/sass'
          //environment: 'production'
        }
      }
    },
    recess: {
      dist: {
        options: {
          compile: true
        },
        files: {
          'public/css/screen.css': [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'dist/sass/screen.css'
          ],
          'public/css/print.css': [
            //'bower_components/bootstrap/dist/css/bootstrap.css',
            'dist/sass/print.css'
          ]
        }
      }
    },
    handlebars: {
      compile: {
        options: {
          namespace: "hbs"
        },
        files: {
          "dist/js/views.js": ["views/*.hbs"]
        }
      }
    },
    uglify: {
      app: {
        files: {
          'public/js/app.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/js/transition.js',
            'bower_components/bootstrap/js/alert.js',
            'bower_components/bootstrap/js/button.js',
            'bower_components/bootstrap/js/carousel.js',
            'bower_components/bootstrap/js/collapse.js',
            'bower_components/bootstrap/js/dropdown.js',
            'bower_components/bootstrap/js/modal.js',
            'bower_components/bootstrap/js/tooltip.js',
            'bower_components/bootstrap/js/popover.js',
            'bower_components/bootstrap/js/scrollspy.js',
            'bower_components/bootstrap/js/tab.js',
            'bower_components/bootstrap/js/affix.js',
            'dist/js/views.js',
            'assets/js/app.'
          ],
          'public/js/libs/modernizr.min.js': 'bower_components/modernizr/modernizr.js'
        }
      },
    },
    copy: {
      bootstrap: {
        files: [
          {expand: true, cwd: 'components/bootstrap/img/', src: ['**'], dest: 'public/img/'}
        ]
      }
    },
    //exec: {
    //  build: {
    //    cmd: 'jekyll build'
    //  },
    //  serve: {
    //    cmd: 'jekyll serve --watch'
    //  },
    //  deploy: {
    //    cmd: 'rsync --progress -a --delete -e "ssh -q" _site/ myuser@host:mydir/'
    //  }
    //}
  });
  
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  
  //grunt.registerTask('default', [ 'less', 'uglify', 'copy', 'exec:build' ]);
  //grunt.registerTask('deploy', [ 'default', 'exec:deploy' ]);
  
  grunt.registerTask('default', [ 'compass', 'recess', 'handlebars', 'uglify', 'copy' ]);
  grunt.registerTask('deploy', [ 'default' ]);
};