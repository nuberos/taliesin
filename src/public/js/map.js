import L from 'leaflet';
import { Events, EventAware } from './eventAware';

export class Map extends EventAware {
  constructor(container, elem) {
    super(elem);
    this.container = container;
    // start the map in South-East England
    this.map = new L.map(elem);
    this.markersLayer = new L.LayerGroup();
    this.mapLayers = new L.LayerGroup();
  }

  draw(data, d) {
    try {
      var neighbourhoodPoints = data.features.filter(function(f) {
        return f.properties.codbar === d.properties.codbar;
      });
      this._elem.style.left = "0px";
      //this.container.style.left = "0px";
      this.mapLayers.clearLayers();
      this.markersLayer.clearLayers();
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      //bounds to fit all markers
      neighbourhoodPoints.forEach(function(i) {
        var title = i.properties.id;
        this.markersLayer.addLayer(L.marker(new L.LatLng(i.geometry.coordinates[1], i.geometry.coordinates[0]), {
          title: title
        }));
      },this);
      var geoJsonLayer = L.geoJson(d);

      this.mapLayers.addLayer(new L.TileLayer(osmUrl, {
        maxZoom: 15,
        attribution: osmAttrib
      }));
      this.map.addLayer(this.mapLayers);
      if (neighbourhoodPoints.length > 0) {
        this.map.addLayer(this.markersLayer);
      }
      this.map.fitBounds(geoJsonLayer.getBounds(), {
        maxZoom: 15
      });
    } catch (err) {

      console.error(err);
    }
  }
}
