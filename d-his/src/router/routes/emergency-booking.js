const children = [
  {
    path: '',
    name: 'EmergencyBooking',
    meta: {
      title: '急診掛號作業',
      isMenu: true,
      menuGroup: '急診掛號',
      functionNo: 'EmergencyBooking',
    },
    component: () => import('pages/emergency/EmergencyBooking.vue'),
  },
  {
    path: 'ConsultationProgress',
    name: 'ConsultationProgress',
    component: () => import('pages/emergency/ConsultationProgress.vue'),
  },
  {
    path: 'PatientDataEdit',
    name: 'PatientDataEdit',
    props: {
      erProgramAction: 'edit',
    },
    component: () => import('pages/emergency/ConsultationProgress.vue'),
  },
]

export const emergencyBookingRoutes = {
  path: '/System/EmergencyBooking',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

