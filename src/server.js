const Hapi = require('hapi');
const Routes = require('../routes/index');
const Models = require('../models');

const server = new Hapi.Server();

server.connection({ port: 8004, host: 'localhost' });
Models.books.destroy({
  truncate: true,
});
server.route(Routes);

server.start((err) => {
  if (err) {
    console.log(err);
  }

  console.log('Server running at:', server.info.uri);
});
module.exports = server;
