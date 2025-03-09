<template>
  <div
    class="rounded-md flex-1 flex flex-col px-6 border-block pb-5"
    id="consent-block"
    ref="consentContent"
    :class="{
      'avoid-clicks': !isSameInstitution,
      'cannot-edit': !consentCanEdit,
    }"
  >
    <div class="px-2 py-2 text-center text-2xl mid-size font-semibold" style="text-align: center">
      電子病歷跨院互通暨提供就醫紀錄與結果資訊同意書
      <span class="hidden-item">
        (<b style="color: red">{{ consentCanEdit ? '編輯' : '檢閱' }}</b
        >)
      </span>
    </div>
    <div>
      本人
      <span style="text-decoration: underline; font-weight: bold; display: inline-block">
        {{ patientInfo.Name || ' ' }}
      </span>
      同意
      <span style="text-decoration: underline; display: inline-block">
        <!-- 衛生福利部空中轉診審核中心(空審中心)、(系統帶入啟動後送衛生所名稱)衛生所、(系統帶入轉診醫院名稱)醫院 -->
        {{ hospitalNames }}醫師
      </span>
      為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情及藥事人員調劑、給予本人用藥諮詢或指導需要時，於本人簽署本同意書日期起算7年內，可調閱下列資料：
    </div>
    <div title="此為必同意項目，不可編輯">
      <label class="mt-5" for="agreeone" style="display: grid; grid-template-columns: 26px 1fr; pointer-events: none">
        <input
          class="mr-1 h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 bg-no-repeat mt-1"
          type="checkbox"
          id="agreeone"
          v-model="consentData.agreeOne"
        />

        <span class="pb-1">透過衛生福利部電子病歷交換中心系統調閱本人最近就醫醫療院所之全部電子病歷資料。</span>
      </label>
    </div>

    <div title="此為必同意項目，不可編輯">
      <label class="mb-3" for="agreetwo" style="display: grid; grid-template-columns: 26px 1fr; pointer-events: none">
        <input
          class="mr-1 h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 bg-no-repeat mt-1"
          type="checkbox"
          id="agreetwo"
          v-model="consentData.agreeTwo"
        />

        <span class="pb-1"
          >自衛生福利部中央健康保險署(以下稱健保署)依全民健康保險法相關規定建置之健保醫療資訊雲端查詢系統(包含健保雲端藥歷系統)，執行下列作業：</span
        >
      </label>
    </div>

    <div class="mb-1 px-7 agree-content">
      <div>一、</div>
      <div>下載於查詢系統中本人就醫之醫療費用申報資料及健保卡上傳就醫資料。(包含用藥紀錄、檢查檢驗項目、手術項目、牙科處置及手術項目等資料)。</div>
    </div>
    <div class="mb-3 px-7 agree-content">
      <div>二、</div>
      <div>線上查詢及下載該查詢系統中，各健保署特約醫事服務機構上傳之本人就醫結果資料。(包含檢查(驗)結果報告、檢查(驗)影像檔案、出院病歷摘要等資料)</div>
    </div>

    <div>
      前述資料，僅限本人於
      <span class="underline inline-block">
        <!-- 衛生福利部空中轉診審核中心(空審中心)、(系統帶入啟動後送衛生所名稱)衛生所、(系統帶入轉診醫院名稱)醫院 -->
        {{ hospitalNames }}醫師</span
      >
      為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情、病情評估及完成後送之癒後評估、藥事人員調劑、給予本人用藥諮詢或指導需要查詢比對使用，另如遠距醫療後醫師評估需緊急空中轉診，則資料自動轉入空中轉診後送使用，不得將該項資料另移作其他目的使用，且本人完成前述事項後，即應將該下載資訊刪除。但下載之資訊，醫師因醫療或追蹤管理需要，已列入病歷或處置決策紀錄者，不在此限。
    </div>

    <div class="mt-1 mb-2">本人依個人資料保護法第3條規定，保留隨時取消本同意書或變更本同意書內容之權利。</div>

    <div class="mt-8">※上述電子病歷跨院互通同意書暨提供就醫紀錄與結果資訊同意書，詳閱無誤，請在此同意書簽名：</div>

    <div class="flex items-center mt-2 mb-3">
      <span class="red-star">立同意書人簽章：</span>
      <span
        class="mx-3 flex justify-center items-center signaturePicture-block"
        :style="consentData.signaturePicture1 ? 'width: 210px;height:86px;border: 1px black dashed;' : ''"
        ><img
          style="width: 100%; height: 100%; cursor: pointer"
          :src="consentData.signaturePicture1"
          v-if="consentData.signaturePicture1"
          title="可點擊此進行重新簽名"
          @click="openSignatureBoard(1)"
        />
        <input v-else class="signature-btn hidden-item" type="button" value="點我電子簽名" @click="openSignatureBoard(1)" />
        <div class="clear-block" v-show="!!consentData.signaturePicture1">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="clearConsentSignature(1)"
          >
            清除
          </button>
        </div>
      </span>

      <div class="flex items-center small-size">
        <span class="red-star">關係</span>：病人之
        <div class="form-check ml-2 mr-2 flex items-center" v-for="(item, index) in contracterRelationOptions" :key="index">
          <input
            class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="radio"
            :id="'radioPatientRelationType' + item.value + item.text"
            v-model="consentData.contracterRelation"
            :value="item.value"
            @change="setRelationData(consentData.contracterRelation)"
          />
          <label class="form-check-label inline-block text-gray-800" :for="'radioPatientRelationType' + item.value + item.text">
            {{ item.text }}
          </label>
        </div>

        <InputText
          class="p-button-sm hidden-item"
          v-model.trim="consentData.contracterRelationOther"
          :disabled="consentData.contracterRelation != '其他'"
          maxlength="10"
          style="width: 180px; height: 40px"
          placeholder="選擇其他時為必填欄位"
          :class="{
            'cannot-edit-input': !consentCanEdit,
          }"
        />
        <div class="show-item underline">
          {{ consentData.contracterRelationOther }}
        </div>
      </div>
    </div>

    <div class="flex items-center my-3">
      <div class="mr-2 flex items-center red-star">
        出生年月日：
        <Calendar
          v-model="consentData.birthday"
          :showIcon="true"
          dateFormat="yy-mm-dd"
          :maxDate="new Date()"
          style="height: 40px"
          class="hidden-item"
          :class="{
            'cannot-edit-input': !consentCanEdit,
          }"
          @date-select="setBirthday"
          v-date-input
        />

        <div class="show-item underline" :class="!consentData.birthday ? 'mx-12' : ''">
          {{ consentData.birthday }}
        </div>
      </div>
      <div class="flex items-center red-star">
        身分證號：<InputText
          class="p-button-sm hidden-item"
          v-model.trim="consentData.idnumber"
          maxlength="10"
          style="width: 130px; height: 40px"
          :class="{
            'cannot-edit-input': !consentCanEdit,
          }"
        />
        <div class="show-item underline" :class="!consentData.idnumber ? 'mx-12' : ''">
          {{ consentData.idnumber }}
        </div>
      </div>
    </div>

    <div class="flex items-center my-3">
      見證人簽章：1.

      <span
        class="mx-3 flex justify-center items-center signaturePicture-block"
        :style="consentData.signaturePicture2 ? 'width: 210px;height:86px;border: 1px black dashed;' : ''"
        ><img
          style="width: 100%; height: 100%; cursor: pointer"
          :src="consentData.signaturePicture2"
          v-if="consentData.signaturePicture2"
          title="可點擊此進行重新簽名"
          @click="openSignatureBoard(2)"
        />
        <input v-else class="signature-btn hidden-item" type="button" value="點我電子簽名" @click="openSignatureBoard(2)" />
        <div class="clear-block" v-show="!!consentData.signaturePicture2">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="clearConsentSignature(2)"
          >
            清除
          </button>
        </div>
      </span>
      2.

      <span
        class="mx-3 flex justify-center items-center signaturePicture-block"
        :style="consentData.signaturePicture3 ? 'width: 210px;height:86px;border: 1px black dashed;' : ''"
        ><img
          style="width: 100%; height: 100%; cursor: pointer"
          :src="consentData.signaturePicture3"
          v-if="consentData.signaturePicture3"
          title="可點擊此進行重新簽名"
          @click="openSignatureBoard(3)"
        />
        <input v-else class="signature-btn hidden-item" type="button" value="點我電子簽名" @click="openSignatureBoard(3)" />
        <div class="clear-block" v-show="!!consentData.signaturePicture3">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="clearConsentSignature(3)"
          >
            清除
          </button>
        </div>
      </span>
    </div>

    <div class="flex items-center my-3">
      法定代理人/監護人：
      <span
        class="mx-3 flex justify-center items-center signaturePicture-block"
        :style="consentData.signaturePicture4 ? 'width: 210px;height:86px;border: 1px black dashed' : ''"
        ><img
          style="width: 100%; height: 100%; cursor: pointer"
          :src="consentData.signaturePicture4"
          v-if="consentData.signaturePicture4"
          title="可點擊此進行重新簽名"
          @click="openSignatureBoard(4)"
        />
        <input v-else class="signature-btn hidden-item" type="button" value="點我電子簽名" @click="openSignatureBoard(4)" />
        <div class="clear-block" v-show="!!consentData.signaturePicture4">
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="clearConsentSignature(4)"
          >
            清除
          </button>
        </div>
      </span>

      關係：病人之<InputText
        class="p-button-sm hidden-item"
        v-model.trim="consentData.legalEepresentativeRelation"
        maxlength="10"
        style="width: 110px; margin-right: 10px; height: 40px"
        placeholder="上限10字"
        :class="{
          'cannot-edit-input': !consentCanEdit,
        }"
      />
      <div class="show-item underline" style="margin-right: 10px; min-width: 110px">
        {{ consentData.legalEepresentativeRelation }}
      </div>
      身分證號：<InputText
        class="p-button-sm hidden-item"
        v-model.trim="consentData.legalEepresentativeIdNumber"
        maxlength="10"
        style="width: 110px; height: 40px"
        placeholder="上限10字"
        :class="{
          'cannot-edit-input': !consentCanEdit,
        }"
      />
      <div class="show-item underline">
        {{ consentData.legalEepresentativeIdNumber }}
      </div>
    </div>

    <div class="flex">
      <span style="cursor: pointer" title="可點擊此重新抓取最新時間" @click="getNewTime">病人申請時間：</span>
      {{ consentData.applyDate }}
    </div>
    <div class="signature-board-out" v-if="showSignatureboard">
      <div class="signature-board">
        <div class="board-head">Electronic Signature 電子簽名</div>
        <div class="board-signature">
          <VueSignaturePad width="100%" height="100%" ref="signaturePad" />
        </div>
        <div class="board-button">
          <button
            type="button"
            class="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-500 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:outline-none dark:focus:ring-yellow-600"
            @click="clearPad"
          >
            清除
          </button>
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            @click="undoPad"
          >
            Undo復原
          </button>
          <button
            type="button"
            class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-sm px-5 py-3 mr-2 mb-2 dark:focus:ring-green-900"
            @click="saveImg"
          >
            儲存
          </button>
          <button
            type="button"
            class="py-3 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            @click="showSignatureboard = false"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, defineComponent, onMounted, nextTick } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { postConsent, getConsentById } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'

