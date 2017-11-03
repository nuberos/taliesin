// Chart
import * as d3 from "d3";

export class RadarChart {
  constructor(config, components) {
    this.config = config;
    this.components = components;
    this.margin = { top: 50, right: 60, bottom: 50, left: 60 };
    this.width = 400 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.levels = 2; //How many levels or inner circles should there be drawn
    this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.opacityArea = 0.35; //The opacity of the area of the blob
    this.radius = Math.min(this.width / 2, this.height / 2);
  }

  createCanvas() {
    var totalWidth = this.width + this.margin.left + this.margin.right,
      totalHeight = this.height + this.margin.top + this.margin.bottom,
      transform = "translate(" + (this.width / 2 + this.margin.left) + "," + (this.height / 2 + this.margin.top) + ")";
    return d3.select(this.components.tertiary).append("svg")
      .attr("width", totalWidth)
      .attr("height", totalHeight)
      .attr("class", "radarchart")
      .append("g")
      .attr("transform", transform);
  }

  addGlow(svg) {
    svg.append('defs')
      .append('filter')
      .attr('id', 'glow')
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur')
      .append('feMerge')
      .append('feMergeNode')
      .attr('in', 'coloredBlur')
      .append('feMergeNode')
      .attr('in', 'SourceGraphic');
  }

  createLine(cfg) {
    return d3.radialLine()
      .radius(function(d) { return cfg.rScale(d.value); })
      .angle(function(d, i) { return i * cfg.angleSlice; })
      .curve(d3.curveCardinalClosed);
  }

  mouseover(e) {
    //Dim all blobs
    d3.selectAll(".radarArea")
      .transition().duration(200)
      .style("fill-opacity", 0.1);
    //Bring back the hovered over blob
    e.transition().duration(200)
    .style("fill-opacity", 0.7);
  }

  mouseout() {
    //Bring back all blobs
    d3.selectAll(".radarArea")
      .transition().duration(200)
      .style("fill-opacity", this.opacityArea);
  }

  wrap(text, width) {

    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  createBackground(chartg, cfg) {
    var wrapperSvg = chartg.append("g").attr("class", "wrapper");
    wrapperSvg.selectAll(".levels")
      .data(d3.range(1, (this.levels + 1)).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d, i) => this.radius / this.levels * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);
      //.style("filter", "url(#glow)");
    //
     wrapperSvg.selectAll(".axisLabel")
      .data(d3.range(1, (this.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", (d) => -d * this.radius / this.levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text((d, i) => `${100 * d / this.levels}%`);

    var axis = wrapperSvg.selectAll(".axis")
      .data(cfg.axisNames)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => cfg.rScale(cfg.maxValue) * Math.cos(cfg.angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => cfg.rScale(cfg.maxValue) * Math.sin(cfg.angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "1px");
      //.style("filter", "url(#glow)");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => cfg.rScale(cfg.maxValue * 1.25) * Math.cos(cfg.angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => cfg.rScale(cfg.maxValue * 1.25) * Math.sin(cfg.angleSlice * i - Math.PI / 2))
      .text((d) => d)
      .call(this.wrap, 60);
  }

  draw(data) {

    var axisNames = (data[0].map(function(i, j) { return i.name })),
    maxValue  = d3.max(data, function(i) { return d3.max(i.map(function(o) { return o.value; }))}),
    cfg = {
      axisNames: axisNames, //Names of each axis
      maxValue: maxValue, //What is the value that the biggest circle will represent
      rScale: d3.scaleLinear().range([0, this.radius]).domain([0, maxValue]),
      angleSlice: Math.PI * 2 / axisNames.length
    },
    self = this;
    //Initiate the radar chart SVG
    var chartg = this.createCanvas();
    //Filter for the outside glow
    this.addGlow(chartg);
    this.createBackground(chartg,cfg);
    //The radial line function
    var radarLine = this.createLine(cfg);
    var blobWrapper = chartg.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d, i) => radarLine(d))
      .style("fill", (d, i) => this.color(i))
      .style("fill-opacity", this.opacityArea)
      .on('mouseover', function(d, i) { self.mouseover(d3.select(this)); })
      .on('mouseout', () => this.mouseout());

    //Create the outlines
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", (d, i) => radarLine(d))
      .style("stroke-width", "1px")
      .style("stroke", (d, i) => this.color(i))
      .style("fill", "none")
      .style("filter", "url(#glow)");
  }
}
