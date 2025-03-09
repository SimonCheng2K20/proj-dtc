const children = [
  {
    path: 'HospitalBed',
    name: 'HospitalBedManage',
    component: () => import('pages/manage/bed/HospitalBedManage.vue'),
    meta: {
      title: '護理站及床位管理',
    },
  },
  {
    path: 'BedStatus',
    name: 'BedStatusManage',
    component: () => import('pages/manage/bed/BedStatusManage.vue'),
    meta: {
      title: '床位狀態管理',
    },
  },
  {
    path: 'HealthyBed',
    name: 'HealthyBedManage',
    component: () => import('pages/manage/bed/HealthyBedManage.vue'),
    meta: {
      title: '健保床位性質管理',
    },
  },
  {
    path: 'BedType',
    name: 'BedTypeManage',
    component: () => import('pages/manage/bed/BedTypeManage.vue'),
    meta: {
      title: '床位類別管理',
    },
  },
  {
    path: 'BedLevel',
    name: 'BedLevelManage',
    component: () => import('pages/manage/bed/BedLevelManage.vue'),
    meta: {
      title: '床位等級管理',
    },
  },
  {
    path: 'StayPatientStatus',
    name: 'StayPatientStatusManage',
    component: () => import('pages/manage/bed/StayPatientStatusManage.vue'),
    meta: {
      title: '住院病患狀態管理',
    },
  },
  {
    path: 'InHospitalPriorityLevel',
    name: 'InHospitalPriorityLevelManage',
    component: () => import('pages/manage/bed/InHospitalPriorityLevelManage.vue'),
    meta: {
      title: '入院許可優先等級管理',
    },
  },
  {
    path: 'InpatientOutcome',
    name: 'InpatientOutcomeManage',
    component: () => import('pages/manage/bed/InpatientOutcomeManage.vue'),
    meta: {
      title: '住院病患轉歸管理',
    },
  },
  {
    path: 'BedPrice',
    name: 'BedPriceManage',
    component: () => import('pages/manage/bed/BedPriceManage.vue'),
    meta: {
      title: '病床固定費用管理',
    },
  },
  {
    path: 'nursingStation',
    name: 'nursingStation',
    component: () => import('pages/stayHospital/maintenance/nursingStation.vue'),
    meta: {
      title: '護理站管理',
    },
  },
  {
    path: 'secretLevel',
    name: 'secretLevel',
    component: () => import('pages/stayHospital/maintenance/secretLevel.vue'),
    meta: {
      title: '機密等級管理-待串API',
    },
  },
]

export const bedRoutes = {
  path: '/System/Manage/Bed',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '床住管理維護',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    functionNo: 'bedMaintenance',
    asideTitle: '床住管理維護',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

