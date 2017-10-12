import * as d3 from "d3";
import {EventAware} from './eventAware';

export class TimeSeriesGraph extends EventAware {
  constructor(elem) {
    super(elem);
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 270 - this.margin.top - this.margin.bottom;
    this.dateFormat = d3.timeFormat("%d %m %Y");
  }

  parseDate(date) {
    var parser = d3.timeParse(this.dateFormat);
    return parser(date);
  }

  createCanvas() {
    return d3.select(this._elem)
      .append("svg")
      .attr("width", this.width + this.margin.left +this. margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  formatData(data) {
    // Get the data
    data.forEach(function(d) {
      d.date = this.parseDate(d.date);
      d.avg = +d.avg;
    },this);
  }

  createLine(x,y) {
    // Define the line
    return d3.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.avg);
      });
  }

  lineColor(d) {
    return d.color = this.color(d.key);
  }

  //timeSeries.districts
  draw(data) {
    this.formatData(data);
    // Set the ranges
    var x = d3.scaleTime().range([0, this.width]);
    var y = d3.scaleLinear().range([this.height, 0]);
    // Define the axes
    var xAxis = d3.axisBottom(x).ticks(5);
    var yAxis = d3.axisLeft(y).ticks(5);
    // Scale the range of the dataa
    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain([0, d3.max(data, function(d) {
      return d.avg;
    })]);

    // Adds the svg canvas
    var graphSvg = this.createCanvas();
    //create the line function
    var line = this.createLine(x,y);
    // Nest the entries by symbol
    var dataNest = d3.nest()
      .key(function(d) {
        return d.name;
      })
      .entries(data);
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
      graphSvg.append("path")
        .attr("class", "line")
        .style("stroke", this.lineColor(d))
        .attr("d", line(d.values));
    },this);
    // Add the X Axis
    graphSvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);
    // Add the Y Axis
    graphSvg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  }
}
