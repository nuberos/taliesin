

class HighlightDetails {
  constructor(options) {  
      this.district = options.district;
      this.origin = options.origin;  
  }  
}

class RestoreDetails {
    constructor(options) { 
        this.district = options.district;
        this.origin = options.origin;    
    }  
}

class MapDetails {
    constructor(options) {         
        this.geojson = options.geojson;
        this.d = options.d;  
        this.codbar = options.codbar; 
    }  
}

function createEvent(options) {
    let data;
    switch(options.eventType) {
    case 'highlight':
        data = new HighlightDetails(options);
        break;
    case 'restore':
        data = new RestoreDetails(options);
        break;      
    case 'showmap':
        data = new MapDetails(options);
        break; 
    } 
    return new CustomEvent(options.eventType, {detail: data });
}
export {createEvent};
