import * as d3 from "d3";
import { createEvent } from './eventFactory';

export class TimeSeriesGraph {
  constructor(config, components) {
    this.config = config;
    this.components = components;
    this.color = d3.scaleOrdinal(config.districts.map((d) => d.color.base)).domain(config.districts.map((d) => d.district));
    this.margin = {
      top: 0,
      right: 0,
      bottom: 45,
      left: 45
    };
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.dateFormat = d3.timeFormat("%d %m %Y");
    this.x = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.x).ticks(d3.timeHour.every(24)).tickFormat(d3.timeFormat("%e/%m"));
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

  drawAxis() {
    // Add the X Axis
    this.svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);    
    this.svg.append("text")
      .attr("class", "label")
      .attr("transform","translate(" + (this.width/2) + " ," + (this.height + this.margin.bottom - 10) + ")")
      .style("text-anchor", "middle")
      .text("Fecha");
    // Add the Y Axis
    this.svg.append("g")
      .attr("class", "yaxis")
      .call(this.yAxis);
    this.svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Distrito");  
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
    this.svg.selectAll("path.line").remove();
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
  
  lineColor(d) {
    return d.color = this.color(d.key);
  }
  //timeSeries.districts
  draw(data) {
    this.formatData(data.values);
    this.data = data;
    // Adds the svg canvas
    this.svg = this.createCanvas();
    // Scale the range of the data
    this.setDomain();
    //draw the axis
    this.drawAxis()
    //paint the lines
    this.updateGraph();
    
  }

  updateGraph(key) {
    
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
         
  }  
}
