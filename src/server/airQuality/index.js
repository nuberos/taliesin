'use strict';
const mockdata = require('./mockdata.json');
const http = require('http');
const clientName = 'airQuality';

module.exports = class AirQualityClient {
  constructor(config) {
    //this.config = config;
    this.config =  config.clients.find((c) => c.name === clientName);
    this.handler = this.loadHandler();
  }

  load() {
    return this.handler();
  }

  loadFromUrl() {
    console.log('not yet implemented');
  }

  loadFromFile() {
    return mockdata;
  }

  loadHandler() {   
    var type = this.config.type;
    var handler;
    switch (type) {
      case 'file':
        handler = this.loadFromFile;
        break;
      case 'url':
        handler = this.loadFromUrl;
        break;
      default:
        console.log(`Config error, could not load handler for: ${type}`);
        handler = this.loadFromFile;
    }
    return handler;
  }
}
