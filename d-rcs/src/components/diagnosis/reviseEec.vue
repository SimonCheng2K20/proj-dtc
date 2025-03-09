<template>
  <div class="main-section">
    <reviseecmodal
      ref="modalEec"
      :itemData="itemData"
      :title="title"
      :name="name"
    ></reviseecmodal>

    <h4 class="big-title">
      <div>
        電子病歷交換中心
        <Button
          class="p-button-raised p-button-secondary p-button-sm float-right"
          style="padding: 0 15px; line-height: 2"
          @click="closeEecView"
          >關閉</Button
        >
        <Button
          class="p-button-white p-button-sm float-right"
          style="padding: 0 15px; line-height: 2; margin-right: 5px"
          @click="showModal"
          >展開</Button
        >
      </div>
    </h4>
    <div class="main-content overflow-auto custom-scroll-bar">
      <div class="content-left">
        <div
          class="mb-1 area-block custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC02'"
        >
          <div class="table-block mb-1 area-block">
            <h3>病情摘要(主觀、客觀及評估)</h3>
            <Textareaprime
              class="textarea-content custom-scroll-bar"
              maxlength="2000"
              v-model="items1"
              :disabled="!itemData.data.CanRecording"
              rows="5"
            />
          </div>
        </div>
        <div
          class="table-block mb-1 area-block custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC02'"
        >
          <h3 style="text-align: left !important; min-width: 500px">診斷</h3>
          <tablecomponet
            :headers="headers2"
            :items="items2"
            columnstyle="grid-template-columns:  repeat(3, 1fr);"
            minwidth="500"
          ></tablecomponet>
        </div>
        <div
          class="table-block mb-1 custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC02'"
        >
          <h3 style="text-align: left !important; min-width: 1080px">處置</h3>
          <tablecomponet
            :headers="headers3"
            :items="items3"
            columnstyle="grid-template-columns: repeat(9, 1fr);"
            minwidth="1080"
          ></tablecomponet>
        </div>
        <div
          class="table-block mb-1 custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC02'"
        >
          <h3 style="text-align: left !important; min-width: 1200px">用藥</h3>
          <tablecomponet
            :headers="headers4"
            :items="items4"
            columnstyle="grid-template-columns:  repeat(11, 1fr);"
            minwidth="1200"
          ></tablecomponet>
        </div>
        <div
          class="table-block mb-1 custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC01'"
        >
          <h3 style="text-align: left !important; min-width: 480px">出院病歷摘要</h3>
          <Textareaprime
            class="textarea-content custom-scroll-bar"
            maxlength="2000"
            v-model="items5"
            :disabled="!itemData.data.CanRecording"
            rows="5"
          />
        </div>
        <div
          class="table-block mb-1 custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC04'"
        >
          <h3 style="text-align: left !important; min-width: 1080px">檢驗檢查報告</h3>
          <!-- {{ items6 }} -->
          <tablecomponet
            :headers="headers6"
            :items="items6"
            columnstyle="grid-template-columns: repeat(8, 1fr) 150px;"
            minwidth="1080"
            :key="`items6${compontKey}`"
          ></tablecomponet>
        </div>
        <div
          class="table-block mb-1 custom-scroll-bar"
          v-show="!nowClickItem?.Code || nowClickItem?.Code == 'EEC05'"
        >
          <h3 style="text-align: left !important">醫學影像報告</h3>
          <Textareaprime
            class="textarea-content custom-scroll-bar"
            maxlength="2000"
            v-model="items7"
            :disabled="!itemData.data.CanRecording"
            rows="5"
          />
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
            v-for="(item, idx) in itemData.eecData1"
            :key="`${idx}eecData1`"
            :title="item.PeriodStart"
            @click="setData(item)"
            :class="nowClickItem == item ? 'activedate' : ''"
          >
            <span>{{ item.periodStart || "" }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock2 = !showBlock2">
          出院病摘
          <minus-icon v-show="showBlock2" />
          <plus-icon v-show="!showBlock2" />
        </div>
        <div v-show="showBlock2">
          <div
            class="date"
            v-for="(item, idx) in itemData.eecData2"
            :key="`${idx}eecData2`"
            :title="item.PeriodStart"
            @click="setData(item)"
            :class="nowClickItem == item ? 'activedate' : ''"
          >
            <span>{{ item.periodStart || "" }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock3 = !showBlock3">
          影像報告
          <minus-icon v-show="showBlock3" />
          <plus-icon v-show="!showBlock3" />
        </div>
        <div v-show="showBlock3">
          <div
            class="date"
            v-for="(item, idx) in itemData.eecData3"
            :key="`${idx}eecData3`"
            :title="item.PeriodStart"
            @click="setData(item)"
            :class="nowClickItem == item ? 'activedate' : ''"
          >
            <span>{{ item.periodStart || "" }}</span>
          </div>
        </div>

        <div class="right-btn cursor-pointer" @click="showBlock4 = !showBlock4">
          檢驗報告
          <minus-icon v-show="showBlock4" />
          <plus-icon v-show="!showBlock4" />
        </div>
        <div v-show="showBlock4">
          <div
            class="date"
            v-for="(item, idx) in itemData.eecData4"
            :key="`${idx}eecData4`"
            :title="item.PeriodStart"
            @click="setData(item)"
            :class="nowClickItem == item ? 'activedate' : ''"
          >
            <span>{{ item.periodStart || "" }}</span>
          </div>
        </div>

        <!-- <div class="right-btn cursor-pointer" @click="showBlock5 = !showBlock5">
          門診用藥紀錄
          <minus-icon v-show="showBlock5" />
          <plus-icon v-show="!showBlock5" />
        </div>
        <div v-show="showBlock5">
          <div
            class="date"
            v-for="(item, idx) in itemData.eecData5"
            :key="`${idx}eecData5`"
            :title="item.PeriodStart"
            @click="setData(item)"
            :class="nowClickItem == item ? 'activedate' : ''"
          >
            <span>{{ item.periodStart || "" }}</span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, nextTick } from "vue";

import tablecomponet from "@/components/tablecomponent/table.vue";
import reviseecmodal from "./reviseecmodal.vue";
export default {
  components: { tablecomponet, reviseecmodal },
  props: {
    itemData: {
      type: Object,
      required: true,
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
  setup(props, { emit }) {
    //eecData1門診病歷
    // eecData2出院病摘
    // eecData3影像報告
    // eecData4檢驗報告
    // eecData5門診用藥紀錄--沒有使用
    // eecData6醫學影像報告--沒有使用
    const compontKey = ref(0);
    const modalEec = ref(null);

    const showModal = () => {
      // console.log("modalEec", );
      modalEec.value.eecModal = true;
    };

    const headers2 = ref([
      { name: "ICD-10", key: "Code" },
      { name: "診斷名稱", key: "Name" },
      { name: "開單醫師", key: "UpdatePractitionerId" },
    ]);

    const headers3 = ref([
      { name: "類別", key: "ProcedureTypeChinese" },
      { name: "治療處置代碼", key: "ProcedureCode" },
      { name: "治療處置名稱", key: "ProcedureName" },
      { name: "總量", key: "Total" },
      { name: "總量單位", key: "TotalUnit" },
      { name: "量測結果值", key: "ObservationValue" },
      { name: "單位", key: "ObservationUnit" },
      { name: "最低值", key: "ReferenceRangeLow" },
      { name: "最高值", key: "ReferenceRangeHigh" },
    ]);
    const headers4 = ref([
      { name: "項次", key: "Category" }, //這找不到
      { name: "藥品代碼", key: "Code" },
      { name: "藥品名稱", key: "Name" },
      { name: "次劑量", key: "Dose" },
      { name: "次劑量單位", key: "DoseUnit" },
      { name: "服法", key: "MethodCodeName" },
      { name: "途徑", key: "RouteCodeName" },
      { name: "日數(天)", key: "Days" },
      { name: "總量", key: "Total" },
      { name: "總量單位", key: "TotalUnit" },
      { name: "開單醫師", key: "PractitionerId" },
    ]);

    const headers6 = ref([
      { name: "項次", key: "ProcedureNo" }, //這找不到
      { name: "檢驗檢查類別", key: "ResultCategory" },
      { name: "醫令代碼", key: "PatientDepartment" },
      { name: "醫令名稱", key: "PatientDepartmentName" },
      { name: "檢驗項目", key: "ResultCode" },
      { name: "檢驗結果", key: "ResultValue" },
      { name: "單位", key: "ResultValueUnit" },
      { name: "參考值", key: "ResultReferenceRange" },
      { name: "報告結果/病理發現", key: "Conclusion" },
    ]);

    const items1 = ref("");
    const items2 = ref([]);
    const items3 = ref([]);
    const items4 = ref([]);
    const items5 = ref("");
    const items6 = ref([]);
    const items7 = ref("暫無資料");

    const showBlock1 = ref(true);
    const showBlock2 = ref(true);
    const showBlock3 = ref(true);
    const showBlock4 = ref(true);
    const showBlock5 = ref(true);

    const closeEecView = () => {
      emit("closeRightCompFunc");
    };

    const nowClickItem = ref({});
    const setData = (item) => {
      item.Procedures = item.Procedures.map((s) => {
        s.ProcedureTypeChinese =
          `${s.ProcedureType.toLowerCase()}` == "procedures"
            ? "處置"
            : `${s.ProcedureType.toLowerCase()}` == "study"
            ? "影像"
            : `${s.ProcedureType.toLowerCase()}` == "laboratory"
            ? "檢驗"
            : "";
        return s;
      });
      item.MedicationRequests = item.MedicationRequests.map((s, i) => {
        s.Category = +i + 1;
        return s;
      });

      item.DiagnosticReports = item.DiagnosticReports.map((s, i) => {
        s.ProcedureNo = +i + 1;
        return s;
      });

      nowClickItem.value = item;
      items1.value = item.conditionSummary || "No Data";
      items2.value = [...item?.Diagnosis];
      items3.value = [...item?.Procedures];
      items4.value = [...item?.MedicationRequests];
      items5.value = item.conditionSummary || "No Data";
      items6.value = [...item?.DiagnosticReports];
      compontKey.value += 1;
      // console.log("data", item);
    };

    return {
      headers2,
      headers3,
      headers4,

      headers6, //有headers的是清單的資料

      items1,
      items2,
      items3,
      items4,
      items5,
      items6,
      items7,

      showBlock1,
      showBlock2,
      showBlock3,
      showBlock4,
      showBlock5,

      modalEec,
      showModal,

      closeEecView,

      setData,
      compontKey,

      nowClickItem,
    };
  },
};
</script>
<style lang="scss" scoped>
.main-section {
  display: flex;
  flex-direction: column;
  .big-title {
    font-size: 28px;
    font-weight: 550;
    font-family: Microsoft JhengHei, Helvetica;

    letter-spacing: 3.45px;
    color: #1c2a54;
    // opacity: 1;
  }
  .main-content {
    display: grid;
    grid-template-columns: minmax(365px, 1fr) 125px;
    grid-column-gap: 8px;
    padding-left: 3px;
    padding-bottom: 100px;
    // padding-right: 3px;
    .content-left {
      .table-block {
        border: 1px rgb(0, 78, 138) solid;
        border-radius: 0.25rem;
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
          text-align: left !important;
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
