import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import $global from './assets/js/global.js'
import $api from './assets/js/api.js'
import $websocket from './assets/js/websocket.js'

import Button from './components/Button.vue'
import CardBox from '@/components/CardBox.vue'
import Dialog from '@/components/Dialog.vue'
import InputLabel from '@/components/InputLabel.vue'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.scss'

Vue.use(ElementUI, { locale })

Vue.prototype.$global = $global
Vue.prototype.$api = $api
Vue.prototype.$websocket = $websocket

Vue.component('Button', Button)
Vue.component('CardBox', CardBox)
Vue.component('Dialog', Dialog)
Vue.component('InputLabel', InputLabel)

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  console.log('to', to)
  if (to.name === 'Login') {
    next()
  } else {
    if (store.state.userData.No) {
      try {
        store.commit('loading', true)
        await store.dispatch('getInit')
      } catch (err) {
        console.log(`error`, err)
      } finally {
        store.commit('loading', false)
      }

      if (store.state.userData.FunctionNos.includes(to.name)) {
        next()
      } else {
        next({ name: 'Login' })
      }
    } else {
      if (sessionStorage.token) {
        store.commit('loading', true)
        try {
          store.commit('userData', await $api.getAccountInfo())
          await store.dispatch('getInit')
        } catch (error) {
          store.commit('loading', false)
          sessionStorage.token = ''
          next({ name: 'Login' })
          return 0
        }
        store.commit('loading', false)

        if (store.state.userData.FunctionNos.includes(to.name)) {
          next()
        } else {
          next({ name: 'Login' })
        }
      } else next({ name: 'Login' })
    }
  }
})

router.afterEach((to) => {
  document.title = 'EMR - ' + to.meta.title
  store.commit('routerPath', to)
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
