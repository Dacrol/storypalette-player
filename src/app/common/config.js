angular.module('sp.player.common.config', [])

.constant('config', {
  version: {
    number: '0.6.0',
    name: 'Red Eyes Player UI'
  },
  // TODO: Make apiBase depend on environment!
  apiBase: 'http://api.storypalette.dev:8888/v1/',
})
;
