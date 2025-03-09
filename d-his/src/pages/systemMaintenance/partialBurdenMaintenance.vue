<template>
  <my-title noFixed title="門診部分負擔"></my-title>
  <Button class="p-button-sm partial-save-btn" @click="saveData" label="儲存" icon="pi pi-pencil" />
  <main>
    <article class="dtc-grid-table">
      <div class="yellow-block-title sepc-column1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 7.5L5.92819 14.0718C5.71566 14.2843 5.60939 14.3906 5.53953 14.5212C5.46966 14.6517 5.44019 14.7991 5.38124 15.0938L4.64709 18.7646C4.58057 19.0972 4.5473 19.2635 4.64191 19.3581C4.73652 19.4527 4.90283 19.4194 5.23544 19.3529L8.90621 18.6188C9.20093 18.5598 9.3483 18.5303 9.47885 18.4605C9.60939 18.3906 9.71566 18.2843 9.92819 18.0718L16.5 11.5L12.5 7.5Z"
            fill="#2A4157"
            fill-opacity="0.24"
          />
          <path
            d="M5.95396 19.38L5.95397 19.38L5.9801 19.3734L5.98012 19.3734L8.60809 18.7164C8.62428 18.7124 8.64043 18.7084 8.65654 18.7044C8.87531 18.65 9.08562 18.5978 9.27707 18.4894C9.46852 18.381 9.62153 18.2275 9.7807 18.0679C9.79242 18.0561 9.80418 18.0444 9.81598 18.0325L17.0101 10.8385L17.0101 10.8385L17.0369 10.8117C17.3472 10.5014 17.6215 10.2272 17.8128 9.97638C18.0202 9.70457 18.1858 9.39104 18.1858 9C18.1858 8.60896 18.0202 8.29543 17.8128 8.02361C17.6215 7.77285 17.3472 7.49863 17.0369 7.18835L17.01 7.16152L16.8385 6.98995L16.8117 6.96314C16.5014 6.6528 16.2272 6.37853 15.9764 6.1872C15.7046 5.97981 15.391 5.81421 15 5.81421C14.609 5.81421 14.2954 5.97981 14.0236 6.1872C13.7729 6.37853 13.4986 6.65278 13.1884 6.96311L13.1615 6.98995L5.96745 14.184C5.95565 14.1958 5.94386 14.2076 5.93211 14.2193C5.77249 14.3785 5.61904 14.5315 5.51064 14.7229C5.40225 14.9144 5.34999 15.1247 5.29562 15.3435C5.29162 15.3596 5.28761 15.3757 5.28356 15.3919L4.62003 18.046C4.61762 18.0557 4.61518 18.0654 4.61272 18.0752C4.57411 18.2293 4.53044 18.4035 4.51593 18.5518C4.49978 18.7169 4.50127 19.0162 4.74255 19.2574C4.98383 19.4987 5.28307 19.5002 5.44819 19.4841C5.59646 19.4696 5.77072 19.4259 5.92479 19.3873C5.9346 19.3848 5.94433 19.3824 5.95396 19.38Z"
            stroke="#33363F"
            stroke-width="1.2"
          />
          <path d="M12.5 7.5L16.5 11.5" stroke="#33363F" stroke-width="1.2" />
        </svg>
        門診基本部分負擔
      </div>
      <div class="blue-block-title left-title2 spec-place">
        <div class="word-one">醫院層</div>
        <div class="word-two">項目</div>
        <div class="line-block"></div>
      </div>
      <div class="blue-block-title">醫學中心</div>
      <div class="blue-block-title">區域醫院</div>
      <div class="blue-block-title">地區醫院</div>
      <div class="blue-block-title">診所</div>

      <div class="blue-block-title sepc-row">西醫門診</div>
      <div class="red-block-title left-title1">經轉診</div>
      <div class="content">
        <q-input v-model="allData.data1"></q-input>
      </div>
      <div class="content"><q-input v-model="allData.data2"></q-input></div>
      <div class="content"><q-input v-model="allData.data3"></q-input></div>
      <div class="content"><q-input v-model="allData.data4"></q-input></div>
      <div class="red-block-title left-title1">未經轉診</div>
      <div class="content"><q-input v-model="allData.data5"></q-input></div>
      <div class="content"><q-input v-model="allData.data6"></q-input></div>
      <div class="content"><q-input v-model="allData.data7"></q-input></div>
      <div class="content"><q-input v-model="allData.data8"></q-input></div>

      <div class="blue-block-title sepc-row">急診</div>
      <div class="red-block-title sepc-row">檢傷分類</div>
      <div class="red-block-title">第1、2級</div>
      <div class="content"><q-input v-model="allData.data9"></q-input></div>
      <div class="content sepc-row">
        <q-input v-model="allData.data10"></q-input>
      </div>
      <div class="content sepc-row">
        <q-input v-model="allData.data11"></q-input>
      </div>
      <div class="content sepc-row">
        <q-input v-model="allData.data12"></q-input>
      </div>
      <div class="red-block-title">第3、4、5級</div>
      <div class="content">
        <q-input v-model="allData.data13"></q-input>
      </div>

      <div class="blue-block-title left-title2">牙醫</div>
      <div class="content">
        <q-input v-model="allData.data14"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data15"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data16"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data17"></q-input>
      </div>
      <div class="blue-block-title left-title2">中醫</div>
      <div class="content">
        <q-input v-model="allData.data18"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data19"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data20"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data21"></q-input>
      </div>
      <div class="blue-block-title left-title2">身心障礙手冊者</div>
      <div class="content sepc-column2">
        <q-input v-model="allData.data22"></q-input>
      </div>

      <div class="blue-block-title left-title2" style="flex-direction: column; align-items: start">
        <div>門診手術後、急診手術後</div>
        <div>或住院患者出院後1個月內之第一次回診，</div>
        <div>及生產出院後6週內第一次回診，視同轉診。</div>
      </div>
      <div class="content">
        <q-input v-model="allData.data23"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data24"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data25"></q-input>
      </div>
      <div class="content">
        <q-input v-model="allData.data26"></q-input>
      </div>
    </article>

    <article class="dtc-grid-table2">
      <div class="yellow-block-title sepc-column1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 7.5L5.92819 14.0718C5.71566 14.2843 5.60939 14.3906 5.53953 14.5212C5.46966 14.6517 5.44019 14.7991 5.38124 15.0938L4.64709 18.7646C4.58057 19.0972 4.5473 19.2635 4.64191 19.3581C4.73652 19.4527 4.90283 19.4194 5.23544 19.3529L8.90621 18.6188C9.20093 18.5598 9.3483 18.5303 9.47885 18.4605C9.60939 18.3906 9.71566 18.2843 9.92819 18.0718L16.5 11.5L12.5 7.5Z"
            fill="#2A4157"
            fill-opacity="0.24"
          />
          <path
            d="M5.95396 19.38L5.95397 19.38L5.9801 19.3734L5.98012 19.3734L8.60809 18.7164C8.62428 18.7124 8.64043 18.7084 8.65654 18.7044C8.87531 18.65 9.08562 18.5978 9.27707 18.4894C9.46852 18.381 9.62153 18.2275 9.7807 18.0679C9.79242 18.0561 9.80418 18.0444 9.81598 18.0325L17.0101 10.8385L17.0101 10.8385L17.0369 10.8117C17.3472 10.5014 17.6215 10.2272 17.8128 9.97638C18.0202 9.70457 18.1858 9.39104 18.1858 9C18.1858 8.60896 18.0202 8.29543 17.8128 8.02361C17.6215 7.77285 17.3472 7.49863 17.0369 7.18835L17.01 7.16152L16.8385 6.98995L16.8117 6.96314C16.5014 6.6528 16.2272 6.37853 15.9764 6.1872C15.7046 5.97981 15.391 5.81421 15 5.81421C14.609 5.81421 14.2954 5.97981 14.0236 6.1872C13.7729 6.37853 13.4986 6.65278 13.1884 6.96311L13.1615 6.98995L5.96745 14.184C5.95565 14.1958 5.94386 14.2076 5.93211 14.2193C5.77249 14.3785 5.61904 14.5315 5.51064 14.7229C5.40225 14.9144 5.34999 15.1247 5.29562 15.3435C5.29162 15.3596 5.28761 15.3757 5.28356 15.3919L4.62003 18.046C4.61762 18.0557 4.61518 18.0654 4.61272 18.0752C4.57411 18.2293 4.53044 18.4035 4.51593 18.5518C4.49978 18.7169 4.50127 19.0162 4.74255 19.2574C4.98383 19.4987 5.28307 19.5002 5.44819 19.4841C5.59646 19.4696 5.77072 19.4259 5.92479 19.3873C5.9346 19.3848 5.94433 19.3824 5.95396 19.38Z"
            stroke="#33363F"
            stroke-width="1.2"
          />
          <path d="M12.5 7.5L16.5 11.5" stroke="#33363F" stroke-width="1.2" />
        </svg>
        門診藥品部分負擔
      </div>
      <div class="blue-block-title content2">藥費</div>
      <div class="blue-block-title content2">部分負擔費用</div>
      <div class="content2">100元以下</div>
      <div class="content content2">
        <q-input v-model="allData.data27" lastpend="元"></q-input>
      </div>
      <div class="content2">101～200元</div>
      <div class="content content2">
        <q-input v-model="allData.data28" lastpend="元"></q-input>
      </div>
      <div class="content2">201～300元</div>
      <div class="content content2">
        <q-input v-model="allData.data29" lastpend="元"></q-input>
      </div>
      <div class="content2">301～400元</div>
      <div class="content content2">
        <q-input v-model="allData.data30" lastpend="元"></q-input>
      </div>
      <div class="content2">401～500元</div>
      <div class="content content2">
        <q-input v-model="allData.data31" lastpend="元"></q-input>
      </div>
      <div class="content2">501～600元</div>
      <div class="content content2">
        <q-input v-model="allData.data32" lastpend="元"></q-input>
      </div>
      <div class="content2">601～700元</div>
      <div class="content content2">
        <q-input v-model="allData.data33" lastpend="元"></q-input>
      </div>
      <div class="content2">701～800元</div>
      <div class="content content2">
        <q-input v-model="allData.data34" lastpend="元"></q-input>
      </div>
      <div class="content2">801～900元</div>
      <div class="content content2">
        <q-input v-model="allData.data35" lastpend="元"></q-input>
      </div>
      <div class="content2">901～1000元</div>
      <div class="content content2">
        <q-input v-model="allData.data36" lastpend="元"></q-input>
      </div>
      <div class="content2">1001元以上</div>
      <div class="content content2">
        <q-input v-model="allData.data37" lastpend="元"></q-input>
      </div>
    </article>

    <article class="dtc-grid-table3">
      <div class="yellow-block-title sepc-column1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 7.5L5.92819 14.0718C5.71566 14.2843 5.60939 14.3906 5.53953 14.5212C5.46966 14.6517 5.44019 14.7991 5.38124 15.0938L4.64709 18.7646C4.58057 19.0972 4.5473 19.2635 4.64191 19.3581C4.73652 19.4527 4.90283 19.4194 5.23544 19.3529L8.90621 18.6188C9.20093 18.5598 9.3483 18.5303 9.47885 18.4605C9.60939 18.3906 9.71566 18.2843 9.92819 18.0718L16.5 11.5L12.5 7.5Z"
            fill="#2A4157"
            fill-opacity="0.24"
          />
          <path
            d="M5.95396 19.38L5.95397 19.38L5.9801 19.3734L5.98012 19.3734L8.60809 18.7164C8.62428 18.7124 8.64043 18.7084 8.65654 18.7044C8.87531 18.65 9.08562 18.5978 9.27707 18.4894C9.46852 18.381 9.62153 18.2275 9.7807 18.0679C9.79242 18.0561 9.80418 18.0444 9.81598 18.0325L17.0101 10.8385L17.0101 10.8385L17.0369 10.8117C17.3472 10.5014 17.6215 10.2272 17.8128 9.97638C18.0202 9.70457 18.1858 9.39104 18.1858 9C18.1858 8.60896 18.0202 8.29543 17.8128 8.02361C17.6215 7.77285 17.3472 7.49863 17.0369 7.18835L17.01 7.16152L16.8385 6.98995L16.8117 6.96314C16.5014 6.6528 16.2272 6.37853 15.9764 6.1872C15.7046 5.97981 15.391 5.81421 15 5.81421C14.609 5.81421 14.2954 5.97981 14.0236 6.1872C13.7729 6.37853 13.4986 6.65278 13.1884 6.96311L13.1615 6.98995L5.96745 14.184C5.95565 14.1958 5.94386 14.2076 5.93211 14.2193C5.77249 14.3785 5.61904 14.5315 5.51064 14.7229C5.40225 14.9144 5.34999 15.1247 5.29562 15.3435C5.29162 15.3596 5.28761 15.3757 5.28356 15.3919L4.62003 18.046C4.61762 18.0557 4.61518 18.0654 4.61272 18.0752C4.57411 18.2293 4.53044 18.4035 4.51593 18.5518C4.49978 18.7169 4.50127 19.0162 4.74255 19.2574C4.98383 19.4987 5.28307 19.5002 5.44819 19.4841C5.59646 19.4696 5.77072 19.4259 5.92479 19.3873C5.9346 19.3848 5.94433 19.3824 5.95396 19.38Z"
            stroke="#33363F"
            stroke-width="1.2"
          />
          <path d="M12.5 7.5L16.5 11.5" stroke="#33363F" stroke-width="1.2" />
        </svg>
        門診復健（含中醫傷科）部分負擔
      </div>

      <div class="content2">
        門診進行復健物理治療或中醫傷科治療，那麼同一療程自第2次起，
        每次須付部分負擔50元(復健物理治療「中度-複雜」及「複雜」治療除外)。
      </div>
    </article>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'

