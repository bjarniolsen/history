module.exports = function(grunt) {
	grunt.initConfig({
		less: {
  	  	  development: {
    		options: {
      	  	  //compress: true,
      	  	  //yuicompress: true,
      	  	  //optimization: 2
    		},
    		files: {
      	  	  // target.css file: source.less file
      	  	  "static/css/main.css": "static/css/main.less"
    		}
  	  	  }
		},
		concat: {
			dist: {
				src: ['static/js/vendor/jquery-2.1.1.js', 'static/js/main.js', 'static/js/plugins.js'],
				dest: 'static/js/dist/build.js',
			}
		},
		uglify: {
			dist: {
				files: {
					'static/js/dist/build.min.js': ['static/js/dist/build.js']
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			styles: {
				files: ['static/css/**/*.less'], // which files to watch
				tasks: ['less']
			},
			scripts: {
    			files: ['static/js/*.js'],
    			tasks: ['concat', 'uglify']
			} 
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
};

/*
 * Put this in the bottom of your HTML file to make livereload work 
 * on your phone.
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></'
+ 'script>')</script>
 */
