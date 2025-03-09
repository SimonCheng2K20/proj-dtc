<template>
  <Dialog v-model:visible="cloudModal" style="width: 96vw" :draggable="false" :modal="true" class="custom-modal">
    <template #header>
      <h3>健保署雲端藥歷</h3>
    </template>
    <div class="main-content" :style="{ height: '72vh' }">
      <div class="content-left overflow-y-auto custom-scroll-bar">
        <div class="table-block mb-1 area-block custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1700px">雲端藥歷</h3>
          <tablecomponet :headers="headers1" :items="items1" columnstyle="grid-template-columns:  repeat(15, 1fr) 150px;" minwidth="1700"></tablecomponet>
        </div>
        <div class="table-block mb-1 area-block custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1320px">檢查檢驗</h3>
          <tablecomponet :headers="headers2" :items="items2" columnstyle="grid-template-columns:  repeat(11, 1fr);" minwidth="1320"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1080px">手術明細記錄</h3>
          <tablecomponet :headers="headers3" :items="items3" columnstyle="grid-template-columns: repeat(9, 1fr);" minwidth="1080"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1200px">牙科處置及手術作業</h3>
          <tablecomponet :headers="headers4" :items="items4" columnstyle="grid-template-columns:  repeat(10, 1fr);" minwidth="1200"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 480px">過敏藥</h3>
          <tablecomponet :headers="headers5" :items="items5" columnstyle="grid-template-columns:  repeat(4, 1fr);" minwidth="480"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 2750px">檢驗檢查結果</h3>
          <tablecomponet
            :headers="headers6"
            :items="items6"
            columnstyle="grid-template-columns: repeat(14, 1fr) 176px 176px repeat(5, 1fr);"
            minwidth="2750"
          ></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 720px">出院病摘</h3>
          <tablecomponet :headers="headers7" :items="items7" columnstyle="grid-template-columns: repeat(6, 1fr);" minwidth="720"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1200px">復健醫療</h3>
          <tablecomponet :headers="headers8" :items="items8" columnstyle="grid-template-columns: repeat(10, 1fr);" minwidth="1200"></tablecomponet>
        </div>
        <div class="table-block mb-1 custom-scroll-bar">
          <h3 style="text-align: left !important; min-width: 1440px">中醫用藥</h3>
          <tablecomponet :headers="headers9" :items="items9" columnstyle="grid-template-columns: repeat(12, 1fr);" minwidth="1440"></tablecomponet>
        </div>
      </div>
      <div class="content-right overflow-auto custom-scroll-bar">
        <div class="right-btn cursor-pointer" @click="showBlock1 = !showBlock1">
          雲端藥歷
          <minus-icon v-show="showBlock1" />
          <plus-icon v-show="!showBlock1" />
        </div>
        <div v-show="showBlock1">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud1TimesArray"
            :key="`${idx}cloud1`"
            :title="item"
            @click="setData(item, 'cloud1')"
            :class="nowClickItem.cloud1 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>
        <div class="right-btn cursor-pointer" @click="showBlock2 = !showBlock2">
          檢查檢驗
          <minus-icon v-show="showBlock2" />
          <plus-icon v-show="!showBlock2" />
        </div>
        <div v-show="showBlock2">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud2TimesArray"
            :key="`${idx}cloud2`"
            :title="item"
            @click="setData(item, 'cloud2')"
            :class="nowClickItem.cloud2 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>
        <div class="right-btn cursor-pointer" @click="showBlock3 = !showBlock3">
          手術明細記錄
          <minus-icon v-show="showBlock3" />
          <plus-icon v-show="!showBlock3" />
        </div>
        <div v-show="showBlock3">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud3TimesArray"
            :key="`${idx}cloud3`"
            :title="item"
            @click="setData(item, 'cloud3')"
            :class="nowClickItem.cloud3 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock4 = !showBlock4">
          牙科處置及手術作業
          <minus-icon v-show="showBlock4" />
          <plus-icon v-show="!showBlock4" />
        </div>
        <div v-show="showBlock4">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud4TimesArray"
            :key="`${idx}cloud4`"
            :title="item"
            @click="setData(item, 'cloud4')"
            :class="nowClickItem.cloud4 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock5 = !showBlock5">
          過敏藥
          <minus-icon v-show="showBlock5" />
          <plus-icon v-show="!showBlock5" />
        </div>
        <div v-show="showBlock5">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud5TimesArray"
            :key="`${idx}cloud5`"
            :title="item"
            @click="setData(item, 'cloud5')"
            :class="nowClickItem.cloud5 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock6 = !showBlock6">
          檢驗檢查結果
          <minus-icon v-show="showBlock6" />
          <plus-icon v-show="!showBlock6" />
        </div>
        <div v-show="showBlock6">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud6TimesArray"
            :key="`${idx}cloud6`"
            :title="item"
            @click="setData(item, 'cloud6')"
            :class="nowClickItem.cloud6 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock7 = !showBlock7">
          出院病摘
          <minus-icon v-show="showBlock7" />
          <plus-icon v-show="!showBlock7" />
        </div>
        <div v-show="showBlock7">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud7TimesArray"
            :key="`${idx}cloud7`"
            :title="item"
            @click="setData(item, 'cloud7')"
            :class="nowClickItem.cloud7 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock8 = !showBlock8">
          復健醫療
          <minus-icon v-show="showBlock8" />
          <plus-icon v-show="!showBlock8" />
        </div>
        <div v-show="showBlock8">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud8TimesArray"
            :key="`${idx}cloud8`"
            :title="item"
            @click="setData(item, 'cloud8')"
            :class="nowClickItem.cloud8 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock9 = !showBlock9">
          中醫用藥
          <minus-icon v-show="showBlock9" />
          <plus-icon v-show="!showBlock9" />
        </div>
        <div v-show="showBlock9">
          <div
            class="date"
            v-for="(item, idx) in itemData.cloud9TimesArray"
            :key="`${idx}cloud9`"
            :title="item"
            @click="setData(item, 'cloud9')"
            :class="nowClickItem.cloud9 == item ? 'activedate' : ''"
          >
            <span>{{ item || '' }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="關閉" class="p-button-success" @click="cloudModal = false" />
    </template>
  </Dialog>
</template>

<script>
import { ref, reactive, nextTick } from 'vue'

import tablecomponet from '@/components/tablecomponent/table.vue'
export default {
  components: { tablecomponet },
  props: {
    itemData: {
      type: Object,
      required: true,
      default: {},
    },
    title: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const cloudModal = ref(false)
    const headers1 = ref([
      { name: '門診診別', key: 'Category' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionCodeDisplay' },
      { name: 'ATC5名稱', key: 'ATC5Name' },
      { name: 'ATC3名稱', key: 'ATC3Name' },
      { name: '成分名稱', key: 'IngredientCode' },
      { name: '藥品名稱', key: 'MedicationCodeText' },
      { name: '藥品規格量', key: 'DenominatorValue' },
      { name: '藥品規格量單位', key: 'DenominatorUnit' },
      { name: '用法用量', key: 'DosageInstructionText' },
      { name: '慢連箋領藥日', key: 'DosageInstructionDateEnd' },
      { name: '藥品用量', key: 'DoseQuantity' },
      { name: '給藥日數', key: 'TimingDuration' },
      { name: '複方註記', key: 'DrugMultiMark' },
      { name: '醫事機構簡稱', key: 'OrganizationName' },
      { name: '慢箋醫事機構簡稱', key: 'RequesterOrgName' },
    ])
    const headers2 = ref([
      { name: '就醫科別名稱', key: 'PatientDepartmentName' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '檢查項目名稱', key: 'PCategoryDisplay' },
      { name: '醫令代碼', key: 'PCode' },
      { name: '醫令名稱', key: 'PCodeDisplay' },
      { name: '診療部位', key: 'BodySite' },
      { name: '收件日期', key: 'PerformedPeriodStart' },
      { name: '檢驗報告日期', key: 'PerformedPeriodEnd' },
      { name: '醫令總量', key: 'Total' },
      { name: '醫事機構簡稱', key: 'OrganizationName' },
    ])

    const headers3 = ref([
      { name: '門診診別', key: 'Category' },
      { name: '就醫科別名稱', key: 'PatientDepartmentName' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '診療部位', key: 'BodySite' },
      { name: '執行時間-起', key: 'StartDate' },
      { name: '執行時間-迄', key: 'EndDate' },
      { name: '醫令總量', key: 'Total' },
      { name: '醫事機構代碼', key: 'CreatePractitionerId' },
    ])
    const headers4 = ref([
      { name: '門診診別', key: 'Category' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '牙科處置代碼', key: 'PCode' },
      { name: '牙科處置名稱', key: 'PCodeDisplay' },
      { name: '診療部位', key: 'BodySite' },
      { name: '執行時間-起', key: 'StartDate' },
      { name: '執行時間-迄', key: 'EndDate' },
      { name: '醫令總量', key: 'Total' },
      { name: '醫事機構簡稱', key: 'CreatePractitionerName' },
    ])
    const headers5 = ref([
      { name: '上傳日期', key: 'AssertedDate' },
      { name: '上傳註記', key: 'Status' },
      { name: '過敏藥物', key: 'Code' },
      { name: '醫療院所簡稱', key: 'OrganizationName' },
    ])

    const headers6 = ref([
      { name: '診療部位', key: 'BodySite' },
      { name: '門診診別', key: 'Category' },
      { name: '就醫科別名稱', key: 'PatientDepartmentName' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '診療部位', key: 'BodySite' },
      { name: '檢查檢驗類別名稱', key: 'ResultCategoryDisplay' },
      { name: '醫令代碼', key: 'DRCode' },
      { name: '醫令名稱', key: 'DRCodeDisplay' },
      { name: '檢驗項目', key: 'ResultCode' },
      { name: '檢驗方法', key: 'ResultCodeDisplay' },
      { name: '檢查檢驗結果', key: 'ResultValue' },
      { name: '單位', key: 'ResultValueUnit' },
      { name: '參考值', key: 'ResultReferenceRange' },
      { name: '報告結果/病理發現及診斷', key: 'Conclusion' },
      { name: '檢體採檢方法/來源/類別', key: 'SpecimenCollectionMethod' },
      { name: '採檢/實際檢查日期', key: 'EffectivePeriodEnd' },
      { name: '報告日期', key: 'IssuedDate' },
      { name: '醫事機構簡稱', key: 'CreatePractitionerName' },
      { name: '有無TAF認證', key: 'PerformerRoleSystem' },
      { name: '是否有影像資料', key: 'ImageComment' },
    ])
    const headers7 = ref([
      { name: '就醫科別名稱', key: 'PatientDepartmentName' },
      { name: '出院診斷碼', key: 'ConditionCode' },
      { name: '出院診斷名稱', key: 'ConditionName' },
      { name: '入院日期', key: 'StartDate' },
      { name: '出院日期', key: 'EndDate' },
      { name: '出院病摘檔案', key: 'ReferenceText' },
    ])
    const headers8 = ref([
      { name: '門診診別', key: 'Category' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '治療類別', key: 'PCode' },
      { name: '強度', key: 'PCodeDisplay' },
      { name: '醫令數量', key: 'Total' },
      { name: '就醫日期(住院日期)', key: 'PPeriodStart' },
      { name: '治療結束日期', key: 'PFollowUpDate' },
      { name: '醫事機構簡稱', key: 'CreatePractitionerName' },
      { name: '診療部位', key: 'BodySite' },
    ])
    const headers9 = ref([
      { name: '門診診別', key: 'Name' },
      { name: '主診斷碼', key: 'ConditionCode' },
      { name: '主診斷名稱', key: 'ConditionName' },
      { name: '慢連籤', key: 'NumberOfRepeatsAllowed' },
      { name: '健保代碼', key: 'MedicationCode' },
      { name: '基準方名', key: 'MedicationCodeText' },
      { name: '效能名', key: 'Ingredient' },
      { name: '用法用量', key: 'DosageInstructionText' },
      { name: '給藥日數', key: 'TimingDuration' },
      { name: '劑型', key: 'Form' },
      { name: '給藥總量', key: 'MaxDosePerAdministration' },
      { name: '醫事機構簡稱', key: 'OrganizationName' },
    ])

    const items1 = ref([])
    const items2 = ref([])
    const items3 = ref([])
    const items4 = ref([])
    const items5 = ref([])
    const items6 = ref([])
    const items7 = ref([])
    const items8 = ref([])
    const items9 = ref([])

    const showBlock1 = ref(true)
    const showBlock2 = ref(true)
    const showBlock3 = ref(true)
    const showBlock4 = ref(true)
    const showBlock5 = ref(true)
    const showBlock6 = ref(true)
    const showBlock7 = ref(true)
    const showBlock8 = ref(true)
    const showBlock9 = ref(true)

    items1.value = !!props.itemData?.cloud1 ? [...props.itemData?.cloud1] : []
    items2.value = !!props.itemData?.cloud2 ? [...props.itemData?.cloud2] : []
    items3.value = !!props.itemData?.cloud3 ? [...props.itemData?.cloud3] : []
    items4.value = !!props.itemData?.cloud4 ? [...props.itemData?.cloud4] : []
    items5.value = !!props.itemData?.cloud5 ? [...props.itemData?.cloud5] : []
    items6.value = !!props.itemData?.cloud6 ? [...props.itemData?.cloud6] : []
    items7.value = !!props.itemData?.cloud7 ? [...props.itemData?.cloud7] : []
    items8.value = !!props.itemData?.cloud8 ? [...props.itemData?.cloud8] : []
    items9.value = !!props.itemData?.cloud9 ? [...props.itemData?.cloud9] : []

    const nowClickItem = ref({
      cloud1: '',
      cloud2: '',
      cloud3: '',
      cloud4: '',
      cloud5: '',
      cloud6: '',
      cloud7: '',
      cloud8: '',
      cloud9: '',
    })
    const setData = (item, type) => {
      switch (type) {
        case 'cloud1':
          nowClickItem.value.cloud1 = item
          if (item == 'All Data') {
            items1.value = [...props.itemData?.cloud1]
          } else {
            items1.value = props.itemData?.cloud1.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud2':
          nowClickItem.value.cloud2 = item
          if (item == 'All Data') {
            items2.value = [...props.itemData?.cloud2]
          } else {
            items2.value = props.itemData?.cloud2.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud3':
          nowClickItem.value.cloud3 = item
          if (item == 'All Data') {
            items3.value = [...props.itemData?.cloud3items3]
          } else {
            items3.value = props.itemData?.cloud3items3.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud4':
          nowClickItem.value.cloud4 = item
          if (item == 'All Data') {
            items4.value = [...props.itemData?.cloud4]
          } else {
            items4.value = props.itemData?.cloud4.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud5':
          nowClickItem.value.cloud5 = item
          if (item == 'All Data') {
            items5.value = [...props.itemData?.cloud5]
          } else {
            items5.value = props.itemData?.cloud5.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud6':
          nowClickItem.value.cloud6 = item
          if (item == 'All Data') {
            items6.value = [...props.itemData?.cloud6]
          } else {
            items6.value = props.itemData?.cloud6.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud7':
          nowClickItem.value.cloud7 = item
          if (item == 'All Data') {
            items7.value = [...props.itemData?.cloud7]
          } else {
            items7.value = props.itemData?.cloud7.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud8':
          nowClickItem.value.cloud8 = item
          if (item == 'All Data') {
            items8.value = [...props.itemData?.cloud8]
          } else {
            items8.value = props.itemData?.cloud8.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        case 'cloud9':
          nowClickItem.value.cloud9 = item
          if (item == 'All Data') {
            items9.value = [...props.itemData?.cloud9]
          } else {
            items9.value = props.itemData?.cloud9.filter((s) => `${s.timedata}`.includes(item))
          }
          break
        default:
          console.log('No data')
      }
    }

    return {
      headers1,
      headers2,
      headers3,
      headers4,
      headers5,
      headers6,
      headers7,
      headers8,
      headers9,

      items1,
      items2,
      items3,
      items4,
      items5,
      items6,
      items7,
      items8,
      items9,

      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      showBlock5,
      showBlock6,
      showBlock7,
      showBlock8,
      showBlock9,

      cloudModal,
      setData,
      nowClickItem,
    }
  },
}
</script>
<style lang="scss" scoped>
.main-content {
  display: grid;
  grid-template-columns: 1650px 125px;
  grid-column-gap: 8px;
  padding-left: 3px;
  // padding-right: 3px;
  .content-left {
    .table-block {
      border: 1px rgb(0, 78, 138) solid;
      border-radius: 0.25rem;
      width: 1640px;
      overflow: auto;
      h3 {
        text-align: left !important;
        padding-left: 12px;
        font-weight: 600;
        background: #f1f9e8;
        font-size: 18px;
        line-height: 36px;
        border-radius: 0.25rem;
      }
    }
    .area-block {
      background: #f2f2f2;
      h3 {
        text-align: left;
        padding-left: 12px;
      }
    }
  }

  .content-right {
    .right-btn {
      margin-bottom: 5px;
      border-radius: 0.5rem;
      padding: 0.25rem;
      font-size: 1.25rem;
      line-height: 1.75rem;
      --tw-text-opacity: 1;
      color: rgba(255, 255, 255, var(--tw-text-opacity));
      background-color: #3186c8;
      text-align: center;
      margin-right: 4px;

      display: flex;
      justify-content: center;
    }
    .date {
      text-align: center;
      cursor: pointer;
      color: rgb(29, 97, 150);
    }
    .activedate {
      color: rgb(255, 255, 255);

      span {
        background: #e9cd4c;
        border-radius: 3px;
        padding: 1px 10px;
      }
    }
  }
}

::v-deep(.p-inputtextarea) {
  width: 100%;
  border: 0px;
  background: #f2f2f2;
  color: #161c2d;
  font-weight: 640;
}
</style>
