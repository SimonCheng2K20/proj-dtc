/* eslint-disable no-console */
/*
> SupportLib - javascript support Lib.
> Vue PlugIns ref:
https://vuejs.org/v2/guide/plugins.html
https://dev.to/nkoik/writing-a-very-simple-plugin-in-vuejs---example-8g8

Pollux:
- 為了明確區分, 命名在原則上還是以 $ 開頭
- 嘗試加入 JSDoc 文件規範, 以協助開發
	ref. [https://code.visualstudio.com/docs/languages/javascript#_jsdoc-support]
	ref. [https://jsdoc.app/]
	.	目前發現: JSDoc 對 import 進來的模組有效, 但以 require() 引入的似乎無效
	.	再繼續嘗試
- 也嘗試用 vuese, 但還沒有結果
	$ npm i @vuese/cli -g
	$ vuese gen
*/

/* -------------------------------------------------------------------------- */
/* 載入 vuex */
//import store from '@/store'

/* ========================================================================== */
/* 常數 */

// 載入組態設定模組
import * as configs from "@/config";

/**
 * 預設值 - Table with Paging 的每頁筆數選項集合
 */
const default4PagingPerPageOption = [
  { value: 5, text: "5 筆" },
  { value: 10, text: "10 筆" },
  { value: 20, text: "20 筆" },
  { value: 50, text: "50 筆" },
  { value: 100, text: "100 筆" },
];

/* -------------------------------------------------------------------------- */
/* 函數.Debug/Trace/Dev. */

function MethodNameOfStack(x) {
  var pos = x.indexOf(".");
  return pos >= 0 ? x.substr(pos + 1) : x;
}

function ParseStack(offset = 0) {
  var stacks = new Error().stack.split("\n");
  return stacks.length > 0
    ? stacks[0] === "Error"
      ? MethodNameOfStack(stacks[offset + 3].trim().split(" ")[1]) //Chrome,Edge
      : stacks[offset + 2].substr(0, stacks[offset + 2].indexOf("@")).replace("/<", "") //FireFox
    : "Unknown";
}

/* -------------------------------------------------------------------------- */
/* 函數.Debug/Trace/Dev. Part 2 */

function Log4StandardInfo(v = null, x = null, o = null) {
  return TimpStampTaiwan() + ":" + (o ? o.$options.name + "." : "") + (x ? x : o ? o.$VueMethodName(1) : ParseStack(1)) + (v ? ` > ${v}` : "");
}

function StandardErrorOutput4RESTfulAPI(errorObject, methodName) {
  if (methodName) {
    console.log(Log4StandardInfo("Error", methodName));
  } else {
    console.log(Log4StandardInfo("Error", ParseStack(1)));
  }
  if (errorObject) {
    console.log(errorObject);
    if (errorObject.config) {
      console.log(`>> [${errorObject.config.method}]`);
      console.log(`>> [${errorObject.config.url}]`);
    }
    console.log(`>> [${errorObject.message || "Error"}]`);
  }
}

/* -------------------------------------------------------------------------- */
/* 函數.格式化 */

/**
 * 數字三位一撇格式化
 * @param {number} i 要格式化的數值
 * @param {number} j 小數點以下的位數長度, 預設為: 小數點以下兩位
 * @return 格式化後的字串 (eg. 1,234.56)
 */
