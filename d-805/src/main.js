//
// $ npm i ckeditor4
// $ npm i ckeditor/ckeditor-releases#full/latest
//
import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import "./plugins/fontawesome";
import "./plugins/axios";
import "@/styles/ejs2.css";
import App from "./App.vue";
import { router } from "./router";
import store from "./store/index";
import jssl from "./SupportLib";
import moment from "moment";
import ToggleButton from "vue-js-toggle-button";
import VueTabs from "vue-nav-tabs/dist/vue-tabs.js";
import "vue-nav-tabs/themes/vue-tabs.css";
import IdleVue from "idle-vue";
import { DatePickerComponent, DatePickerPlugin, DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import "vue-multiselect/dist/vue-multiselect.min.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import globalComps from "@/assets/js/global-components.js";
const eventsHub = new Vue();
//Vue.use(ElementUI);
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  ChartDataLabels,
  idleTime: 3000, // 3 seconds,
  startAtIdle: false,
});
Vue.use(VueTabs);
Vue.use(ToggleButton);
Vue.prototype.$moment = moment;

globalComps.forEach(({ name, comp }) => {
  Vue.component(name, comp);
});

// <div class="d-flex align-items-center pl-3 border-bottom my-2">
/* <h5><font-awesome-icon
  icon="file-image"
  class="mr-1"
/></h5>
  <h3 v-text="title" />
  </div > */

Vue.use(jssl);
Vue.component(DatePickerPlugin.name, DatePickerComponent);
Vue.use(DateTimePickerPlugin);
window.$ = require("jquery");
window.jQuery = window.$;
window.signalr = require('signalr');
require("@/assets/jquery.blockUI.js");
window.onbeforeunload = function() {
  return "Are you sure";
};
window.onkeyup = function(keyEvent) {
  let keyBoardMove = keyEvent.isTrusted;
  if (keyBoardMove) {
    store.state.Profile4User.ActionTime = new Date();
  }
};
import Axios_Test from "./_services/Axios_Test";
Vue.use(Axios_Test);
Vue.config.productionTip = false;
Vue.directive("print", function(el, { value: { inBody, origin, printType, afterPrint, isDemo = false } }) {
  const app = document.getElementById("app");
  if (app.classList.contains("noPrint")) app.classList.remove("noPrint");
  if (inBody) {
    setTimeout(() => {
      const styleDom = document.createElement("style");
      // printType { 0: A4, 1: B6, 2: B5}

      styleDom.innerHTML = isDemo
        ? `@page {size: ${printType == 2 ? "B5 landscape" : printType == 1 ? "B6 landscape" : "A4"};}`
        : `@page {size: ${printType == 2 ? "256mm 182mm" : printType == 1 ? "182mm 128mm" : "202mm 290mm"};}`;
      
      if(!isDemo && printType ==1) {
        styleDom.innerHTML += `\n@media print {html, body {transform: scale(0.5) translate(-50%, -50%);}}`;
      }
      // document.body.classList.add(printType == 2 ? "B5" : printType == 1 ? "B6" : "A4");
      document.body.appendChild(styleDom);
      document.body.appendChild(el);
      // const border = document.createElement("div");
      // border.setAttribute("id", "borders");
      // document.body.appendChild(border);

      app.classList.add("noPrint");
      document.body.classList.toggle("print");
      window.print();
      afterPrint();
      document.body.classList.toggle("print");
      app.classList.remove("noPrint");
      document.body.removeChild(styleDom);
      // document.body.classList.remove(printType == 2 ? "B5" : printType == 1 ? "B6" : "A4");
    }, 100);
  } else if (!inBody && el.parentNode && origin.$el && el.parentNode.className != origin.$el.className) {
    origin.$el.appendChild(el);
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

window.dtcToday = () => {
  return (
    moment()
      .add(1, "days")
      .toISOString()
      .split("T")[0] + "T00:00:00.000Z"
  );
};

window.dtcStart = (num = 1) => {
  let days = 30;
  if (num === 2) {
    days = 30 * 3;
  } else if (num == 3) {
    days = 30 * 6;
  } else if (num == 4) {
    days = 365;
  }
  return (
    moment()
      .subtract(days, "days")
      .toISOString()
      .split("T")[0] + "T00:00:00.000Z"
  );
};
