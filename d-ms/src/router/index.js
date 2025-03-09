import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      show:false,
      title:'登入',
      noPathBox:true
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/data',
    name: 'Data',
    meta: {
      show:true,
      title:'文件管理'
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect:'/data/medicalRecord',
    children: [
      {
        path: 'medicalRecord',
        name: 'DataMedicalRecord',
        meta: {
          show:true,
          title:'病歷夾維護'
        },
        component: () => import('../views/DataMedicalRecord.vue'),
      },
      {
        path: 'category',
        name: 'DataCategory',
        meta: {
          show:true,
          title:'文件類別維護'
        },
        component: () => import('../views/DataCategory.vue'),
      },
      {
        path: 'manager',
        name: 'DataManager',
        meta: {
          show:true,
          title:'文件維護'
        },
        component: () => import('../views/DataManager.vue'),
      },
      {
        path: 'archive',
        name: 'DataArchive',
        meta: {
          show:true,
          title:'歸檔作業'
        },
        component: () => import('../views/DataArchive.vue'),
      },
      {
        path: 'patient',
        name: 'DataPatient',
        meta: {
          show:true,
          title:'病患管理'
        },
        component: () => import('../views/DataPatient.vue'),
      },
    ]
  },
  /*{
    path: '/FileCheck',
    name: 'fileCheck',
    meta: {
      show:true,
      title:'文件調閱查詢'
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect:'/fileCheck/search',
    children: [
      {
        path: 'search',
        name: 'FileCheckSearch',
        meta: {
          show:true,
          title:'文件調閱查詢'
        },
        component: () => import('../views/FileCheckSearch.vue'),
      },
    ]
  },*/
  /*{
    path: '/signature',
    name: 'Signature',
    meta: {
      show:true,
      title:'簽章作業'
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect:'/signature/batch',
    children: [
      {
        path: 'batch',
        name: 'SignatureBatch',
        meta: {
          show:true,
          title:'批次簽章作業'
        },
        component: () => import('../views/SignatureBatch.vue'),
      },
    ]
  },*/
  {
    path: '/system',
    name: 'System',
    meta: {
      show:true,
      title:'系統管理'
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect:'/system/account',
    children: [
      {
        path: 'account',
        name: 'SystemAccount',
        meta: {
          show:true,
          title:'帳號維護清單查詢'
        },
        component: () => import('../views/SystemAccount.vue'),
      },
      {
        path: 'userGroup',
        name: 'SystemUserGroup',
        meta: {
          show:true,
          title:'使用者群組'
        },
        component: () => import('../views/SystemUserGroup.vue'),
      },
      {
        path: 'function',
        name: 'SystemFunction',
        meta: {
          show:true,
          title:'功能管理'
        },
        component: () => import('../views/SystemFunction.vue'),
      },
      {
        path: 'audit',
        name: 'SystemAudit',
        meta: {
          show:true,
          title:'稽核管理'
        },
        component: () => import('../views/SystemAudit.vue'),
      }
    ]
  },
  {
    path:'*',
    redirect: '/login',
    meta: {
      show:false,
    }
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
