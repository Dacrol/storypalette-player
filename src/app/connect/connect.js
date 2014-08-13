angular.module('sp.player.connect', [
  'uiAuth',
  'uiSocket', 
  'uiAuth', 
  'uiUtils', 
  'ui.router',
])

.config(function($stateProvider, authProvider, socketProvider) {
  $stateProvider.state('connect', {
    url: '/connect',
    templateUrl: 'connect/connect.tpl.html',
    controller: 'ConnectCtrl',
    resolve: {
      user: authProvider.requireUser,
      socketInfo: function(user, socket, utils, auth) {
        var ns = utils.getSocketNamespace(user);
        var room = utils.getSocketRoom(user);
        var token = auth.getToken(); 
        return socketProvider.requireAuthenticatedConnection(socket, ns, room, token);
      }
    }
  });
})

// Waiting for palette
.controller('ConnectCtrl', function($scope, socket, $location, user) {
    console.log('ConnectCtrl');

    $scope.user = user;
    console.log('Player-user', user, 'logged in.');

    socket.on('onRequestPalette', function(paletteId) {
      console.log('requestPalette', paletteId);
      $location.path('/play/' + paletteId);
    });
})
;
