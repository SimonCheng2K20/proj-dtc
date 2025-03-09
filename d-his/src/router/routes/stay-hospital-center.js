const children = [
  {
    path: 'StayHospitalList',
    name: 'StayHospital-StayHospitalList',
    meta: {
      title: '住院病人查詢',
      isMenu: true,
      menuGroup: '住院中心',
      functionNo: 'staySearch',
    },
    component: () => import('pages/stayHospital/IpdRecordManage.vue'),
  },
  {
    path: 'ReserveList',
    name: 'StayHospital-ReserveList',
    meta: {
      title: '預約名單查詢',
      isMenu: true,
      menuGroup: '住院中心',
      functionNo: 'staySearch',
    },
    component: () => import('pages/stayHospital/IpdRecordReserve.vue'),
  },
  {
    path: 'StayHospitalCheckIn',
    name: 'StayHospital-StayHospitalCheckIn',
    meta: {
      title: '住院報到',
      isMenu: true,
      menuGroup: '住院中心',
      functionNo: 'staySearch',
    },
    component: () => import('pages/stayHospital/StayHospitalCheckIn.vue'),
  },
  {
    path: 'StayHospitalCharge',
    name: 'StayHospital-StayHospitalCharge',
    meta: {
      title: '住院批價作業',
      isMenu: true,
      menuGroup: '住院中心',
      functionNo: 'staySearch',
    },
    component: () => import('src/pages/stayHospital/StayHospitalCharge.vue'),
  },
]

export const stayHospitalCenterRoutes = {
  path: '/System/StayHospitalCenter',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}
