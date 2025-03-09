// 載入模組:組態設定
import * as configs from "@/config";

import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";
import VueJwtDecode from "vue-jwt-decode";

Vue.use(Router);

const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

// push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}



let cvsArr = new Array(8).fill().map((v, i) => ({
  path: `/cardiac/doc${i + 1}`,
  name: `doc${i + 1}`,
  component: () => import(`./views/Cardiac/doc${i + 1}`),
}));
//統計作業中的，統計表更新，先不放上ris 200
//NavBarMain component會擋掉
cvsArr.push(
  {
    path: "/ImageStat",
    name: "ImageStat",
    component: () => import("./views/TableState/ImageComponents/ImageStat.vue"),
  },
  {
    path: "/ReportStat",
    name: "ReportStat",
    component: () =>
      import("./views/TableState/ReportComponents/ReportStat.vue"),
  },
  {
    path: "/CheckRoomStat",
    name: "CRStat",
    component: () =>
      import("./views/TableState/CheckRoomComponents/CheckRoomStat.vue"),
  }
);
const subArr = new Array(8).fill().map((v, i) => ({
  path: `/sub/doc${i + 1}`,
  name: `subDoc${i + 1}`,
  component: () => import(`./views/Sub/doc${i + 1}`),
}));

subArr.push({
  path: "/sub/doc/demo/:index",
  name: "docDemo",
  component: () => import("./views/Sub/docDemo"),
});


