'use strict';

module.exports = {
  seed: false,
  ip: process.env.IP || undefined,
  mongo: {
    uri: 'mongodb://serv2/photos-prod'
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
  port: 8083
};
