const productionConfig = {
  //apiBase: 'http://api.storypalette.net/v1/',
  //socketBase: 'http://api.storypalette.net/',
  apiBase: 'https://server.storypalette.se/v1/',
  socketBase: 'https://server.storypalette.se/',
  environment: 'production',
  port: 8881,
};

const developmentConfig = {
  apiBase: 'http://localhost:8880/v1/',
  socketBase: 'http://localhost:8880/',
  environment: 'local',
  port: 8881,
}

const config = (process.env.NODE_ENV === 'development') ? developmentConfig : productionConfig;

module.exports = config;
