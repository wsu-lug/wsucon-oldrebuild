module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bowerrc: grunt.file.readJSON('.bowerrc'),
		credentials: grunt.file.readJSON('credentials.json'),
		path: {
			src: 'src',
			dist: 'dist',
			tmp: '.tmp',
			stagingForJekyll: '.staging-jekyll'
		},
		compass: {
			options: {
				sassDir: '<%= path.src %>/sass',
				cssDir: '<%= path.stagingForJekyll %>/css',
				require: 'zurb-foundation'
			},
			development: {
				options: {
					outputStyle: 'expanded'
				}
			},
			production: {
				options: {
					outputStyle: 'compressed'
				}
			}
		},
		modernizr: {
			devFile: '<%= path.src %>/bower_components/modernizr/modernizr.js',
			outputFile: '<%= path.stagingForJekyll %>/js/modernizr.js',
			files: ['!<%= bowerrc.directory %>/**']
		},
		jekyll: {
			build: {
				options: {
					src: '<%= path.stagingForJekyll %>',
					dest: '<%= path.dist %>'
				}
			}
		},
		copy: {
			layouts: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '_layouts/**',
				dest: '<%= path.stagingForJekyll %>/'
			},
			includes: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '_includes/**',
				dest: '<%= path.stagingForJekyll %>/'
			},
			posts: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '_posts/**',
				dest: '<%= path.stagingForJekyll %>/'
			},
			drafts: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '_drafts/**',
				dest: '<%= path.stagingForJekyll %>/'
			},
			siteData: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '_data/**',
				dest: '<%= path.stagingForJekyll %>/'
			},
			index: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '*.html',
				dest: '<%= path.stagingForJekyll %>/'
			}
		},
		replace: {
			analytics: {
				options: {
					patterns: [
						{
							match: 'googleAnalyticsTrackingID',
							replacement: '<%= credentials.googleAnalyticsTrackingID %>'
						}
					]
				},
				files: [
					{
						src: '<%= path.stagingForJekyll %>/_includes/google-analytics.html',
						dest: './'
					}
				]
			}
		},
		useminPrepare: {
			html: '<%= path.stagingForJekyll %>/_layouts/default.html',
			options: {
				dest: '<%= path.stagingForJekyll %>'
			}
		},
		rev: {
			dist: {
				files: {
					src: [
						'<%= path.stagingForJekyll %>/js/{,*/}*.js',
						'<%= path.stagingForJekyll %>/css/{,*/}*.css',
						'<%= path.stagingForJekyll %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
					]
				}
			}
		},
		usemin: {
			html: ['<%= path.stagingForJekyll %>/_layouts/default.html'],
			css: ['<%= path.stagingForJekyll %>/css/*.css'],
			options: {
				assetsDirs: ['<%= path.stagingForJekyll %>']
			}
		},
		watch: {
			options: {
				atBegin: true,
				cwd: '<%= path.src %>'
			},
			css: {
				files: 'sass/**',
				tasks: 'compass:development'
			},
			jekyll: {
				files: ['<%= path.stagingForJekyll %>/**'],
				tasks: 'jekyll:build',
				options: {
					livereload: true
				}
			}
		},
		clean: {
			staging: '<%= path.stagingForJekyll %>',
			tmp: '<%= path.tmp %>',
			dist: '<%= path.dist %>'
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', function (environment) {
		grunt.task.run([
			'clean',
			'compass:' + (environment || 'production'),
			'copy',
			'replace',
			'useminPrepare',
			'concat',
			'uglify',
			'modernizr',
			'rev',
			'usemin',
			'jekyll:build'
		]);
	});

	grunt.registerTask('test-build', ['useminPrepare', 'usemin']);
};
