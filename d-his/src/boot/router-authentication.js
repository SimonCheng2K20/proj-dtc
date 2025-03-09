import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth'
import { useGlobalStore } from 'stores/global'

export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const globalStore = useGlobalStore()

    const setIdle = () => {
      if (globalStore.isSetIdle === false) {
        // 先註解，不做自動登出
        // globalStore.startCheckIsActive()
      }
    }

    const userDataCheck = async () => {
      if (!authStore.userData.No) {
        const res = await authStore.getData()
        const error = res.find((item) => item.error)
        if (error) return { error }
      }

      return { data: true }
    }

    const beforeEnterSystemInit = () => {
      setIdle()
    }

    if (/^\/System/.test(to.path)) {
      if (sessionStorage.getItem('token') === null) {
        next('/Login')
        return
      }

      const { error } = await userDataCheck()
      if (error) {
        next('/Login')
        return
      }

      // const toRouteFunctionNo = to.matched.find((item) => !!item.meta.functionNo).meta.functionNo
      // if (authStore.userData.No !== 'assist' && !authStore.userData.FunctionNos.includes(toRouteFunctionNo)) {
      //   next('/Login')
      //   return
      // }

      beforeEnterSystemInit()
    }

    next()
  })

  if (process.env.PROD) {
    // 僅在生產時禁止上一頁，避免開發不便
    window.addEventListener('popstate', () => {
      history.pushState(history.state, null, document.URL)
    })

    router.afterEach(() => {
      history.pushState(history.state, null, document.URL)
    })
  }
})

