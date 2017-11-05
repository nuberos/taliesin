//longitude and latitude coords
import * as d3 from "d3";
import { createEvent } from './eventFactory';

export class ChoroplethMap {
  constructor(config, components) {    
    this.config = config;
    this.components = components;
    this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    this.width  = 475 - this.margin.left - this.margin.right;
    this.height = 700 - this.margin.top - this.margin.bottom;
    this.domainScale = [50, 150, 350, 750, 1450, 2850, 5650, 11250, 22450, 44850, 89650, 179250];
    this.legendDomainScale = [0, 50, 150, 350, 750, 1450, 2850, 5650, 11250, 22450, 44850, 89650, 179250];
    this.legendLabels = ["< 50", "50+", "150+", "350+", "750+", "1450+", "2850+", "5650+", "11250+", "22450+", "44850+", "89650+", "> 179250 "];
    this.colors = d3.scaleThreshold().domain(this.domainScale).range([
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
      components.controls.addEventListener('highlight', this.highlight);
      components.controls.addEventListener('restore', this.restore);
      components.secondary.addEventListener('highlight', (e) => this.highlight(e));
      components.secondary.addEventListener('restore', (e) => this.restore());
  }

  createCanvas() {
    var svg = d3.select(this.components.primary)
      .append("svg")
      .attr("preserveAspectRatio", "xMidYMid")
      .attr("viewBox", "0 0 " + this.width + " " + this.height)
      .attr("width", this.width)
      .attr("height", this.height)
      .style("fill", "white");
    svg.append("rect")
      .attr("class", "background")
      .attr("width", this.width)
      .attr("height", this.height);
    return svg;
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

  getPollutionData(corbar) {
    var min = 0;
    var max = this.domainScale[this.domainScale.length - 1];
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  }

  highlight(e) {
    console.log('highlight!');
    console.dir(e);
    d3.select('g#neighbourhoods').selectAll(`.${e.detail.district}`).style("fill-opacity", .7);
  }

  restore(e) {
    console.log('restore!');
    console.dir(e);
    d3.select('g#neighbourhoods').selectAll('path').style("fill-opacity", 1);
  }

  fire(eventType, options) {    
    Object.assign(options,{eventType: eventType});
    var event = createEvent(options);
    this.components.primary.dispatchEvent(event);
    console.info('event type: %s with details: %s fired',eventType,options);
  }

  appendDistricts(svg, geojson) {
    var projection = d3.geoMercator().fitSize([this.width, this.height], geojson.objects.districts);
    var path = d3.geoPath().projection(projection);
    //
    svg.selectAll("path")
      .data(geojson.objects.districts.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => d.properties.district)
      .attr("class", "active district")
  }

  appendNeighbourhoods(svg, geojson, data) {
    var projection = d3.geoMercator().fitSize([this.width, this.height], geojson.objects.neighbourhoods);
    var path = d3.geoPath().projection(projection);
    svg.selectAll("path")
      .data(geojson.objects.neighbourhoods.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => `nhb${d.properties.codbar}`)
      .attr("class", (d)=> `active neighborhood ${d.properties.district}`)
      .attr("d", path)
      .style("fill", (d) => {
        var num = this.getPollutionData(d.properties.codbar);
        return this.colors(num);
      })
      .on("mouseover", (d) => this.fire('highlight',{district: d.properties.district}))
      .on("mouseout", (d) => {console.dir(d);this.fire('restore',{district: d.properties.district})})
      .on("click", (d) => {        
        this.components.container.classList.remove("d-block");
        this.components.container.classList.add("d-none");        
        const options = {geojson: d, codbar: d.properties.codbar};
        this.fire('showmap',options);
      });      
  }

  appendStations(svg, geojson, data) {
    /*var projection = d3.geoMercator().fitSize([this.width, this.height], geojson.objects.neighbourhoods);
    var path = d3.geoPath().projection(projection);
    svg.selectAll("circle")
      .data(data.features)
      .enter()
      .append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);*/

      //.append("circle")
      //.attr("cx", (d) => projection(d.geometry.coordinates)[0])
      //.attr("cy", (d) => projection(d.geometry.coordinates)[1])
      //.attr("r", (d) => Math.sqrt(d.properties.years) * 4)
      //.style("fill", "rgb(44,127,184)")
      //.style("opacity", 0.85);
  }

  appendLegend(svg) {
    var ls_w = 20,
      ls_h = 20;
    var legend = svg.selectAll("g.legend")
      .data(this.legendDomainScale)
      .enter().append("g")
      .attr("class", "legend");
    legend.append("rect")
      .attr("x", 20)
      .attr("y", (d, i) => this.height - (i * ls_h) - 2 * ls_h)
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", (d, i) => this.colors(d))
      .style("fill-opacity", 0.8);

    legend.append("text")
      .attr("x", 50)
      .attr("y", (d, i) => this.height - (i * ls_h) - ls_h - 4)
      .text((d, i) => this.legendLabels[i])
      .style("fill", "black");
  }

  draw(data) {
    // Append Div for tooltip to SVG
    var svg = this.createCanvas();    
    var districtsg = svg.append("g").attr("id", "districts");
    var neighbourhoodsg = svg.append("g").attr("id", "neighbourhoods");
    this.addGlow(neighbourhoodsg);
    var stationsg = svg.append("g").attr("id", "stations");

    d3.json(`static/${this.config.geojson}`, (error, geojson) => {
      if (error) {
        throw error;
      }
      this.appendDistricts(districtsg,geojson);
      this.appendNeighbourhoods(neighbourhoodsg,geojson,data);
      this.appendStations(stationsg,geojson,data);
    });
    this.appendLegend(svg);
  }
}
