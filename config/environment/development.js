'use strict';

module.exports = {
  seed: true,
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'mongodb://serv2/photos-dev'
  },

  mail: {
    sender:"monalbumphotosnet@gmail.com",
    server:{
/*      host: "smtp.gmail.com",
      port: 465,
      secure: true,*/
      service:"gmail",
      tls: {rejectUnauthorized: false},
      auth:{
        user: "monalbumphotosnet@gmail.com",
        pass: "albumphotos"
      }
    }
  },

  port:9000

};
