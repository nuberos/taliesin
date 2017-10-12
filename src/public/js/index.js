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

var timeSeries = {
  "districts": [{
      "name": "Centro",
      "date": "13 01 2017",
      "avg": 28
    },
    {
      "name": "Centro",
      "date": "14 01 2017",
      "avg": 20
    },
    {
      "name": "Centro",
      "date": "15 01 2017",
      "avg": 23
    },
    {
      "name": "Centro",
      "date": "16 01 2017",
      "avg": 33
    },
    {
      "name": "Centro",
      "date": "17 01 2017",
      "avg": 35
    },
    {
      "name": "Centro",
      "date": "18 01 2017",
      "avg": 40
    },
    {
      "name": "Centro",
      "date": "19 01 2017",
      "avg": 31
    },
    {
      "name": "Centro",
      "date": "20 01 2017",
      "avg": 16
    },
    {
      "name": "Centro",
      "date": "21 01 2017",
      "avg": 15
    },
    {
      "name": "Centro",
      "date": "22 01 2017",
      "avg": 14
    },
    {
      "name": "Centro",
      "date": "23 01 2017",
      "avg": 11
    },
    {
      "name": "Chamartin",
      "date": "13 01 2017",
      "avg": 5
    },
    {
      "name": "Chamartin",
      "date": "14 01 2017",
      "avg": 7
    },
    {
      "name": "Chamartin",
      "date": "15 01 2017",
      "avg": 11
    },
    {
      "name": "Chamartin",
      "date": "16 01 2017",
      "avg": 14
    },
    {
      "name": "Chamartin",
      "date": "17 01 2017",
      "avg": 13
    },
    {
      "name": "Chamartin",
      "date": "18 01 2017",
      "avg": 16
    },
    {
      "name": "Chamartin",
      "date": "19 01 2017",
      "avg": 18
    },
    {
      "name": "Chamartin",
      "date": "20 01 2017",
      "avg": 21
    },
    {
      "name": "Chamartin",
      "date": "21 01 2017",
      "avg": 16
    },
    {
      "name": "Chamartin",
      "date": "22 01 2017",
      "avg": 14
    },
    {
      "name": "Chamartin",
      "date": "23 01 2017",
      "avg": 9
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "13 01 2017",
      "avg": 41
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "14 01 2017",
      "avg": 45
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "15 01 2017",
      "avg": 47
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "16 01 2017",
      "avg": 48
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "17 01 2017",
      "avg": 55
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "18 01 2017",
      "avg": 50
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "19 01 2017",
      "avg": 47
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "20 01 2017",
      "avg": 45
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "21 01 2017",
      "avg": 43
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "22 01 2017",
      "avg": 40
    },
    {
      "name": "Fuencarral-El Pardo",
      "date": "23 01 2017",
      "avg": 39
    }
  ]
};

var data = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.646207, 40.427889]
      },
      "properties": {
        "id": "1",
        "years": 3,
        "codbar": "151"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.758443, 40.371427]
      },
      "properties": {
        "id": "2",
        "years": 2,
        "codbar": "116"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.716937, 40.437753]
      },
      "properties": {
        "id": "3",
        "years": 5,
        "codbar": "071"
      }
    },

    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.810704, 40.474623]
      },
      "properties": {
        "id": "4",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.615163, 40.590375]
      },
      "properties": {
        "id": "5",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.779378, 40.483555]
      },
      "properties": {
        "id": "6",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.885015, 40.568993]
      },
      "properties": {
        "id": "7",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.851192, 40.514139]
      },
      "properties": {
        "id": "8",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.782488, 40.542402]
      },
      "properties": {
        "id": "9",
        "years": 5,
        "codbar": "081"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.710697, 40.407500]
      },
      "properties": {
        "id": "10",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.693123, 40.409232]
      },
      "properties": {
        "id": "11",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.705547, 40.413774]
      },
      "properties": {
        "id": "12",
        "years": 5,
        "codbar": "012"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-3.702114, 40.405408]
      },
      "properties": {
        "id": "13",
        "years": 5,
        "codbar": "012"
      }
    }
  ]
};
var map = new Map(document.getElementById('neighbourhoodmap'),document.getElementById("neighbourhoodmapcontainer"));
function showAllData(evt) {
  document.getElementById("neighbourhoodmapcontainer").style.marginLeft = "-9999px";
  document.getElementById('maincontainer').classList.remove("d-none");
  document.getElementById('maincontainer').classList.add("d-block");

}
var backArrow = document.getElementById('back');
backArrow.addEventListener('click', showAllData);
//
var choroplethMap = new ChoroplethMap(document.getElementById('maincontainer'),document.getElementById('map'));
var drawMap = (d) => map.draw(data,d);
choroplethMap.subscribe(drawMap);
choroplethMap.draw(data);
var timeGraph = new TimeSeriesGraph(document.getElementById('graph'));
timeGraph.draw(timeSeries.districts);
var radarChart = new RadarChart(document.getElementById('chart'))
radarChart.draw(chartData);
