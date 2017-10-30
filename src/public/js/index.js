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
import { Events } from './eventAware';
import { TimeSeriesGraph } from './timeSeriesGraph';
import { RadarChart } from './radarChart';
import { show } from './detail';
var config = window.__APPCFG__;
var data = window.__INITIAL_STATE__;
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
var choroplethMap = new ChoroplethMap(config,document.getElementById('maincontainer'),document.getElementById('map'));
var timeGraph = new TimeSeriesGraph(document.getElementById('maincontainer'),document.getElementById('graph'));
var radarChart = new RadarChart(document.getElementById('chart'));
choroplethMap.draw(data.geoData);
timeGraph.draw(data.temporalEvolution);
radarChart.draw(data.statisticsData);
var drawMap = (d) => {
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
choroplethMap.subscribe(Events.CLICK, drawMap); // probar https://developer.mozilla.org/es/docs/Web/API/CustomEvent
choroplethMap.subscribe(Events.MOUSEOVER, highlightTimeSerie);
choroplethMap.subscribe(Events.MOUSEOUT, restoreTimeSeries);
timeGraph.subscribe(Events.CLICK, drawDetailedGraph); // probar https://developer.mozilla.org/es/docs/Web/API/CustomEvent
