'use strict';

var initialState = function(context) {
  var state = {      
    statisticsData: context.data.root.statisticsData,
    temporalEvolution: context.data.root.temporalEvolution,
    geoData: context.data.root.geoData
  };
  return JSON.stringify(state);
};

module.exports = initialState;
