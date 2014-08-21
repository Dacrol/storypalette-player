angular.module('sp.player.common.playerAppApiMock', [
])

.factory('playerAppApi', function($q) {
  console.log('Using playerAppApiMock');
  return {
    getCredentials: function() {
      return null; 
    }
  };
})
;
