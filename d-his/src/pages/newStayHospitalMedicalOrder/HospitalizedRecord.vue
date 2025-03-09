<template>
  <q-page>
    <my-aside width="245">
      <aside class="aside-list scroll">
        <div class="flex justify-center gap-2">
          <q-btn
            class="printBtn"
            dense
            unelevated
            color="blue-4"
            textColor="black"
            label="匯入全部"
            @click="getReport"
          ></q-btn>
          <q-btn
            class="printBtn"
            dense
            unelevated
            color="brown-4"
            textColor="black"
            label="匯入身體狀況"
            @click="getAllVitalSigns"
          ></q-btn>
          <q-btn
            class="printBtn"
            dense
            unelevated
            color="purple-4"
            textColor="black"
            label="匯入病程紀錄"
            @click="getAllProcessNotes"
          ></q-btn>
          <q-btn
            class="printBtn"
            dense
            unelevated
            color="green-4"
            textColor="black"
            label="匯入用藥紀錄"
            @click="getAllMedications"
          ></q-btn>
          <q-btn
            class="printBtn"
            dense
            unelevated
            color="orange-4"
            textColor="black"
            label="匯入檢查項目"
            @click="getAllProcedures"
          ></q-btn>
        </div>
        <div class="flex justify-center mt-2">
          <q-btn class="printBtn" dense unelevated textColor="black" label="列印" @click="print"></q-btn>
        </div>
      </aside>
    </my-aside>

    <div class="p-3 print" id="print">
      <div class="border border-black w-[800px] p-5">
        <h2 class="text-center text-2xl font-semibold mb-2">出院摘要</h2>
        <div class="text-lg font-bold">
          <div>
            <span> 病歷號碼:{{ ipdStore.ipdData.PatientId }} </span>
            <span style="margin-left: 80px"> 姓名:{{ ipdStore.ipdData.Patient.Person.Name }} </span>
          </div>
          <div class="flex gap-6">
            <span> 性別:{{ ipdStore.ipdData.Gender }} </span>
            <span> 身分證字號:{{ ipdStore.ipdData.Patient.Person.PersonId }} </span>
            <span> 出生日期:{{ dayjs(ipdStore.ipdData.Patient.Person?.BirthDate).format('YYYY-MM-DD HH:mm') }} </span>
          </div>
          <div>入院日期:{{ dayjs(ipdStore.ipdData?.IpdDate).format('YYYY-MM-DD HH:mm') }}</div>
          <div>出院日期:{{ dayjs(ipdStore.ipdData?.IpdDate).format('YYYY-MM-DD HH:mm') }}</div>
          <div>
            出院狀況:
            <q-option-group v-model="situation" :options="situationOptions" inline></q-option-group>
          </div>
          <div>
            診斷(icd10):
            {{ ipdStore.ipdData?.OpdDiagnosisIcd10Name }}
          </div>
          <div>
            主訴(缺 opdSubject):
            {{ ipdStore.ipdData?.OpdDiagnosisIcd10Name }}
          </div>
          <div>
            身體狀況(VitalSigns): <br />
            <q-input v-bind="QInputProps" class="text-lg font-bold" type="textarea" v-model="allVitalSigns"></q-input>
          </div>
          <div>
            病程紀錄(IpdProgressNotes): <br />
            <q-input v-bind="QInputProps" class="text-lg font-bold" type="textarea" v-model="allProcessNotes"></q-input>
          </div>
          <div>
            用藥紀錄(IpdMedications): <br />
            <q-input v-bind="QInputProps" class="text-lg font-bold" type="textarea" v-model="allMedications"></q-input>
          </div>
          <div>
            檢查紀錄(IpdProcedures): <br />
            <q-input v-bind="QInputProps" class="text-lg font-bold" type="textarea" v-model="allProcedures"></q-input>
          </div>
          <div>
            <div>備註:</div>
            <q-input v-bind="QInputProps" class="text-lg font-bold" type="textarea" v-model="note"></q-input>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import { useIpdStore } from 'stores/ipd'

// utils
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import dayjs from 'dayjs'

const route = useRoute()
// const router = useRouter();
// const $q = useQuasar();

const ipdStore = useIpdStore()
const situation = ref('')
const situationOptions = [
  { label: '治癒', value: 'heal' },
  { label: '病情改善', value: 'getBetter' },
  { label: '不變', value: 'noChange' },
  { label: '轉院', value: 'changeHospital' },
  { label: '死亡', value: 'death' },
]
const getReport = () => {
  getAllProcessNotes()
  getAllMedications()
  getAllProcedures()
  getAllVitalSigns()
}
const allProcessNotes = ref('')
const getAllProcessNotes = () => {
  let text = ''
  for (let index = 0; index < ipdStore.ipdData?.IpdProgressNotes?.length; index++) {
    text += `${ipdStore.ipdData?.IpdProgressNotes[index].PomrDescription}。\n`
  }
  allProcessNotes.value = text
}
const allMedications = ref('')
const getAllMedications = () => {
  let text = ''
  for (let index = 0; index < ipdStore.ipdData?.IpdMedications?.length; index++) {
    text +=
      `${ipdStore.ipdData?.IpdMedications[index].MedicineName}，${ipdStore.ipdData?.IpdMedications[index].FrequencyName}，` +
      `服用${ipdStore.ipdData?.IpdMedications[index].DoseOnce}次。\n`
  }
  allMedications.value = text
}
const allProcedures = ref('')
const getAllProcedures = () => {
  let text = ''
  for (let index = 0; index < ipdStore.ipdData?.IpdProcedures?.length; index++) {
    text += `${ipdStore.ipdData?.IpdProcedures[index].BookingStartTime}，${ipdStore.ipdData?.IpdProcedures[index].ProcedureName}\n`
  }
  allProcedures.value = text
}

const allVitalSigns = ref('')
const getAllVitalSigns = () => {
  let text = ''
  for (let index = 0; index < ipdStore.ipdData?.IpdVitalSigns?.length; index++) {
    text +=
      `體溫${ipdStore.ipdData?.IpdVitalSigns[index].BodyTemperature}∘C、脈搏${ipdStore.ipdData?.IpdVitalSigns[index].Hr}次/分、` +
      `呼吸${ipdStore.ipdData?.IpdVitalSigns[index].Rr}次/分、` +
      `血壓mmHg${ipdStore.ipdData?.IpdVitalSigns[index].BloodPressureHigh}/${ipdStore.ipdData?.IpdVitalSigns[index].BloodPressureLow}\n`
  }
  allVitalSigns.value = text
}
const note = ref('暫做參考')
const print = () => {
  window.print()
}

const init = () => {}
init()
</script>

<style lang="scss" scoped>
.aside-list {
  padding: 10px 7px;
  background-color: #eefaff;
  height: 100%;

  .printBtn {
    height: 38px;
    padding: 0px 8px;
    font-size: 18px;
    line-height: 34px;
    font-weight: 700;
    background: white;
    border: 1px solid #629893;
    color: black;
    margin-right: 8px;
  }
  .allPrintBtn {
    @extend .printBtn;
    background-color: #ffcb7d;
  }
}
</style>

