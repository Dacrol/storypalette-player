angular.module('sp.player', [
  'templates-app',
  'templates-common',
  'templates-shared',

  'sp.player.waiting',
  'sp.player.play',

  'sp.player.common.config',
  'sp.player.common.playerApp',

  'uiAuth', 
  'spUtils', 
  'spConnection', 

  'ui.router',
  'ui.bootstrap'
])

.config(function($locationProvider, $urlRouterProvider, config, authProvider, $stateProvider, authConfigProvider) {
  // Route configuration
  $locationProvider.html5Mode(true);  // no hash-urls

  // Redirect to connecting state.
  $urlRouterProvider.when('/', '/waiting');

  // Abstract state for different access levels
  $stateProvider.state('user', {
    abstract: true,
    template: '<ui-view/>',
    resolve: {
      user: function(playerApp, auth) {
        var credentials = playerApp.getCredentials(); 
        if (credentials) {
          return auth.login(credentials.username, credentials.password); 
        } else {
          return auth.requireUser(); 
        }
      },
      socket: function(user, connection, utils, auth) {
        var ns = utils.getSocketNamespace(user);
        var room = user.roomId;
        var token = auth.getToken(); 
        return connection.requireRoomConnection(ns, room, token);
      }
    }
  });

  authConfigProvider.setTokenKey('spPlayerToken'); 
  authConfigProvider.setApiBase(config.apiBase); 
})

.run(function($rootScope) {
  $rootScope.$on('$stateChangeError', 
function(event, toState, toParams, fromState, fromParams, error){ 
    console.warn('$stateChangeError', error); 
  });
})

.controller('AppCtrl', function() {
})
;
// TODO: Temp fix for karma.
window.env = window.env || {};
