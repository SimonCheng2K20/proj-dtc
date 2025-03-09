import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.css'
import store from './store'
import router from './router'
import usePrime from './plugins/prime'
import useCustom from './plugins/customComps'
import { dateInput, resize } from './plugins/directives.js'

import JsonViewer from 'vue-json-viewer'
import mitt from 'mitt'

import Toast from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

import VueSignaturePad from 'vue-signature-pad'

// Element Plus





const options = {
  // You can set your default options here
  transition: 'Vue-Toastification__fade',
  maxToasts: 20,
  newestOnTop: true,
}

const emitter = mitt()

const app = useCustom(usePrime(createApp(App).use(router).use(store).use(Toast, options).use(VueSignaturePad).use(JsonViewer)))

app.directive('date-input', dateInput)
app.directive('resize', resize)

app.provide('$chineseYear', (date) => parseInt(date.slice(0, 4)) - 1911 + date.slice(4))

app.provide('$getUniqueItemListBy', (list, key) => [...new Map(list.map((item) => [item[key], item])).values()])

app.provide('globalVariable', {
  showMedicalCardMessage: true,
})

app.provide('emitter', emitter)

app.mount('#app')
