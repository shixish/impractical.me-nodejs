//module.exports = function(grunt) {
//
//  // Project configuration.
//  grunt.initConfig({
//    pkg: grunt.file.readJSON('package.json'),
//    uglify: {
//      options: {
//        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//      },
//      build: {
//        src: 'src/<%= pkg.name %>.js',
//        dest: 'build/<%= pkg.name %>.min.js'
//      }
//    }
//  });
//
//  // Load the plugin that provides the "uglify" task.
//  grunt.loadNpmTasks('grunt-contrib-uglify');
//
//  // Default task(s).
//  grunt.registerTask('default', ['uglify']);
//
//};

module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      production: {
        options: {
          paths: ["bower_components/bootstrap/less"],
          yuicompress: true
        }/*,
        files: {
          "public/css/application.min.css": "assets/_less/application.less"
        }*/
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config/config.rb',
          environment: 'production'
        }
      },
      dev: {
        options: {
          config: 'config/config.rb'
        }
      }
    },
    uglify: {
      app: {
        files: {
          'public/js/app.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/bootstrap/js/bootstrap-collapse.js',
            'bower_components/bootstrap/js/bootstrap-scrollspy.js',
            'bower_components/bootstrap/js/bootstrap-button.js',
            'bower_components/bootstrap/js/bootstrap-affix.js'
           ]
        }
      },
      //jquery: {
      //  files: {
      //    'public/js/jquery.min.js': 'components/jquery/jquery.js'
      //  }
      //},
      //bootstrap: {
      //  files: {
      //    'public/js/bootstrap.min.js': ['components/bootstrap/js/bootstrap-collapse.js',
      //                                   'components/bootstrap/js/bootstrap-scrollspy.js',
      //                                   'components/bootstrap/js/bootstrap-button.js',
      //                                   'components/bootstrap/js/bootstrap-affix.js']
      //  }
      //}
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
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  
  //grunt.registerTask('default', [ 'less', 'uglify', 'copy', 'exec:build' ]);
  //grunt.registerTask('deploy', [ 'default', 'exec:deploy' ]);
  
  grunt.registerTask('default', [ 'less', 'uglify', 'copy' ]);
  grunt.registerTask('deploy', [ 'default' ]);
};