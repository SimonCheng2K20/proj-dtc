const children = [
  {
    path: 'IdentityAttend',
    component: () => import('pages/manage/clinic/IdentityAttendManage.vue'),
    name: 'IdentityAttendManage',
    meta: {
      title: '就診身分管理',
    },
  },
  {
    path: 'IdentityDiscounts',
    component: () => import('pages/manage/clinic/IdentityDiscountsManage.vue'),
    name: 'IdentityDiscountsManage',
    meta: {
      title: '門診折扣身份管理',
    },
  },
  {
    path: 'SeekMedical',
    component: () => import('pages/manage/clinic/SeekMedicalManage.vue'),
    name: 'SeekMedicalManage',
    meta: {
      title: '就醫類別管理',
    },
  },
  {
    path: 'SeekMedicalDepart',
    component: () => import('pages/manage/clinic/SeekMedicalDepartManage.vue'),
    name: 'SeekMedicalDepartManage',
    meta: {
      title: '就醫科別管理',
    },
  },
  {
    path: 'Prevent',
    name: 'PreventManage',
    component: () => import('pages/manage/clinic/PreventManage.vue'),
    meta: {
      title: '預防保健管理',
    },
  },
  {
    path: 'PartialAfford',
    name: 'PartialAffordManage',
    component: () => import('pages/manage/clinic/PartialAffordManage.vue'),
    meta: {
      title: '門診部分負擔',
    },
  },
  {
    path: 'roomMaintenance',
    component: () => import('pages/systemMaintenance/room.vue'),
    name: 'roomMaintenance',
    meta: {
      title: '門診診間管理',
    },
  },
  {
    path: 'Department',
    name: 'DepartmentManage',
    component: () => import('pages/manage/clinic/DepartmentManage.vue'),
    meta: {
      title: '部門管理',
    },
  },
  {
    path: 'Specialty',
    name: 'SpecialtyManage',
    component: () => import('pages/manage/clinic/SpecialtyManage.vue'),
    meta: {
      title: '科室管理',
    },
  },
  {
    path: 'Doctor',
    name: 'DoctorManage',
    component: () => import('pages/manage/clinic/DoctorManage.vue'),
    meta: {
      title: '門診醫生管理',
    },
  },
  {
    path: 'Frequency',
    component: () => import('pages/manage/clinic/FrequencyManage.vue'),
    name: 'FrequencyManage',
    meta: {
      title: '頻率代碼管理',
    },
  },
  {
    path: 'Chronic',
    name: 'ChronicManage',
    component: () => import('pages/manage/clinic/ChronicManage.vue'),
    meta: {
      title: '特定治療項目管理',
    },
  },
  {
    path: 'room',
    component: () => import('pages/systemMaintenance/room.vue'),
    name: 'room',
    meta: {
      title: '診間名稱設定',
    },
  },
  {
    path: 'ErrorCode',
    name: 'ErrorCodeManage',
    component: () => import('pages/manage/clinic/ErrorCodeManage.vue'),
    meta: {
      title: '異常代碼管理',
    },
  },
  {
    path: 'CaseTypeManage',
    component: () => import('pages/manage/clinic/CaseTypeManage.vue'),
    name: 'CaseTypeManage',
    meta: {
      title: '案件分類管理',
    },
  },
  {
    path: 'SpecialTherapy',
    name: 'SpecialTherapyManage',
    component: () => import('pages/manage/clinic/SpecialTherapyManage.vue'),
    meta: {
      title: '特定治療管理',
    },
  },
  {
    path: 'OrgPartial',
    name: 'OrgPartialManage',
    component: () => import('pages/manage/clinic/OrgPartialManage.vue'),
    meta: {
      title: '醫院部分負擔方式及金額管理',
    },
  },
]

export const clinicRoutes = {
  path: '/System/Manage/Clinic',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  meta: {
    title: '門診掛號管理',
    isMenu: true,
    menuGroup: '系統管理.資料維護',
    functionNo: 'jiuZhenMaintenance',
    asideTitle: '門診掛號管理',
    asideList: children.map((item) => ({ text: item.meta.title, to: { name: item.name } })),
  },
  children,
}

