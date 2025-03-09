const children = [
  {
    path: 'ClinicSearch',
    component: () => import('pages/drugStore/DrugStoreSearch.vue'),
    name: 'drugStore-clinicSearch',
    meta: {
      title: '門診藥局查詢',
      isMenu: true,
      menuGroup: '藥局',
    },
  },
  {
    path: 'EmergencySearch',
    component: () => import('pages/drugStore/DrugStoreSearch.vue'),
    name: 'drugStore-emergencySearch',
    meta: {
      title: '急診藥局查詢',
      isMenu: true,
      menuGroup: '藥局',
    },
  },
  {
    path: 'DrugSearch',
    component: () => import('pages/drugStore/DrugSearch.vue'),
    name: 'drugStore-drugSearch',
    meta: {
      title: '藥品資料查詢',
      isMenu: true,
      menuGroup: '藥局',
    },
  },
]

export const drugStore = {
  path: '/System/DrugStore',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: 'drugStore-clinicSearch' },
  children,
}

