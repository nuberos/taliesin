//longitude and latitude coords
import * as d3 from "d3";
import { Events, EventAware } from './eventAware';

export class ChoroplethMap extends EventAware {
  constructor(config, container, elem) {
    super(elem);
    this.config = config;
    this.container = container;
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width  = 800 - this.margin.left - this.margin.right;
    this.height = 570 - this.margin.top - this.margin.bottom;
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
  }

  createCanvas() {
    var svg = d3.select(this._elem)
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

  getPollutionData(corbar) {
    var min = 0;
    var max = this.domainScale[this.domainScale.length - 1];
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
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
      .attr("id", (d) => d.properties.name)
      .attr("class", "district")
      .attr("class", "active");
  }

  onClick(d) {
    d.centroid = d3.geoCentroid(d);
    this.container.classList.remove("d-block");
    this.container.classList.add("d-none");
    this.fire(Events.CLICK,d);
  }

  mouseover(d) {
      this.fire(Events.MOUSEOVER,d.properties.district);
  }

  mouseout(d) {
      this.fire(Events.MOUSEOUT,d.properties.district);
  }

  appendNeighbourhoods(svg, geojson, data) {
    var projection = d3.geoMercator().fitSize([this.width, this.height], geojson.objects.neighbourhoods);
    var path = d3.geoPath().projection(projection);
    svg.selectAll("path")
      .data(geojson.objects.neighbourhoods.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", (d) => d.properties.codbar)
      .attr("class", "neighborhood")
      .attr("class", "active")
      .attr("d", path)
      .style("fill", (d) => {
        var num = this.getPollutionData(d.properties.codbar);
        return this.colors(num);
      })
      .attr("opacity", "0.7")
      .on('click', (d)=> this.onClick(d))
      .on('mouseover', (d)=> this.mouseover(d))
      .on('mouseout', (d)=> this.mouseout(d));
  }

  appendStations(svg, geojson, data) {
    var projection = d3.geoMercator().fitSize([this.width, this.height], geojson.objects.neighbourhoods);
    var path = d3.geoPath().projection(projection);
    svg.selectAll("circle")
      .data(data.features)
      .enter()
      .append("circle")
      .attr("cx", (d) => projection(d.geometry.coordinates)[0])
      .attr("cy", (d) => projection(d.geometry.coordinates)[1])
      .attr("r", (d) => Math.sqrt(d.properties.years) * 4)
      .style("fill", "rgb(44,127,184)")
      .style("opacity", 0.85);
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
      .style("opacity", 0.8);

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
