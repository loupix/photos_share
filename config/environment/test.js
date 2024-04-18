'use strict';

module.exports = {
  seed: false,
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'mongodb://serv2/photos-test'
  }
};
