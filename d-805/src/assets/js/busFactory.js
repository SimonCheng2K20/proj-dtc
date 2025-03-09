import Vue from "vue";
const EventStore = {};
const Bus = new Vue();

// remove all Events
const destroyHandler = function() {
  // 'this' means which components use method
  const currentEventObj = EventStore[this._uid];
  if (typeof currentEventObj === "undefined") {
    return;
  }
  for (let type in currentEventObj) {
    const key = Array.isArray(type) ? type.join(",") : type;
    // Bus remove event
    Bus.$off(type, currentEventObj[key]);
  }
  // remove recode assemble
  delete EventStore[this._uid];
};

const BusFactory = (vm) => {
  // current destroyed hook
  const destroyed = vm.$options.destroyed;
  const uid = vm._uid;
  EventStore[uid] = {};
  !destroyed.includes(destroyHandler) && destroyed.push(destroyHandler);
  return {
    $on: (type, handler) => {
      const key = Array.isArray(type) ? type.join(",") : type;
      EventStore[uid][key] = handler;
      Bus.$on(type, handler);
    },
    $off: (type, handler) => {
      if (!type) {
        delete EventStore[uid];
        Bus.$off();
        return;
      }
      const key = Array.isArray(type) ? type.join(",") : type;
      // 删除对应的事件
      delete EventStore[uid][key];
      Bus.$off(type, handler);
    },
    $once: (...params) => Bus.$once(...params),
    $emit: (...params) => Bus.$emit(...params),
  };
};
BusFactory.$emit = (...params) => Bus.$emit(...params);
BusFactory.$once = (...params) => Bus.$once(...params);
export default BusFactory;