export const router = new Router({
  path: "/",
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "homeRoot",
      component: () => import(`./views/${process.env.VUE_APP_HomePage}.vue`),
    },
    {
      path: "/home",
      name: "home",
      component: () => import(`./views/${process.env.VUE_APP_HomePage}.vue`),
    },
    {
      path: "/MI01/FI0101",
      name: "FI0101",
      component: () => import("./views/MI01/FI0101.vue"),
    },
    //2020/1/10 Light Add
    {
      path: "/MI01/FI0102",
      name: "FI0102",
      component: () => import("./views/MI01/FI0102.vue"),
    },
    //JAMES UPDATED
    {
      path: "/MI02/FI0201",
      name: "FI0201",
      component: () => import("./views/MI02/FI0201-2.vue"),
    },
    {
      path: "/MI02/FI0202",
      name: "FI0202",
      component: () => import("./views/MI02/FI0202-2.vue"),
    },
    {
      path: "/MI02/FI0203",
      name: "FI0203",
      component: () => import("./views/MI02/FI0203.vue"),
    },
    {
      path: "/MI02/FI0203-1",
      name: "FI0203-1",
      component: () => import("./views/MI02/FI0203-1.vue"),
    },
    {
      path: "/MI02/FI0204",
      name: "FI0204",
      component: () => import("./views/MI02/FI0204.vue"),
    },
    // {
    //   path: "/MI02/FI0201",
    //   name: "FI0201",
    //   component: () => import("./views/MI02/FI0201.vue")
    // },
    // {
    //   path: "/MI02/FI0201/:guid",
    //   name: "FI0202",
    //   component: () => import("./views/MI02/FI0202.vue")
    // },
    {
      path: "/subReport",
      name: "SubReport",
      component: () => import("./views/SubReport/index.vue"),
    },
    {
      path: "/reportWindow",
      name: "ReportWindow",
      component: () => import("./views/ReportWindow/index.vue"),
    },
    {
      path: "/MI03/FI0301",
      name: "FI0301",
      component: () => import("./views/MI03/FI0301.vue"),
    },

    {
      path: "/MI03/FI0302",
      name: "FI0302",
      component: () => import("./views/MI03/FI0302.vue"),
    },
    {
      path: "/MI03/FI0303",
      name: "FI0303",
      component: () => import("./views/MI03/FI0303.vue"),
    },
    {
      path: "/MI03/FI0304",
      name: "FI0304",
      component: () => import("./views/MI03/FI0304.vue"),
    },
    {
      path: "/MI03/FI0304ForSub",
      name: "FI0304ForSub",
      component: () => import("./views/MI03/FI0304ForSub.vue"),
    },
    {
      path: "/MI03/FI0305",
      name: "FI0305",
      component: () => import("./views/ShiftNote/FI0305.vue"),
    },
    {
      path: "/MI03/FI0305-1",
      name: "FI0305-1",
      component: () => import("./views/MI03/FI0305-1.vue"),
    },
    {
      path: "/MI03/FI0306-1",
      name: "FI0306-1",
      component: () => import("./views/MI03/FI0306-1.vue"),
    },
    {
      path: "/MI03/FI0306",
      name: "FI0306",
      component: () => import("./views/MI03/FI0306.vue"),
    },
    {
      path: "/MI03/FI0307",
      name: "FI0307",
      component: () => import("./views/MI03/FI0307.vue"),
    },
    {
      path: "/MI03/FI0307Demo",
      name: "FI0307Demo",
      component: () => import("./views/MI03/FI0307Demo.vue"),
    },
    {
      path: "/MI03/FI0308",
      name: "FI0308",
      component: () => import("./views/MI03/FI0308.vue"),
    },
    {
      path: "/MI03/FI0309",
      name: "FI0309",
      component: () => import("./views/MI03/FI0309.vue"),
    },
    {
      path: "/MI03/FI0310",
      name: "FI0310",
      component: () => import("./views/MI03/FI0310.vue"),
    },
    //統計表單 -- 20個表單
    //  {
    //    path: "/CheckRoomStat",
    //    name: "CheckRoomStat",
    //    component: () => import("./views/TableState/CrsIndex.vue")
    //  },
    // {
    //   path: "/ImageStat",
    //   name: "ImageStat",
    //   component: () => import("./views/TableState/ImageStat.vue")
    // },
    {
      path: "/ReportStat",
      name: "ReportStat",
      component: () => import("./views/TableState/ReportComponents/ReportStat.vue")
    },
    // {
    // 	path: '/MI03/FI0301-2',
    // 	name: 'FI0301-2',
    // 	component: () => import('./views/MI03/FI0301-2.vue')
    // },
    {
      path: "/Employee",
      name: "Employee",
      component: () => import("./views/Employee/Index"),
    },
    {
      path: "/Account",
      name: "Account",
      component: () => import("./views/Account/Index"),
    },
    {
      path: "/Role",
      name: "Role",
      component: () => import("./views/Role/Index"),
    },
    {
      path: "/AuditEvent",
      name: "AuditEvent",
      component: () => import("./views/AuditEvent/Index"),
    },
    {
      path: "/Patient",
      name: "Patient",
      component: () => import("./views/Patient/Index.vue"),
    },
    {
      path: "/CheckCategory",
      name: "CheckCategory",
      component: () => import("./views/CheckCategory/Index"),
    },
    {
      path: "/CheckCombo",
      name: "CheckCombo",
      component: () => import("./views/CheckCombo/Index"),
    },
    {
      path: "/CheckItem",
      name: "CheckItem",
      component: () => import("./views/CheckItem/Index"),
    },
    {
      path: "/Device",
      name: "Device",
      component: () => import("./views/Device/Index"),
    },
    {
      path: "/Room",
      name: "Room",
      component: () => import("./views/Room/Index"),
    },
    {
      path: "/Medication",
      name: "Medication",
      component: () => import("./views/Medication/Index"),
    },
    {
      path: "/CodeName",
      name: "CodeName",
      component: () => import("./views/CodeName/Index"),
    },
    {
      path: "/SubMedication",
      name: "SubMedication",
      component: () => import("./views/SubMedication/Index"),
    },
    {
      path: "/Institution",
      name: "Institution",
      component: () => import("./views/Institution/Index"),
    },
    {
      path: "/Hospital",
      name: "Hospital",
      component: () => import("./views/Hospital/Index"),
    },
    {
      path: "/Function",
      name: "Function",
      component: () => import("./views/Function/Index"),
    },
    {
      path: "/DeviceWorkload",
      name: "DeviceWorkload",
      component: () => import("./views/DeviceWorkload/Index"),
    },
    {
      path: "/EmployeeWorkload",
      name: "EmployeeWorkload",
      component: () => import("./views/EmployeeWorkload/Index"),
    },
    {
      path: "/DefaultSpecialTime",
      name: "DefaultSpecialTime",
      component: () => import("./views/DefaultSpecialTime/Index"),
    },
    {
      path: "/SpecialTime",
      name: "SpecialTime",
      component: () => import("./views/SpecialTime/Index"),
    },
    {
      path: "/Schedule",
      name: "Schedule",
      component: () => import("./views/Schedule/Index"),
    },
    {
      path: "/WeekScheduling",
      name: "WeekScheduling",
      component: () => import("./views/WeekScheduling/Index"),
    },
    {
      path: "/Holiday",
      name: "Holiday",
      component: () => import("./views/Holiday/index"),
    },
    {
      path: "/MonthScheduling",
      name: "MonthScheduling",
      component: () => import("./views/MonthScheduling/Index"),
    },
    {
      path: "/ManualAssign",
      name: "ManualAssign",
      component: () => import("./views/ManualAssign/Index"),
    },
    {
      path: "/ProcedureGroup",
      name: "ProcedureGroup",
      component: () => import("./views/ProcedureGroup/Index"),
    },
    {
      path: "/ModalityCategory",
      name: "ModalityCategory",
      component: () => import("./views/ModalityCategory/Index"),
    },
    {
      path: "/HrrWord",
      name: "HrrWord",
      component: () => import("./views/HrrWord/Index"),
    },
    {
      path: "/BookingTest",
      name: "BookingTest",
      component: () => import("./views/BookingTest/Index"),
    },
    {
      path: "/BookingWindow",
      name: "bookingWindow",
      component: () => import("./views/BookingWindow/index"),
    },
    {
      path: "/Login",
      name: "LogIn",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/SubReport/templateMaintain",
      name: "templateMaintain",
      component: () => import("./views/SubMaintain"),
    },
    {
      path: "/WorkingSchedule",
      name: "workingSchedule",
      component: () => import("./views/WorkingSchedule"),
    },
    {
      path: "/FailureImageProcess",
      name: "FailureImageProcess",
      component: () => import("./views/FailureImageProcess"),
    },
    {
      path: "/HolidayArrangement",
      name: "HolidayArrangement",
      component: () => import("./views/HolidayArrangement"),
    },
    ...subArr,
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "LogIn" },
    },
  ].concat(cvsArr),
});

