import Vue from "vue";
import "jschannel";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import $ from "jquery";
window.$ = $;
import {
  BootstrapVue,
  IconsPlugin
} from "bootstrap-vue";
// import contenteditable from "vue-contenteditable";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import VueTabs from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'
import VueClipboard from 'vue-clipboard2'
import Vlf from 'vlf'
import localforage from 'localforage'
import ToggleButton from 'vue-js-toggle-button'
// import VueMousetrap from 'vue-mousetrap'

Vue.use(Vlf, localforage)
// Vue.use(contenteditable)
Vue.use(VueTabs)
Vue.use(VueClipboard)
Vue.use(ToggleButton)
// Vue.use(VueMousetrap)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

Vue.prototype.$formatPrice = function (value) {
  value = Number(value);
  if (!value || isNaN(value)) return "";
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

Vue.prototype.$formatDate = function (str) {
  if (!str) return "";
  let date1 = moment(str).format();
  return date1.split("T")[0];
};

Vue.prototype.$dataFilter = function (key, qs, str) {
  str = '' + str;
  const lower = str.toLowerCase();
  return qs + `&$filter=substringof('${lower}', tolower(${key})) eq true`
};

Vue.prototype.$appendFilter = function (key, qs, str) {
  str = '' + str;
  const lower = str.toLowerCase();
  return qs + ` and substringof('${lower}',tolower(${key})) eq true`;
};

window.level4 = ["一", "二", "三", "四"];
window.level6 = ["一", "二", "三", "四", "五", "六"];

let year = new Date().getFullYear() - 1911;
const years = new Array(7).fill().map((s, i) => year - i);
window.year = year;
window.years = years;
window.taipeis = [
  "北投",
  "士林",
  "中山",
  "內湖",
  "大同",
  "松山",
  "萬華",
  "中正",
  "大安",
  "信義",
  "南港",
  "文山"
];
