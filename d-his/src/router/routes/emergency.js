const children = [
  {
    path: 'List',
    name: 'emergencyListIndex',
    meta: {
      title: '急診病患清單',
      isMenu: true,
      menuGroup: '急診',
      functionNo: 'emergencyListIndex',
    },
    component: () => import('pages/emergencyList/index.vue'),
  },
  {
    path: 'history',
    name: 'emergencyListHistory',
    meta: {
      title: '急診歷史病患清單管理',
      isMenu: true,
      menuGroup: '急診',
      functionNo: 'emergencyListHistory',
    },
    component: () => import('pages/emergencyList/ERHistoryList.vue'),
  },
  {
    path: 'schedule',
    name: 'emergencyListSchedule',
    meta: {
      title: '急診醫師及護理人員週排班設定',
      isMenu: true,
      menuGroup: '急診',
      functionNo: 'emergencyListIndex',
    },
    component: () => import('pages/emergencyList/schedule.vue'),
  },
]

export const emergencyRoutes = {
  path: '/System/Emergency',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

