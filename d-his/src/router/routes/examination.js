const children = [
  {
    path: 'Specimen',
    component: () => import('pages/manage/examination/SpecimenManage.vue'),
    name: 'SpecimenManage',
    meta: {
      title: '檢體維護',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
  {
    path: 'SpecimenGroup',
    component: () => import('pages/manage/examination/SpecimenGroupManage.vue'),
    name: 'SpecimenGroupManage',
    meta: {
      title: '檢體組別維護',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
  {
    path: 'Examination',
    component: () => import('pages/manage/examination/ExaminationManage.vue'),
    name: 'ExaminationManage',
    meta: {
      title: '檢驗項目維護',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
  {
    path: 'checkSign',
    component: () => import('pages/examination/checkSign.vue'),
    name: 'checkSign',
    meta: {
      title: '檢驗簽收',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
  {
    path: 'specimenReport',
    component: () => import('pages/examination/specimenReport.vue'),
    name: 'specimenReport',
    meta: {
      title: '檢體報告輸入作業',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
  {
    path: 'report',
    component: () => import('pages/examination/report.vue'),
    name: 'report',
    meta: {
      title: '檢驗報告查詢作業',
      isMenu: true,
      menuGroup: '檢驗系統',
      functionNo: 'examinationMaintenance',
    },
  },
]

export const examinationRoutes = {
  path: '/System/ExaminationManage',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

