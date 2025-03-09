<template>
  <div class="bg-gray-100 p-8 border border-blue-300 rounded">
    <div class="text-center font-bold">{{ data.InstitutionName }}</div>
    <div class="text-center font-bold text-2xl">偏遠地區遠距醫療建置計畫之遠距會診同意書</div>

    <div class="my-8">
      <div class="mb-2">
        病人
        <span class="border-b border-black"> {{ data.PatientName }} </span>
        病歷號碼
        <span class="border-b border-black"> {{ data.PatientId }} </span>
        性別
        <span class="border-b border-black"> {{ data.PatientGenderCode }} </span>
        ，出生於
        <span class="border-b border-black"> {{ dayjs(data.PatientBirthday).format('YYYY 年 MM 月 DD 日') }}</span>
        ，因罹患
        <InputText v-model="data.Malady"></InputText>
        疾病，經本院醫師評估，需輔以運用科技通訊技術，由本院與基地醫院醫師進行遠距照會，以提升轉診及緊急醫療處置之品質。
      </div>
      <div class="mb-2">
        本院醫師或相關醫事人員，已向您充分說明本次遠距照會之目的、必要性、可能結果、遠距照會之限制性等，包括且不限於基地醫院（被照會）醫師受限於無法實際進行完整的身體診察、觸診、聽診、氣味辨識、意識評估等，及因此可能無法給予完整之意見。經說明後，充分了解遠距照會無法取代實境照會，且基地醫院（被照會）醫師之意見僅供參考。
      </div>
      <div class="mb-2">若對醫療照護處置有任何疑問，請在簽名前，再與您的醫師或相關醫事人員充分討論。</div>
    </div>

    <div class="grid grid-cols-2 gap-2 my-8" style="width: 80%">
      <my-input-wrapper label="說明地點（醫院/機構）" require labelClass="border border-blue-300">
        <InputText :value="data.InstitutionName" disabled></InputText>
      </my-input-wrapper>

      <my-input-wrapper label="說明之醫事人員" require labelClass="border border-blue-300">
        <InputText :value="data.CreateAccountName" disabled></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="職稱" require labelClass="border border-blue-300">
        <div class="flex items-center mx-2">
          <input class="cursor-pointer" type="radio" id="radio-doctor" value="doctor" v-model="data.CreateAccountTitleForRadio" />
          <label class="cursor-pointer" for="radio-doctor">醫師</label>
        </div>
        <div class="flex items-center mx-2">
          <input class="cursor-pointer" type="radio" id="radio-account-other" value="other" v-model="data.CreateAccountTitleForRadio" />
          <label class="cursor-pointer" for="radio-account-other">其他</label>
        </div>
        <InputText v-show="data.CreateAccountTitleForRadio === 'other'" v-model="data.CreateAccountTitle" placeholder="職稱為其他時，此欄位必填"></InputText>
      </my-input-wrapper>
    </div>

    <my-input-group :group="['col', 2]" class="grid grid-cols-2 gap-2 my-8" style="width: 80%">
      <my-input-wrapper label="網絡醫院" labelClass="border border-blue-300">
        <Dropdown
          v-model="data.ConsultAccountInstitutionNo"
          :options="hospitalItems"
          optionLabel="Name"
          optionValue="No"
          @change="onConsultAccountInstitutionNoChange"
        />
      </my-input-wrapper>
      <my-input-wrapper label="醫師" labelClass="border border-blue-300">
        <Dropdown v-model="data.ConsultAccountNo" :options="doctorItems" optionLabel="Name" optionValue="No" @change="onConsultAccountNoChange($event.value)" />
      </my-input-wrapper>
      <my-input-wrapper label="專科別" labelClass="border border-blue-300">
        <InputText v-model="data.CreateAccountDepartmentName"></InputText>
      </my-input-wrapper>
    </my-input-group>

    <my-input-group :group="['col', 2]" class="grid grid-cols-2 gap-2" style="width: 80%">
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
      <my-input-wrapper label="身份證字號" require labelClass="border border-blue-300">
        <InputText v-model="data.ConsentIdentifier" @input="data.ConsentIdentifier = data.ConsentIdentifier.toUpperCase()"></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="住址" labelClass="border border-blue-300">
        <InputText v-model="data.ConsentAddress"></InputText>
      </my-input-wrapper>
      <my-input-wrapper label="電話" labelClass="border border-blue-300">
        <InputText v-model="data.ConsentTel"></InputText>
      </my-input-wrapper>

      <my-input-wrapper label="申請時間" labelClass="border border-blue-300">
        <div class="w-full flex justify-center items-center bg-white">{{ dayjs().format('YYYY 年 MM 月 DD 日 HH 時 mm 分') }}</div>
      </my-input-wrapper>
    </my-input-group>

    <div class="my-8">
      <div class="mb-2">1. 如由病人、親屬或關係人簽署本同意書，則無需見證，見證人部分得免填</div>
      <div class="mb-2">2. 若意識清楚，但無法親次簽具者且無親屬或關係人在場，得以按指印代替簽名，惟應有二名見證人</div>
      <div class="mb-2">3. 若病人意識不清且無親屬或關係人在場，醫療緊急情況得由二名合格醫師在病歷上證明需檢查或治療即可</div>
    </div>

    <div class="grid grid-cols-2 gap-2" style="width: 80%">
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
        <Button @click="clearPad"> 清除 </Button>
        <Button @click="undoPad"> 復原 </Button>
        <Button @click="saveImg"> 儲存 </Button>
        <Button @click="dialog.signature.show = false"> 關閉 </Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import dayjs from 'dayjs'
import { getMyNetGroupHospitals, getAccountSelectNoList, getAccountListAll } from 'Service/apis.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const signaturePadRef = ref()

const sheetData = inject('sheetData')
const data = inject('confirmData')
data.ConsentRelationshipForRadio = !!data.ConsentRelationship ? 'other' : 'self'
data.CreateAccountTitleForRadio = !!data.CreateAccountTitle ? 'other' : 'doctor'

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

const hospitalItems = ref([])
const GetMyNetGroupHospitals = async () => {
  try {
    const res = await getMyNetGroupHospitals(data.SheetId)
    if (res.status === 200) hospitalItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const doctorItems = ref([])
const GetAccountListAll = async () => {
  try {
    const query = setSearchQuery({ $filter: `InstitutionNo eq '${data.ConsultAccountInstitutionNo}'` })
    const res = await getAccountListAll(query)
    if (res.status === 200) doctorItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const onConsultAccountInstitutionNoChange = () => {
  GetAccountListAll()
  data.ConsultAccountNo = null
  data.ConsultAccountName = null
  data.CreateAccountDepartmentName = null
}

const onConsultAccountNoChange = (id) => {
  const doctor = doctorItems.value.find((item) => item.No === id)
  data.ConsultAccountName = doctor.Name
  data.CreateAccountDepartmentName = doctor.DepartmentName
}

const onSelfRadioChange = () => {
  data.ConsentIdentifier = sheetData.Patient.Identifier
  // data.ConsentAddress = sheetData.Patient.Address
  // data.ConsentTel = sheetData.Patient.Tel
}

const init = () => {
  GetMyNetGroupHospitals()
}
init()
</script>
