<template>
  <section class="dtc-main-section px-3">
    <socketServerDownload ref="socketServerDownloadRef"></socketServerDownload>
    <medicalCardMessage ref="medicalCardMessageRecordingConponent"></medicalCardMessage>
    <medicalCardCertification ref="medicalCardCertificationRecordingConponent"></medicalCardCertification>
    <section class="search-block">
      <h5 class="big-title">補簽章作業</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">會診申請時間</span>
          <Calendar
            class="calendar custom-search"
            v-model="selectedDate"
            :showIcon="true"
            :manualInput="true"
            dateFormat="yy/mm/dd"
            style="width: 250px"
            v-date-input
          /><span class="mt-2">~</span>
          <Calendar
            class="calendar custom-search"
            v-model="selectedDate2"
            :showIcon="true"
            :manualInput="true"
            dateFormat="yy/mm/dd"
            style="width: 250px"
            v-date-input
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">病患姓名</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" class="custom-search" />
        </div>
        <div>
          <button
            class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search mr-2"
            type="button"
            style="background: #0c69e1"
            @click="getData"
          >
            查詢
          </button>
          <button
            class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
            type="button"
            style="background: #6a9f3e"
            @click="clearSearch"
          >
            清除
          </button>
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">諮詢單位</span>
          <Dropdown
            v-model="selectedUnit"
            :options="unitOptions"
            placeholder="全部"
            style="padding-top: 10px"
            optionLabel="text"
            optionValue="value"
            @change="getData"
            :filter="true"
            :showClear="Boolean(selectedUnit) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">病患身分證字號</span>
          <InputText type="text" v-model.trim="selectedIdNumber" @keydown.enter="getData" class="custom-search" />
        </div>
      </div>
    </section>

    <div class="flex items-center" :title="Boolean(medicalCardData) ? '已完成醫事人員卡認證' : ''">
      <Button
        label="醫事人員卡認證"
        class="p-button-outlined p-button-danger"
        style="margin: 4px 4px"
        @click="checkMedicalCard"
        v-show="!showLoadingButton"
        :disabled="Boolean(medicalCardData)"
      />

      <Button label="loading..." class="p-button-danger" style="margin: 4px 4px" icon="pi pi-spin pi-spinner" v-show="showLoadingButton" />

      <span class="ml-3 mr-1 font-semibold text-xl">目前狀態:</span>
      <span class="text-xl font-semibold text-red-500" v-if="medicalCardData">已認證</span>
      <span class="text-xl font-semibold text-red-500" v-if="!medicalCardData">未認證</span>
    </div>

    <div>
      <Button @click.stop="chooseAll" style="margin: 4px 4px" :disabled="!items[0]?.CanSignature">全選</Button>
      <Button class="p-button-success" style="margin: 4px 4px" @click="executiveSignature" :disabled="!items[0]?.CanSignature || !medicalCardData"
        >執行簽章</Button
      >
    </div>

    <header class="dtc-grid my-dark">
      <div style="display: flex; align-items: center; justify-content: center">
        <Checkbox v-model="isChooseAll" @change="setAll(isChooseAll)" :binary="true" :disabled="!items[0]?.CanSignature" />
      </div>
      <div v-for="(item, i) in headers" :key="`headers${i}`" @click="sortData(item)" class="header">
        {{ item.name }}
        <span v-show="item.sortDesc === null" v-if="item.key">
          <i class="pi pi-sort"></i>
        </span>
        <span v-show="item.sortDesc === false" v-if="item.key">
          <i class="pi pi-caret-up"></i>
        </span>
        <span v-show="item.sortDesc" v-if="item.key">
          <i class="pi pi-caret-down"></i>
        </span>
      </div>
    </header>
    <main
      class="dtc-grid"
      v-for="(item, idx) in items"
      :key="`content${idx}`"
      style="color: #39312e"
      :style="idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color:#e7f2f3;'"
    >
      <div class="content" style="padding-top: 0px" :title="!item.CanSignature ? '此帳號無法此會診單進行簽章' : ''">
        <Checkbox :binary="true" v-model="item.isActive" :disabled="!item.CanSignature" />
      </div>
      <div class="content icon-conent" style="padding-top: 6px" @click="viewDetail(item)">
        <img class="cursor-pointer" style="width: 42px" src="/assets/sheetdetail.svg" title="檢視會診紀錄" />
      </div>
      <div class="content icon-conent" style="padding-top: 6px" @click="openSealDetail(item)">
        <img style="height: 40px" class="cursor-pointer" src="/assets/needsigned.svg" />
      </div>

      <div class="content" :title="item.Type">
        {{ item.Type || '' }}
      </div>
      <div class="content" :title="item.InstitutionName">
        {{ item.InstitutionName || '' }}
      </div>
      <div class="content" :title="item.CreateAccountName">
        {{ item.CreateAccountName || '' }}
      </div>
      <div class="content" :title="item.applyTime">
        {{ item.applyTime || '' }}
      </div>
      <div class="content" :title="item.PatientName">
        {{ item.PatientName || '' }}
      </div>
      <div class="content" :title="item.PatientIdentifier">
        {{ item.PatientIdentifier || '' }}
      </div>
    </main>
    <main v-if="!items.length" class="mt-2 text-center text-xl font-semibold col-span-full" style="font-family: Microsoft JhengHei, Helvetica">No Data</main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator v-model:first="offset" v-model:rows="rows" :totalRecords="totalItemsCount" :rowsPerPageOptions="[5, 10, 50, 100, 200, 500, 1000]"></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>
    <!-- modal -->
    <Dialog class="custom-modal" v-model:visible="modalInfoShow" style="width: 560px" :modal="true" :draggable="false" @hide="clearModalInfoData">
      <template #header>
        <h3>系統資訊 (執行簽章成功)</h3>
      </template>
      <h2 class="font-extrabold mb-2 text-lg">
        <b>{{ modalInfoData.docName || '' }}醫師您好:</b>
      </h2>
      <p class="font-extrabold">
        已完成筆數共
        <span style="color: #021149">{{ modalInfoData.hasEdited || 0 }}</span>
        筆。
      </p>
      <p class="font-extrabold">
        未完成筆數共
        <span style="color: #021149">{{ modalInfoData.notHasEdited || 0 }}</span>
        筆。
      </p>
      <template #footer>
        <Button class="p-button-success" @click.stop="modalInfoShow = false">關閉</Button>
      </template>
    </Dialog>

    <consultationRecord ref="consultationRecordRef" :modelValue="modelValue"></consultationRecord>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, watch, inject, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { getSignatureList, getInstitutionList, postSignature, getSheetById } from 'Service/apis.js'
