import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/index.scss'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import $global from './assets/js/global.js'
import $api from './assets/js/api.js'
import $websocket from './assets/js/websocket.js'

import CardBox from './components/CardBox.vue'
import Button from './components/Button.vue'
import Dialog from '@/components/Dialog.vue'
import InputLabel from '@/components/InputLabel.vue'

Vue.use(ElementUI,{locale});
Vue.component('CardBox', CardBox)
Vue.component('Button', Button)
Vue.component('Dialog', Dialog)
Vue.component('InputLabel', InputLabel)
Vue.prototype.$global=$global
Vue.prototype.$api=$api
Vue.prototype.$websocket=$websocket
Vue.config.productionTip = false

router.beforeEach(async (to,from,next)=> {
  console.log('to',to)
  if(to.path==="/login") {
    next()
  }
  else {
    if(store.state.userData) {
      store.commit('loading',true)
      await store.dispatch('getInit')
      store.commit('loading',false)
      next()
      if(store.state.userData.FunctionNos.includes(to.name)) {
        next()
      }
      else {
        next({name:'Login'})
      }
    }
    else {
      if(localStorage.token) {
        store.commit('loading',true)
        try {
          store.commit('userData',await $api.getAccountInfo())
          await store.dispatch('getInit')
        } catch (error) {
          store.commit('loading',false)
          localStorage.token=''
          next({name:'Login'})
          return 0
        }
        store.commit('loading',false)
        next()
        if(store.state.userData.FunctionNos.includes(to.name)) {
          next()
        }
        else {
          next({name:'Login'})
        }
      }
      else next({name:'Login'})
    }
  }
})

router.afterEach((to) => {
  document.title='病歷掃描系統 - '+to.meta.title
  store.commit('routerPath',to)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
