const children = [
  {
    path: 'OpdList',
    name: 'OpdList',
    meta: {
      title: '門診清單總覽',
      isMenu: true,
      menuGroup: '門診',
      functionNo: 'opdList',
    },
    component: () => import('src/pages/opd/OpdList.vue'),
  },
  {
    path: 'OpdTrace',
    name: 'OpdTrace',
    meta: {
      title: '個案追蹤管理',
      isMenu: true,
      menuGroup: '門診',
      functionNo: 'trace',
    },
    component: () => import('pages/trace/opdTrace.vue'),
  },
  {
    path: 'TraceEdit',
    name: 'TraceEdit',
    component: () => import('pages/trace/traceEdit.vue'),
  },
  {
    path: 'OpdHistory',
    name: 'OpdHistory',
    component: () => import('pages/opd/OpdHistory.vue'),
  },
  {
    path: 'OpdReferral/:opdId',
    name: 'OpdReferral',
    component: () => import('pages/opd/referral.vue'),
  },
  {
    path: 'UseDrugRecord',
    name: 'UseDrugRecord',
    meta: {
      title: '用藥紀錄查詢',
      isMenu: true,
      menuGroup: '門診',
      functionNo: 'UseDrugRecord',
    },
    component: () => import('pages/opd/UseDrugRecord.vue'),
  },
  {
    path: ':opdId/Detail',
    name: 'OpdRecord-Detail',
    component: () => import('pages/opd/opdDetail.vue'),
  },
  {
    path: ':opdId/Ditto',
    name: 'OpdRecord-Ditto',
    component: () => import('src/pages/opd/OpdRecordPage.vue'),
    props: {
      wrapperType: 'page',
    },
  },
]

export const opdRoutes = {
  path: '/System/Opd',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

