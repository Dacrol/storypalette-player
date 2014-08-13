angular.module('sp.player.connect', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider.state('user.connect', {
    url: '/connect',
    templateUrl: 'connect/connect.tpl.html',
    controller: 'ConnectCtrl'
  });
})

// Waiting for palette
.controller('ConnectCtrl', function($scope, socket, $location, user) {
    console.log('ConnectCtrl', user.username);

    $scope.user = user;

    socket.on('onRequestPalette', function(paletteId) {
      console.log('requestPalette', paletteId);
      $location.path('/play/' + paletteId);
    });
})
;
