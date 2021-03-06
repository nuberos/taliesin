'use strict';

const Hapi = require('hapi');
const Path = require('path');
const Config = require('./config');
const AirQualityClient = require('./airQuality');

const server = new Hapi.Server();
const config = Config('/');
const airQualityClient = new AirQualityClient(config);

server.connection({port: 3000, host: 'localhost'});

server.register([require('vision'),require('inert')], (err) => {

    if(err) {
      console.log(`an error happened while registering vision plugin: ${err}`);
      throw err;
    }
    server.views({
      engines: {
        hbs: require('handlebars')
      },
      relativeTo:  __dirname,
      path: './templates',
      partialsPath: './partials',
      layoutPath: './layouts',
      layout: 'default',
      helpersPath: './helpers',
      context: config
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

    var data = airQualityClient.load();
    //console.dir(data);
    reply.view('index',data);
  }
});

server.route({
  method: 'GET',
  path: '/docs/airquality',
  handler: function (request, reply) {
    reply.view('airquality');
  }
});

server.route({
  method: 'GET',
  path: '/docs/how',
  handler: function (request, reply) {
    reply.view('how');
  }
});

server.route({
  method: 'GET',
  path: '/get-involved',
  handler: function (request, reply) {
    reply.view('getInvolved');
  }
});

server.route({
  method: 'GET',
  path: '/downloads',
  handler: function (request, reply) {
    reply.view('downloads');
  }
});

server.start((err) => {
  if(err) {
    console.log(`an error happened while starting hapi server ${err}`);
    throw err;
  }
  console.log(`Server running at: ${server.info.uri} with config: ${JSON.stringify(config)}`);
});
