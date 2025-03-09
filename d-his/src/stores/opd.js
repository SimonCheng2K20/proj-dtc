import { defineStore } from 'pinia'
import mitt from 'mitt'
import { cloneDeep } from 'lodash-es'
import { getOpdRecordItem } from 'api'

const opdData = {
  OpdId: null,
  RegId: null,
  PatientId: null,
  Subjective: null,
  Objective: null,
  OpdPlan: null,
  SignedDocId: null,
  SignedDocName: null,
  DclDepartmentNo: null,
  Note: null,
  Height: null,
  Weight: null,
  Pulse: null,
  BloodPressureLow: null,
  BloodPressureHigh: null,
  Status: null,
  OpdDiagnoses: [],
  OpdPieceProcedure: null,
  OpdMedications: [],
  OpdProcedures: [],
  Age: null,
  BirthDate: null,
  DepartmentName: null,
  Gender: null,
  Identity: null,
  IdentityName: null,
  IdentityDiscount: null,
  PartialAfford: null,
  SeekMedical: null,
  Prevent: null,
  Idetifier: null,
  Laboratory: null,
  PACS: null,
  PersonName: null,
  PrimaryIcd: null,
  RoomName: null,
  SignedDocId: null,
  SignedDocName: null,
  CreateDatetime: null,
  ModifyDatetime: null,
  Status: null,
  EName: null,
  Allergy: null,
  OpdChronics: [],
  RoomBooking: {
    Age: null,
    Attend: null,
    AttendCategory: null,
    AttendName: null,
    BookingDate: null,
    CardSerial: null,
    CaseType: null,
    DepartmentName: null,
    DoctorId: null,
    DoctorName: null,
    Identity: null,
    IdentityDiscount: null,
    IdentityName: null,
    Laboratory: null,
    Pacs: null,
    PartialAfford: null,
    Patient: {
      Person: {
        Address: null,
        BirthDate: null,
        EName: null,
        Email: null,
        GenderCode: null,
        Name: null,
        Nationality: null,
        PersonId: null,
        Phone: null,
      },
    },
    PatientId: null,
    PersonId: null,
    Prevent: null,
    RegId: null,
    RoomName: null,
    RoomNo: null,
    SeekMedical: null,
    Seq: null,
    TimeSection: null,
    TimeSlotName: null,
    TimeSlotNo: null,
    Type: null,
    OpdTcmFourDiagnosisItems: [],
    OpdTcmEightPrincipleItems: [],
    OpdTcmSpecificDiseaseProcedure: null,
  },
}

export const useOpdStore = defineStore('opd', {
  state: () => ({
    opdData: cloneDeep(opdData),

    emitter: mitt(),
  }),
  actions: {
    async GetOpdRecordItem(opdId) {
      try {
        const res = await getOpdRecordItem(opdId)
        if (res.data) {
          this.opdData = res.data
        }
        return { data: res.data }
      } catch (error) {
        return { error }
      }
    },
    setOpdData(data) {
      Object.assign(this.opdData, data)
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

