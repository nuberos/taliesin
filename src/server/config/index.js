'use strict';

const Confidence = require('confidence');
const config     = require('./config.json');

const re = /^\w+/;
var store = new Confidence.Store();
//loads and validates config
store.load(config);
var criteria = {
  env: process.env.NODE_ENV
};

function parseKey(key) {
    if(!key) {
      key = '/';
    }
    if(re.test(key)) {
        key = '/' +  key;
    }
    return key;
}

module.exports = function(key) {
    var secureKey = parseKey(key);
    return store.get(secureKey,criteria);
}
