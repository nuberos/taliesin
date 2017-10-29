
var Events = {
    CLICK: 'onclick',
    MOUSEOVER: 'onmouseover',
    MOUSEOUT: 'onmouseout'
};

var EventAware = class EventAware {
  constructor(elem) {
    this._elem = elem;
    this.handlers = new Map();
  }

  subscribe(evt, fn) {
    const hds = this.handlers.get(evt) || new Set();
    if(hds.has(fn)) {

      console.info('listener already registered, skipping it');
    }
    else {

      hds.add(fn);
    }
    this.handlers.set(evt,hds);
  }

  unsubscribe(evt, fn) {
    const hds = this.handlers.get(evt) || new Set();
    hds.delete(fn);
    this.handlers.set(evt,hds);
  }

  fire(evt, o) {
    console.info('event fired %s', evt)
    const hds = this.handlers.get(evt) || new Set();
    hds.forEach(function(item) { item.call(this, o); },this);
  }
}
export {Events, EventAware};
