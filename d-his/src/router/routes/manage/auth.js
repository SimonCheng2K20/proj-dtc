const children = [
  {
    path: 'Account',
    name: 'AccountManage',
    component: () => import('pages/manage/auth/AccountManage.vue'),
    meta: {
      title: '系統帳號管理',
      isMenu: true,
      menuGroup: '系統管理.權限設定',
      functionNo: 'account',
    },
  },
  {
    path: 'Role',
    name: 'RoleManage',
    component: () => import('pages/manage/auth/RoleManage.vue'),
    meta: {
      title: '系統角色管理',
      isMenu: true,
      menuGroup: '系統管理.權限設定',
      functionNo: 'role',
    },
  },
  {
    path: 'Functions',
    name: 'FunctionsManage',
    component: () => import('pages/manage/auth/FunctionManage.vue'),
    meta: {
      title: '系統作業管理',
      isMenu: true,
      menuGroup: '系統管理.權限設定',
      functionNo: 'functions',
    },
  },
  {
    path: 'Employee',
    name: 'EmployeeManage',
    component: () => import('pages/manage/auth/EmployeeManage.vue'),
    meta: {
      title: '員工資料管理',
      isMenu: true,
      menuGroup: '系統管理.權限設定',
      functionNo: 'employee',
    },
  },
  {
    path: 'Audit',
    name: 'AuditManage',
    component: () => import('pages/manage/auth/Audit.vue'),
    meta: {
      title: '稽核紀錄管理',
      isMenu: true,
      menuGroup: '系統管理.權限設定',
      functionNo: 'auditlist',
    },
  },
]

export const authManageRoutes = {
  path: '/System/Manage/Auth',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

