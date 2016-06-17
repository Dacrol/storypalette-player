angular.module('sp.player.common.palettes', [
  'sp.player.common.config' 
])

.factory('palettes', function($http, config) {
  var apiBase = config.apiBase + 'palettes/'; // http://api.storypalette.net/palettes

  // Public API
  return {
    all: function() {
      return $http.get(apiBase).then(function(response) {
        return response.data;
      });
    },

    // Returns a promise
    // TODO: Clean up
    one: function(id) {
      // TODO: what is returned here?
      return $http.get(apiBase + id)
        .then(function (response) {
          return response.data;
        })
        .then(function(rawPalette) {
          // Create empty value for all assets
          angular.forEach(rawPalette.assets, function(asset) {
            asset.value = {raw: 0};
          });
          return rawPalette;
        });
    }

  };
})
;
