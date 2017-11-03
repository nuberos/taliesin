import { createEvent } from './eventFactory';

export class Controls {
  constructor(config, elem) {
    this._elem = elem;
    this.config = config;
  }

  init() {
    const items = this._elem.querySelectorAll("a");
    items.forEach(function(item) {
        item.addEventListener('click', (e) => console.log('click!'));
        item.addEventListener('mouseover', (e) => this.fire('highlight',{district: e.target.id, origin: e.target}));
        item.addEventListener('mouseout', (e) => this.fire('restore',{district: e.target.id, origin: e.target}));
    },this);
  }

  fire(eventType, data) {
    
    const options = {eventType: eventType};
    Object.assign(options,data);
    var event = createEvent(options);
    this._elem.dispatchEvent(event);
    console.info('event type: %s with details: %s fired',eventType,options);
  }
}
