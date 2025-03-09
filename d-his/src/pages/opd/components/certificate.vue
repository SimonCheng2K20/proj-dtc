<template>
  <div>
    <div class="flex flex-col items-center font-bold">
      <div>{{ organization.Name }}</div>
      <div>診斷證明書</div>
    </div>

    <my-input-group class="grid grid-cols-5 gap-2">
      <div class="col-span-4"><!-- 佔位 --></div>
      <DtxInputGroup title="診斷文號">
        <InputText disabled />
      </DtxInputGroup>

      <DtxInputGroup title="病歷號碼">
        <InputText v-model="opdStore.opdData.PatientId" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="姓名">
        <InputText v-model="opdStore.opdData.PersonName" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="性別">
        <InputText v-model="opdStore.opdData.Gender" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="生日">
        <InputText :value="opdStore.opdData.BirthDate.substring(0, 10)" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="年齡">
        <InputText v-model="opdStore.opdData.Age" disabled />
      </DtxInputGroup>

      <DtxInputGroup title="應診日期">
        <InputText :value="opdStore.opdData.CreateDatetime.substring(0, 10)" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="主治醫師">
        <InputText v-model="opdStore.opdData.SignedDocName" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="科別">
        <InputText v-model="opdStore.opdData.DepartmentName" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="身分">
        <InputText v-model="opdStore.opdData.IdentityName" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="過敏">
        <InputText v-model="opdStore.opdData.Allergy" disabled />
      </DtxInputGroup>

      <DtxInputGroup title="聯絡地址" class="col-span-full">
        <InputText
          :value="opdStore.opdData.RoomBooking.Patient.Person.Address ? opdStore.opdData.RoomBooking.Patient.Person.Address.replace(/＞|＜/g, '') : ''"
          disabled
        />
      </DtxInputGroup>

      <DtxInputGroup title="病名" class="col-span-full">
        <InputText v-model="dData.Icd10Name" disabled />
      </DtxInputGroup>

      <DtxInputGroup title="醫師囑言" class="col-span-full">
        <q-input type="textarea" v-model="data"></q-input>
      </DtxInputGroup>
    </my-input-group>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getCertificateItem, getOrganization } from 'api'
import { useOpdStore } from 'stores/opd.js'

const opdStore = useOpdStore()

const is404 = ref(false)
const data = ref('')
const dData = ref('')

const GetCertificateItem = async () => {
  try {
    const res = await getCertificateItem(opdStore.opdData.OpdId)
    if (res.status === 200 || res.status === 204) {
      data.value = res.data.Advice
      dData.value = res.data
    }
  } catch (err) {
    console.log(err)
    if (err.status === 404) {
      is404.value = true
    }
  }
}

const organization = reactive({
  Name: '',
})

const GetOrganization = async () => {
  try {
    const res = await getOrganization()

    if (res.status === 200) {
      Object.assign(organization, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

defineExpose({
  getAdvice: () => data.value,
  getIs404: () => is404.value,
})

const init = async () => {
  await GetOrganization()
  await GetCertificateItem()
}
init()
</script>

