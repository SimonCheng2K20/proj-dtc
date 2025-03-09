import axios from 'axios'
import store from '../store'
import router from '../router'
import dayjs from 'dayjs'
// import { useRouter } from "vue-router";
import { useToast } from 'vue-toastification'
const toast = useToast()

export default function ajax({ url, method = 'get', data = null, isLoading = false, showDialog = false, successMessage = null }) {
  return new Promise((resolve, reject) => {
    // console.log("url", url);
    if (isLoading) store.commit('m_setLoadingStatus', true)
    let headers = Object.assign(
      {
        'Content-Type': 'application/json',
        dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        // 'timeZoneCode': Math.round(new Date().getTimezoneOffset() / 60),
      },
      // store.getters.g_userToken
      //   ? { Authorization: `Bearer ${store.getters.g_userToken}` }
      //   : {}
      {
        Authorization: `Bearer ${
          sessionStorage.getItem('token') &&
          !`${url}`.includes('Notice/ActiveList') &&
          !`${url}`.includes('Auth/GetCaptcha') &&
          !`${url}`.includes('Auth/Login')
            ? sessionStorage.getItem('token').replace(/\"/g, '')
            : ''
        }`,
      }
    )

    // console.log("headers", headers);

    const instance = axios.create({
      headers,
      // baseURL: 'http://192.168.1.201/rMeeting/',
      baseURL: process.env.NODE_ENV === 'development' ? '/rmeeting' : '/',
      // withCredentials: true,
      timeout: 8000,
    })
    const applayInstance = method === 'get' ? instance.get : method === 'post' ? instance.post : method === 'put' ? instance.put : instance.delete

    applayInstance(url, data)
      .then((res) => {
        resolve(res)
        if (successMessage)
          store.commit('m_setDialog', {
            show: true,
            title: successMessage?.title || 'Success',
            content: successMessage?.content || '成功',
          })
      })
      .catch(function (err) {
        if (showDialog) {
          // console.log(err.response.data)
          store.commit('m_setDialog', {
            show: true,
            title: `錯誤 (${err.response.status})`,
            content: `${err.response.data?.title || err.response.data || '發生錯誤，請洽管理者'} (${err.response.statusText})` || '錯誤',
          }) //直接跳錯誤視窗
        }
        if (err.response.status === 401 && router.currentRoute.value.name !== 'Auth') {
          sessionStorage.clear()
          store.commit('m_setToDefaultData')
          router.replace({ name: 'Auth' }) // 錯誤狀態是 401 且 不在登錄頁 則導到登入頁

          store.commit('m_setDialog', {
            show: true,
            title: '系統資訊',
            content: !!err.response.data ? err.response.data : `連線逾時，請重新登入`,
          })
        }

        reject(err)
      })
      .finally(() => {
        if (isLoading) store.commit('m_setLoadingStatus', false)
      })
  })
}
