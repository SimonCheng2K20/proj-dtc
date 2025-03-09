import axios from 'axios'
import store from '../store'
// function digital2Number (num: number) { return ('0' + num).slice(-2) }

export const ajax = ({ url, method = 'get', data = null, isShowLoading = false }) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json'
    }
    const instance = axios.create({
      headers,
      baseURL: 'http://54.254.132.72:8082/',
      // baseURL: 'http://localhost:8082/',
      timeout: 8000
    })
    if(isShowLoading) store.commit('m_setLoadingStatus', true);
    if (isShowLoading) console.log('show loading')
    instance[method](url, data)
    .then(
      res => { resolve(res) })
    .catch(
      err => { reject(err) })
    .finally(()=>{
      if (isShowLoading) store.commit('m_setLoadingStatus', false);
    })
  })
}
