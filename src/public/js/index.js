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
var timeGraph = new TimeSeriesGraph(document.getElementById('graph'));
var radarChart = new RadarChart(document.getElementById('chart'));
choroplethMap.draw(data.geoData);
timeGraph.draw(data.temporalEvolution);
radarChart.draw(data.statisticsData);
var drawMap = (d) => map.draw(data.geoData,d);
var highlightTimeSerie = (d) => timeGraph.highlight(d);
var restoreTimeSeries = (d) => timeGraph.restore(d);
choroplethMap.subscribe(Events.CLICK, drawMap); // probar https://developer.mozilla.org/es/docs/Web/API/CustomEvent
choroplethMap.subscribe(Events.MOUSEOVER, highlightTimeSerie);
choroplethMap.subscribe(Events.MOUSEOUT, restoreTimeSeries);
