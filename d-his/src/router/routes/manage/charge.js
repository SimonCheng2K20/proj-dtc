const children = [
  {
    path: 'ReceiptCategory',
    name: 'ReceiptCategoryManage',
    component: () => import('pages/manage/charge/ReceiptCategoryManage.vue'),
    meta: {
      title: '收據類別',
    },
  },
  {
    path: 'ChargeItem',
    name: 'ChargeItemManage',
    component: () => import('pages/manage/charge/charge.vue'),
    meta: {
      title: '收費項目-待串API',
    },
  },
  {
    path: 'receiptChargeCorrespond',
    name: 'receiptChargeCorrespond',
    meta: {
      title: '收據類別收費項目對應-待串API',
    },
  },
  {
    path: 'PartialAffordCharge',
    name: 'PartialAffordCharge',
    component: () => import('src/pages/manage/charge/PartialAffordCharge.vue'),
    meta: {
      title: '健保門急診部分負擔設定',
    },
  },
]

export const chargeManageRoutes = {
  path: '/System/Manage/Charge',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '系統收費維護',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    functionNo: 'receipt',
    asideTitle: '系統收費維護',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

