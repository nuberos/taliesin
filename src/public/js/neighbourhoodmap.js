import L from 'leaflet';

export function showMap(mapInfo, d, data) {
  try {
    var neighbourhoodPoints = data.features.filter(function(f) {
      return f.properties.codbar === d.properties.codbar;
    });
    //document.getElementById('neighbourhoodmap').style.width = '850px';
    document.getElementById('neighbourhoodmap').style.height = '650px';
    console.dir(d);
    console.dir(data);
    mapInfo.mapLayers.clearLayers();
    mapInfo.markersLayer.clearLayers();
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    console.log('1');
    //bounds to fit all markers
    neighbourhoodPoints.forEach(function(i) {
      var title = i.properties.id;
      mapInfo.markersLayer.addLayer(L.marker(new L.LatLng(i.geometry.coordinates[1], i.geometry.coordinates[0]), {
        title: title
      }));
    });
    var geoJsonLayer = L.geoJson(d);
    //mymap.setView(new L.LatLng(d.centroid[1], d.centroid[0]),14);
    mapInfo.mapLayers.addLayer(new L.TileLayer(osmUrl, {
      maxZoom: 15,
      attribution: osmAttrib
    }))
    console.dir('2');
    mapInfo.map.addLayer(mapInfo.mapLayers);
    if (neighbourhoodPoints.length > 0) {
      //var markersGroup = new L.FeatureGroup(markersLayer.getLayers());
      mapInfo.map.addLayer(mapInfo.markersLayer);
    }
    //console.dir(new L.LatLng(d.centroid[1], d.centroid[0]));
    //mapInfo.map.panTo(new L.LatLng(d.centroid[1], d.centroid[0]));
    mapInfo.map.fitBounds(geoJsonLayer.getBounds(), {
      maxZoom: 15
    });
    console.log('4');
    //mapInfo.map.invalidateSize();
  } catch (err) {

    console.error(err);
  }
}

export function initMap() {
  // start the map in South-East England
  var mymap = new L.map('neighbourhoodmap');
  //document.getElementById('neighbourhoodmapcontainer').classList.add("d-none");
  var markersLayer = new L.LayerGroup();
  var mapLayers    = new L.LayerGroup();
  return {map: mymap, markersLayer: markersLayer, mapLayers: mapLayers};
}
