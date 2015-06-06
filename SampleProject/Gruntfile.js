module.exports = function (grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    tsd: {
        refresh: {
            options: {
                command: 'reinstall',
                config: 'tsd.json',
            }
        }
    },
    less: {
      development: {
        compress: false,
        files: {
          'Assets/style.css' : 'Assets/style.less'
        }
      }
    },
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'Views',
            src: ['**/*.jsx'],
            dest: 'Views',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      dist: {
        src: ['Views/*.js'],
        dest: 'Generated/views.js',
      },
    },
    jsxtyper: {
      'Generated/ViewDefs.ts': ['Views/*.jsx']
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-tsd');
  grunt.loadNpmTasks('grunt-jsxtyper');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
    
  // Default tasks
  grunt.registerTask('default', ['tsd', 'react', 'less', 'concat', 'jsxtyper']);
};
