angular.module('sp.player.common.playerAppApiMock', [
])

.factory('playerAppApi', function($q) {
  console.log('Using playerAppApiMock');

  return {
    getCredentials: function() {
      return null; 
    },
    dmxMessage: function(value) {
      console.log('playerAppApiMock.dmxMessage', value); 
    },
    startDmx: function(room) {
      console.log('playerAppApiMock.startDmx', room); 
    },
    stopDmx: function() {
      console.log('playerAppApiMock.stopDmx'); 
    }
  };
})
;
