module.exports = function(grunt) {
	'use strict';

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		bowerrc: grunt.file.readJSON('.bowerrc'),
		credentials: grunt.file.readJSON('credentials.json'),
		path: {
			src: 'src',
			dist: 'dist',
			dev: '.dev',
			tmp: '.tmp',
			stagingForJekyll: '.staging-jekyll'
		},
		compass: {
			options: {
				sassDir: '<%= path.src %>/sass',
				importPath: '<%= path.src %>/bower_components/foundation/scss'
			},
			dev: {
				options: {
					outputStyle: 'expanded',
					cssDir: '<%= path.dev %>/css'
				}
			},
			dist: {
				options: {
					outputStyle: 'compressed',
					cssDir: '<%= path.stagingForJekyll %>/css'
				}
			}
		},
		modernizr: {
			devFile: '<%= path.src %>/bower_components/modernizr/modernizr.js',
			outputFile: '<%= path.stagingForJekyll %>/js/modernizr.js',
			files: ['!<%= bowerrc.directory %>/**']
		},
		jekyll: {
			options: {
				src: '<%= path.stagingForJekyll %>'
			},
			dev: {
				options: {
					dest: '<%= path.tmp %>/jekyll'
				}
			},
			dist: {
				options: {
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
			htmlInRoot: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: '*.html',
				dest: '<%= path.stagingForJekyll %>/'
			},
			tmpJekyll: {
				expand: true,
				cwd: '<%= path.tmp %>/jekyll/',
				src: '**',
				dest: '<%= path.dev %>/'
			},
			bower: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: 'bower_components/**',
				dest: '<%= path.dev %>/'
			},
			js: {
				expand: true,
				cwd: '<%= path.src %>/',
				src: 'js/**',
				dest: '<%= path.dev %>/'
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
			html: '<%= path.src %>/_layouts/default.html',
			options: {
				dest: '<%= path.stagingForJekyll %>'
			}
		},
		rev: {
			js: {
				src: '<%= path.stagingForJekyll %>/js/{,*/}*.js'
			},
			css: {
				src: '<%= path.stagingForJekyll %>/css/{,*/}*.css'
			},
			images: {
				src: '<%= path.stagingForJekyll %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
			}
		},
		usemin: {
			html: ['<%= path.stagingForJekyll %>/_layouts/default.html'],
			css: ['<%= path.stagingForJekyll %>/css/*.css'],
			options: {
				assetsDirs: ['<%= path.stagingForJekyll %>']
			}
		},
		connect: {
			options: {
				port: 8181,
				open: true,
				livereload: 35729
			},
			dev: {
				options: {
					base: '<%= path.dev %>'
				}
			},
			dist: {
				options: {
					base: '<%= path.dist %>'
				}
			}
		},
		watch: {
			sass: {
				files: '<%= path.src %>/sass/**',
				tasks: 'css:dev',
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			js: {
				files: '<%= path.src %>/js/**',
				tasks: 'js:dev',
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			html: {
				files: '<%= path.src %>/**/*.html',
				tasks: 'html:dev'
			},
			posts: {
				files: '<%= path.src %>/_posts/**',
				tasks: ['clean:staging_posts', 'clean:dev_posts', 'copy:posts']
			},
			siteData: {
				files: '<%= path.src %>/_data/**',
				tasks: 'copy:siteData'
			},
			jekyll: {
				files: '<%= path.stagingForJekyll %>/**',
				tasks: 'jekyll-dev',
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			}
		},
		humans_txt: {
			generate: {
				options: {
					content: pkg.humans,
					includeUpdateIn: 'site'
				},
				dest: '<%= path.dist %>/humans.txt'
			}
		},
		clean: {
			staging: '<%= path.stagingForJekyll %>',
			staging_css: '<%= path.stagingForJekyll %>/css/**',
			staging_js: '<%= path.stagingForJekyll %>/js/**',
			staging_html: '<%= path.stagingForJekyll %>/**/*.html',
			staging_posts: '<%= path.stagingForJekyll %>/_posts/**/*',
			dev_css: '<%= path.dev %>/css/**',
			dev_js: '<%= path.dev %>/js/**',
			dev_posts: {
				src: '<%= path.dev %>/*',
				filter: function (path) { // Directories named after years
					return grunt.file.isDir(path) && /\d{4}/.test(path);
				}
			},
			dev: '<%= path.dev %>',
			tmp: '<%= path.tmp %>',
			dist: '<%= path.dist %>'
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('css', function (target) {
		target = target || 'dist';

		if (target == 'dist') {
			grunt.task.run('clean:staging_css');
		} else {
			grunt.task.run('clean:dev_css');
		}

		grunt.task.run([
			'compass:' + target
		]);

		if (target == 'dist') {
			grunt.task.run('rev:css');
		}
	});

	grunt.registerTask('js', function (target) {
		target = target || 'dist';
		switch (target) {
			case 'dist':
				grunt.task.run([
					'clean:staging_js',
					'clean:tmp',
					'useminPrepare',
					'concat',
					'uglify',
					'modernizr',
					'rev:js'
				]);
				break;
			case 'dev':
				grunt.task.run([
					'clean:dev_js',
					'copy:js'
				]);
				break;
		}
	});

	grunt.registerTask('html', function (target) {
		grunt.task.run([
			'clean:staging_html',
			'copy:layouts',
			'copy:includes',
			'copy:posts',
			'copy:drafts',
			'copy:siteData',
			'copy:htmlInRoot',
			'replace'
		]);

		if (target == 'dist') {
			grunt.task.run('usemin');
		}
	});

	grunt.registerTask('jekyll-dev', [ // Jekyll destroys the destination, so we emulate a softer copy.
		'jekyll:dev',
		'copy:tmpJekyll'
	])

	grunt.registerTask('build', function (target) {
		target = target || 'dist';

		grunt.task.run('clean');

		switch (target) {
			case 'dist':
				grunt.task.run([
					'css:dist',
					'js:dist',
					'html:dist',
					'jekyll:dist',
					'humans_txt'
				]);
				break;
			case 'dev':
				grunt.task.run([
					'css:dev',
					'js:dev',
					'html:dev',
					'jekyll-dev',
					'copy:bower'
				]);
				break;
		}
	});

	grunt.registerTask('server', function (target) {
		target = target || 'dev';
		if (target == 'dev')
			grunt.task.run(['build:dev', 'connect:dev', 'watch']);
		else
			grunt.task.run(['build:dist', 'connect:dist:keepalive']);
	});
};
