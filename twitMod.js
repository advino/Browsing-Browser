let twitMod = {
  Twit: require('twit'),
  config: require('./config.js')
};

twitMod.T = new twitMod.Twit(twitMod.config);

 module.exports = twitMod;
