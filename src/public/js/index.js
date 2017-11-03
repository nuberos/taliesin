/*import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header'


//setInterval(tick,1000);

ReactDOM.render(
  <Header/>,
  document.getElementById('root')
);*/
//dos selectores para comparar distritos
//graficos interaccionan entre ellos
import { ChoroplethMap } from './choroplethMap';
import { Map } from './map';
import { TimeSeriesGraph } from './timeSeriesGraph';
import { RadarChart } from './radarChart';
import { show } from './detail';
import { Controls } from './controls';

var components = {
  container: document.getElementById("maincontainer"), 
  controls: document.getElementById('controls'),
  primary: document.getElementById('map'),
  secondary: document.getElementById('graph'),
  tertiary: document.getElementById('chart')
};
var config = window.__APPCFG__;
var data = window.__INITIAL_STATE__;
var controls = new Controls({},document.getElementById('controls'));
controls.init();
var map = new Map(document.getElementById("detailscontainer"),document.getElementById('neighbourhoodmap'));
function showAllData(evt) {
  document.getElementById("detailscontent").style.left = "-9999px";
  document.getElementById("neighbourhoodmap").style.left = "-9999px";
  document.getElementById('maincontainer').classList.remove("d-none");
  document.getElementById('maincontainer').classList.add("d-block");
  document.getElementById('back').classList.remove("d-block");
  document.getElementById('back').classList.add("d-none");
}
var backArrow = document.getElementById('back');
backArrow.addEventListener('click', showAllData);

//
var choroplethMap = new ChoroplethMap(config,components);
var timeGraph = new TimeSeriesGraph(config,components);
var radarChart = new RadarChart(config,components);

choroplethMap.draw(data.geoData);
timeGraph.draw(data.temporalEvolution);
radarChart.draw(data.statisticsData);
/*var drawMap = (d) => {
  document.getElementById('back').classList.remove("d-none");
  document.getElementById('back').classList.add("d-block");
  map.draw(data.geoData,d) 
};
var highlightTimeSerie = (d) => timeGraph.highlight(d);
var restoreTimeSeries = (d) => timeGraph.restore(d);
var drawDetailedGraph = (d) => {
  document.getElementById('back').classList.remove("d-none");
  document.getElementById('back').classList.add("d-block");
  var ct = document.getElementById("detailscontent");
  show(ct,d);
};
var highlightDistrict = (d) => choroplethMap.highlight(d);
var restoreDistrict = () => choroplethMap.restore();*/

