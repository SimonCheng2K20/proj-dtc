export default {
  path: '/systemManage/',
  name: 'systemManage',
  meta: {
    title: '系統管理',
  },
  component: () => import('../views/system/index.vue'),
  children: [
    {
      path: 'medicalAffairsNetgroupMaintain',
      name: 'medicalAffairsNetgroupMaintain',
      meta: {
        title: '醫事司網絡維護管理',
        needfooter: true,
      },
      component: () => import('../views/system/netgroupmedicalaffairs.vue'),
    },
    {
      path: 'healthCareNetgroupMaintain',
      name: 'healthCareNetgroupMaintain',
      meta: {
        title: '照護司網絡維護管理',
        needfooter: true,
      },
      component: () => import('../views/system/netgrouphealthcare.vue'),
    },
    {
      path: 'hospitalMaintain',
      name: 'hospitalMaintain',
      meta: {
        title: '機構單位維護',
        needfooter: true,
      },
      component: () => import('../views/system/hospital.vue'),
    },
    {
      path: 'hisMaintain',
      name: 'hisMaintain',
      meta: {
        title: 'HIS主機管理',
        needfooter: true,
      },
      component: () => import('../views/system/hissetting.vue'),
    },
    {
      path: 'pacsMaintain',
      name: 'pacsMaintain',
      meta: {
        title: 'Pacs主機管理',
        needfooter: true,
      },
      component: () => import('../views/system/pacssetting.vue'),
    },
    {
      path: 'accountMaintain',
      name: 'accountMaintain',
      meta: {
        title: '帳號維護管理',
        needfooter: true,
      },
      component: () => import('../views/system/account.vue'),
    },
    {
      path: 'accountauditMaintain',
      name: 'accountauditMaintain',
      meta: {
        title: '帳號審核管理',
        needfooter: true,
      },
      component: () => import('../views/system/accountaudit.vue'),
    },
    {
      path: 'roleMaintain',
      name: 'roleMaintain',
      meta: {
        title: '角色權限管理',
        needfooter: true,
      },
      component: () => import('views/manage/RoleManage.vue'),
    },
    {
      path: 'auditMaintain',
      name: 'auditMaintain',
      meta: {
        title: '稽核記錄管理',
        needfooter: true,
      },
      component: () => import('../views/system/audit.vue'),
    },
    {
      path: 'faqMaintain',
      name: 'faqMaintain',
      meta: {
        title: '常見問題管理',
        needfooter: true,
      },
      component: () => import('../views/system/faq.vue'),
    },
    {
      path: 'bulletinMaintain',
      name: 'bulletinMaintain',
      meta: {
        title: '公佈欄管理',
        needfooter: true,
      },
      component: () => import('../views/system/bulletin.vue'),
    },
    {
      path: 'functionsMaintain',
      name: 'functionsMaintain',
      meta: {
        title: '系統功能管理',
        needfooter: true,
      },
      component: () => import('views/manage/FunctionManage.vue'),
    },
    {
      path: '/holiday',
      name: 'Holiday',
      meta: {
        title: '會診醫師排班維護',
        needfooter: true,
      },
      component: () => import('../views/holiday/index.vue'),
    },
  ],
};
