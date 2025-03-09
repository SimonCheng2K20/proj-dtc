const children = [
  {
    path: 'HomeCareProcedure',
    component: () => import('pages/manage/homeCare/HomeCareProcedureManage.vue'),
    name: 'HomeCareProcedure',
    meta: {
      title: '醫令診療項目管理',
    },
  },
]

export const homeCareManageRoutes = {
  path: '/System/Manage/HomeCare',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '後臺維護',
    isMenu: true,
    menuGroup: '居家及社區復健',
    asideTitle: '醫令資料維護',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

