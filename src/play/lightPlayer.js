angular.module('sp.player.play.lightPlayer', [
  'sp.player.common.playerApp',
])

// Handles connection to dmxplayer
// TODO: Remove all socket communication when all customers have upgraded to new player-app
.factory('lightPlayer', function(playerApp) {
  var dmxSocket;

  return {
    init: function(room) {
      // For new player-app that uses ipc 
      playerApp.startDmx(room);

      // Old player app uses sockets
      /* TODO: Make backwards compatible?
      console.log('lightPlayer: Connecting to dmxplayer...');
      dmxSocket = io('http://localhost:8891', {forceNew: true});

      dmxSocket.on('connect', function() {
        console.log('lightPlayer: Connected to dmxplayer');
        dmxSocket.emit('init', {room: room});
      });
      */
    
    },
    play: function(value) {
      //console.log('lightPlayer: colour', value.colour);  
      
      // TODO: Old player
      //dmxSocket.emit('onValueUpdate', value);

      // For new player-app
      playerApp.dmxMessage(value);
    },
    reset: function() {
      console.log('lightPlayer: Reset --> Disonnect');
      if (dmxSocket) {
        dmxSocket.disconnect();
        dmxSocket = null;
      }

      // For new player-app
      playerApp.stopDmx();
    }
  };
})
;

