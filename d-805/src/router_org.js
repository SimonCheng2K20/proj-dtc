import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  path: "/",
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", name: "home", component: () => import(`./views/${process.env.VUE_APP_HomePage}.vue`) },
    {
      path: "/MI01/FI0101",
      name: "FI0101",
      component: () => import("./views/MI01/FI0101.vue")
    },
    {
      path: "/MI02/FI0201",
      name: "FI0201",
      component: () => import("./views/MI02/FI0201.vue")
    },
    {
      path: "/MI02/FI0201/:guid",
      name: "FI0202",
      component: () => import("./views/MI02/FI0202.vue")
    },
    {
      path: "/MI03/FI0301",
      name: "FI0301",
      component: () => import("./views/MI03/FI0301.vue")
    },
    {
      path: "/MI03/FI0302",
      name: "FI0302",
      component: () => import("./views/MI03/FI0302.vue")
    },
    {
      path: "/MI03/FI0303",
      name: "FI0303",
      component: () => import("./views/MI03/FI0303.vue")
    },
    {
      path: "/Employee",
      name: "Employee",
      component: () => import("./views/Employee/Index")
    },
    {
      path: "/Role",
      name: "Role",
      component: () => import("./views/Role/Index")
    },
    {
      path: "/Patient",
      name: "Patient",
      component: () => import("./views/Patient/Index.vue")
    },
    {
      path: "/CheckCategory",
      name: "CheckCategory",
      component: () => import("./views/CheckCategory/Index")
    },
    {
      path: "/CheckCombo",
      name: "CheckCombo",
      component: () => import("./views/CheckCombo/Index")
    },
    {
      path: "/CheckItem",
      name: "CheckItem",
      component: () => import("./views/CheckItem/Index")
    },
    {
      path: "/Device",
      name: "Device",
      component: () => import("./views/Device/Index")
    },
    {
      path: "/Room",
      name: "Room",
      component: () => import("./views/Room/Index")
    },
    {
      path: "/Medication",
      name: "Medication",
      component: () => import("./views/Medication/Index")
    },
    {
      path: "/Institution",
      name: "Institution",
      component: () => import("./views/Institution/Index")
    },
    {
      path: "/DeviceWorkload",
      name: "DeviceWorkload",
      component: () => import("./views/DeviceWorkload/Index")
    },
    {
      path: "/EmployeeWorkload",
      name: "EmployeeWorkload",
      component: () => import("./views/EmployeeWorkload/Index")
    },
    {
      path: "/DefaultSpecialTime",
      name: "DefaultSpecialTime",
      component: () => import("./views/DefaultSpecialTime/Index")
    },
    {
      path: "/SpecialTime",
      name: "SpecialTime",
      component: () => import("./views/SpecialTime/Index")
    },
    {
      path: "/Schedule",
      name: "Schedule",
      component: () => import("./views/Schedule/Index")
    },
    {
      path: "/WeekScheduling",
      name: "WeekScheduling",
      component: () => import("./views/WeekScheduling/Index")
    },
    {
      path: "/MonthScheduling",
      name: "MonthScheduling",
      component: () => import("./views/MonthScheduling/Index")
    },
    {
      path: "/ManualDispatch",
      name: "ManualDispatch",
      component: () => import("./views/ManualDispatch/Index")
    },
    {
      path: "/BookingTest",
      name: "BookingTest",
      component: () => import("./views/BookingTest/Index")
    },
    {
      path: "/BookingWindow/:checkItemNo/patient/:patientInfo",
      name: "bookingWindow",
      component: () => import("./components/Booking/Index")
    }
    // 404 Not found:
    //{ path: '*', redirect: '/' }
  ]
});
