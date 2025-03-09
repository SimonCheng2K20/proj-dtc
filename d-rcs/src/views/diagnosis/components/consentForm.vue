<template>
  <div class="bg-gray-100 p-8 border border-blue-300 rounded">
    <div class="text-center font-bold text-2xl">電子病歷跨院互通暨提供就醫紀錄與結果資訊同意書</div>

    <div class="my-8">
      <div class="mb-2">
        本人
        <span class="border-b border-black"> {{ data.PatientName }} </span>
        同意

        <span class="border-b border-black"> {{ data.StationName + (!!data.HospitalName ? `、${data.HospitalName}` : '') }} </span>
        醫師為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情及藥事人員調劑、給予本人用藥諮詢或指導需要時，於本人簽署本同意書日期起算7年內，可調閱下列資料：
      </div>

      <div class="flex items-center gap-2 mb-2">
        <i class="pi pi-check-square text-blue-500 bg-white" style="font-size: 24px"></i>
        <span>透過衛生福利部電子病歷交換中心系統調閱本人最近就醫醫療院所之全部電子病歷資料。</span>
      </div>

      <div class="flex items-center gap-2 mb-2">
        <i class="pi pi-check-square text-blue-500 bg-white" style="font-size: 24px"></i>
        <span> 自衛生福利部中央健康保險署（以下稱健保署）依全民健康保險法相關規定建置之健保醫療資訊雲端查詢系統（包含健保雲端藥歷系統），執行下列作業： </span>
      </div>
      <div class="ml-8 mb-2">
        一、 下載於查詢系統中本人就醫之醫療費用申報資料及健保卡上傳就醫資料。（包含用藥紀錄、檢查檢驗項目、手術項目、牙科處置及手術項目等資料）。
      </div>
      <div class="ml-8 mb-2">
        二、 線上查詢及下載該查詢系統中，各健保署特約醫事服務機構上傳之本人就醫結果資料。（包含檢查（驗）結果報告、檢查（驗）影像檔案、出院病歷摘要等資料）。
      </div>
    </div>

    <div class="mb-2">
      前述資料，僅限本人於
      <span class="border-b border-black"> {{ data.StationName + (!!data.HospitalName ? `、${data.HospitalName}` : '') }} </span>
      醫師為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情、病情評估及完成後送之癒後評估、藥事人員調劑、給予本人用藥諮詢或指導需要查詢比對使用，另如遠距醫療後醫師評估需緊急空中轉診，則資料自動轉入空中轉診後送使用，不得將該項資料另移作其他目的使用，且本人完成前述事項後，即應將該下載資訊刪除。但下載之資訊，醫師因醫療或追蹤管理需要，已列入病歷或處置決策紀錄者，不在此限。
    </div>

    <div class="mb-2">本人依個人資料保護法第３條規定，保留隨時取消本同意書或變更本同意書內容之權利。</div>

    <div class="mb-2">※上述電子病歷跨院互通同意書暨提供就醫紀錄與結果資訊同意書，詳閱無誤，請在此同意書簽名：</div>

    <my-input-group :group="['col', 2]" class="grid grid-cols-2 gap-2 my-8" style="width: 80%">
      <my-input-wrapper label="立同意書人" require labelClass="border border-blue-300">
        <div class="w-full bg-white cursor-pointer" @click="toSignature('ConsentSignature')">
          <div v-if="data.ConsentSignature === null" class="h-full flex justify-center items-center bg-blue-100">點我電子簽名</div>
          <img v-else style="width: 160px; height: 90px" :src="data.ConsentSignature" />
        </div>
      </my-input-wrapper>
      <my-input-wrapper label="與病人之關係" require labelClass="border border-blue-300">
        <div class="flex items-center mx-2">
          <input class="cursor-pointer" type="radio" id="radio-self" value="self" v-model="data.ConsentRelationshipForRadio" @change="onSelfRadioChange" />
          <label class="cursor-pointer" for="radio-self">本人</label>
        </div>
        <div class="flex items-center mx-2">
          <input class="cursor-pointer" type="radio" id="radio-relation-other" value="other" v-model="data.ConsentRelationshipForRadio" />
          <label class="cursor-pointer" for="radio-relation-other">其他</label>
        </div>
        <InputText v-show="data.ConsentRelationshipForRadio === 'other'" v-model="data.ConsentRelationship" placeholder="關係為其他時，此欄位必填"></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="出生年月日" require labelClass="border border-blue-300">
        <Calendar v-model="data.Birthday" v-date-input showIcon dateFormat="yy-mm-dd" :maxDate="new Date()"></Calendar>
      </my-input-wrapper>

      <my-input-wrapper label="身份證字號" require labelClass="border border-blue-300">
        <InputText v-model="data.PatientIdentifier" @input="data.PatientIdentifier = data.PatientIdentifier.toUpperCase()"></InputText>
      </my-input-wrapper>
    </my-input-group>

    <my-input-group class="grid grid-cols-2 gap-2 my-8" style="width: 80%">
      <my-input-wrapper label="見證人1" labelClass="border border-blue-300">
        <div class="w-full bg-white cursor-pointer" @click="toSignature('Eyewitness1Signature')">
          <div v-if="!!data.Eyewitness1Signature === false" class="h-full flex justify-center items-center bg-blue-100">點我電子簽名</div>
          <img v-else style="width: 160px; height: 90px" :src="data.Eyewitness1Signature" />
        </div>
      </my-input-wrapper>
      <my-input-wrapper label="見證人2" labelClass="border border-blue-300">
        <div class="w-full bg-white cursor-pointer" @click="toSignature('Eyewitness2Signature')">
          <div v-if="!!data.Eyewitness2Signature === false" class="h-full flex justify-center items-center bg-blue-100">點我電子簽名</div>
          <img v-else style="width: 160px; height: 90px" :src="data.Eyewitness2Signature" />
        </div>
      </my-input-wrapper>
    </my-input-group>

    <my-input-group class="grid grid-cols-2 gap-2 my-8" style="width: 80%">
      <my-input-wrapper label="法定代理人/監護人" labelClass="border border-blue-300">
        <div class="w-full bg-white cursor-pointer" @click="toSignature('AgentSignature')">
          <div v-if="!!data.AgentSignature === false" class="h-full flex justify-center items-center bg-blue-100">點我電子簽名</div>
          <img v-else style="width: 160px; height: 90px" :src="data.AgentSignature" />
        </div>
      </my-input-wrapper>
      <my-input-wrapper label="與病人之關係" labelClass="border border-blue-300">
        <InputText v-model="data.AgentRelationship"></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="身份證字號" labelClass="border border-blue-300">
        <InputText v-model="data.AgentIdentifier" @input="data.AgentIdentifier = data.AgentIdentifier.toUpperCase()"></InputText>
      </my-input-wrapper>
    </my-input-group>

    <div class="grid grid-cols-2">
      <my-input-wrapper label="申請時間" labelClass="border border-blue-300">
        <div class="w-full flex justify-center items-center bg-white">{{ dayjs().format('YYYY 年 MM 月 DD 日 HH 時 mm 分') }}</div>
      </my-input-wrapper>
    </div>

    <Dialog
      v-model:visible="dialog.signature.show"
      :draggable="false"
      :modal="true"
      :dismissableMask="false"
      header="電子簽名"
      style="width: 90%"
      @hide="signatureKey = null"
    >
      <div class="border border-dotted border-black" style="height: 70vh">
        <VueSignaturePad width="100%" height="100%" :options="{ minWidth: 3, maxWidth: 6 }" ref="signaturePadRef" />
      </div>

      <template #footer>
        <Button style="background: orange" @click="clearPad"> 清除 </Button>
        <Button style="background: green" @click="undoPad"> 復原 </Button>
        <Button @click="saveImg"> 儲存 </Button>
        <Button style="background: grey" @click="dialog.signature.show = false"> 關閉 </Button>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, inject } from 'vue'
import dayjs from 'dayjs'

const signaturePadRef = ref()

const sheetData = inject('sheetData')
const data = inject('consentData')
data.ConsentRelationshipForRadio = !!data.ConsentRelationship ? 'other' : 'self'

const toSignature = (key) => {
  signatureKey.value = key
  dialog.signature.show = true
}

const dialog = reactive({
  signature: { show: false },
})

const signatureKey = ref()

const clearPad = () => {
  signaturePadRef.value.clearSignature()
}

const undoPad = () => {
  signaturePadRef.value.undoSignature()
}

const saveImg = () => {
  const res = signaturePadRef.value.saveSignature()

  if (res.isEmpty === false) {
    data[signatureKey.value] = res.data
  }

  dialog.signature.show = false
}

const onSelfRadioChange = () => {
  data.PatientIdentifier = sheetData.Patient.Identifier
  data.Birthday = sheetData.Patient.Birthday?.substring(0, 10)
}
</script>
