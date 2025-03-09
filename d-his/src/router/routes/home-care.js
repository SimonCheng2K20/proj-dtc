const children = [
  {
    path: 'HomeCareApply',
    name: 'HomeCare-HomeCareApply',
    component: () => import('src/pages/homeCare/HomeCareApply.vue'),
    meta: {
      title: '居家照護申請案件',
      isMenu: true,
      menuGroup: '居家及社區復健.居家照護',
    },
  },
  {
    path: 'HomeCareList',
    name: 'HomeCare-HomeCareList',
    component: () => import('src/pages/homeCare/HomeCareList.vue'),
    meta: {
      title: '居家照護清單',
      isMenu: true,
      menuGroup: '居家及社區復健.居家照護',
    },
  },
  {
    path: 'MentalApplyEvaluate',
    name: 'HomeCare-MentalApplyEvaluate',
    component: () => import('src/pages/homeCare/MentalApplyEvaluate.vue'),
    meta: {
      title: '慢性精神疾病申請書與評量表查詢',
      isMenu: true,
      menuGroup: '居家及社區復健.精神疾病',
    },
  },
  {
    path: 'MentalCareList',
    name: 'HomeCare-MentalCareList',
    component: () => import('src/pages/homeCare/MentalCareList.vue'),
    meta: {
      title: '慢性精神病照護清單',
      isMenu: true,
      menuGroup: '居家及社區復健.精神疾病',
    },
  },
  {
    path: 'PalliativeCare',
    name: 'HomeCare-PalliativeCare',
    component: () => import('src/pages/homeCare/PalliativeCare.vue'),
    meta: {
      title: '安寧照護申請案件',
      isMenu: true,
      menuGroup: '居家及社區復健.安寧照護',
    },
  },
]

export const homeCareRoutes = [
  {
    path: '/System/HomeCare',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: { name: children[0].name },
    children: children,
  },
]
