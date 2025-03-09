const children = [
  {
    path: 'NursingStation',
    component: () => import('pages/nursingStation/NursingStation.vue'),
    name: 'NursingStation',
    redirect: { name: 'NursingStation-Clerk' },
    children: [
      {
        path: 'Clerk',
        component: () => import('pages/nursingStation/ClerkPage.vue'),
        name: 'NursingStation-Clerk',
        meta: {
          title: '護理站書記',
          isMenu: true,
          menuGroup: '護理站',
          functionNo: 'clerk',
          pageTitle: '護理站書記',
        },
      },
      {
        path: 'Clerk/InHospital/:ipdId',
        component: () => import('pages/nursingStation/InHospital.vue'),
        name: 'NursingStation-Clerk-InHospital',
        children: [
          {
            path: 'InHospitalData',
            component: () => import('pages/nursingStation/in-hospital/InHospitalData.vue'),
            name: 'NursingStation-Clerk-InHospital-InHospitalData',
          },
          {
            path: 'IdentityChange',
            component: () => import('pages/nursingStation/in-hospital/IdentityChange.vue'),
            name: 'NursingStation-Clerk-InHospital-IdentityChange',
          },
          {
            path: 'BedChange',
            component: () => import('pages/nursingStation/in-hospital/BedChange.vue'),
            name: 'NursingStation-Clerk-InHospital-BedChange',
          },
          {
            path: 'Food',
            component: () => import('pages/nursingStation/in-hospital/Food.vue'),
            name: 'NursingStation-Clerk-InHospital-Food',
          },
        ],
      },
      {
        path: 'Implement',
        component: () => import('pages/nursingStation/Implement.vue'),
        name: 'NursingStation-Implement',
        meta: { pageTitle: '護理站執行' },
        children: [
          {
            path: 'BedList',
            name: 'NursingStation-Implement-BedList',
            component: () => import('pages/nursingStation/implement/BedList.vue'),
          },
          {
            path: 'DrugToDo',
            name: 'NursingStation-Implement-DrugToDo',
            component: () => import('pages/nursingStation/implement/DrugToDo.vue'),
          },
          {
            path: 'DrugToDo/:ipdId',
            name: 'NursingStation-Implement-DrugToDo-Person',
            component: () => import('pages/nursingStation/implement/PersonDrugToDo.vue'),
          },
          {
            path: ':ipdId/VitalSign',
            name: 'NursingStation-Implement-VitalSign',
            component: () => import('pages/nursingStation/implement/VitalSign.vue'),
          },
          {
            path: ':ipdId/NutritionalCare',
            name: 'NursingStation-Implement-NutritionalCare',
            component: () => import('pages/nursingStation/implement/NutritionalCare.vue'),
          },
        ],
      },
      {
        path: 'Accounting/:ipdId',
        component: () => import('pages/nursingStation/Accounting.vue'),
        name: 'NursingStation-Clerk-Accounting',
        children: [
          {
            path: 'PricingSearch',
            name: 'NursingStation-Clerk-Accounting-PricingSearch',
            component: () => import('src/pages/charge/ChargingThePatientV2.vue'),
          },
          {
            path: 'BedPriceSearch',
            name: 'NursingStation-Clerk-Accounting-BedPriceSearch',
            component: () => import('pages/nursingStation/accounting/bedPriceSearch.vue'),
          },
          {
            path: 'ProcedureSearch',
            name: 'NursingStation-Clerk-Accounting-ProcedureSearch',
            component: () => import('src/pages/nursingStation/accounting/procedureSearch.vue'),
          },
        ],
      },
      {
        path: 'Task',
        name: 'NursingStation-Task',
        component: () => import('pages/nursingStation/TaskList.vue'),
      },
      {
        path: 'Task/PatientInfo/:ipdId',
        component: () => import('pages/nursingStation/PatientInfo.vue'),
        meta: { pageTitle: '病患資訊' },
        children: [
          {
            path: 'MedicationRecord',
            name: 'NursingStation-Task-MedicationRecord',
            component: () => import('pages/nursingStation/task/MedicationRecord.vue'),
          },
          {
            path: 'ProcedureRecord',
            name: 'NursingStation-Task-ProcedureRecord',
            component: () => import('pages/nursingStation/task/ProcedureRecord.vue'),
          },
          {
            path: 'IpdRecord',
            name: 'NursingStation-Task-IpdRecord',
            component: () => import('src/pages/opd/OpdRecordPage.vue'),
          },
          {
            path: 'ExaminationReport',
            name: 'NursingStation-Task-ExaminationReport',
            component: () => import('pages/newStayHospitalMedicalOrder/ExaminationReport.vue'),
          },
          {
            path: 'ImageReport',
            name: 'NursingStation-Task-ImageReport',
            component: () => import('pages/newStayHospitalMedicalOrder/ImageReport.vue'),
            props: {
              wrapperType: 'page',
            },
          },
        ],
      },

      {
        path: 'nursingRecord',
        component: () => import('pages/nursingStation/task/nursingRecord.vue'),
      },
      {
        path: 'changeShift',
        component: () => import('pages/nursingStation/task/changeShift.vue'),
        name: 'NursingStation-ChangeShift',
        meta: { pageTitle: '護理站交班' },
      },
    ],
  },
  {
    path: 'weeklyschedule',
    component: () => import('pages/nursingStation/WeekSchedule.vue'),
    name: 'nursingStation-weeklyschedule',
    meta: {
      title: '醫師及護理人員週排班設定',
      isMenu: true,
      menuGroup: '護理站',
      functionNo: 'clerk',
    },
  },
  {
    path: 'foodManage',
    component: () => import('pages/nursingStation/foodManage.vue'),
    name: 'foodManage',
    meta: {
      title: '護理站伙食設定',
      isMenu: true,
      menuGroup: '護理站',
      functionNo: 'clerk',
      pageTitle: '護理站伙食設定',
    },
  },
]

export const nursingStationRoutes = {
  path: '/System/NursingStation',
  component: () => import('src/layouts/MainLayout.vue'),
  redirect: { name: children[0].name },
  children,
}