import {
  getBasicPartial,
  getBasicPartialItem,
  postBasicPartial,
  putBasicPartial,
  putBatchBasicPartial,
  deleteBasicPartial,
  getMedPartial,
  getMedPartialItem,
  postMedPartial,
  putMedPartial,
  putBatchMedPartial,
  deleteMedPartial,
} from 'api'

const $q = useQuasar()

const loading = ref(true)

const allData = ref({
  //original XD data
  data1: 170,
  data2: 100,
  data3: 50,
  data4: 50,
  data5: 420,
  data6: 240,
  data7: 80,
  data8: 50,
  data9: 450,
  data10: 300,
  data11: 150,
  data12: 150,
  data13: 550,
  data14: 50,
  data15: 50,
  data16: 50,
  data17: 50,
  data18: 50,
  data19: 50,
  data20: 50,
  data21: 50,
  data22: 50,
  data23: 170,
  data24: 100,
  data25: 50,
  data26: 50,
  data27: 0,
  data28: 20,
  data29: 40,
  data30: 60,
  data31: 80,
  data32: 100,
  data33: 120,
  data34: 140,
  data35: 160,
  data36: 180,
  data37: 200,
}) //originalData

const getData = async () => {
  try {
    const { data: data1 } = await getBasicPartial()
    const { data: data2 } = await getMedPartial()
    let allData1 = _.cloneDeep(data1?.Items) // 門診基本部分負擔
    let allData2 = _.cloneDeep(data2?.Items) // 門診藥品部分負擔

    allData1 = allData1.reduce((ac, cu, idx) => {
      ac['data' + cu.ItemId] = {
        AreaHospital: cu.AreaHospital,
        Clinic: cu.Clinic,
        MedicalCenter: cu.MedicalCenter,
        RegionHospital: cu.RegionHospital,
      }
      return ac
    }, {})

    allData2 = allData2.reduce((ac, cu, idx) => {
      ac['data' + cu.ItemId] = {
        Fee: cu.Fee,
      }
      return ac
    }, {})

    allData.value = {
      data1: +allData1.data1.MedicalCenter,
      data2: +allData1.data1.AreaHospital,
      data3: +allData1.data1.RegionHospital,
      data4: +allData1.data1.Clinic,
      data5: +allData1.data2.MedicalCenter,
      data6: +allData1.data2.AreaHospital,
      data7: +allData1.data2.RegionHospital,
      data8: +allData1.data2.Clinic,
      data9: +allData1.data3.MedicalCenter,
      data10: +allData1.data3.AreaHospital,
      data11: +allData1.data3.RegionHospital,
      data12: +allData1.data3.Clinic,
      data13: +allData1.data4.MedicalCenter,
      data14: +allData1.data5.MedicalCenter,
      data15: +allData1.data5.AreaHospital,
      data16: +allData1.data5.RegionHospital,
      data17: +allData1.data5.Clinic,
      data18: +allData1.data6.MedicalCenter,
      data19: +allData1.data6.AreaHospital,
      data20: +allData1.data6.RegionHospital,
      data21: +allData1.data6.Clinic,
      data22: +allData1.data7.MedicalCenter,
      data23: +allData1.data8.MedicalCenter,
      data24: +allData1.data8.AreaHospital,
      data25: +allData1.data8.RegionHospital,
      data26: +allData1.data8.Clinic,
      data27: +allData2.data1.Fee,
      data28: +allData2.data2.Fee,
      data29: +allData2.data3.Fee,
      data30: +allData2.data4.Fee,
      data31: +allData2.data5.Fee,
      data32: +allData2.data6.Fee,
      data33: +allData2.data7.Fee,
      data34: +allData2.data8.Fee,
      data35: +allData2.data9.Fee,
      data36: +allData2.dataa.Fee,
      data37: +allData2.datab.Fee,
    }
  } catch (err) {
    $q.notify({
      type: 'negative',

      message: '資料抓取錯誤',
      position: 'top',
    })
  }
}

