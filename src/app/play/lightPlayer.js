angular.module('sp.player.play.lightPlayer', [])

.factory('lightPlayer', function() {
    // connect to socket server
  //var room = room;
  var dmxSocket;

  return {
    init: function(room) {
      console.log('connecting to dmxplayer...');
      dmxSocket = io('http://localhost:8891');
      dmxSocket.on('connect', function() {
        console.log('connected to dmxplayer!');
        dmxSocket.emit('init', {room: room});
      });
    
    },
    play: function(value) {
      console.log('lightPlayer.play() colour', value.colour);  
      dmxSocket.emit('onValueUpdate', value);
    },
    reset: function() {
      console.log('emit reset');
      dmxSocket.emit('reset');  
    }
  };
})
;

