import { defineStore } from 'pinia'
import mitt from 'mitt'
import { cloneDeep } from 'lodash-es'
import { getIpdRecordItem, getIpdRecordList } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'

const ipdData = {
  CreateDatetime: null,
  ModifyDatetime: null,
  DepartmentName: null,
  AttendingDocName: null,
  BedName: null,
  IdentityName: null,
  StatusName: null,
  InpatientDays: null,
  BedTypeName: null,
  BedLevelName: null,
  SourceName: null,
  Gender: null,
  InpatientDocName: null,
  OpdDiagnosisIcd10Name: null,
  OpdDiagnosisIcd101Name: null,
  OpdDiagnosisIcd102Name: null,
  OpdDiagnosisIcd103Name: null,
  OpdDiagnosisIcd104Name: null,
  HbedType: {
    No: null,
    Name: null,
    HbedTypeNhiPoint: null,
    HbedTypeNhiCode: null,
    NursingOneDayNhiPoint: null,
    NursingOneDayNhiCode: null,
    NursingAfterTwoDayNhiPoint: null,
    NursingAfterTwoDayNhiCode: null,
  },
  Patient: {
    PatientId: null,
    PersonId: null,
    Status: null,
    Pregnant: null,
    HadSurgery: null,
    Allergy: null,
    QuickSieve: null,
    VaccineTimes: null,
    Fever: null,
    Temperature: null,
    ChronicDisease: null,
    ChronicDiseaseOther: null,
    Symptoms: null,
    SymptomsOther: null,
    Height: null,
    Weight: null,
    Bmi: null,
    EmergencyContact: null,
    ContactRelationship: null,
    ContactTelphone: null,
    EmergencyContact2: null,
    ContactRelationship2: null,
    ContactTelphone2: null,
    Pulse: null,
    BloodPressurediastolic: null,
    BloodPressuresystolic: null,
    IsDeleted: null,
    Visit1stDate: null,
    Marriage: null,
    BloodType: null,
    JobType: null,
    AllergyMedicine: null,
    AllergyComment: null,
    SurgeryComment: null,
    Identity: null,
    IdentityDiscount: null,
    PartialCharge: null,
    SeekMedical: null,
    AttendCategory: null,
    Person: {
      PersonId: null,
      Name: null,
      EName: null,
      GenderCode: null,
      BirthDate: null,
      Phone: null,
      Address: null,
      Email: null,
      Nationality: null,
    },
  },
  HospitalBed: {
    Id: null,
    Area: null,
    Floor: null,
    Room: null,
    Bed: null,
    BedPrice: null,
    MakeUp: null,
    MakeUpPrice: null,
    NursingStation: null,
    HealthBed: null,
    BedType: null,
    BedLevel: null,
    BedStatus: null,
    CreatedDatetime: null,
    ModifyDatetime: null,
  },
  IpdId: null,
  PatientId: null,
  BedId: null,
  IpdPreDate: null,
  IpdPreDischargeDate: null,
  IpdDate: null,
  IpdDischargeDate: null,
  Contact1: null,
  Relationship1: null,
  Telphone1: null,
  Contact2: null,
  Relationship2: null,
  Telphone2: null,
  DepartmentId: null,
  AttendingDocId: null,
  Source: null,
  Identity: null,
  BadReserveGrade: null,
  Note: null,
  Status: null,
  OpdId: null,
  MedicationDesc: null,
  InpatientDocId: null,
  IdentityDiscount: null,
  PartialAfford: null,
  PayType: null,
  MajorInjuryCardNo: null,
  MajorInjuryCardStartDate: null,
  MajorInjuryCardEndDate: null,
  CardSerial: null,
  TrafficeAccidentFlag: null,
  OpdDiagnosisIcd10: null,
  OpdDiagnosisIcd101: null,
  OpdDiagnosisIcd102: null,
  OpdDiagnosisIcd103: null,
  OpdDiagnosisIcd104: null,
  IpdPlan: null,
}

export const useIpdStore = defineStore('ipd', {
  state: () => ({
    ipdData: cloneDeep(ipdData),
    ipdDataLoading: false,

    ipdList: [],
    pagination: {
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0,
    },
    ipdListLoading: false,
    selected: [],

    emitter: mitt(),
  }),
  actions: {
    async GetIpdRecordList(queryOptions) {
      try {
        this.ipdListLoading = true
        const query = setSearchQuery({
          $top: this.pagination.rowsPerPage,
          $skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          ...queryOptions,
        })
        const res = await getIpdRecordList(query)
        this.ipdList = res.data.Items
        this.pagination.rowsNumber = res.data.Count
      } catch (error) {
        console.log(error)
      } finally {
        this.ipdListLoading = false
      }
    },
    async GetIpdRecordItem(ipdId) {
      try {
        this.ipdDataLoading = true
        const res = await getIpdRecordItem(ipdId)
        this.setIpdData(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        this.ipdDataLoading = false
      }
    },
    setIpdData(data) {
      Object.assign(this.ipdData, data)
      this.selected = [data]
    },
    async validate() {
      return new Promise((resolve) => {
        this.emitter.emit(null, (result) => {
          resolve(result)
        })
      })
    },
  },
})