const saveData = async () => {
  let all = _.cloneDeep(allData.value)

  let arr = Object.entries(all)

  //把所有資料轉為數字
  let allObj = arr.reduce((ac, cu, idx) => {
    ac[cu[0]] = +cu[1]
    return ac
  }, {})

  const savingDataArr1 = [
    {
      ItemId: '1',
      MedicalCenter: allObj.data1,
      AreaHospital: allObj.data2,
      RegionHospital: allObj.data3,
      Clinic: allObj.data4,
    },
    {
      ItemId: '2',
      MedicalCenter: allObj.data5,
      AreaHospital: allObj.data6,
      RegionHospital: allObj.data7,
      Clinic: allObj.data8,
    },
    {
      ItemId: '3',
      MedicalCenter: allObj.data9,
      AreaHospital: allObj.data10,
      RegionHospital: allObj.data11,
      Clinic: allObj.data12,
    },
    {
      ItemId: '4',
      MedicalCenter: allObj.data13,
      AreaHospital: allObj.data10,
      RegionHospital: allObj.data11,
      Clinic: allObj.data12,
    },
    {
      ItemId: '5',
      MedicalCenter: allObj.data14,
      AreaHospital: allObj.data15,
      RegionHospital: allObj.data16,
      Clinic: allObj.data17,
    },
    {
      ItemId: '6',
      MedicalCenter: allObj.data18,
      AreaHospital: allObj.data19,
      RegionHospital: allObj.data20,
      Clinic: allObj.data21,
    },
    {
      ItemId: '7',
      MedicalCenter: allObj.data22,
      AreaHospital: allObj.data22,
      RegionHospital: allObj.data22,
      Clinic: allObj.data22,
    },
    {
      ItemId: '8',
      MedicalCenter: allObj.data23,
      AreaHospital: allObj.data24,
      RegionHospital: allObj.data25,
      Clinic: allObj.data26,
    },
  ]

  const savingDataArr2 = [
    {
      ItemId: '1',
      Fee: allObj.data27,
    },
    {
      ItemId: '2',
      Fee: allObj.data28,
    },
    {
      ItemId: '3',
      Fee: allObj.data29,
    },
    {
      ItemId: '4',
      Fee: allObj.data30,
    },
    {
      ItemId: '5',
      Fee: allObj.data31,
    },
    {
      ItemId: '6',
      Fee: allObj.data32,
    },
    {
      ItemId: '7',
      Fee: allObj.data33,
    },
    {
      ItemId: '8',
      Fee: allObj.data34,
    },
    {
      ItemId: '9',
      Fee: allObj.data35,
    },
    {
      ItemId: 'a',
      Fee: allObj.data36,
    },
    {
      ItemId: 'b',
      Fee: allObj.data37,
    },
  ]

  try {
    await putBatchBasicPartial(savingDataArr1)
    await putBatchMedPartial(savingDataArr2)
    // for (const element of savingDataArr1) {
    //   await putBasicPartial(element);
    // }

    // for (const element2 of savingDataArr2) {
    //   await putMedPartial(element2);
    // }

    $q.notify({
      type: 'positive',

      message: '儲存成功',
      position: 'top',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',

      message: '儲存失敗',
      position: 'top',
    })
  }
}

