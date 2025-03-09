const children = [
  {
    path: 'Table-4.4.1',
    component: () => import('pages/manage/chi-icd/Table-4.4.1.vue'),
    name: 'manage-chiicd-Table-4.4.1',
    meta: { title: '中度複雜性針灸適應症（附表4.4.1）' },
  },
  {
    path: 'Table-4.4.2',
    component: () => import('pages/manage/chi-icd/Table-4.4.2.vue'),
    name: 'manage-chiicd-Table-4.4.2',
    meta: { title: '特殊疾病（附表4.4.2）' },
  },
  {
    path: 'Table-4.4.3',
    component: () => import('pages/manage/chi-icd/Table-4.4.3.vue'),
    name: 'manage-chiicd-Table-4.4.3',
    meta: { title: '高度複雜性針灸適應症（附表4.4.3）' },
  },
  {
    path: 'Table-4.5.1',
    component: () => import('pages/manage/chi-icd/Table-4.5.1.vue'),
    name: 'manage-chiicd-Table-4.5.1',
    meta: { title: '中度複雜性傷科適應症（附表4.5.1）' },
  },
  {
    path: 'Table-4.5.2',
    component: () => import('pages/manage/chi-icd/Table-4.5.2.vue'),
    name: 'manage-chiicd-Table-4.5.2',
    meta: { title: '高度複雜性傷科（多部位損傷）適應症（附表4.5.2）' },
  },
  {
    path: 'Table-4.5.3',
    component: () => import('pages/manage/chi-icd/Table-4.5.3.vue'),
    name: 'manage-chiicd-Table-4.5.3',
    meta: { title: '高度複雜性傷科（脫臼）適應症（附表4.5.3）' },
  },
  {
    path: 'Table-4.5.4',
    component: () => import('pages/manage/chi-icd/Table-4.5.4.vue'),
    name: 'manage-chiicd-Table-4.5.4',
    meta: { title: '高度複雜性傷科（骨折）適應症（附表4.5.4）' },
  },
  {
    path: 'Table-4.7',
    component: () => import('pages/manage/chi-icd/Table-4.7.vue'),
    name: 'manage-chiicd-Table-4.7',
    meta: { title: '舌診儀、脈診儀檢查適應症（附表4.7）' },
  },
]

export const chiIcdRoutes = {
  path: '/System/Manage/ChiIcd',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '中醫專用表查詢',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    asideTitle: '中醫專用表查詢',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

