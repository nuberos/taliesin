var fs = require('fs');
var origJson = require('./src/public/geojson/census_tracts_long.json');
var destJson = require('./src/public/geojson/neighbourhoods.json');


/* destJson.objects.neighborhoods.geometries.forEach(function(element) {
    //console.log(element)
    var output = origJson.features.filter(function(value){ return value.properties.codbar==element.id;})
    console.log('elem.id:'+ element.id + ' out:' + JSON.stringify(output[0].properties));
    element.properties = {};
    element.properties.nomdis = output[0].properties.nomdis;
    element.properties.codbar = output[0].properties.codbar;
    element.properties.codbarrio = output[0].properties.codbarrio;
    element.properties.nombre = output[0].properties.nombre;
    element.properties.coddistrit = output[0].properties.coddistrit;
    element.properties.shape_area = output[0].properties.shape_area;
    element.properties.shape_len = output[0].properties.shape_len;
});

fs.writeFile('./src/public/geojson/census_tracts_long.json', JSON.stringify(destJson), (err) => {
    if(err) {
      throw err;
    }
});*/

destJson.features.forEach(function(element) {

    var output = origJson.objects.neighborhoods.geometries.filter(
      function(value){ return (value.properties.nombre==element.properties.neighbourhood && value.properties.nomdis==element.properties.neighbourhood_group);
    });
    console.log('elem.id:'+ element.id + ' out:' + JSON.stringify(output[0].properties));
    var barrio = element.properties.neighbourhood;
    var district = element.properties.neighbourhood_group;
    element.properties = {};
    element.properties.neighbourhood = barrio;
    element.properties.district = district;
    element.properties.nomdis = output[0].properties.nomdis;
    element.properties.codbar = output[0].properties.codbar;
    element.properties.codbarrio = output[0].properties.codbarrio;
    element.properties.nombre = output[0].properties.nombre;
    element.properties.coddistrit = output[0].properties.coddistrit;
    element.properties.shape_area = output[0].properties.shape_area;
    element.properties.shape_len = output[0].properties.shape_len;
});

fs.writeFile('./src/public/geojson/neighbourhoods_long.json', JSON.stringify(destJson), (err) => {
    if(err) {
      throw err;
    }
});
