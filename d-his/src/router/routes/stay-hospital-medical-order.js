const children = [
  {
    path: '',
    name: 'StayHospitalMedicalOrder',
    meta: {
      title: '住院醫囑',
      isMenu: true,
      menuGroup: '住院醫囑',
      functionNo: 'medicalOrder',
    },
    component: () => import('pages/newStayHospitalMedicalOrder/StayHospitalMedicalOrder.vue'),
    children: [
      {
        path: ':Id/CreateMedicalOrder',
        name: 'StayHospitalMedicalOrder-CreateMedicalOrder',
        redirect: {
          name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder',
        },
        component: () => import('pages/newStayHospitalMedicalOrder/create-medical-order/CreateMedicalOrder.vue'),
        children: [
          {
            path: 'AllergyReact',
            name: 'StayHospitalMedicalOrder-CreateMedicalOrder-AllergyReact',
            component: () =>
              import('pages/newStayHospitalMedicalOrder/create-medical-order/components/AllergyReact.vue'),
          },
          {
            path: 'CreateMedicalOrder',
            name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder',
            component: () =>
              import('pages/newStayHospitalMedicalOrder/create-medical-order/components/CreateMedicalOrder.vue'),
            children: [
              {
                path: 'MedicalCourseRecord',
                name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-MedicalCourseRecord',
                component: () =>
                  import('pages/newStayHospitalMedicalOrder/create-medical-order/components/MedicalCourseRecord.vue'),
              },
              {
                path: 'Icd',
                name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Icd',
                component: () => import('pages/newStayHospitalMedicalOrder/create-medical-order/components/Icd.vue'),
              },
              {
                path: 'Medicine',
                name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Medicine',
                component: () =>
                  import('pages/newStayHospitalMedicalOrder/create-medical-order/components/Medicine.vue'),
              },
              {
                path: 'Procedure',
                name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Procedure',
                component: () =>
                  import('pages/newStayHospitalMedicalOrder/create-medical-order/components/Procedure.vue'),
              },
            ],
          },
          {
            path: 'CasePayment',
            name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CasePayment',
            component: () =>
              import('src/pages/newStayHospitalMedicalOrder/create-medical-order/case-payment/CasePayment.vue'),
          },
          {
            path: 'TwDRGs',
            name: 'StayHospitalMedicalOrder-CreateMedicalOrder-TwDRGs',
            component: () => import('src/pages/newStayHospitalMedicalOrder/create-medical-order/components/TwDRGs.vue'),
          },
        ],
      },
      {
        path: ':Id/ExaminationReport',
        name: 'StayHospitalMedicalOrder-ExaminationReport',
        component: () => import('pages/newStayHospitalMedicalOrder/ExaminationReport.vue'),
      },
      {
        path: ':Id/ImageReport',
        name: 'StayHospitalMedicalOrder-ImageReport',
        component: () => import('pages/newStayHospitalMedicalOrder/ImageReport.vue'),
        props: {
          wrapperType: 'page',
        },
      },
      {
        path: ':Id/History',
        name: 'StayHospitalMedicalOrder-History',
        component: () => import('src/pages/opd/OpdRecordPage.vue'),
        props: {
          wrapperType: 'item',
        },
      },
      {
        path: ':Id/OutHospital',
        name: 'StayHospitalMedicalOrder-OutHospital',
        component: () => import('src/pages/newStayHospitalMedicalOrder/out-hospital/OutHospital.vue'),
        children: [
          {
            path: 'OutHospitalLicense',
            name: 'StayHospitalMedicalOrder-OutHospital-OutHospitalLicense',
            component: () => import('pages/newStayHospitalMedicalOrder/out-hospital/OutHospitalLicense.vue'),
          },
          {
            path: 'NotDoMedicalOrder',
            name: 'StayHospitalMedicalOrder-OutHospital-NotDoMedicalOrder',
            component: () => import('pages/newStayHospitalMedicalOrder/out-hospital/NotDoMedicalOrder.vue'),
          },
          {
            path: 'Medicine',
            name: 'StayHospitalMedicalOrder-OutHospital-Medicine',
            component: () => import('pages/newStayHospitalMedicalOrder/out-hospital/MedicinePage.vue'),
          },
          {
            path: 'OperationDiagnosis',
            name: 'StayHospitalMedicalOrder-OutHospital-OperationDiagnosis',
            component: () => import('pages/newStayHospitalMedicalOrder/out-hospital/OperationDiagnosis.vue'),
          },
          {
            path: 'ReturnReserve',
            name: 'StayHospitalMedicalOrder-OutHospital-ReturnReserve',
            component: () => import('pages/newStayHospitalMedicalOrder/out-hospital/ReturnReserve.vue'),
          },
        ],
      },
      {
        path: ':Id/HospitalizedRecord',
        name: 'StayHospitalMedicalOrder-HospitalizedRecord',
        component: () => import('pages/newStayHospitalMedicalOrder/HospitalizedRecord.vue'),
      },
      {
        path: ':Id/CreateCertificate',
        name: 'StayHospitalMedicalOrder-CreateCertificate',
        component: () => import('pages/newStayHospitalMedicalOrder/CreateCertificate.vue'),
      },
    ],
  },
]

export const stayHospitalMedicalOrderRoutes = {
  path: '/System/StayHospitalMedicalOrder',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}

