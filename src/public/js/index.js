/*import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header'


//setInterval(tick,1000);

ReactDOM.render(
  <Header/>,
  document.getElementById('root')
);*/
import showCityGraphs from './citydistricts';
import {initMap,showMap} from './neighbourhoodmap';
import showGraph from './graph';
import showChart from './chart';

var mapInfo = initMap();
function showNeighbourhoodData(d, data) {
  //d3.selectAll("g").attr("visibility", "hidden");
  document.getElementById('maincontainer').classList.remove("d-block");
  document.getElementById('maincontainer').classList.add("d-none");
  //document.getElementById('neighbourhoodmapcontainer').classList.remove("d-none");
  //document.getElementById('neighbourhoodmapcontainer').classList.add("d-block");
  document.getElementById("neighbourhoodmapcontainer").style.marginLeft = "0px";
  showMap(mapInfo, d, data);
}

function showAllData(evt) {
  //d3.selectAll("g").attr("visibility", "visible");
  document.getElementById("neighbourhoodmapcontainer").style.marginLeft = "-9999px";
  //document.getElementById('neighbourhoodmapcontainer').classList.remove("d-block");
  //document.getElementById('neighbourhoodmapcontainer').classList.add("d-none");
  document.getElementById('maincontainer').classList.remove("d-none");
  document.getElementById('maincontainer').classList.add("d-block");

}
var backArrow = document.getElementById('back');
backArrow.addEventListener('click', showAllData);
console.dir(showCityGraphs);
showCityGraphs(showNeighbourhoodData);
showGraph();
showChart();
