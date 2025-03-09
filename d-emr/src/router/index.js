import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      show: false,
      noPathList: true,
      title: '登入',
    },
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    name: 'Home',
    meta: {
      show: false,
      title: '首頁',
    },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/basic',
    name: 'Basic',
    meta: {
      show: true,
      title: '基本設定',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/basic/info',
    children: [
      {
        path: 'info',
        name: 'BasicInfo',
        meta: {
          show: true,
          title: '醫院基本資料管理',
          permissions: {
            admin: true,
          },
        },
        component: () => import('../views/BasicInfo.vue'),
      },
      {
        path: 'proclamation',
        name: 'BasicProclamation',
        meta: {
          show: true,
          title: '公佈欄管理',
          featuresList: [
            { name: 'BasicProclamationAdd', meta: { title: '新增' } },
            { name: 'BasicProclamationEdit', meta: { title: '修改' } },
            { name: 'BasicProclamationDel', meta: { title: '刪除' } },
          ],
        },
        component: () => import('../views/BasicProclamation.vue'),
      },
    ],
  },
  {
    path: '/role',
    name: 'Role',
    meta: {
      show: true,
      title: '使用者管理',
      featuresList: [
        { name: 'RoleAdd', meta: { title: '新增' } },
        { name: 'RoleEdit', meta: { title: '修改' } },
        { name: 'RoleDel', meta: { title: '刪除' } },
      ],
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/role/account',
    children: [
      {
        path: 'account',
        name: 'RoleAccount',
        meta: {
          show: true,
          title: '帳號維護管理',
        },
        component: () => import('../views/RoleAccount.vue'),
      },
      {
        path: 'permission',
        name: 'RolePermission',
        meta: {
          show: true,
          title: '角色權限管理',
        },
        component: () => import('../views/RolePermission.vue'),
      },
    ],
  },
  {
    path: '/features',
    name: 'Features',
    meta: {
      show: true,
      title: '功能管理',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/features/menage',
    children: [
      {
        path: 'menage',
        name: 'FeaturesMenage',
        meta: {
          show: true,
          title: '系統功能管理',
        },
        component: () => import('../views/FeaturesMenage.vue'),
      },
    ],
  },
  {
    path: '/search',
    name: 'Search',
    meta: {
      show: true,
      title: '查詢',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/search/medicalRecords',
    children: [
      {
        path: 'medicalRecords',
        name: 'SearchMedicalRecords',
        meta: {
          show: true,
          title: '電子病歷查詢',
        },
        component: () => import('../views/SearchMedicalRecords.vue'),
      },
    ],
  },
  {
    path: '/archive',
    name: 'Archive',
    meta: {
      show: true,
      title: '歸檔',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/archive/sampleRecords',
    children: [
      {
        path: 'sampleRecords',
        name: 'ArchiveSampleRecords',
        meta: {
          show: true,
          title: '抽審查詢',
        },
        component: () => import('../views/ArchiveMedicalRecords.vue'),
      },
    ],
  },
  {
    path: '/daily',
    name: 'Daily',
    meta: {
      show: true,
      title: '日誌',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/daily/importSearch',
    children: [
      {
        path: 'importSearch',
        name: 'DailyImportSearch',
        meta: {
          show: true,
          title: '單張匯入查詢',
        },
        component: () => import('../views/DailyImportSearch.vue'),
      },
      {
        path: 'medicalRecords',
        name: 'DailyMedicalRecords',
        meta: {
          show: true,
          title: '電子病歷交換',
        },
        component: () => import('../views/DailyMedicalRecords.vue'),
      },
    ],
  },
  {
    path: '/signature',
    name: 'Signature',
    meta: {
      show: true,
      title: '簽章作業',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/signature/batch',
    children: [
      {
        path: 'batch',
        name: 'SignatureBatch',
        meta: {
          show: true,
          title: '批次簽章作業',
        },
        component: () => import('../views/SignatureBatch.vue'),
      },
    ],
  },
  {
    path: '/audit',
    name: 'Audit',
    meta: {
      show: true,
      title: '稽核作業',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/audit/records',
    children: [
      {
        path: 'records',
        name: 'AuditRecords',
        meta: {
          show: true,
          title: '稽核紀錄管理',
        },
        component: () => import('../views/AuditRecords.vue'),
      },
      {
        path: 'state',
        name: 'AuditState',
        meta: {
          show: true,
          title: '簽章狀態查詢',
        },
        component: () => import('../views/AuditState.vue'),
      },
    ],
  },
  {
    path: '/borrowMedicalRecords',
    name: 'BorrowMedicalRecords',
    meta: {
      show: true,
      title: '借閱病歷',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/audit/records',
    children: [
      {
        path: 'list',
        name: 'BorrowMedicalRecordsList',
        meta: {
          show: true,
          title: '電子病歷借閱作業',
        },
        component: () => import('../views/BorrowMedicalRecords.vue'),
      },
    ],
  },
  /*{
      path: '/externalMedicalRecords',
      name: 'ExternalMedicalRecords',
      meta: {
        show:true,
        title:'外院電子病歷'
      },
      component: () => import('../views/ParentLayout.vue'),
      redirect:'/externalMedicalRecords/list',
      children: [
        {
          path: 'list',
          name: 'ExternalMedicalRecordsList',
          meta: {
            show:true,
            title:'外院電子病歷'
          },
          component: () => import('../views/ExternalMedicalRecords.vue'),
        }
      ]
    },*/
  {
    path: '/dictionary',
    name: 'Dictionary',
    meta: {
      show: true,
      title: '個案管理',
    },
    component: () => import('../views/ParentLayout.vue'),
    redirect: '/dictionary/borrow',
    children: [
      {
        path: 'medical',
        name: 'DictionaryMedical',
        meta: {
          show: true,
          title: '敏感病歷維護',
        },
        component: () => import('../views/DictionaryMedical.vue'),
      },
      {
        path: 'identity',
        name: 'DictionaryIdentity',
        meta: {
          show: true,
          title: '敏感身分維護',
        },
        component: () => import('../views/DictionaryIdentity.vue'),
      },
      {
        path: 'borrow',
        name: 'DictionaryBorrow',
        meta: {
          show: true,
          title: '借閱原因設定',
        },
        component: () => import('../views/DictionaryBorrow.vue'),
      },
      {
        path: 'timeout',
        name: 'DictionaryTimeout',
        meta: {
          show: true,
          title: '逾時原因設定',
        },
        component: () => import('../views/DictionaryTimeout.vue'),
      },
      {
        path: 'separate',
        name: 'DictionarySeparate',
        meta: {
          show: true,
          title: '敏感身分類別維護',
        },
        component: () => import('../views/DictionarySeparate.vue'),
      },
      {
        path: 'medicalRecords',
        name: 'DictionaryMedicalRecords',
        meta: {
          show: true,
          title: '敏感病歷類別維護',
        },
        component: () => import('../views/DictionaryMedicalRecords.vue'),
      },
    ],
  },
  {
    path: '*',
    redirect: '/',
    meta: {
      show: false,
    },
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router
