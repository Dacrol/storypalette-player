angular.module('sp.player.common.playerAppApiNative', [
])

.factory('playerAppApi', function() {
  console.log('Using playerAppApiNative');

  var {ipcRenderer} = require('electron');            

  return {
    getCredentials: function() {
      return ipcRenderer.sendSync('getCredentials');
    },
    dmxMessage: function(value) {
      ipcRenderer.send('dmxMessage', value); 
    },
    startDmx: function(room) {
      ipcRenderer.send('startDmx', room); 
    },
    stopDmx: function() {
      ipcRenderer.send('stopDmx'); 
    }
  };
})
;

