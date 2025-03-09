const children = [
  {
    path: 'TodayBooking',
    name: 'TodayBooking',
    meta: {
      title: '當日掛號',
      isMenu: true,
      menuGroup: '掛號/批價',
      functionNo: 'booking',
    },
    component: () => import('pages/booking/Booking.vue'),
  },
  {
    path: 'ReserveBooking',
    name: 'ReserveBooking',
    meta: {
      title: '預約掛號',
      isMenu: true,
      menuGroup: '掛號/批價',
      functionNo: 'booking',
    },
    component: () => import('pages/booking/Booking.vue'),
  },
  {
    path: 'iccard',
    name: 'bookingICCard',
    component: () => import('pages/booking/ICCard.vue'),
  },
  {
    path: 'BookingProgress',
    name: 'BookingProgress',
    component: () => import('src/pages/booking/BookingProgress.vue'),
  },
  {
    path: 'PatientManage',
    name: 'PatientManage',
    meta: {
      functionNo: 'booking',
    },
    component: () => import('pages/booking/components/PatientManageEditItem.vue'),
    props: { wrapperType: 'page' },
  },
]

export const boolingRoutes = {
  path: '/System/Booking',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

