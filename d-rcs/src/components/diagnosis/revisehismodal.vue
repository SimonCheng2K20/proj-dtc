<template>
  <Dialog
    v-model:visible="hisModal"
    style="width: 90vw"
    :draggable="false"
    :modal="true"
    class="custom-modal"
  >
    <template #header>
      <h3>HIS歷史資料</h3>
    </template>
    <div class="main-section">
      <div class="main-content overflow-auto custom-scroll-bar">
        <div class="content-left">
          <div class="table-block mb-1 area-block">
            <h3>病情摘要</h3>
            <Textareaprime
              class="textarea-content custom-scroll-bar"
              maxlength="2000"
              v-model="items1"
              :disabled="!itemData.data.CanRecording"
              rows="6"
            />
          </div>
          <div class="table-block mb-1 area-block">
            <h3>特註</h3>
            <Textareaprime
              class="textarea-content custom-scroll-bar"
              maxlength="2000"
              v-model="items2"
              :disabled="!itemData.data.CanRecording"
              rows="6"
            />
          </div>
          <div class="table-block mb-1">
            <h3>診斷</h3>
            <tablecomponet
              :headers="headers3"
              :items="items3"
              columnstyle="grid-template-columns: 80px repeat(2, 1fr);"
            ></tablecomponet>
          </div>
          <div class="table-block mb-1">
            <h3>處置</h3>
            <tablecomponet
              :headers="headers4"
              :items="items4"
              columnstyle="grid-template-columns: 80px repeat(5, 1fr);"
            ></tablecomponet>
          </div>
          <div class="table-block mb-1">
            <h3>用藥</h3>
            <tablecomponet
              :headers="headers5"
              :items="items5"
              columnstyle="grid-template-columns: 80px repeat(9, 1fr);"
            ></tablecomponet>
          </div>
          <div class="table-block mb-1">
            <h3>檢驗</h3>
            <tablecomponet
              :headers="headers6"
              :items="items6"
              columnstyle="grid-template-columns: 80px repeat(6, 1fr);"
            ></tablecomponet>
          </div>
        </div>
        <div class="content-right">
          <div class="right-btn cursor-pointer" @click="showBlock1 = !showBlock1">
            門診病歷
            <minus-icon v-show="showBlock1" />
            <plus-icon v-show="!showBlock1" />
          </div>
          <div v-show="showBlock1">
            <div
              class="date"
              v-for="(item, idx) in itemData.his1TimesArray"
              :key="`${idx}his1`"
              :title="item"
              @click="setData(item, 'his1')"
              :class="nowClickItem.his1 == item ? 'activedate' : ''"
            >
              <span>{{ item || "" }}</span>
            </div>
          </div>
          <div class="right-btn cursor-pointer" @click="showBlock2 = !showBlock2">
            急診病歷
            <minus-icon v-show="showBlock2" />
            <plus-icon v-show="!showBlock2" />
          </div>
          <div v-show="showBlock2">
            <div
              class="date"
              v-for="(item, idx) in itemData.his2TimesArray"
              :key="`${idx}his2`"
              :title="item"
              @click="setData(item, 'his2')"
              :class="nowClickItem.his2 == item ? 'activedate' : ''"
            >
              <span>{{ item || "" }}</span>
            </div>
          </div>
          <div class="right-btn cursor-pointer" @click="showBlock3 = !showBlock3">
            住院病歷
            <minus-icon v-show="showBlock3" />
            <plus-icon v-show="!showBlock3" />
          </div>
          <div v-show="showBlock3">
            <div
              class="date"
              v-for="(item, idx) in itemData.his3TimesArray"
              :key="`${idx}his2`"
              :title="item"
              @click="setData(item, 'his3')"
              :class="nowClickItem.his3 == item ? 'activedate' : ''"
            >
              <span>{{ item || "" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="關閉" class="p-button-success" @click="hisModal = false" />
    </template>
  </Dialog>
</template>

<script>
import { ref, reactive, nextTick } from "vue";

import tablecomponet from "@/components/tablecomponent/table.vue";
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
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const compontKey = ref(0);
    const hisModal = ref(false);
    const headers3 = ref([
      { name: "診斷序號", key: "No" },
      { name: "診斷碼", key: "Code" },
      { name: "診斷名稱", key: "Name" },
    ]);
    const headers4 = ref([
      { name: "處置序號", key: "ProcedureNo" },
      { name: "處置類別", key: "ProcedureType" },
      { name: "處置代碼", key: "ProcedureCode" },
      { name: "處置名稱", key: "ProcedureName" },
      { name: "檢查單號", key: "EncounterId" }, //not sure
      { name: "開單醫師", key: "CreatePractitionerId" },
    ]);
    const headers5 = ref([
      { name: "處置序號", key: "Id" }, //not sure
      { name: "處置代碼", key: "Code" },
      { name: "處置名稱", key: "Name" },
      { name: "次劑量", key: "Dose" },
      { name: "次劑量單位", key: "DoseUnit" },
      { name: "服法", key: "MethodCodeName" },
      { name: "日數(天)", key: "Days" },
      { name: "總量", key: "Total" },
      { name: "總量單位", key: "TotalUnit" },
      { name: "開單醫師", key: "PractitionerId" },
    ]);
    const headers6 = ref([
      { name: "處置序號", key: "Id" }, //not sure
      { name: "處置代碼", key: "DRCode" }, //not sure
      { name: "處置名稱", key: "DRCodeDisplay" }, //not sure
      { name: "量測結果", key: "ResultValue" },
      { name: "單位", key: "ResultValueUnit" },
      { name: "參考值區間", key: "ResultReferenceRange" },
      { name: "參考文字", key: "Conclusion" }, //not sure
    ]);

    const items1 = ref(""); //病情摘要
    const items2 = ref(""); //特註
    const items3 = ref([]); //診斷
    const items4 = ref([]); //處置
    const items5 = ref([]); //用藥
    const items6 = ref([]); //檢驗

    const showBlock1 = ref(true);
    const showBlock2 = ref(true);
    const showBlock3 = ref(true);

    const nowClickItem = ref({
      his1: null,
      his2: null,
      his3: null,
    });

    const setData = (item, type) => {
      let allArr = [];
      switch (type) {
        case "his1":
          nowClickItem.value.his1 = item;
          if (item == "All Data") {
            allArr = !!props.itemData?.hisData1 ? [...props.itemData?.hisData1] : [];
          } else {
            allArr = props.itemData?.hisData1.filter((s) => `${s.times}`.includes(item));
          }
          break;
        case "his2":
          nowClickItem.value.his2 = item;
          if (item == "All Data") {
            allArr = !!props.itemData?.hisData2 ? [...props.itemData?.hisData2] : [];
          } else {
            allArr = props.itemData?.hisData2.filter((s) => `${s.times}`.includes(item));
          }
          break;
        case "his3":
          nowClickItem.value.his3 = item;
          if (item == "All Data") {
            allArr = !!props.itemData?.hisData3 ? [...props.itemData?.hisData3] : [];
          } else {
            allArr = props.itemData?.hisData3.filter((s) => `${s.times}`.includes(item));
          }
          break;
        default:
          console.log("No data");
      }
      console.log(allArr)
      items1.value = allArr.map((k) => `${k.conditionSummary}`).join("\n");
      items2.value = allArr.map((k) => `${k.specialNote}`).join("\n");
      items3.value = allArr.reduce((acc, cur) => [...acc, ...cur.Diagnosis], []);
      items4.value = allArr.reduce((acc, cur) => [...acc, ...cur.Procedures], []);
      items5.value = allArr.reduce((acc, cur) => [...acc, ...cur.MedicationRequests], []);
      items6.value = allArr.reduce((acc, cur) => [...acc, ...cur.Laboratories], []);
    };

    return {
      compontKey,
      nowClickItem,
      setData,

      headers3,
      headers4,
      headers5,
      headers6,

      items1,
      items2,
      items3,
      items4,
      items5,
      items6,

      showBlock1,
      showBlock2,
      showBlock3,

      hisModal,
    };
  },
};
</script>
<style lang="scss" scoped>
.main-section {
  display: flex;
  flex-direction: column;
  width: 100%;

  .main-content {
    display: grid;
    grid-template-columns: minmax(365px, 1fr) 125px;
    grid-column-gap: 8px;
    padding-left: 3px;
    // padding-right: 3px;
    .content-left {
      .table-block {
        border: 1px rgb(0, 78, 138) solid;
        border-radius: 0.25rem;
        h3 {
          text-align: left;
          padding-left: 12px;
          font-weight: 600;
          background: #f1f9e8;
          font-size: 18px;
          line-height: 36px;
          border-radius: 0.25rem;
        }
      }
      .area-block {
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
}
::v-deep(.p-inputtextarea) {
  width: 100%;
  border: 0px;
  background: #f2f2f2;
  color: #161c2d;
  font-weight: 640;
}
</style>
