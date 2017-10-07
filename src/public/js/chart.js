// Chart
import * as d3 from "d3";

var chartData = [
    [//iPhone
    {axis:"Battery Life",value:0.22},
    {axis:"Brand",value:0.28},
    {axis:"Contract Cost",value:0.29},
    {axis:"Design And Quality",value:0.17},
    {axis:"Have Internet Connectivity",value:0.22},
    {axis:"Large Screen",value:0.02},
    {axis:"Price Of Device",value:0.21},
    {axis:"To Be A Smartphone",value:0.50}
    ],[//Samsung
    {axis:"Battery Life",value:0.27},
    {axis:"Brand",value:0.16},
    {axis:"Contract Cost",value:0.35},
    {axis:"Design And Quality",value:0.13},
    {axis:"Have Internet Connectivity",value:0.20},
    {axis:"Large Screen",value:0.13},
    {axis:"Price Of Device",value:0.35},
    {axis:"To Be A Smartphone",value:0.38}
    ],[//Nokia Smartphone
    {axis:"Battery Life",value:0.26},
    {axis:"Brand",value:0.10},
    {axis:"Contract Cost",value:0.30},
    {axis:"Design And Quality",value:0.14},
    {axis:"Have Internet Connectivity",value:0.22},
    {axis:"Large Screen",value:0.04},
    {axis:"Price Of Device",value:0.41},
    {axis:"To Be A Smartphone",value:0.30}
    ]
  ];

var chartWidth = 600,				//Width of the circle
chartHeight = 600,
axisNames = (chartData[0].map(function(i, j){return i.axis})),	//Names of each axis
cfg = {
	 width: chartWidth,				//Width of the circle
	 height: chartHeight,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: d3.max(chartData, function(i){return d3.max(i.map(function(o){return o.value;}))}), 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function
   axisNames: axisNames,
   numberOfAxis: axisNames.length,
   radius: Math.min(chartWidth/2, chartHeight/2), 	//Radius of the outermost circle
   angleSlice: Math.PI * 2 / axisNames.length //The width in radians of each "slice"
};

//var maxValue = d3.max(chartData, function(i){return d3.max(i.map(function(o){return o.value;}))});



//var allAxis = (data[0].map(function(i, j){return i.axis}));	//Names of each axis
//var total = allAxis.length;					//The number of different axes
//var radius = Math.min(cfg.w/2, cfg.h/2); 	//Radius of the outermost circle
var Format = d3.format('%');			 	//Percentage formatting


//Scale for the radius
var rScale = d3.scaleLinear().range([0, cfg.radius]).domain([0, cfg.maxValue]);
export default function showChart() {
//Initiate the radar chart SVG
var chartSvg = d3.select("#chart").append("svg")
		.attr("width",  cfg.width + cfg.margin.left + cfg.margin.right)
		.attr("height", cfg.height + cfg.margin.top + cfg.margin.bottom)
		.attr("class", "radarchart");
//Append a g element
var chartg = chartSvg.append("g")
.attr("transform", "translate(" + (cfg.width/2 + cfg.margin.left) + "," + (cfg.height/2 + cfg.margin.top) + ")");

//Filter for the outside glow
var filter = chartg.append('defs').append('filter').attr('id','glow'),
feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
feMerge = filter.append('feMerge'),
feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

var axisGrid = chartg.append("g").attr("class", "axisWrapper");

axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return cfg.radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
.style("filter" , "url(#glow)");

axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*cfg.radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
.text(function(d,i) { return Format(cfg.maxValue * d/cfg.levels); });

var axis = axisGrid.selectAll(".axis")
		.data(cfg.axisNames)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(cfg.maxValue*1.1) * Math.cos(cfg.angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(cfg.maxValue*1.1) * Math.sin(cfg.angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
.style("stroke-width", "2px");

//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(cfg.angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(cfg.angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
.call(wrap, cfg.wrapWidth);

//The radial line function
	var radarLine = d3.radialLine()
		.radius(function(d) { return rScale(d.value); })
.angle(function(d,i) { return i*cfg.angleSlice; })
.curve(d3.curveCardinalClosed);

var blobWrapper = chartg.selectAll(".radarWrapper")
		.data(chartData)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
});

//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width","1px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
.style("filter" , "url(#glow)");

//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(cfg.angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(cfg.angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
.style("fill-opacity", 0.8);
}

//Wraps SVG text
	function wrap(text, width) {
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
}//wrap
