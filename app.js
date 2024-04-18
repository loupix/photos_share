//Définition des modules
const express = require("express")
const mongoose = require("mongoose")
const chalk = require('chalk')
const config = require('./config/environment')

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.set('useFindAndModify', false);

if (config.seed) {require('./config/seed');}

const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server, { serveClient: true });
// require('./config/sockets.js')(socket);

require('./config/express.js')(app);

// Routes

app.use('/api/photos', require('./routes/photos.js'));
app.use('/api/albums', require('./routes/albums.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/friends', require('./routes/friends.js'));
app.use('/api/requests', require('./routes/requests.js'));
app.use('/api/admin', require('./routes/admin.js'));
app.use('/', require('./routes/index.js'));

server.listen(config.port, config.ip, function () {

  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

});

module.exports = server;