angular.module('sp.player', [
  'templates-app',
  'templates-common',
  'templates-shared',

  'sp.player.connect',
  'sp.player.play',
  'sp.player.common.config',

  'uiAuth', 

  'ui.router',
  'ui.bootstrap'
])

.config(function($locationProvider, $urlRouterProvider, config, authConfigProvider) {
  // Route configuration
  $locationProvider.html5Mode(true);  // no hash-urls

  // Redirect to connecting state.
  $urlRouterProvider.when('/', '/connect');

  authConfigProvider.setTokenKey('spPlayerToken'); 
  authConfigProvider.setApiBase(config.apiBase); 

})

.controller('AppCtrl', function() {
})
;
