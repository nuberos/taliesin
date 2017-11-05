'use strict';

var clientConfig = function(context) {
  var config = {
    geojson: context.data.root.geojson,
    districts: context.data.root.districts,
    pollutants: context.data.root.pollutants
  };  
  const cfg = JSON.stringify(config);
  console.dir(cfg);
  return cfg;
};

module.exports = clientConfig;
