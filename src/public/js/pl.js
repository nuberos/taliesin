/*Skip to content
Features
Business
Explore
Marketplace
Pricing
This repository
Search
Sign in or Sign up
 Watch 2  Star 34  Fork 28 scottcheng/bj-air-vis
 Code  Issues 0  Pull requests 0  Projects 0  Insights
Branch: gh-pages Find file Copy pathbj-air-vis/air-vis.js
e064ec1  on 3 Jan 2013
@scottcheng scottcheng removed redundant line
1 contributor
RawBlameHistory
896 lines (804 sloc)  23.3 KB
var vis = function(data) {
  var POLLUTANTS = ['no2', 'so2', 'pm2_5', 'pm10'];
  var textPollutant = (function() {
    var mapping = {
      all: 'All',
      no2: 'NO2',
      so2: 'SO2',
      pm2_5: 'PM2.5',
      pm10: 'PM10'
    };
    return function(codename) {
      return mapping[codename];
    };
  })();
  var htmlPollutant = (function() {
    var mapping = {
      all: 'All Pollutants',
      no2: 'NO<sub>2</sub>',
      so2: 'SO<sub>2</sub>',
      pm2_5: 'PM<sub>2.5</sub>',
      pm10: 'PM<sub>10</sub>'
    };
    return function(codename) {
      return mapping[codename];
    };
  })();
  var getPollutants = function(d) {
    var ret = [];
    var len = POLLUTANTS.length;
    for (var i = 0; i < len; i++) {
      if (d[POLLUTANTS[i]] != 'NULL') {
        ret.push(d[POLLUTANTS[i]]);
      }
    }
    return ret;
  };

  var colors = {
    greys: colorbrewer.Greys[9],
    all: colorbrewer.Blues[9],
    no2: colorbrewer.Greens[9],
    so2: colorbrewer.Purples[9],
    pm2_5: colorbrewer.Reds[9],
    pm10: colorbrewer.Oranges[9]
  };

  // prepare data
  var data = (function () {
    // prepare data
    data.byStation = d3.nest().key(function(d) {
      return d.place;
    }).entries(data.values);

    data.byStation.forEach(function(station) {
      // calculate mean pollution at each time stamp (<day, hour>)
      station.values.forEach(function(d) {
        d.value = d3.mean(getPollutants(d));
      });

      // break up pollutants
      var brokenUp = [];
      station.values.forEach(function(v) {
        POLLUTANTS.forEach(function(pollutant) {
          if (v[pollutant] !== 'NULL') {  // ditch NULLs
            brokenUp.push({
              place: v.place,
              time: v.time,
              hour: v.time.match(/ \d+/)[0].substr(1),
              pollutant: pollutant,
              value: v[pollutant]
            });
          }
        });
      });

      // calculate mean of aggregate pollution at this station
      station.value = d3.mean(brokenUp, function(d) {
        return d.value;
      });

      // group by pollutant types
      station.byPollutant = d3.nest().key(function(d) {
        return d.pollutant;
      }).entries(brokenUp);

      // calculate mean intensity of each pollutant at this stations
      station.byPollutant.forEach(function(pollutant) {
        station[pollutant.key] = d3.mean(pollutant.values, function(d) {
          return d.value;
        });
      });

      // for each pollutant, group by hour
      station.byPollutant.forEach(function(pollutant) {
        var byHour = d3.nest().key(function(d) {
          return d.hour;
        }).entries(pollutant.values);

        // get mean for each hour
        pollutant.byHour = [];
        byHour.forEach(function(hour) {
          pollutant.byHour.push({
            place: station.key,
            hour: hour.key,
            pollutant: pollutant.key,
            value: d3.mean(hour.values, function(d) {
              return d.value;
            })
          });
        });
      });
    });

    // calculate overall mean
    data.overall = (function() {
      var overall = {};

      var flattenByHour = [];
      data.byStation.forEach(function(station) {
        station.byPollutant.forEach(function(pollutant) {
          pollutant.byHour.forEach(function(hour) {
            flattenByHour.push({
              hour: hour.hour,
              pollutant: hour.pollutant,
              value: hour.value
            });
          });
        });
      });

      // group by pollutant
      overall.byPollutant = d3.nest().key(function(d) {
        return d.pollutant;
      }).entries(flattenByHour);

      // for each pollutant, group by hour
      overall.byPollutant.forEach(function(pollutant) {
        var byHour = d3.nest().key(function(d) {
          return d.hour;
        }).entries(pollutant.values);

        // get mean for each hour
        pollutant.byHour = [];
        byHour.forEach(function(hour) {
          pollutant.byHour.push({
            hour: hour.key,
            pollutant: pollutant.key,
            value: d3.mean(hour.values, function(d) {
              return d.value;
            })
          });
        });
      });

      // calculate mean over stations for each time stamp (<day, hour>)

      // group data entries by time
      overall.byTime = d3.nest().key(function(d) {
        return d.time;
      }).entries(data.values);

      // calculate mean for each time stamp
      overall.byTime.forEach(function(time) {
        time.time = time.key;

        POLLUTANTS.forEach(function(pollutant) {
          time[pollutant] = d3.mean(time.values, function(d) {
            return d[pollutant];
          });
        });

        time.value = d3.mean(getPollutants(time));
      });

      return overall;
    })();

    data.MAX = d3.max(data.values, function(d) {
      return d3.max(getPollutants(d));
    });

    return data;
  })();

  var controller = (function() {
    var controller = {};

    // all ui states are maintained here
    // keys:
    // * scope: 'all' or 'station'
    // * id: station id, valid if scope == 'station'
    // * pollutant: 'all', or one of the pollutant names
    var state;

    var applyOpt = function(opt) {
      (opt.scope !== undefined) && (state.scope = opt.scope);
      (opt.id !== undefined) && (state.id = opt.id);
      (opt.pollutant !== undefined) && (state.pollutant = opt.pollutant);

      ixHinter.stop();
    };

    var render = function() {
      map.plot(state);
      radial.plot(state);
      tiles.plot(state);
      pollutantSelector.render(state);
    };

    controller.init = function() {
      state = {
        scope: 'all',
        pollutant: 'all'
      };
      d3.select('#station-name').text('All Stations');
      d3.select('body').attr('class', 'pollutant-all');
      render();
      ixHinter.start();
    };

    controller.deselectStation = function() {
      d3.select('#station-name').text('All Stations');

      applyOpt({
        scope: 'all'
      });
      render();
    };

    controller.selectStation = function(id, name) {
      d3.select('#station-name').html(name);

      applyOpt({
        scope: 'station',
        id: id
      })
      render();
    };

    controller.deselectPollutant = function() {
      d3.select('body').attr('class', 'pollutant-all');

      applyOpt({
        pollutant: 'all'
      });
      render();
    }

    controller.selectPollutant = function(pollutant) {
      d3.select('body').attr('class', 'pollutant-' + pollutant);

      applyOpt({
        pollutant: pollutant
      });
      render();
    };

    return controller;
  })();

  var scaledColor = (function() {
    var scale = d3.scale.pow().exponent(.35)
      .domain([0, data.MAX])
      .range([0, 1]);

    var quantize = d3.scale.quantize()
      .domain([0, 1]);

    return function(x, pollutant, colorRange) {
      colorRange || (colorRange = [0, 9]);
      quantize.range(colors[pollutant].slice(colorRange[0], colorRange[1]));
      return quantize(scale(x));
    };
  })();





  // plot tiles
  var tiles = (function() {
    var tiles = {};

    var width = 418;
    var height = 155;
    var axisHeight = 15;
    var axisWidth = 20;
    var tilesSVG = d3.select('svg.tiles')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + axisWidth + ',' + axisHeight + ')');

    var gap = 1;
    var tileWidth = (width - axisWidth) / 24 - gap;
    var tileHeight = (height - axisHeight) / 14 - gap;

    // initial plot
    tilesSVG.selectAll('.tile')
      .data(data.overall.byTime)
      .enter().append('rect')
        .attr('class', 'tile')
        .attr('width', tileWidth)
        .attr('height', tileHeight)
        .attr('rx', 3)
        .attr('ry', 1)
        .attr('x', function(d) {
          return d.time.match(/ \d+/)[0] * (tileWidth + gap);
        })
        .attr('y', function(d) {
          return (d.time.match(/\/\d+\//)[0].substr(1, 2) - 17) * (tileHeight + gap);
        });

    // draw axes
    (function() {
      // x axis
      var xAxis = d3.select('svg.tiles')
        .append('g')
          .attr('class', 'legend axis')
          .attr('transform', 'translate(' + axisWidth + ',' + (axisHeight - 3) + ')');
      var xData = [];
      for (var i = 0; i < 24; i++) {
        xData.push(i);
      }
      xAxis.selectAll('text.legend-element.axis-scale')
        .data(xData)
        .enter().append('text')
          .attr('class', 'legend-element axis-scale')
          .attr('x', function(d, i) {
            return (tileWidth + gap) * i;
          })
          .attr('y', 0)
          .text(function(d) {
            if (d % 3 === 0) {
              return d + ':00';
            }
            return '';
          });

      // y axis
      var yAxis = d3.select('svg.tiles')
        .append('g')
          .attr('class', 'legend axis')
          .attr('transform', 'translate(0,' + axisHeight + ')');
      var yData = [];
      for (var i = 17; i <= 30; i++) {
        yData.push(i);
      }
      yAxis.selectAll('text.legend-element.axis-scale')
        .data(yData)
        .enter().append('text')
          .attr('class', 'legend-element axis-scale')
          .attr('x', axisWidth - 3)
          .attr('y', function(d, i) {
            return (tileHeight + gap) * i + tileHeight / 2;
          })
          .attr('dy', '.375em')
          .attr('text-anchor', 'end')
          .text(function(d) {
            if (d % 3 === 2) {
              return d;
            }
            return '';
          });
      yAxis.append('text')
        .attr('class', 'legend-element axis-scale')
        .attr('x', axisWidth - 3)
        .attr('y', -3)
        .attr('text-anchor', 'end')
        .text('Oct')
    })();

    tiles.plot = function(opt) {
      switch (opt.scope) {
      case 'all':
        var entries = data.overall.byTime;
        break;
      case 'station':
        var len = data.byStation.length;
        for (var i = 0; i < len; i++) {
          var found = false;
          if (data.byStation[i].key == opt.id) {
            var entries = data.byStation[i].values;
            found = true;
            break;
          }
        }
        if (!found) {
          console.error('wrong id passed to tiles.plot: ' + opt.id);
        }
        break;
      }

      tilesSVG.selectAll('.tile')
        .data(entries)
        .transition()
          .style('fill', function(d) {
            if (opt.pollutant === 'all') {
              return scaledColor(d.value, 'all');
            } else {
              return scaledColor(d[opt.pollutant], opt.pollutant);
            }
          });
    };

    return tiles;
  })();


  var ixHinter = (function() {
    var ixHinter = {};

    var to;

    ixHinter.start = function() {
      to = window.setTimeout(function() {
        show();
      }, 3000);
    };

    ixHinter.stop = function() {
      window.clearTimeout(to);
      window.setTimeout(function() {
        hide();
      }, 2000);
    };

    var show = function() {
      d3.select('#ix-hint').classed('active', true);
    };

    var hide = function() {
      d3.select('#ix-hint').classed('active', false);
    };

    return ixHinter;
  })();

  // initialize visualization
  controller.init();
};


// load data
d3.csv('data/values.csv', function(values) {
  d3.csv('data/locations.csv', function(locations) {
    d3.csv('data/map.csv', function(map) {
      d3.csv('data/location-coord.csv', function(coord) {
        // integrate `coord` into `locations`
        for (var i = 0; i < locations.length; i++) {
          var found = false;
          for (var j = 0; j < coord.length; j++) {
            if (coord[j].id === locations[i].id) {
              found = true;
              locations[i].x = coord[j].x;
              locations[i].y = coord[j].y;
              break;
            }
          }
          if (!found) {
            // no coord for this location, remove
            locations.splice(i, 1);
            i--;
          }
        }
        d3.select('#loading')
          .transition()
          .duration(1000)
          .style('opacity', 0)
          .remove();
        vis({
          values: values,
          locations: locations,
          map: map
        });
      });
    });
  });
});
*/