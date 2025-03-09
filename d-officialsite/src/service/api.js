import { ajax } from './axios.js'

export const getNews = (per, page) => ajax({ url: `news/items?per=${per}&page=${page}` })

export const addContact = data => ajax({ url: 'contact/addItem', method: 'post', data, isShowLoading: true})
