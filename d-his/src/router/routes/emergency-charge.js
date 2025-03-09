const children = [
  {
    path: '',
    name: 'EmergencyCharge',
    meta: {
      title: '急診批價作業',
      isMenu: true,
      menuGroup: '急診掛號',
      functionNo: 'EmergencyCharge',
    },
    component: () => import('pages/emergency/EmergencyCharge.vue'),
  },
  {
    path: 'EmergencyChargingThePatient',
    name: 'EmergencyChargingThePatient',
    component: () => import('pages/emergency/EmergencyChargingThePatient.vue'),
  },
]

export const emergencyChargeRoutes = {
  path: '/System/EmergencyCharge',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

