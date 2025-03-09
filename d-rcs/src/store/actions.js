import { authLogin, getFunctionList } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import router from '@/router'
import store from '.'
const toast = useToast()
export default {
  a_SetDeviceMode(context, value) {
    context.commit('setDeviceMode', value)
  },
  a_setFunctionList(context) {
    return new Promise((resolve, reject) => {
      getFunctionList('&orderby=Seq asc').then((res) => {
        context.commit('m_setFunctionList', res.data.Items)
        resolve(res.data.Items)
      })
    })
  },
  async a_authLogin(context, authData) {
    try {
      const res = await authLogin(authData)
      return res
    } catch (err) {
      console.log(err)
      toast.error(`登入錯誤: ${err.data || err.toString}`, {
        timeout: 5000,
        hideProgressBar: true,
      })
      return err
    }
  },
}