const props = defineProps({
  patientInfo: {
    type: Object,
    default: {},
  },
  isSameInstitution: {
    type: Boolean,
    default: false,
  },
  consentCanEdit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['setApplyTime'])
const store = useStore()
const toast = useToast()
const signaturePad = ref(null)
const showSignatureboard = ref(false)

const consentContent = ref(null)
const hospitalNames = ref(null)
const consentData = ref({
  agreeOne: true,
  agreeTwo: true,
  contracterRelation: null,
  contracterRelationOther: null,
  legalEepresentativeRelation: null,
  legalEepresentativeIdNumber: null,
  birthday: null,
  idnumber: null,
  signaturePicture1: null,
  signaturePicture2: null,
  signaturePicture3: null,
  signaturePicture4: null,

  applyDate: null,
})

const clearConsentSignature = (type) => {
  switch (type) {
    case 1:
      consentData.value.signaturePicture1 = ''
      break
    case 2:
      consentData.value.signaturePicture2 = ''
      break
    case 3:
      consentData.value.signaturePicture3 = ''
      break
    case 4:
      consentData.value.signaturePicture4 = ''
      break
    default:
      console.log(`Sorry, no data.`)
  }
}

const getNewTime = () => {
  consentData.value.applyDate = dayjs(new Date()).format(' YYYY  年  MM  月  DD  日 HH 時 mm 分')
}

const contracterRelationOptions = [
  {
    text: '本人',
    value: '本人',
  },
  { text: '其他', value: '其他' },
]

const setRelationData = (data) => {
  if (data == '本人') {
    consentData.value.contracterRelationOther = ''
    consentData.value.birthday = props.patientInfo?.BirthDate
    consentData.value.idnumber = props.patientInfo?.Identifier
  } else {
    consentData.value.birthday = null
    consentData.value.idnumber = ''
  }
}

const setBirthday = () => {
  // console.log("setBirthday");
  consentData.value.birthday = dayjs(consentData.value.birthday).format('YYYY-MM-DD')
}

const saveData = async () => {
  //check data
  if (consentData.value.contracterRelation == '其他' && !Boolean(consentData.value.contracterRelationOther)) {
    toast.error(`關係選擇其他時，則關係的內容為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  let checkDataArr = [
    {
      data: consentData.value.signaturePicture1,
      keyname: '立同意書人簽章',
    },
    {
      data: consentData.value.birthday,
      keyname: '病患出生年月日',
    },
    {
      data: consentData.value.idnumber,
      keyname: '病患身分證號',
    },
  ]

  checkDataArr = checkDataArr.filter((s) => !Boolean(s.data))
  const checkDataArrString = checkDataArr.reduce((acc, cur) => acc + `${acc ? '、' : ''}` + cur.keyname, '')

  if (checkDataArr.length) {
    toast.error(`${checkDataArrString}為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  //save data

  const obj = {
    SheetId: props.patientInfo?.sheetId,
    ConsentName: consentData.value.contracterRelation == '本人' ? props.patientInfo.Name : consentData.value.contracterRelationOther,

    ConsentRelationship: consentData.value.contracterRelation == '本人' ? '本人' : '其他',

    ConsentSignature: consentData.value.signaturePicture1,
    Eyewitness1Signature: consentData.value.signaturePicture2,
    Eyewitness2Signature: consentData.value.signaturePicture3,
    AgentSignature: consentData.value.signaturePicture4,
    AgentRelationship: consentData.value.legalEepresentativeRelation,
    AgentIdentifier: consentData.value.legalEepresentativeIdNumber,
    Birthday: consentData.value.birthday,
  }

  try {
    const res = await postConsent(obj)
    toast.success(`同意書資料儲存成功!`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  } catch (e) {
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

const getData = async () => {
  const res = await getConsentById(store.state.editItem?.Id)
  const allData = res.data

  if (!!allData) {
    hospitalNames.value = allData.StationName + `${allData.HospitalName ? '、' + allData.HospitalName : ''}`
  }

  consentData.value.contracterRelation = !Boolean(allData.ConsentRelationship) || allData.ConsentRelationship == '本人' ? '本人' : '其他'
  consentData.value.contracterRelationOther = !Boolean(allData.ConsentRelationship) || allData.ConsentRelationship == '本人' ? '' : allData.ConsentName

  consentData.value.birthday = allData?.Birthday?.substring(0, 10)

  consentData.value.idnumber = !Boolean(allData.ConsentRelationship) || allData.ConsentRelationship == '本人' ? store.state.editItem.Patient?.Identifier : ''

  consentData.value.signaturePicture1 = allData?.ConsentSignature
  consentData.value.signaturePicture2 = allData?.Eyewitness1Signature
  consentData.value.signaturePicture3 = allData?.Eyewitness2Signature
  consentData.value.signaturePicture4 = allData?.AgentSignature
  consentData.value.legalEepresentativeRelation = allData?.AgentRelationship
  consentData.value.legalEepresentativeIdNumber = allData?.AgentIdentifier
  consentData.value.applyDate = dayjs(allData?.ApplyTime).format(' YYYY  年  MM  月  DD  日 HH 時 mm 分')
  emit('setApplyTime', dayjs(allData?.ApplyTime).format('YYYY-MM-DD'))

  // emit("setApplyTime", e.target.value);
  // emit("setApplyTime",dayjs(allData.ApplyTime).format(
  //   " YYYY-MM-DD");
}

const nowEditType = ref('')

const openSignatureBoard = (type) => {
  //type:
  //1:立同意書人簽章 2:見證人簽章1 3:見證人簽章2 4:法定代理人/監護人簽章
  nowEditType.value = type
  showSignatureboard.value = true
}

const clearPad = () => {
  signaturePad.value.clearSignature()
}

const undoPad = () => {
  signaturePad.value.undoSignature()
}

const saveImg = () => {
  const { isEmpty, data } = signaturePad.value.saveSignature()

  if (!Boolean(data)) {
    showSignatureboard.value = false
    return
  }

  const imgType = nowEditType.value
  switch (imgType) {
    case 1:
      consentData.value.signaturePicture1 = data
      break
    case 2:
      consentData.value.signaturePicture2 = data
      break
    case 3:
      consentData.value.signaturePicture3 = data
      break
    case 4:
      consentData.value.signaturePicture4 = data
      break
    default:
      console.log(`Sorry, no data.`)
  }
  showSignatureboard.value = false
}

onMounted(async () => {
  await getData()
})

defineExpose({
  getPrintData() {
    return { ...consentData.value, hospitalNames: hospitalNames.value, Name: props.patientInfo.Name }
  },
  saveData,
})
</script>

<style lang="scss" scoped>
.signature-btn {
  cursor: pointer;
  background: rgb(255, 255, 255);
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 18%, rgba(235, 235, 235, 1) 100%);
  border: 1px solid #d9d9d9;
  padding: 2px 8px;
}
.border-block {
  border: 1px solid #b3c0e7;
}

.signature-board-out {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.7);
  border-radius: 5px;
  display: grid;
  place-items: center;
  color: white;
  z-index: 99999999999999999999;
  .signature-board {
    position: fixed;
    z-index: 30;
    top: 3%;
    bottom: 3%;
    right: 6%;
    left: 6%;
    display: grid;
    place-items: center;

    background-color: #fff;
    color: #333;
    height: calc(100vh - 60px);
    max-width: calc(100vw - 80px);
    border-radius: 8px 8px 0 0;
    width: 88%;

    .board-head {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 0;
      //   background: #bfcbda;
      background: #041c79;
      color: #fff;
      height: 50px;
      line-height: 50px;
      border-radius: 8px 8px 0 0;
      font-weight: 600;
    }

    .board-signature {
      width: 97%;
      height: 82%;
      border: 1px dashed #333;
    }

    .board-button {
      position: absolute;
      bottom: 1.2%;
      right: 4%;
    }
  }
}
.agree-content {
  display: grid;
  grid-template-columns: 40px 1fr;
}
.show-item {
  display: none;
}

.cannot-edit {
  pointer-events: none;
  // background: #ebebeb36;
  background: #cdcdcd2b;
}

::v-deep(.p-calendar.cannot-edit-input > input) {
  background: #cdcdcd2b;
}
::v-deep(.p-inputtext.cannot-edit-input) {
  background: #cdcdcd2b;
}

.signaturePicture-block {
  position: relative;
  .clear-block {
    display: none;
  }
  &:hover {
    .clear-block {
      display: block;
      position: absolute;
      top: -46px;
      right: -8px;
    }
  }
}
</style>
