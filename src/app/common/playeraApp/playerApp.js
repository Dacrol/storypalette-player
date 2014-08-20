angular.module('sp.player.common.playerApp', [
  // playerAppNative or playerAppMock is added below
])

// mooApi service is either mooApiBrowser or mooApiNative.
.factory('playerApp', function(playerAppApi) {
  return playerAppApi;
})
;

// Include the correct playerApp module for browser/native environment.
try {
  var ipc = require('ipc');            
  // If we get here we are running in atom-shell player-app.
  angular.module('sp.player.common.playerApp').requires.push('sp.player.common.playerAppApiNative');
} catch (e) {
  // If we get here we are running in web browser.
  angular.module('sp.player.common.playerApp').requires.push('sp.player.common.playerAppApiMock');
}
