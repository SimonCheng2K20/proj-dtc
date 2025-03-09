const children = [
  {
    path: 'NotTakeDrugReason',
    name: 'NotTakeDrugReasonManage',
    component: () => import('pages/manage/stay-hospital/NotTakeDrugReasonManage.vue'),
    meta: {
      title: '未服用藥品原因維護',
    },
  },
  {
    path: 'StayHospitalRemark',
    name: 'StayHospitalRemarkManage',
    component: () => import('pages/manage/stay-hospital/StayHospitalRemarkManage.vue'),
    meta: {
      title: '註記維護',
    },
  },
  {
    path: 'IdentityDiscounts',
    name: 'StayHospitalIdentityDiscountsManage',
    component: () => import('pages/manage/stay-hospital/IdentityDiscountsManage.vue'),
    meta: {
      title: '住院折扣身分管理',
    },
  },
]

export const stayHospitalManageRoutes = {
  path: '/System/Manage/StayHospital',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '住院基本檔維護',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    functionNo: 'reason',
    asideTitle: '住院基本檔維護',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

