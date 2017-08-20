'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server();
server.connection({port: 3000, host: 'localhost'});

server.register([require('vision'),require('inert')], (err) => {

    if(err) {
      console.log(`an error happened while registering vision plugin: ${err}`);
      throw err;
    }
    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo:  __dirname,
      path: 'templates',
      partialsPath: 'partials',
      helpersPath: 'helpers'
    });

    server.route({
      method: 'GET',
      path: '/static/{filename*}',
      handler: {
        directory: {
          path: 'dist',
          lookupCompressed: true,
          listing:true
        }
      }
    });
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.view('index');
  }
});

server.start((err) => {
  if(err) {
    console.log(`an error happened while starting hapi server ${err}`);
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
