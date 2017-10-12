
export class EventAware {
  constructor(elem) {
    this._elem = elem;
    this.handlers = [];
  }

  subscribe(fn) {
    this.handlers.push(fn);
  }

  unsubscribe(fn) {
    this.handlers = this.handlers.filter((i) => i !== fn);
  }

  fire(o) {
    this.handlers.forEach(function(item) { item.call(this, o); },this);
  }
}
