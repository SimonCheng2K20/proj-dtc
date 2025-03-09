import { createRouter, createWebHashHistory } from 'vue-router'
// import { useStore } from 'vuex'
import store from '../store'
import statistics from './statistics'
import diagnosis from './diagnosis'
import system from './system'
import { getDakarInfo, getDakarById, leaveMeet } from 'Service/apis.js'
import { nextTick } from 'vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'home page',
      keepAlive: true,
      name: 'Home',
      needfooter: true,
    },
    component: () => import('../views/home/index.vue'),
    beforeEnter: (to, from, next) => {
      //避免協助人員亂看
      const dakarNoCheck = store.state?.dakar ? store.state?.dakar.No : ''
      if (!sessionStorage.token || sessionStorage.token == 'undefined' || (`${dakarNoCheck}`.includes('assist') && from.name == 'formalForm')) {
        next({ name: 'Auth' })
      } else {
        next()
      }
    },
  },
  {
    path: '/home',
    name: 'redirHome',
    redirect: { name: 'Home' },
  },
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   meta: {
  //     title: 'Login',
  //   },

  //   children: [
  //     {
  //       path: 'Login',
  //       name: 'Login',
  //       component: () => import('views/auth/index.vue'),
  //       meta: {
  //         title: 'Login',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/auth',
    name: 'Auth',
    meta: {
      title: 'auth',
      needfooter: false,
    },
    component: () => import('../views/auth/index.vue'),
  },
  {
    path: '/jump',
    name: 'Jump',
    meta: {
      title: 'jump',
      needfooter: false,
    },
    component: () => import('../views/jump.vue'),
  },
  system,
  statistics,
  diagnosis,
  { path: '/:pathMatch(.*)*', redirect: { name: 'Auth' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // console.log("to", to, "from", from);
  // console.log("store.state", store.state);

  if (!store.getters.g_isLogin && to.name !== 'Auth') {
    // console.log('11111111111111');
    const _user = store.state?.dakar ? store.state?.dakar : null

    if (!!_user?.Token) {
      //has token--- reload will happen
      // console.log('22222222222222');
      store.commit('m_setAuthData', _user)
      next()
    } else if (to.name == 'recordingMaintain' && Boolean(to.query.token)) {
      //no token but is input url directly
      // console.log('3333333333333333333333333');
      //token

      console.log(`from router (to.query.token)`, to.query.token)

      sessionStorage.setItem('token', to.query.token)
      //set main data
      const { data } = await getDakarInfo()

      data.Token = to.query.token
      store.commit('m_setAuthData', data)
      sessionStorage.setItem('dakar', JSON.stringify(data))

      //set other data
      const dakarNo = store.state?.dakar ? store.state?.dakar.No : ''
      const { data: otherData } = await getDakarById(`${dakarNo}`)
      store.commit('m_setOthersData', otherData)

      next()
    } else if (to.name == 'Jump' && Boolean(to.query.token)) {
      //jumpage
      // console.log('jump', to.query.token);
      next()
    } else {
      //no token
      // console.log('444444444444');
      next({ name: 'Auth' })
    }
  } else if (store.getters.g_isLogin && to.name == 'recordingMaintain' && Boolean(to.query.token) && from.name != 'recordingMaintain') {
    //has login but input token url
    store.commit('m_setToDefaultData')
    sessionStorage.clear()

    //has token but is input url directly
    // console.log('555555555555555');

    //token
    sessionStorage.setItem('token', to.query.token)
    //set main data
    const { data } = await getDakarInfo()
    data.Token = to.query.token
    store.commit('m_setAuthData', data)
    sessionStorage.setItem('dakar', JSON.stringify(data))

    // //set other data
    const dakarNo = store.state?.dakar ? store.state?.dakar.No : ''
    const { data: otherData } = await getDakarById(`${dakarNo}`)
    store.commit('m_setOthersData', otherData)

    store.dispatch('a_setFunctionList')

    next()
  } else {
    // console.log('666666666666666666666');

    const isEnterRoom = sessionStorage.getItem('isEnterRoom') ? JSON.parse(sessionStorage.getItem('isEnterRoom')) : ''

    if (Boolean(isEnterRoom) && from.name == 'formalForm') {
      let roomId = sessionStorage.getItem('chatroom') ? `${JSON.parse(sessionStorage.getItem('chatroom'))}`.replace(/\"/g, '') : ''
      leaveMeet(roomId)
      sessionStorage.setItem('isEnterRoom', '')
    }
    next()
  }
})
export default router