import buildQuery from 'odata-query'
import dayjs from 'dayjs'
import {
  substringofFilter,
  appendSubstringofFilter,
  timeFilterGe,
  timeFilterLe,
  appendTimeFilterLe,
  equalFilter,
  appendEqualFilter,
} from 'Service/searchFunction.js'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

import consultationRecord from '@/components/consultationRecord.vue'
import { medicalCardWebSocketCheckIdentifier } from '@/service/websocket.js'
import medicalCardMessage from '@/components/medicalCardMessage.vue'
import medicalCardCertification from '@/components/medicalCardCertification.vue'

import socketServerDownload from '@/components/medicalWebSocketServerDownload.vue'

export default defineComponent({
  name: 'function',
  components: {
    consultationRecord,
    medicalCardMessage,
    medicalCardCertification,
    socketServerDownload,
  },
  setup() {
    const medicalCardMessageRecordingConponent = ref(null)
    const medicalCardCertificationRecordingConponent = ref(null)
    const socketServerDownloadRef = ref(null)
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: '檢視會診單', key: '', sortDesc: null },
      { name: '待簽章內容', key: '', sortDesc: null },
      { name: '簽章文件類別', key: 'Type', sortDesc: null },
      { name: '諮詢單位', key: 'InstitutionName', sortDesc: null },
      { name: '諮詢醫師', key: 'CreateAccountName', sortDesc: null },
      { name: '會診申請時間', key: 'ApplyTime', sortDesc: null },
      { name: '姓名', key: 'PatientName', sortDesc: null },
      { name: '身分證字號', key: 'PatientIdentifier', sortDesc: null },
    ])

    const items = ref([])

    const offset = ref(0)
    const rows = ref(5)
    const totalItemsCount = ref(1)
    const orderByArr = ref([])

    const toast = useToast()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const getData = async (datanum = 0) => {
      //datanum 的存在是為了去顯示執行完簽章後的筆數
      try {
        //odata3 qs
        const page = +offset.value / +rows.value + +1
        const skip = (page - 1) * rows.value
        const top = rows.value
        const orderBy = orderByArr.value

        if (!(orderByArr.value.includes('ApplyTime') || orderByArr.value.includes('ApplyTime desc'))) {
          orderBy.push('ApplyTime desc')
        }

        const obj = { top, skip, orderBy }
        let qs = buildQuery(obj)
        let bQs = false

        if (Boolean(selectedDate.value)) {
          let time = dayjs(selectedDate.value).format('YYYY-MM-DD')
          qs = timeFilterGe('ApplyTime', qs, time)
        }

        if (selectedDate2.value) {
          let time2 = dayjs(selectedDate2.value).format('YYYY-MM-DD')
          if (bQs) {
            qs = appendTimeFilterLe('ApplyTime', qs, time2)
          } else {
            qs = timeFilterLe('ApplyTime', qs, time2)
          }
          bQs = true
        }

        if (selectedName.value) {
          if (bQs) {
            qs = appendSubstringofFilter('PatientName', qs, selectedName.value.toLowerCase())
          } else {
            qs = substringofFilter('PatientName', qs, selectedName.value.toLowerCase())
          }
          bQs = true
        }

        if (selectedIdNumber.value) {
          if (bQs) {
            qs = appendSubstringofFilter('PatientIdentifier', qs, selectedIdNumber.value.toLowerCase())
          } else {
            qs = substringofFilter('PatientIdentifier', qs, selectedIdNumber.value.toLowerCase())
          }
          bQs = true
        }

        if (selectedUnit.value) {
          if (bQs) {
            qs = appendEqualFilter('InstitutionNo', qs, selectedUnit.value)
          } else {
            qs = equalFilter('InstitutionNo', qs, selectedUnit.value)
          }
          bQs = true
        }

        //top:筆數、skip:跳過幾筆

        const res = await getSignatureList(`${qs}`)

        let { Items, Count } = res.data

        items.value = Items.map((s) => ({
          applyTime: Boolean(s.ApplyTime) ? s.ApplyTime.split('T')[0] + ' ' + s.ApplyTime.split('T')[1] : '',
          isActive: false,
          ...s,
        }))

        totalItemsCount.value = Count

        if (datanum > 0) {
          const doctorName = store.state?.dakar ? store.state?.dakar.Name : ''

          modalInfoData.value.docName = doctorName
          modalInfoData.value.hasEdited = datanum
          modalInfoData.value.notHasEdited = Count

          modalInfoShow.value = true
        }
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
      isChooseAll.value = false
    }

    //sort
    function sortData(item) {
      if (!item.key) {
        return
      }
      if (item.sortDesc) {
        item.sortDesc = null
      } else if (false === item.sortDesc) {
        item.sortDesc = true
      } else if (null === item.sortDesc) {
        item.sortDesc = false
      }
      orderByArr.value = []

      headers.value.forEach((s) => {
        if (s.sortDesc !== null) {
          orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`)
        }
      })
      getData()
    }

    //for search
    const selectedDate = ref(null)
    const selectedDate2 = ref(null)
    const selectedName = ref('')
    const selectedIdNumber = ref('')
    const selectedUnit = ref(null)

    const unitOptions = ref([])

    const $getUniqueItemListBy = inject('$getUniqueItemListBy')

    function clearSearch() {
      selectedDate.value = null
      selectedDate2.value = null
      selectedName.value = ''
      selectedIdNumber.value = ''
      selectedUnit.value = null
      getData()
    }

    let institutionlist = {}
    const getOptions = async () => {
      let institutionDatas = sessionStorage.getItem('institutions') ? JSON.parse(sessionStorage.getItem('institutions')) : []

      if (!institutionDatas.length) {
        const res = await getInstitutionList('')
        const { Items } = res.data
        institutionDatas = [...Items]
        sessionStorage.setItem('institutions', JSON.stringify(Items))
      }

      institutionlist = institutionDatas.reduce((acc, cur) => ({ ...acc, [cur.No]: cur.Name }), {})

      const _wholeList = institutionDatas.map((s) => ({
        text: s.Name,
        value: s.No,
      }))
      const _uniqueValues = $getUniqueItemListBy(_wholeList, 'value')
      const _uniqueTexts = $getUniqueItemListBy(_uniqueValues, 'text')
      unitOptions.value = _uniqueTexts
    }

    const checkMedicalCardMessage = async () => {
      //沒有醫事人員卡密碼則跳出此訊息
      const noneedMessage = sessionStorage.getItem('noneedMes') ? sessionStorage.getItem('noneedMes').replace(/\"/g, '') : ''

      if (noneedMessage == 'true' || Boolean(store.state?.medicalCardData)) {
        return
      }

      medicalCardMessageRecordingConponent.value.showMedcalCardMessage = true
    }

    onMounted(async () => {
      await getOptions()
      await getData()
      checkMedicalCardMessage()
    })

    watch(offset, (v, pv) => {
      getData()
    })

    watch(rows, (v, pv) => {
      getData()
    })

    const isChooseAll = ref(false)

    const setAll = async (ischooseall = false) => {
      items.value = items.value.map((s) => {
        s.isActive = ischooseall
        return s
      })
    }

    const chooseAll = () => {
      isChooseAll.value = true
      setAll(true)
    }

    const executiveSignature = async () => {
      if (!Boolean(store.state?.medicalCardData)) {
        toast.error(`醫事人員卡認證需為已認證狀態才可執行簽章`, {
          timeout: 5000,
          hideProgressBar: true,
        })
        return
      }

      let arr = items.value.filter((s) => s.isActive)

      let allDatas = arr.map((s) => ({
        SheetId: s.SheetId,
        Type: s.Type,
        Signature: store.state?.medicalCardData,
      }))

      try {
        if (!allDatas.length) {
          return
        }
        for (let i = 0; i < allDatas.length; i += 1) {
          await postSignature(allDatas[i])
        }
        getData(allDatas.length)
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    const viewDetail = async (item) => {
      const res = await getSheetById(item.SheetId)
      let allData = res.data

      sessionStorage.setItem('chatroom', item.SheetId)
      store.commit('m_setEditItem', allData)
      router.push({
        name: item.Status == 0 ? 'draftForm' : 'formalForm',
        params: { item: item.SheetId },
        query: {
          sealViewdetail: true,
          back: 'recordingMaintain',
        },
      })
    }

    const consultationRecordRef = ref(null)

    const modelValue = ref({})

    const openSealDetailAll = async (type = 1, sheetId = null) => {
      const res = await getSheetById(sheetId)
      let allData = res.data

      // type:1--會診紀錄
      if (type == 1) {
        let arr = [...allData?.Records]
        const accountName = store.state?.dakar ? store.state?.dakar.Name : ''

        arr = arr.find((s) => s.MeetMemberAccountName == accountName)

        if (!!arr) {
          modelValue.value = { ...arr }
          consultationRecordRef.value.modalConsultationRecordShow = true
        } else {
          toast.error(`目前無此帳號在該會診單的會診紀錄`, {
            timeout: 5000,
            hideProgressBar: true,
          })
        }
      } else if (type == 2) {
        sessionStorage.setItem('chatroom', sheetId)
        store.commit('m_setEditItem', allData)
        router.push({
          name: 'sheetOnlyView',
          params: { item: sheetId },
        })
      }
      // type:2--會診單
    }

    const openSealDetail = async (item) => {
      if (item.Type == '會診紀錄') {
        openSealDetailAll(1, item.SheetId)
      } else if (item.Type == '會診單') {
        openSealDetailAll(2, item.SheetId)
      }
      // let allData = res.data;
    }

    //modal-------簽章成功時所顯示的資訊
    const modalInfoShow = ref(false)
    const modalInfoData = ref({
      docName: '',
      hasEdited: 0,
      notHasEdited: 0,
    })
    const clearModalInfoData = () => {
      modalInfoData.value = {
        docName: '',
        hasEdited: 0,
        notHasEdited: 0,
      }
    }

    const medicalCardData = computed(() => {
      return store.state?.medicalCardData
    })

    //
    const showLoadingButton = ref(false)
    const checkMedicalCard = async () => {
      showLoadingButton.value = true
      const res = await medicalCardWebSocketCheckIdentifier()

      if (res?.type == 'error') {
        socketServerDownloadRef.value.showMedicalWebSocketServerDownload = true
      }

      if (res == 'matchok') {
        medicalCardCertificationRecordingConponent.value.showMedicalCardCertification = true
      }

      showLoadingButton.value = false
    }

    return {
      medicalCardMessageRecordingConponent,
      medicalCardCertificationRecordingConponent,
      medicalCardData,
      checkMedicalCard,
      showLoadingButton,
      //檢視待簽章內容
      viewDetail,
      openSealDetail,
      consultationRecordRef,

      modelValue,

      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedDate,
      selectedDate2,
      selectedName,
      selectedIdNumber,
      selectedUnit,

      unitOptions,

      clearSearch,
      setAll,
      chooseAll,
      executiveSignature,

      //
      isChooseAll,

      //modal info-------
      modalInfoShow,
      modalInfoData,
      clearModalInfoData,
      socketServerDownloadRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-block {
  .big-title {
    background: #e1e8f5;
    padding: 5px;
    color: #333;
    border-radius: 0.15rem 0.15rem 0 0;
    font-size: 20px;
    font-weight: bold;
  }

  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem 0.25rem 0 0;

  .search-section {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-column-gap: 6px;
    grid-gap: 10px;
  }
}

.p-inputgroup-addon {
  width: 135px;
  background: #f1f9e7;
  color: #1f2d56;
  font-weight: bold;
  border: 0px !important;
}

.special-addon {
  border-right: 0.5px solid #dbdcdd;
}

.custom-search {
  // height: 42px;
}

.p-dropdown {
  line-height: 12px;
}

.dtc-grid {
  display: grid;
  grid-template-columns: 90px 190px 190px 1fr 1fr 1fr 1fr 1fr 1fr;
  // grid-auto-flow: column;
  text-align: center;
  // border-right: 0px;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 15px;
    padding: 4px 0;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    display: -webkit-box;
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: rgb(46, 45, 45);
  }

  > .icon-conent {
    display: grid;
    justify-content: center;
  }

  > div:first-child {
    border-left: 2px solid #ffffff;
  }

  > .header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }

  > .content {
    padding: 6px;
    padding-top: 4px;
    height: 63px;
  }

  > .full-content {
    grid-column: 1 / -1;
  }
}

.my-dark {
  > div {
    background: #e9e9e9;
    color: #f3f3f3;
    font-weight: bolder;
  }
}
</style>
