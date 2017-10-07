//longitude and latitude coords
import * as d3 from "d3";

var data = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.646207, 40.427889]
      },
      "properties": {
        "id": "1",
        "years": 3,
        "codbar": "151"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.758443, 40.371427]
      },
      "properties": {
        "id": "2",
        "years": 2,
        "codbar": "116"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.716937, 40.437753]
      },
      "properties": {
        "id": "3",
        "years": 5,
        "codbar": "071"
      }
    },

    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.810704, 40.474623]
      },
      "properties": {
        "id": "4",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.615163, 40.590375]
      },
      "properties": {
        "id": "5",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.779378, 40.483555]
      },
      "properties": {
        "id": "6",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.885015, 40.568993]
      },
      "properties": {
        "id": "7",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.851192, 40.514139]
      },
      "properties": {
        "id": "8",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.782488, 40.542402]
      },
      "properties": {
        "id": "9",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.710697, 40.407500]
      },
      "properties": {
        "id": "10",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.693123, 40.409232]
      },
      "properties": {
        "id": "11",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.705547, 40.413774]
      },
      "properties": {
        "id": "12",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.702114, 40.405408]
      },
      "properties": {
        "id": "13",
        "years": 5,
        "codbar": "012"
      }
    }
  ]
};
var width = window.screen.width;
var height = 720;
var domainScale = [50, 150, 350, 750, 1450, 2850, 5650, 11250, 22450, 44850, 89650, 179250];
var legendDomainScale = [0, 50, 150, 350, 750, 1450, 2850, 5650, 11250, 22450, 44850, 89650, 179250];
var legendLabels = ["< 50", "50+", "150+", "350+", "750+", "1450+", "2850+", "5650+", "11250+", "22450+", "44850+", "89650+", "> 179250 "];
var colors = d3.scaleThreshold()
  .domain(domainScale)
  .range([
    '#78c679',
    '#a3d78f',
    '#c5e29d',
    '#dfe8a2',
    '#f2e89d',
    '#fce38e',
    '#fed976',
    '#feb15e',
    '#f38b4a',
    '#df663c',
    '#c54431',
    '#a5232b',
    '#800026'
  ]);

var colorsB = d3.scaleThreshold()
  .domain(domainScale)
  .range([
    '#78c679',
    '#a3d78f',
    '#c5e29d',
    '#dfe8a2',
    '#f2e89d',
    '#fce38e',
    '#fed976',
    '#ffb25d',
    '#ff8f49',
    '#fa6f38',
    '#f3512b',
    '#eb3522',
    '#e31a1c'
  ]);

export default function showCityGraphs(onClickFn) {
  // Append Div for tooltip to SVG
  var svg = d3.select("#map")
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "white");

  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

  var districtsg = svg.append("g").attr("id", "districts");
  var neighbourhoodsg = svg.append("g").attr("id", "neighbourhoods");
  var stationsg = svg.append("g").attr("id", "stations");

  d3.json("static/madrid.json", function(error, madrid) {
    //console.dir(madrid);
    if (error) {
      throw error;
    }


    var projection = d3.geoMercator().fitSize([width, height], madrid.objects.districts);
    var path = d3.geoPath().projection(projection);
    districtsg.selectAll("path")
      .data(madrid.objects.districts.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", districtId)
      .attr("class", "district")
      .attr("class", "active");

    projection = d3.geoMercator().fitSize([width, height], madrid.objects.neighbourhoods);
    path = d3.geoPath().projection(projection);
    neighbourhoodsg.selectAll("path")
      .data(madrid.objects.neighbourhoods.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", neighborhoodId)
      .attr("class", "neighborhood")
      .attr("class", "active")
      .attr("d", path)
      .style("fill", function(d) {
        var num = getPollutionData(d.properties.codbar);
        var color = colors(num);
        //console.log('barrio:' + d.properties.codbar + ' num:' + num + ' color:' + color);
        return color;
      })
      .attr("opacity", "0.7")
      .on('click', function(d) {
        //console.dir(d);
        d.centroid = d3.geoCentroid(d);
        //console.dir(d.centroid);
        onClickFn(d, data);
      });

    stationsg.selectAll("circle")
      .data(data.features)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        //console.dir(d);
        return projection(d.geometry.coordinates)[0];
      })
      .attr("cy", function(d) {
        return projection(d.geometry.coordinates)[1];
      })
      .attr("r", function(d) {
        return Math.sqrt(d.properties.years) * 4;
      })
      .style("fill", "rgb(44,127,184)")
      .style("opacity", 0.85);

  });

  var legend = svg.selectAll("g.legend")
    .data(legendDomainScale)
    .enter().append("g")
    .attr("class", "legend");

  var ls_w = 20,
    ls_h = 20;

  legend.append("rect")
    .attr("x", 20)
    .attr("y", function(d, i) {
      return height - (i * ls_h) - 2 * ls_h;
    })
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d, i) {
      return colors(d);
    })
    .style("opacity", 0.8);

  legend.append("text")
    .attr("x", 50)
    .attr("y", function(d, i) {
      return height - (i * ls_h) - ls_h - 4;
    })
    .text(function(d, i) {
      return legendLabels[i];
    })
    .style("fill", "black");


}

function neighborhoodId(d) {
  //console.dir(d);
  return d.properties.codbar;
}

function districtId(d) {
  return d.properties.name;
}

function getPollutionData(corbar) {
  var min = 0;
  var max = domainScale[domainScale.length - 1];
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  //console.log('random:' + random);
  return random;
}
