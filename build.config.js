// Configuration for the build process.
module.exports = {
  // Compile to this folder during development.
  build_dir: 'build',

  // Minified code is deployed here.
  compile_dir: 'dist',

  // Our application code.
  app_files: {
    js: ['src/**/*.js', '!src/**/*.spec.js'],
    jsunit: ['src/**/*.spec.js'],
    atpl: ['src/app/**/*.tpl.html'],
    ctpl: ['src/common/**/*.tpl.html'],
    html: ['src/index.html'],
    less: 'src/less/main.less'
  },

  // Files used during testing only.
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/lodash/dist/lodash/js'
    ]
  },

  // Stuff in `vendor` directory to be used in the build process.
  vendor_files: {
    js: [
      'vendor/lodash/dist/lodash.js',
      'vendor/angular/angular.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
    ],
    css: [],
  },

  // Externally shared files.
  // A bit hacky as the template requires full url while
  // the js paths start from shared_dir.
  // At some point we might do in-house bower repos.
  shared_dir: '../storypalette-editor',

  // Used for renaming the module.
  shared_tpl_base: '../storypalette-editor/src/common/',

  shared_files: {
    js: [
      // Uses shared_dir
      ['src/common/uiSocket/**/*.js', '!src/common/uiSocket/**/*.spec.js'],
      ['src/common/uiUtils/**/*.js', '!src/common/uiUtils/**/*.spec.js'],
      ['src/common/uiAuth/**/*.js', '!src/common/uiAuth/**/*.spec.js']
    ],
    tpl: [
      // Full path from '.'
      '../storypalette-editor/src/common/uiAuth/**/*.tpl.html'
      //'src/common/security/login/form.tpl.html'
    ]
  }
};
