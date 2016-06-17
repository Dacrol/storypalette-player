angular.module('sp.player.common.playerAppApiNative', [
])

.factory('playerAppApi', function($q) {
  console.log('Using playerAppApiNative');

  var ipc = require('ipc');            

  return {
    getCredentials: function() {
      return ipc.sendSync('getCredentials');
    },
    dmxMessage: function(value) {
      ipc.send('dmxMessage', value); 
    },
    startDmx: function(room) {
      ipc.send('startDmx', room); 
    },
    stopDmx: function() {
      ipc.send('stopDmx'); 
    }
  };
})
;

