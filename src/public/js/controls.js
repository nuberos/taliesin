import { createEvent } from './eventFactory';

export class Controls {
  constructor(config, components) {
    this.config = config;
    this.components = components;
    this.components.primary.addEventListener('highlight', (e) => this.highlight(e));
    this.components.primary.addEventListener('restore', (e) => this.restore(e));
    this.components.secondary.addEventListener('highlight', (e) => this.highlight(e));
    this.components.secondary.addEventListener('restore', (e) => this.restore(e));
  }

  highlight(e) {
    this.components.controls.querySelector(`a#${e.detail.district}`).classList.add("selected");
  }

  restore(e) {
    this.components.controls.querySelector(`a#${e.detail.district}`).classList.remove("selected");
  }

  init() {
    const items = this.components.controls.querySelectorAll("a");
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
    this.components.controls.dispatchEvent(event);
    console.info('event type: %s with details: %s fired',eventType,options);
  }
}