function NumericWithDecimal(i = 0, j = 2) {
  if (j < 0) j = 0;
  i = i.toString().replace(",", "");
  var k = j > 0 ? parseFloat(i).toFixed(j) : parseInt(i);
  if (k === "NaN") k = j > 0 ? (0).toFixed(j) : 0;
  return k.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/* -------------------------------------------------------------------------- */
/* 函數.日期時間 */

/**
 * 回傳台灣所屬時區(GMT+8)日期時間的格式化字串
 * @param {Date} obj 日期時間物件, 未給定時表示為取當下日期時間(預設值)來轉換
 * @return 格式化的日期時間字串(含三位微秒, 即: yyyyMMdd.hhmmss&#64;fff)
 */
function DateTimeNowTaiwan(obj = new Date()) {
  obj.setHours(obj.getHours() + 8);
  return obj
    .toISOString()
    .replace(/-/g, "")
    .replace(/:/g, "")
    .replace(".", "@")
    .replace("T", ".")
    .replace("Z", "");
}

/**
 * 回傳台灣所屬時區(GMT+8)時間的格式化字串
 * @param obj 日期時間物件, 未給定時表示為取當下日期時間來轉換
 * @return 格式化的時間字串(含三位微秒, 即: hhmmss&#64;fff)
 */
function TimpStampTaiwan(obj) {
  return DateTimeNowTaiwan(obj).substr(9);
}

/* -------------------------------------------------------------------------- */
/* 函數.資料 */

/**
 * 取得新的 GUID
 * @return GUID 字串(含 - 分隔符號)
 */
function StandardUUID() {
  var d = Date.now();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* -------------------------------------------------------------------------- */
/* 函數.檢查 */

/**
 * 檢查傳入的參數是否存在? 即: 非 undefined
 * @return boolean
 */
function IsTargetExists(e) {
  //	- 當 e 以 typeof 檢測的結果為 undefined 時, 即可認定為不存在
  //	- 做這個函數的原因是:
  //		> 如 datatable 某個欄位之值為 null 時,
  //			1. 在 RESTful API 傳回的 JSON 裡會是 "FieldName": null
  //			2. 以 JSON.parse(JSON.stringify(...)) 做 deep copy, 或直接 assign (shallow copy) 時,
  //				還是會把該欄位宣告為 property (或屬性)
  //			3. 但它在 if(FieldName) 判斷時, 會是 false, 因為 null 等於沒有值, 也就等於不存在
  //		> 如要判斷某個值為 boolean 的變數存不存在? 也會發生跟上述相同的狀況
  //		因此, 以這個判斷式來檢查變數或 property、attribution 是否存在?
  return typeof e !== "undefined";
}

/* -------------------------------------------------------------------------- */
/* 函數.轉換 */

/**
 * 以 JSON 操作來進行 Deep Copy
 * @return object
 */
function DeepCopyByJSON(e) {
  return IsTargetExists(e) ? JSON.parse(JSON.stringify(e)) : JSON.parse(JSON.stringify(""));
}

/* ========================================================================== */

export default {
  install(Vue) {
    /* - Global Variable, 宣告方式一 - */
    Vue.mixin({
      data: function() {
        return {
          // TWP.分頁.每頁幾筆.選項集
          //	>	get 諁詞表示為 Read Only
          //	>	使用方式: this.$root.TWPPagingPerPageOptionCollection
          //		...有點麻煩 XD
          get TWPPagingPerPageOptionCollection() {
            return default4PagingPerPageOption;
          },
        };
      },
    });
    /* - Global Variable, 宣告方式二 - */
    Vue.prototype.$DefaultPerPageOption = default4PagingPerPageOption;

    /* - Instance Method - general */
    Vue.prototype.$FormatDecimal = (i, d) => NumericWithDecimal(i, d);
    Vue.prototype.$FormatForceInteger = (i) => NumericWithDecimal(i, -1);
    Vue.prototype.$FormatStandardMoney = (i) => NumericWithDecimal(i, 2);
    Vue.prototype.$GetGUID = () => StandardUUID().replace(/-/g, "");
    Vue.prototype.$DateTimeNow = () => DateTimeNowTaiwan();
    Vue.prototype.$GetTimeStamp = () => TimpStampTaiwan();
    Vue.prototype.$IsThemeBlack = () => document.body.classList.contains(configs.ThemeId4Black);
    Vue.prototype.$Exists = (o) => IsTargetExists(o);
    Vue.prototype.$DeepCopy = (o) => DeepCopyByJSON(o);
    Vue.prototype.$GetApp = (e) => {
      if (e && e.$parent) {
        let level = 1;
        let i = e.$parent;
        while (i && !i.WaitingShow) {
          level++;
          if (i.$parent) {
            i = i.$parent;
          } else {
            return null;
          }
        }
        return [i, level];
      }
      return null;
    };

    /* - Instance Method for Debug/Trace - */
    Vue.prototype.$VueMethodName = (offset = 0) => ParseStack(offset);
    Vue.prototype.$logv = (x = null, o = null) => TimpStampTaiwan() + ":" + (o ? o.$options.name + "." : "") + (x ? x : o ? o.$VueMethodName(1) : ParseStack());
    Vue.prototype.$logp = (v = null) => TimpStampTaiwan() + (v ? `:${v}` : "");
    Vue.prototype.$logs = (v = null, x = null, o = null) => Log4StandardInfo(v, x, o);
    Vue.prototype.$stdErr = (o, x) => StandardErrorOutput4RESTfulAPI(o, x);
    Vue.prototype.$number2Digits = (num, pos = 2) => (new Array(pos - 1).fill("0").join("") + num).slice(-1 * pos);

    Vue.prototype.$convertRange = (dateRange, key) => {
      const convertToRange = (datetime, condition) =>
        new Date(`${datetime.getFullYear()}/${datetime.getMonth() + 1}/${datetime.getDate()} ${condition === "Start" ? "00:00:00" : "23:59:59"}`);
      // 判斷時間range後進行search
      return dateRange[0] && dateRange[1]
        ? dateRange
            .reduce((ac, cu, index) => {
              const condition = index === 0 ? "Start" : "End";
              ac.push(`${index === 0 ? "&" : ""}${key}${condition}=${convertToRange(cu, condition).toJSON()}`);
              return ac;
            }, [])
            .join("&")
        : "";
    };
  },
};
