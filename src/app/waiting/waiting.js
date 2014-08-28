angular.module('sp.player.waiting', [
  'ui.router'
])

.config(function($stateProvider) {
  $stateProvider.state('user.waiting', {
    url: '/waiting',
    templateUrl: 'waiting/waiting.tpl.html',
    controller: 'WaitingCtrl'
  });
})

// Waiting for palette.
.controller('WaitingCtrl', function($scope, socket, $location, user) {
    $scope.user = user;
    $scope.room = _.find(user.organisation.rooms, {id: user.roomId}); 

    socket.on('onRequestPalette', function(paletteId) {
      console.log('onRequestPalette', paletteId);
      $location.path('/play/' + paletteId);
    });
})
;
