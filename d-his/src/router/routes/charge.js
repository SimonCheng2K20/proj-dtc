const children = [
  {
    path: '',
    name: 'ChargePage',
    meta: {
      title: '門診批價作業',
      isMenu: true,
      menuGroup: '掛號/批價',
      functionNo: 'pricing',
    },
    component: () => import('src/pages/charge/ChargePage.vue'),
  },
  {
    path: 'ChargingThePatient',
    name: 'ChargingThePatient',
    component: () => import('src/pages/charge/ChargingThePatient.vue'),
  },
  {
    path: 'ChargingThePatientV2/:id?/:PersonId?/:ipdId',
    name: 'ChargingThePatientV2',
    component: () => import('src/pages/charge/ChargingThePatientV2.vue'),
  },
]

export const chargeRoutes = {
  path: '/System/Charge',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}
