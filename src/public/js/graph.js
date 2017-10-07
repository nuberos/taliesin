import * as d3 from "d3";

var timeSeries = {
  "districts": [{
      "name": "Centro",
      "date": "13 01 2017",
      "avg": 28
    },
    {
      "name": "Centro",
      "date": "14 01 2017",
      "avg": 20
    },
    {
      "name": "Centro",
      "date": "15 01 2017",
      "avg": 23
    },
    {
      "name": "Centro",
      "date": "16 01 2017",
      "avg": 33
    },
    {
      "name": "Centro",
      "date": "17 01 2017",
      "avg": 35
    },
    {
      "name": "Centro",
      "date": "18 01 2017",
      "avg": 40
    },
    {
      "name": "Centro",
      "date": "19 01 2017",
      "avg": 31
    },
    {
      "name": "Centro",
      "date": "20 01 2017",
      "avg": 16
    },
    {
      "name": "Centro",
      "date": "21 01 2017",
      "avg": 15
    },
    {
      "name": "Centro",
      "date": "22 01 2017",
      "avg": 14
    },
    {
      "name": "Centro",
      "date": "23 01 2017",
      "avg": 11
    },
    {
      "name": "Chamartin",
      "date": "13 01 2017",
      "avg": 5
    },
    {
      "name": "Chamartin",
      "date": "14 01 2017",
      "avg": 7
    },
    {
      "name": "Chamartin",
      "date": "15 01 2017",
      "avg": 11
    },
    {
      "name": "Chamartin",
      "date": "16 01 2017",
      "avg": 14
    },
    {
      "name": "Chamartin",
      "date": "17 01 2017",
      "avg": 13
    },
    {
      "name": "Chamartin",
      "date": "18 01 2017",
      "avg": 16
    },
    {
      "name": "Chamartin",
      "date": "19 01 2017",
      "avg": 18
    },
    {
      "name": "Chamartin",
      "date": "20 01 2017",
      "avg": 21
    },
    {
      "name": "Chamartin",
      "date": "21 01 2017",
      "avg": 16
    },
    {
      "name": "Chamartin",
      "date": "22 01 2017",
      "avg": 14
    },
    {
      "name": "Chamartin",
      "date": "23 01 2017",
      "avg": 9
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "13 01 2017",
      "avg": 41
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "14 01 2017",
      "avg": 45
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "15 01 2017",
      "avg": 47
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "16 01 2017",
      "avg": 48
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "17 01 2017",
      "avg": 55
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "18 01 2017",
      "avg": 50
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "19 01 2017",
      "avg": 47
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "20 01 2017",
      "avg": 45
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "21 01 2017",
      "avg": 43
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "22 01 2017",
      "avg": 40
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "23 01 2017",
      "avg": 39
    }
  ]
}

// graph
var color = d3.scaleOrdinal(d3.schemeCategory10);;
// Set the dimensions of the canvas / graph
var gmargin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  gwidth = 600 - gmargin.left - gmargin.right,
  gheight = 270 - gmargin.top - gmargin.bottom;

// Parse the date / time
var myFormat = d3.timeFormat("%d %m %Y");
var parseDate = d3.timeParse(myFormat);

// Set the ranges
var x = d3.scaleTime().range([0, gwidth]);
var y = d3.scaleLinear().range([gheight, 0]);

// Define the axes
var xAxis = d3.axisBottom(x).ticks(5);
var yAxis = d3.axisLeft(y).ticks(5);


// Define the line
var pollutionLine = d3.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.avg);
  });

export default function showGraph() {

  // Adds the svg canvas
  var graphSvg = d3.select("#graph")
    .append("svg")
    .attr("width", gwidth + gmargin.left + gmargin.right)
    .attr("height", gheight + gmargin.top + gmargin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + gmargin.left + "," + gmargin.top + ")");

  // Get the data
  timeSeries.districts.forEach(function(d) {
    d.date = parseDate(d.date);
    d.avg = +d.avg;
  });

  // Scale the range of the data
  x.domain(d3.extent(timeSeries.districts, function(d) {
    return d.date;
  }));
  y.domain([0, d3.max(timeSeries.districts, function(d) {
    return d.avg;
  })]);

  // Nest the entries by symbol
  var dataNest = d3.nest()
    .key(function(d) {
      return d.name;
    })
    .entries(timeSeries.districts);

  // Loop through each symbol / key
  dataNest.forEach(function(d) {
    console.dir(d);
    graphSvg.append("path")
      .attr("class", "line")
      .style("stroke", function() {
        return d.color = color(d.key);
      })
      .attr("d", pollutionLine(d.values));
  });
  // Add the X Axis
  graphSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + gheight + ")")
    .call(xAxis);

  // Add the Y Axis
  graphSvg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

}
