import { defineStore } from 'pinia'
import mitt from 'mitt'
import { cloneDeep } from 'lodash-es'

const patientData = {
  patientType: 'PersonId',
  PersonId: null,
  PatientId: null,
  CardSerial: null,
  Name: null,
  BirthDate: null,
  GenderCode: null,
  AttendCategory: null, // 一般門診
  Identity: null,
  IdentityDiscount: null,
  SeekMedical: null,
  NoNhiCardFee: null,
  ErExamination: null,
  PartialCharge: null,
  Booking_Fee: null,
  Partial_Fee: null,
  Accumulated_Payable: null,
  Paid_Fee: null,
  ErStatus: null,
  ErTrend: null,
  ErDepartmentNo: null,
  isTakeCard: true,
  PartialAfford: null,
  FallDownFlag: false,
  NhicardCode: null,
  // custom property
  isChangeBooking: false,
  changeBookingRegId: null,
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    patientData: cloneDeep(patientData),

    emitter: mitt(),
    isPatientBookingListShow: false,
  }),
  actions: {
    setPatientData(data) {
      Object.assign(this.patientData, data)
    },
    resetPatientData({ isEmergency }) {
      Object.assign(this.patientData, cloneDeep(patientData), {
        AttendCategory: isEmergency ? '4' : '2',
        SeekMedical: isEmergency ? '04' : null,
      })
    },
    async validate() {
      return new Promise((resolve) => {
        this.emitter.emit('validate', (result) => {
          resolve(result)
        })
      })
    },
    reset() {
      this.$reset()
    },
  },
})

