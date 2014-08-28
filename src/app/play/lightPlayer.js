angular.module('sp.player.play.lightPlayer', [])

// Handles connection to dmxplayer
.factory('lightPlayer', function() {
    // connect to socket server
  //var room = room;
  var dmxSocket;

  return {
    init: function(room) {
      console.log('lightPlayer: Connecting to dmxplayer...');
      dmxSocket = io('http://localhost:8891', {forceNew: true});

      dmxSocket.on('connect', function() {
        console.log('lightPlayer: Connected to dmxplayer');
        dmxSocket.emit('init', {room: room});
      });
    
    },
    play: function(value) {
      //console.log('lightPlayer: colour', value.colour);  
      dmxSocket.emit('onValueUpdate', value);
    },
    reset: function() {
      console.log('lightPlayer: Reset');
      if (dmxSocket) {
        dmxSocket.disconnect();
        dmxSocket = null;
      }
    }
  };
})
;

