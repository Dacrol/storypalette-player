//import playerAppApiMock from './playerAppApiMock';
//import playerAppApiNative from './playerAppApiNative';

angular.module('sp.player.common.playerApp', [
  // playerAppNative or playerAppMock is added below
])

// mooApi service is either mooApiBrowser or mooApiNative.
.factory('playerApp', function(playerAppApi) {
  return playerAppApi;
})
;

// Include the correct playerApp module for browser/native environment.
// TODO: Fix conditional require!
// TODO: Now this only works in Electron
//try {
  var {ipcRenderer} = require('electron');            
  require('./playerAppApiNative');
  // If we get here we are running in atom-shell player-app.
  angular.module('sp.player.common.playerApp').requires.push('sp.player.common.playerAppApiNative');
//} catch (e) {
  // If we get here we are running in web browser.
  //require('./playerAppApiMock');
  //angular.module('sp.player.common.playerApp').requires.push('sp.player.common.playerAppApiMock');
//}
