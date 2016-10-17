import './lightPlayer.js';
import '../common/uiImagePlayer/imagePlayer.js';
import '../common/uiAudioPlayer/audioPlayer.js';
import template from './play.tpl.html';

// TODO: Get rid of underscore!
import _ from 'underscore';

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
    templateUrl: template,
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
  var resetPlayers = function() {
    audioPlayer.reset();
    imagePlayer.reset();
    lightPlayer.reset();
  };

  var disconnect = function() {
    resetPlayers();
    socket.removeAllListeners();  // Avoid duplicate event listeners
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

  // Send palette to performer
  socket.emit('activePalette', $scope.palette);

  // Incoming request from Performer
  socket.on('onRequestPalette', function(paletteId) {
    console.log('PlayCtrl.onRequestPalette:', paletteId);

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
  

  $scope.$on('$destroy', function() {
    disconnect();
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
  socket.on('onValueUpdate', function(data) {
    if (data.assetId === null) {
      return;
    }


    $scope.valueUpdate = true;
    var asset = $scope.palette.assets[data.assetId];
    asset.value = data.value;

    //console.log('data', data, 'asset', asset);

    switch(asset.type) {
      case 'image':
        $scope.imageOpacity = {'opacity': asset.value.opacity};

        //$scope.imageClass = asset.value.visible ? 'show' : 'hide';
        $scope.imageUrl = imagePlayer.getImageUrl(asset, config.apiBase);
        //$scope.imageUrl = 'http://storypalette.imgix.net/e699ea984be3f76cc9140190bfa14370.jpg';
        console.log('Show image', $scope.imageUrl);
        break;
      case 'sound':
        var id = getSoundUrl(asset);
        if (asset.value.state === 'stopped') {
          audioPlayer.stop(id);
        } else if (asset.value.state === 'playing') {
          audioPlayer.play(id);
        } 
        if (typeof asset.value.volume !== 'undefined') {
          audioPlayer.setVolume(id, asset.value.volume);
        }
        break;
      case 'light':
        lightPlayer.play(asset.value);
        break;
    }
  });

  // These should move to services
  var getSoundUrl = function(asset) {    
    return config.apiBase + 'sound/' + asset.source.id + '/' + asset.source.extension;
  };

  // Setup sounds
  _.each($scope.palette.assets, function(asset) {
    if (asset.type === 'sound')  {
      var url = getSoundUrl(asset);
      var options = {};
      options.format = asset.source.extension;
      options.loop = asset.loop || false;
      options.autoplay = options.loop; // autostart looping sounds
      options.volume = options.loop ? 0.0 : 0.9;  // start
      audioPlayer.newSound(url, options);

      // TODO: Hack, it doesn't work to pass 0.0 as volume on creation
      if (options.loop) {
         audioPlayer.setVolume(url, 0.0);
      }
    }
  });

});
