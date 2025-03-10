import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

//npm i --save @fortawesome/free-regular-svg-icons
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(far);

//npm install @fortawesome/free-brands-svg-icons --save
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";
library.add(faGooglePlus);

Vue.component("font-awesome-icon", FontAwesomeIcon);

import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();
