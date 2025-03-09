/*
subect:基本 Axios 模組參考
create:20191003, Pollux
update:20191003, Pollux
usages:
	// 於 main.js 中加入:
	import Axios_Test from './_services/Axios_Test'
	Vue.use(Axios_Test)
	// 於 .vue 中的使用方式:
	this.$http
		.get('test01/hello')// 以 GET 動詞叫用 API
		.then(r => {
			// 叫用成功, 於 console 呈現相關資訊
			console.log(`${this.$GetTimeStamp()}>Completed`)
			console.log(`>> Verb: [${r.config.method}]`)
			console.log(`>> URL : [${r.config.url}]`)
			console.log(`>> Data: [${r.data}]`)
		})
		.catch(err => {
			// 叫用失敗
			console.log(`${this.$GetTimeStamp()}>Error catched:`)
			console.log(`>> Verb: [${err.config.method}]`)
			console.log(`>> URL : [${err.config.url}]`)
			console.log(`>> Msg : [${err.message || 'Error'}]`)
		})
remark:
*/
/* eslint-disable no-console */
// 載入組態設定
import * as configs from "@/config";

import store from "@/store/index";

// 載入 Axios 元件
import axios from "axios";

// 建立 Axios 常數 - 預設組態
export const Axios = axios.create({
  baseURL: configs.APIBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 50,
});

Axios.defaults.timeout = configs.TimeOut * 1000;

// TODO: Axios 攔截器
//
Axios.interceptors.request.use(
  (config) => {
    if (store.state.Profile4User.Authorized) {
      if (store.state.Profile4User[configs.JWTTokenName]) {
        config.headers.Authorization = `Bearer ${store.state.Profile4User[configs.JWTTokenName]}`;
      }
    }
    return config;
  },
  (error) => {
    console.log("Axios.interceptors.request.OnError:");
    console.log(error);
    return Promise.reject(error);
  }
);
//
//Axios.interceptors.response.use
Axios.interceptors.response.use(
  (res) => {
    //console.log('Axios.interceptors.response.OnComplete:')
    //console.log(res)
    return res;
  },
  (error) => {
    console.log("Axios.interceptors.response.OnError:");
    //
    // http 404 之類的狀況不會有 error.response
    //	- 如果需要, 得從後台 C# 加工 (搜尋 web api 2 catch 404)
    if (error.response) {
      console.log(`> response.status=${error.response.status}`);
      console.log(`> response.statusText=${error.response.statusText}`);
      if (error.response.status === 401) {
        // 401 = 驗證失敗, 跳到登入畫面?
        //room.href = '/login'
        console.log("401-need to transfer");
      } else if (error.response.status === 500) {
        // 500 = Server Error
        // do something
        console.log("500-internal error");
      }
    }
    //
    return Promise.reject(error);
    //return Promise.resolve(error)
  }
);
//

// 宣告為 Vue.js 的全域函數 $http 並且使用預設組態
export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  },
};
