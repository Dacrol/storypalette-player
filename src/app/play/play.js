angular.module('sp.player.play', [
  'sp.player.play.lightPlayer',

  'sp.player.common.palettes',

  'uiImagePlayer', 
  'uiAudioPlayer',

  'ui.router'
])

.config(function($stateProvider) {

  $stateProvider.state('user.play', {
    url: '/play/:paletteId',
    templateUrl: 'play/play.tpl.html',
    controller: 'PlayCtrl',
    resolve: {
      palette: function(palettes, $stateParams) {
        var paletteId = $stateParams['paletteId'];
        return palettes.one(paletteId).then(function(palette) {
          return palette;  // not really used
        });
      }
    }
  });
})

.controller('PlayCtrl', function($scope, $state, $location, socket, audioPlayer, imagePlayer, lightPlayer, palette, config, user) {
  console.log('\n**** PlayCtrl ****');

  var resetPlayers = function() {
    audioPlayer.reset();
    imagePlayer.reset();
    //initProgress();
  };

  var room = _.find(user.organisation.rooms, {id: user.roomId});
  lightPlayer.init(room);

  $scope.progress = {
    audio: {done: true},
    image: {done: true},
    done: true
  };

  // Palette is loaded when page is loaded
  $scope.palette = palette; // Palettes.getPalette();
  //initProgress();

  // Send palette to performer
  socket.emit('activePalette', $scope.palette);

  // Incoming request from Performer
  socket.on('onRequestPalette', function(paletteId) {
    console.log('PlayCtrl.onRequestPalette: Get palette ', paletteId);

    // Performer wants us to switch to another palette
    if ($scope.palette._id === paletteId) {
      console.log('Requested palette already playing, just send it to Performer');
      socket.emit('activePalette', $scope.palette);

      //$location.path('/play/' + paletteId);
      //$route.reload();
    } else {
      console.log('New palette requested, goto new url');
      // Change location to refresh the route and load the new palette
      socket.emit('activePalette', $scope.palette);

      disconnect();
      $location.path('/play/' + paletteId);
    }
  });
  
  var disconnect = function() {
    resetPlayers();
    socket.removeAllListeners();  // Avoid duplicate event listeners
  };

  $scope.$on('$destroy', function() {
    console.log('playCtrl scope destroyed');
  });

  // Performer disconnected.
  socket.on('onDisconnect', function(numClientsLeft) {
    console.log('performer disconnected'); 
    disconnect(); 
    $state.go('user.waiting');
  });

  imagePlayer.on(['add','progress'], function(progress) {
    $scope.progress.image = progress;
    $scope.progress.image.style = {width: ($scope.progress.image.loaded / $scope.progress.image.count * 100) + '%'};
    $scope.progress.done = $scope.progress.image.done && $scope.progress.audio.done;

    if (!$scope.$$phase) {
      $scope.$apply();
    }            
  });

  audioPlayer.on(['add','progress'], function(progress) {
    //console.log("Audio progress: ", $scope.progress.audio);
    $scope.progress.audio = progress;
    $scope.progress.audio.style = {width: ($scope.progress.audio.loaded / $scope.progress.audio.count * 100) + '%'};
    $scope.progress.done = $scope.progress.image.done && $scope.progress.audio.done;

    if ($scope.progress.audio.done) {
      //audioPlayer.printSounds();
    }

    if (!$scope.$$phase) {
      $scope.$apply();
    }            
  });

  // Preload images
  imagePlayer.preloadPaletteImages($scope.palette, config.apiBase);

  $scope.valueUpdate = false;
  $scope.imageOpacity = {};

  // Palette.value has been updated by Performer
  socket.on('onValueUpdate', function (data) {
    //console.log('PlayCtrl.onValueUpdate: ', data);
    if (data.assetId === null) {
      return;
    }

    $scope.valueUpdate = true;
    var asset = $scope.palette.assets[data.assetId];
    asset.value = data.value;

    switch(asset.type) {
      case 'image':
        $scope.imageOpacity = {'opacity': asset.value.opacity};

        //$scope.imageClass = asset.value.visible ? 'show' : 'hide';
        $scope.imageUrl = imagePlayer.getImageUrl(asset, config.apiBase);
        break;
      case 'sound':
        if (asset.value.state === 'stopped') {
          audioPlayer.stop(data.assetId);
        } else if (asset.value.state === 'playing') {
          audioPlayer.play(data.assetId);
        } else {
            //console.log('Unknown sound state');
        }

        if (typeof asset.value.volume !== 'undefined') {
          audioPlayer.setVolume(data.assetId, asset.value.volume);
        }
        break;
      case 'light':
        lightPlayer.play(asset.value);
        break;
    }
  });

  // These should move to services
  var getSoundUrl = function(asset) {
    var url = config.apiBase + 'sound/' + asset.source.id + '.' + asset.source.extension;
    return url;
  };

  // Setup sounds
  for (var i = 0;i < $scope.palette.assets.length;i++){
    var asset = $scope.palette.assets[i];
    if (asset.type === 'sound')  {
      var options = {};
      options.loop = asset.loop || false;
      options.autoplay = options.loop; // autostart looping sounds
      options.volume = options.loop ? 0.0 : 0.9;  // start
      audioPlayer.newSound(i, getSoundUrl(asset), options);

      // TODO: Hack, it doesn't work to pass 0.0 as volume on creation
      if (options.loop) {
         audioPlayer.setVolume(i, 0.0);
      }
    }
  }

});
