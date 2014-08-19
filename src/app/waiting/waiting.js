angular.module('sp.player.waiting', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider.state('user.waiting', {
    url: '/waiting',
    templateUrl: 'waiting/waiting.tpl.html',
    controller: 'WaitingCtrl',
    
  });
})

// Waiting for palette
.controller('WaitingCtrl', function($scope, socket, $location, user) {
    console.log('WaitingCtrl', user.username);

    $scope.user = user;

    socket.on('onRequestPalette', function(paletteId) {
      console.log('requestPalette', paletteId);
      $location.path('/play/' + paletteId);
    });
})
;
