'use strict';

var clientConfig = function(context) {
  var config = {
    geojson: context.data.root.geojson
  };
  return JSON.stringify(config);
};

module.exports = clientConfig;
