import { TwDRGsRoutes } from './routes/manage/tw-drgs.js'
import { drugStore } from './routes/drug-store.js'
import { clinicRoutes } from './routes/manage/clinic.js'
import { procedureRoutes } from './routes/manage/procedure.js'
import { bedRoutes } from './routes/manage/bed.js'
import { opdRoutes } from './routes/opd.js'
import { boolingRoutes } from './routes/booking.js'
import { chargeRoutes } from './routes/charge.js'
import { emergencyChargeRoutes } from './routes/emergency-charge.js'
import { emergencyBookingRoutes } from './routes/emergency-booking.js'
import { emergencyRoutes } from './routes/emergency.js'
import { examinationRoutes } from './routes/examination.js'
import { chargeManageRoutes } from './routes/manage/charge.js'
import { nursingStationRoutes } from './routes/nursing-station.js'
import { stayHospitalMedicalOrderRoutes } from './routes/stay-hospital-medical-order.js'
import { stayHospitalManageRoutes } from './routes/manage/stay-hospital.js'
import { stayHospitalCenterRoutes } from './routes/stay-hospital-center.js'
import { authManageRoutes } from './routes/manage/auth.js'
import { chiIcdRoutes } from './routes/manage/chi-icd.js'
import { homeCareRoutes } from './routes/home-care.js'
import { homeCareManageRoutes } from './routes/manage/home-care.js'

let routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: '/Login',
    children: [
      {
        path: 'Login',
        name: 'Login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/System',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: {
      asideTitle: '藥品資料維護',
      asideList: [
        { text: '藥品資料維護', to: { name: 'drugmanagement' } },
        { text: '藥價資料更新', to: { name: 'drugPriceChange' } },
        { text: '藥品廠商維護', to: { name: 'drugvendormanagement' } },
        { text: '藥房資料維護', to: { name: 'drugstoremanagement' } },
        {
          text: '藥品交互作用資料維護',
          to: { name: 'DrugInteractManage' },
        },
      ],
    },
    children: [
      {
        path: 'drugmanagement',
        component: () => import('pages/pharmacy/DrugManage.vue'),
        name: 'drugmanagement',
        meta: {
          title: '藥品資料維護',
          isMenu: true,
          menuGroup: '藥品',
          functionNo: 'drugmanagement',
        },
      },
      {
        path: 'drugPriceChange',
        component: () => import('pages/pharmacy/drugPriceChange.vue'),
        name: 'drugPriceChange',
        meta: { pageTitle: '藥價資料更新' },
      },
      {
        path: 'drugvendormanagement',
        component: () => import('pages/pharmacy/drugVendor.vue'),
        name: 'drugvendormanagement',
        meta: { pageTitle: '藥品廠商維護' },
      },
      {
        path: 'drugstoremanagement',
        component: () => import('pages/pharmacy/DrugStoreManage.vue'),
        name: 'drugstoremanagement',
        meta: { pageTitle: '藥房資料維護' },
      },
      {
        path: 'DrugInteractManage',
        component: () => import('pages/pharmacy/DrugInteractManage.vue'),
        name: 'DrugInteractManage',
        meta: { pageTitle: '藥品交互作用資料維護' },
      },
    ],
  },
  {
    path: '/System/drugWarehouse',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: {
      asideTitle: '藥房資料管理',
      asideList: [
        { text: '藥房庫存查詢', to: { name: 'drugWarehouse/stockSearch' } },
        { text: '提出申領單', to: { name: 'drugWarehouse/drugApplySheet' } },
        {
          text: '藥品申領單維護',
          to: { name: 'DrugApplySheetManage' },
        },
        {
          text: '藥房退庫單維護',
          to: { name: 'DrugReturnSheetManage' },
        },
      ],
    },
    children: [
      {
        path: 'stockSearch',
        component: () => import('pages/pharmacy/drugWarehouse/stockSearch.vue'),
        name: 'drugWarehouse/stockSearch',
        meta: {
          title: '藥房資料管理',
          isMenu: true,
          menuGroup: '藥品',
          functionNo: 'drugstoreinstock',
        },
      },
      {
        path: 'drugApplySheet',
        component: () => import('pages/pharmacy/drugWarehouse/drugApplySheet.vue'),
        name: 'drugWarehouse/drugApplySheet',
        meta: { pageTitle: '提出申請單' },
      },
      {
        path: 'DrugApplySheetManage',
        component: () => import('pages/pharmacy/drugWarehouse/drugApplySheetManage.vue'),
        name: 'DrugApplySheetManage',
        meta: { pageTitle: '藥品申請單維護' },
      },
      {
        path: 'DrugReturnSheetManage',
        component: () => import('pages/pharmacy/drugWarehouse/DrugReturnSheetManage.vue'),
        name: 'DrugReturnSheetManage',
        meta: { pageTitle: '藥房退庫單維護' },
      },
    ],
  },
  {
    path: '/System/drugStockhouse',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: { name: 'drugStockhouse/DrugWarehouseSearch' },
    meta: {
      asideTitle: '藥庫資料管理',
      asideList: [
        {
          text: '庫存查詢作業',
          to: { name: 'drugStockhouse/DrugWarehouseSearch' },
        },
        {
          text: '提出採購單',
          to: { name: 'drugStockhouse/requestPurchaseOrder' },
        },
        {
          text: '採購單管理',
          to: { name: 'drugStockhouse/purchaseListManagement' },
        },
        {
          text: '藥房申領單管理',
          to: { name: 'drugStockhouse/drugApplyManage' },
        },
        {
          text: '藥房退庫單管理',
          to: { name: 'drugStockhouse/drugReturnManage' },
        },
        {
          text: '藥品數量清點',
          to: { name: 'drugStockhouse/drugQuantityCheck' },
        },
      ],
    },
    children: [
      {
        path: 'DrugWarehouseSearch',
        component: () => import('pages/pharmacy/drugStockhouse/DrugWarehouseSearch.vue'),
        name: 'drugStockhouse/DrugWarehouseSearch',
        meta: {
          title: '藥庫資料管理',
          isMenu: true,
          menuGroup: '藥品',
          functionNo: 'drugwarehouseinquire',
        },
      },
      {
        path: 'requestPurchaseOrder',
        component: () => import('pages/pharmacy/drugStockhouse/requestPurchaseOrder.vue'),
        name: 'drugStockhouse/requestPurchaseOrder',
        meta: { pageTitle: '提出採購單' },
      },
      {
        path: 'purchaseListManagement',
        component: () => import('pages/pharmacy/drugStockhouse/purchaseListManagement.vue'),
        name: 'drugStockhouse/purchaseListManagement',
        meta: { pageTitle: '採購單管理' },
      },
      {
        path: 'drugApplyManage',
        component: () => import('pages/pharmacy/drugStockhouse/drugApplyManage.vue'),
        name: 'drugStockhouse/drugApplyManage',
        meta: { pageTitle: '藥房申領單管理' },
      },
      {
        path: 'drugReturnManage',
        component: () => import('pages/pharmacy/drugStockhouse/drugReturnManage.vue'),
        name: 'drugStockhouse/drugReturnManage',
        meta: { pageTitle: '藥房退庫單管理' },
      },
      {
        path: 'drugQuantityCheck',
        component: () => import('pages/pharmacy/drugStockhouse/drugQuantityCheck.vue'),
        name: 'drugStockhouse/drugQuantityCheck',
        meta: { pageTitle: '藥品數量清點' },
      },
    ],
  },
  {
    path: '/System/Manage',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: {
      asideTitle: '特材品項維護',
      asideList: [{ text: '特材品項維護', to: { name: 'SpecialMedicalMaterialManage' } }],
    },
    children: [
      {
        path: 'SpecialMedicalMaterial',
        component: () => import('pages/manage/special-material/SpecialMedicalMaterialManage.vue'),
        name: 'SpecialMedicalMaterialManage',
        meta: {
          title: '特材品項維護',
          isMenu: true,
          menuGroup: '系統管理.資料維護',
          functionNo: 'specialMaterialMaintenance',
          pageTitle: '特材品項維護',
        },
      },
    ],
  },
  {
    path: '/System',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: '/schedule/weekSchedule',
    children: [
      {
        path: 'WeekSchedule',
        name: 'WeekSchedule',
        meta: {
          title: '門診週排班設定',
          isMenu: true,
          menuGroup: '門診醫師排班',
          functionNo: 'week',
        },
        component: () => import('pages/schedule/weekSchedule.vue'),
      },
    ],
  },
  {
    path: '/System',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '/hotkeySetting',
        name: 'hotkeySetting',
        component: () => import('pages/hotkeySetting/hotkeySetting.vue'),
        meta: {
          title: '科室公用組套維護',
          isMenu: true,
          menuGroup: '科室公用組套',
        },
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('pages/organization/index.vue'),
        meta: {
          title: '機構設定維護',
          isMenu: true,
          menuGroup: '系統管理.資料維護',
          functionNo: 'organization',
        },
      },
    ],
  },

  {
    path: '/System',
    children: [

      {
        path: '結核病',
        name: '結核病',
        meta: {
          title: '結核病',
          isMenu: true,
          menuGroup: '品質服務',
        },
      },
      {
        path: '糖尿病及初期慢性腎臟病',
        name: '糖尿病及初期慢性腎臟病',
        meta: {
          title: '糖尿病及初期慢性腎臟病',
          isMenu: true,
          menuGroup: '品質服務',
        },
      },
      {
        path: '個案上傳',
        name: '個案上傳',
        meta: {
          title: '個案上傳',
          isMenu: true,
          menuGroup: '品質服務',
        },
      },
    ],
  },
]

routes = routes.concat(
  procedureRoutes,
  clinicRoutes,
  bedRoutes,
  TwDRGsRoutes,
  drugStore,
  opdRoutes,
  boolingRoutes,
  chargeRoutes,
  emergencyBookingRoutes,
  emergencyChargeRoutes,
  emergencyRoutes,
  examinationRoutes,
  chargeManageRoutes,
  stayHospitalMedicalOrderRoutes,
  nursingStationRoutes,
  stayHospitalManageRoutes,
  stayHospitalCenterRoutes,
  authManageRoutes,
  chiIcdRoutes,
  homeCareRoutes,
  homeCareManageRoutes
)

routes = routes.concat({
  // 錯誤的網址全部導回 login ，( 必須放在最後 => 上面沒有符合，才來到這項 )
  path: '/:catchAll(.*)',
  redirect: { name: 'Login' },
})

export default routes

