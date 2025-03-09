import { defineAsyncComponent, defineComponent, markRaw, h } from 'vue'
import { useOpdStore } from 'stores/opd.js'

const createComponent = (raw) => markRaw(defineComponent(raw))
export default createComponent({
  name: 'ActionBtns',

  setup() {
    const opdStore = useOpdStore()

    return () => {
      const AllergyBtn = defineAsyncComponent(() => import('./AllergyBtn.vue'))
      const DittoBtn = defineAsyncComponent(() => import('./DittoBtn.vue'))
      const ExaminationReportBtn = defineAsyncComponent(() => import('./ExaminationReportBtn.vue'))
      const ImageReportBtn = defineAsyncComponent(() => import('./ImageReportBtn.vue'))
      const OpdRecordBtn = defineAsyncComponent(() => import('./OpdRecordBtn.vue'))
      const ReverseBookingBtn = defineAsyncComponent(() => import('./ReverseBookingBtn.vue'))
      const ReverseStayBtn = defineAsyncComponent(() => import('./ReverseStayBtn.vue'))
      const SurgeryScheduleBtn = defineAsyncComponent(() => import('./SurgeryScheduleBtn.vue'))
      const CallPacsBtn = defineAsyncComponent(() => import('./CallPacsBtn.vue'))

      if (opdStore.opdData.DclDepartmentNo === '60') {
        return [h(DittoBtn), h(ReverseBookingBtn), h(AllergyBtn)]
      } else {
        return [
          h(DittoBtn),
          h(OpdRecordBtn),
          h(ReverseBookingBtn),
          h(ReverseStayBtn),
          h(AllergyBtn, { patientId: opdStore.opdData.PatientId, isAllergy: opdStore.opdData.Allergy }),
          h(ExaminationReportBtn, { patientId: opdStore.opdData.PatientId, opdId: opdStore.opdData.OpdId }),
          h(ImageReportBtn, { patientId: opdStore.opdData.PatientId, opdId: opdStore.opdData.OpdId }),
          h(SurgeryScheduleBtn),
          h(CallPacsBtn),
        ]
      }
    }
  },
})

