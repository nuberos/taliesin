import * as d3 from "d3";
import { createEvent } from './eventFactory';

export class TimeSeriesGraph {
  constructor(config, components) {
    this.config = config;
    this.components = components;
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.margin = {
      top: 0,
      right: 0,
      bottom: 30,
      left: 0
    };
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.dateFormat = d3.timeFormat("%d %m %Y");
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.x).ticks(5);
    this.yAxis = d3.axisLeft(this.y).ticks(5);
    components.primary.addEventListener('highlight', (e) => this.highlight(e));
    components.primary.addEventListener('restore', (e) => this.restore());
    components.controls.addEventListener('highlight', (e) => this.highlight(e));
    components.controls.addEventListener('restore', (e) => this.restore(e));
  }

  parseDate(date) {
    var parser = d3.timeParse(this.dateFormat);
    return parser(date);
  }

  createCanvas() {
    return d3.select(this.components.secondary)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  dataNest() {
    return d3.nest()
    .key(function(d) {
      return d.district;
    })
    .entries(this.data.values);
  }

  setDomain() {
    // Scale the range of the dataa
    this.x.domain(d3.extent(this.data.values, function(d) {
      return d.date;
    }));
    this.y.domain([0,d3.max(this.data.values, function(d) {
      return d.avg;
    })]);
  }

  formatData(data) {
    // Get the data
    data.forEach(function(d) {
      d.date = this.parseDate(d.date);
      d.avg = +d.avg;
    }, this);
  }

  createLine(x, y) {
    // Define the line
    return d3.line()
      .x((d)=> this.x(d.date))
      .y((d)=> this.y(d.avg));
  }

  opacity(d1,key) {
    var opacity = 0.15;
    if(!key || d1.key === key) {
        opacity = 1;
    }
    return opacity;
  }

  highlight(e) {
    // remove contents of svg
    this.svg.selectAll("path").remove();
    //this.fire(Events.MOUSEOVER,key);
    this.updateGraph(e.detail.district);
  }

  restore(e) {
    //this.fire(Events.MOUSEOUT);
    this.updateGraph();
  }

  fire(eventType, district) {    
    const options = {eventType: eventType, district: district};
    var event = createEvent(options);
    this.components.secondary.dispatchEvent(event);
    console.info('event type: %s with details: %s fired',eventType,options);
  }

  handleClick(d) {
    this.components.container.classList.remove("d-block");
    this.components.container.classList.add("d-none");
    //this.fire(Events.CLICK,d);
  }

  createLegend() {
    /*var legendWidth = 180,
      fontsz = 11,
      texth = fontsz + 1,
      rl = 11,
      texth = fontsz + 1,
      legendHeight = this.data.keys.length * texth + 30;
    var legend = this.svg.append("g")
      .attr("class", "legendContainer")
      .style("fill", "white")
      .style("fill-opacity", "0.85")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("transform", "translate(" + (this.width - legendWidth) + ",0)");

    legend.append("rect")
      .attr("class", "legendRect")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "white")
      .style("fill-opacity", "0.85");

    var legendElement = legend.selectAll("g")
      .data(this.data.keys)
      .enter().append("g")
      .attr("class", "legend");
    legendElement.append("rect")
      .attr("x", 10)
      .attr("y", function(d, i) {
        return (i + 1) * texth
      })
      .attr("width", rl)
      .attr("height", rl)
      .style("fill", (d) => this.color(d.district));
    //.style("opacity", 0.8);
    legendElement.append("text")
      .attr("x", 10 + rl + 10)
      .attr("y", function(d, i) {
        return 10 + (i + 1) * texth
      })
      .text(function(d) {
        return d.name
      })
      .attr("font-size", `${fontsz}px`)
      .style("fill", "black");*/

  }
  lineColor(d) {
    return d.color = this.color(d.key);
  }
  //timeSeries.districts
  draw(data) {
    this.formatData(data.values);
    this.data = data;
    // Adds the svg canvas
    this.svg = this.createCanvas();
    this.updateGraph();
  }

  updateGraph(key) {
    // Scale the range of the data
    this.setDomain();
    //create the line function
    var line = this.createLine(this.x,this.y);
    // Nest the entries by symbol
    var dataNest = this.dataNest();
    // Loop through each symbol / key
    dataNest.forEach(function(d) {
      this.svg.append("path")
        .attr("class", "line")
        .attr("id", (d,i)=> `line-${i}`)
        .style("stroke", this.lineColor(d))
        .style("stroke-opacity", this.opacity(d,key))
        .attr("d", line(d.values))
        .on('click', (e) => this.handleClick(d.key))
        .on('mouseover', (e) => this.fire('highlight',d.key))
        .on('mouseout', (e) => this.fire('restore',d.key));        
    }, this);
    // Add the X Axis
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);
    // Add the Y Axis
    this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);
    //add the legend
    this.createLegend();
  }
}