router.beforeEach(async (to, from, next) => {
  if (to.query.token) {
    store.commit("setAuthState", true);
    store.commit("setAuthToken", to.query.token);
  }

  // - 注意: 別造成 endless recursive !
  // if (configs.Mode4Dev) console.log('router.beforeEach')
  // if (configs.Mode4Dev) console.log(`to.path = ${to.path}`)
  // 將JWT回傳 並驗證是否過期
  if (
    store.state.Profile4User.Authorized &&
    // store.state.Profile4User[configs.JWTTokenName] &&
    localStorage.token
  ) {
    // const tokenData = VueJwtDecode.decode(
    //   store.state.Profile4User[configs.JWTTokenName]
    // );
    // //驗證toekn是否過期
    // //若現在時間大於Token時間則表示Token過期 重登!
    // if (new Date() > new Date(tokenData.exp * 1000) && to.path !== "/Login") {
    //   next("/Login");
    // } else {
    //   next()

    const tokenData = VueJwtDecode.decode(localStorage.token);

    if ((new Date() > new Date(tokenData && tokenData.exp ? tokenData.exp * 1000 : 0) || !localStorage.token) && to.path !== "/Login") {
      next("/Login");
    } else {
      next()

      // const toName = to.name.includes("-") ? to.name.split("-")[0] : to.name;
      // if ([...store.state.Profile4User.functions, "home"].includes(toName) || store.state.Profile4User.id === "admin") {
      //   next();
      // } else {
      //   // 若該頁使用者沒權限則導至 首頁
      //   next("/home");
      // }
    }
  } else {
    if (to.path !== "/Login") next("/Login");
    else {
      next();
    }
  }
});