const init = async () => {
  getData()
}

init()
</script>

<style lang="scss" scoped>
.dtc-grid-table,
.dtc-grid-table2,
.dtc-grid-table3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 36px 36px 36px 36px 36px 36px 36px 50px 36px 100px;
  border-left: 1px solid #215dbb;
  margin: 5px 12px 22px;

  // align-items: center;
  > div {
    background-color: #fff;
    border-bottom: 1px solid #215dbb;
    border-right: 1px solid #215dbb;
    color: #0a2548;
    text-align: center;
    padding: 2px 8px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 550;
  }
  .content {
    cursor: pointer;
  }

  .yellow-block-title {
    background-color: #fef9ea;
    border-top: 1px solid #215dbb;

    justify-content: flex-start;
  }

  .blue-block-title {
    background-color: #d5e8f1;
  }

  .red-block-title {
    background-color: #fff1f1;
  }

  .left-title1 {
    grid-column: span 2;
  }
  .left-title2 {
    grid-column: span 3;
  }

  .sepc-column1 {
    grid-column: 1/-1;
  }

  .sepc-column2 {
    grid-column: span 4;
  }

  .sepc-row {
    grid-row: span 2;
  }
}

.dtc-grid-table2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 36px 36px 36px 36px 36px 36px 36px 36px 36px 36px 36px 36px 36px;
  .content2 {
    justify-content: center;
  }
}

.dtc-grid-table3 {
  grid-template-columns: 1fr;
  grid-template-rows: 36px 120px;
  .content2 {
    justify-content: center;
  }
}
.partial-save-btn {
  position: fixed;
  right: 22px;
  top: 116px;
  z-index: 99;
}
.spec-place {
  position: relative;
  padding: 0 !important;

  .line-block {
    width: 100%;
    height: 100%;
    clip-path: polygon(0 0, 3% 0, 100% 100%, 97% 100%);
    background-color: #1a56b8;
    position: absolute;
    left: 0%;
  }

  .word-one {
    position: absolute;
    right: 20px;
    top: 1px;
  }
  .word-two {
    position: absolute;
    left: 20px;
    bottom: 1px;
  }
}
</style>
