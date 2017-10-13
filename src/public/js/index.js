/*import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header'


//setInterval(tick,1000);

ReactDOM.render(
  <Header/>,
  document.getElementById('root')
);*/
import { ChoroplethMap } from './choroplethMap';
import { Map } from './map';
import { TimeSeriesGraph } from './timeSeriesGraph';
import { RadarChart } from './radarChart';
var config = window.__APPCFG__;
var data = window.__INITIAL_STATE__;
var map = new Map(document.getElementById('neighbourhoodmap'),document.getElementById("neighbourhoodmapcontainer"));
function showAllData(evt) {
  document.getElementById("neighbourhoodmapcontainer").style.marginLeft = "-9999px";
  document.getElementById('maincontainer').classList.remove("d-none");
  document.getElementById('maincontainer').classList.add("d-block");

}
var backArrow = document.getElementById('back');
backArrow.addEventListener('click', showAllData);
//
var choroplethMap = new ChoroplethMap(config,document.getElementById('maincontainer'),document.getElementById('map'));
var drawMap = (d) => map.draw(data.geoData,d);
choroplethMap.subscribe(drawMap);
choroplethMap.draw(data.geoData);
var timeGraph = new TimeSeriesGraph(document.getElementById('graph'));
timeGraph.draw(data.temporalEvolution);
var radarChart = new RadarChart(document.getElementById('chart'))
radarChart.draw(data.statisticsData);
