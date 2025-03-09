const children = [
  {
    path: 'Procedure',
    component: () => import('pages/manage/procedure/ProcedureManage.vue'),
    name: 'ProcedureManage',
    meta: {
      title: '醫令資料維護',
    },
  },
  {
    path: 'changeStatus',
    component: () => import('pages/manage/procedure/procedureChange.vue'),
    name: 'changeStatus',
    meta: {
      title: '醫令異動狀態',
    },
  },
  {
    path: 'Addition',
    component: () => import('pages/manage/procedure/AdditionManage.vue'),
    name: 'AdditionManage',
    meta: {
      title: '醫療服務給付項目加成維護',
    },
  },
  {
    path: 'CheckRoom',
    component: () => import('pages/manage/procedure/CheckRoomManage.vue'),
    name: 'CheckRoomManage',
    meta: {
      title: '檢查室維護',
    },
  },
  {
    path: 'DeliveryUnit',
    name: 'DeliveryUnitManage',
    component: () => import('pages/manage/procedure/DeliveryUnitManage.vue'),
    meta: {
      title: '外送單位維護',
    },
  },
  {
    path: 'Group',
    name: 'GroupManage',
    component: () => import('pages/manage/procedure/GroupManage.vue'),
    meta: {
      title: '組別維護',
    },
  },
  {
    path: 'ProcedureType',
    name: 'ProcedureTypeManage',
    component: () => import('pages/manage/procedure/ProcedureTypeManage.vue'),
    meta: {
      title: '醫令類別維護',
    },
  },
  {
    path: 'StayPriceType',
    name: 'StayPriceTypeManage',
    component: () => import('pages/manage/procedure/StayPriceTypeManage.vue'),
    meta: {
      title: '住院費用類別維護',
    },
  },
  {
    path: 'MedicalPartManage',
    component: () => import('pages/manage/procedure/MedicalPartManage.vue'),
    name: 'MedicalPartManage',
    meta: {
      title: '診療部位維護',
    },
  },
  {
    path: 'Icd10',
    name: 'Icd10CmManage',
    component: () => import('pages/manage/procedure/Icd10CmManage.vue'),
    meta: {
      title: 'ICD-10-CM 查詢',
    },
  },
  {
    path: 'Icd9',
    name: 'Icd9CmManage',
    component: () => import('pages/manage/procedure/Icd9CmManage.vue'),
    meta: {
      title: 'ICD-9-CM 查詢',
    },
  },
  {
    path: 'IcdRelation',
    name: 'IcdRelationManage',
    component: () => import('pages/manage/procedure/IcdRelationManage.vue'),
    meta: {
      title: 'ICD-9/ICD-10 對應',
    },
  },
  {
    path: 'ProcedureCategory',
    name: 'ProcedureCategoryManage',
    component: () => import('pages/manage/procedure/ProcedureCategoryManage.vue'),
    meta: {
      title: '醫令分類維護',
    },
  },
]

export const procedureRoutes = {
  path: '/System/Manage/Procedure',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '醫令資料維護',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    functionNo: 'procedure',
    asideTitle: '醫令資料維護',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

