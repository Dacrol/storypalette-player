angular.module('sp.player.common.config', [])

.constant('config', {
  version: {
    number: '0.6.0',
    name: 'Red Eyes Player UI'
  },
  environment: window.env.environment || 'local',
  apiBase: window.env.apiBase
})
;
