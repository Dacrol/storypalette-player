import 'angular';
import './play/play.js';
import './waiting/waiting.js';
import './common/palettes.js';
import './common/config.js';
import playerApp from './common/playerApp/playerApp.js';
import uiAuth from './common/uiAuth/index.js';
import uiProfile from './common/uiProfile/uiProfile.js'
import spUtils from './common/spUtils/utils.js';
import uirouter from 'angular-ui-router';
import './common/spConnection/connection.js';
import uiBootstrap from 'angular-ui-bootstrap';

import 'bootstrap/less/bootstrap.less';
import './less/main.less';

angular.module('sp.player', [
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
        console.log('user', user);
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
