describe('sp.player.common.config', function() {

  beforeEach(module('sp.player.common.config'));

  describe('config constant', function() {
    var config;

    beforeEach(inject(function(_config_) {
      config = _config_;
    }));

    it('should be defined', function() {
      expect(config).toBeDefined();
    });

  });

});  

