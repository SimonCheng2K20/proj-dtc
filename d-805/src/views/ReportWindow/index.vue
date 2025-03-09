<template>
  <div class="d-flex flex-column bg-white text-black">
    <div class="report-window p-1">
      <!-- :style="`background-color: rgba(${getThemeColors.textColor === '#fff' ? '255,255,255':'0,0,0'}, .1);`" -->
      <!-- :style="`background-color: rgba(255, 255,255, 1);`" -->
      <page-title
        title="歷史報告總覽"
        img="history"
      />

      <!-- <div class="report-title" :style="`background-color: ${reportTitleColor}`">
      <div class="py-2 px-4">
        <font-awesome-icon icon="history" />
        歷史報告總覽
      </div>
    </div> -->

      <div class="report-shadow" />

      <div class="report-body flex-1">
        <div
          class="d-flex h-100"
          no-gutters
        >
          <div class="lists py-2 pl-3 pr-2">
            <div class="my-1 list-title">
              <font style="opacity: .7">
                <font-awesome-icon icon="list" /> 報告清單
              </font>
            </div>
            <div class="report-list text-left">
              <div
                v-for="(item, idx) in historyList"
                :key="item.CREATEDTTM"
                class="p-2"
                :class="{ active: chosenItem == item }"
                @click="chosenItem = item"
              >
                <div
                  v-text="item.ProcedureName"
                  :key="item.ProcedureName + '_' + idx"
                  class="title my-1"
                />
                <div>
                  <div
                    v-text="$moment(item.ProcedureCompleted).format('YYYY-MM-DD hh:mm:ss')"
                    :key="item.ProcedureCompleted + '_' + idx"
                    class="content"
                  />
                  <div
                    class="content text-left version-content"
                    v-text="'Version: ' + item.DxrVersion"
                  />
                </div>
              </div>
            </div>
            <!-- <b-table
            size="sm"
            :fields="fields"
            :items="historyList"
          /> -->
          </div>
          <div
            ref="mainContent"
            style="margin-top: -10px;"
            class="flex-1 main-content py-4 pl-2 pr-3"
          >
            <template v-if="chosenItem">

              <card-frame title="病患資訊">
                <div class="p-2">
                  <patient
                    :info="chosenItem"
                    class="mb-1"
                  />
                </div>
              </card-frame>

              <card-frame
                title="ReportContent"
                :theme="{ bg: 'success', color: 'white' }"
              >
                <div class="p-2">
                  <div
                    v-if="isLoading"
                    class="d-flex justify-content-center align-items-center"
                  >
                    <b-spinner label="Spinning" />
                  </div>
                  <b-card-text
                    v-else
                    class="text-left p-2"
                    v-text="reportContent || '無資料'"
                  />
                </div>
              </card-frame>

              <!-- <card-frame
                title="Imaging finding"
                :theme="{ bg: 'warning', color: 'black' }"
              >
                <div class="p-2">
                  <imagingFinding
                    class="text-left"
                    v-if="structures"
                    :structures="structures"
                  />
                </div>
              </card-frame> -->

            </template>
            <div
              v-else
              class="w-100 d-flex justify-content-center align-items-center"
            >
              暫無資料
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getPatientReportList, getReportByAccessionNo } from "@/assets/service/dataManager.js";
import patient from "./patientInfo";
import imagingFinding from "@/components/printComposition/imagingFinding";
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      chosenItem: null,
      reportContent: "",
      historyList: [],
      structures: null,
      fields: [
        { key: "ProcedureName", sortable: true, label: "名稱" },
        { key: "ProcedureCompletedTime", sortable: true, label: "完成日期" },
      ],
      publicPath: process.env.BASE_URL,
      isLoading: false
    };
  },
  async created () {
    const { otherPatientId, patientId } = this.$route.query;
    this.otherId = otherPatientId;

    this.historyList = await getPatientReportList(patientId);
    if (this.historyList.length > 0) {
      this.chosenItem = this.historyList[0];
    }
  },
  mounted () {
    this.$refs.mainContent.style.height = this.$refs.mainContent.clientHeight + "px";
  },
  components: {
    patient,
    imagingFinding,
  },
  watch: {
    async chosenItem (item) {
      try {
        this.isLoading = true;
        const res = await getReportByAccessionNo(item.AccessionNo, item.PatientId);
        this.isLoading = false;
        this.reportContent = res.ReportContent;
        this.structures = Object.keys(res)
          .filter((k) => k.includes("StructureContent"))
          .reduce((acc, cur) => {
            acc.push({ content: res[cur], data: JSON.parse(res[cur.replace("Content", "Data")]) });
            return acc;
          }, []);
      } catch (err) {
        this.structures = null;
      }
    },
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
    // structures () {
    //   return !this.chosenItem
    //     ? []
    //     : Object.keys(this.chosenItem).filter(k => k.includes('StructureContent')).reduce((acc, cur, index) => {
    //       acc.push({ content: this.chosenItem[cur], data: this.chosenItem[cur.replace('Content', 'Data')] })
    //       return acc;
    //     }, []);
    // }
    cardBgroundColor () {
      return this.getThemeColors.key === "white" || this.getThemeColors.key === "lightGray" ? "white" : "transparent";
    },
    reportTitleColor () {
      return this.getThemeColors.key === "white" || this.getThemeColors.key === "lightGray" ? "white" : "var(--primary)";
    },
  },
  methods: {},
};
</script>

<style lang="scss">
@import "@/assets/styles/mixins.scss";
.report-window {
  // background: linear-gradient(
  //   180deg,
  //   rgba(0, 0, 0, 0.05) 0%,
  //   rgba(0, 0, 0, 0) 64%,
  //   rgba(0, 0, 0, 0) 100%
  // );
  @include scroll-style;
  height: 100vh;
  .lists {
    width: 320px;
    box-sizing: content-box;
    position: relative;
    &::after {
      position: absolute;
      content: "";
      right: 0;
      top: 2.5%;
      height: 95%;
      width: 1px;
      background-color: #999;
      opacity: 0.25;
    }
  }
  .list-title {
    font-size: 12px;
  }

  .report-list {
    z-index: 500;
    width: inherit;
    overflow-y: auto;
    height: calc(100vh - 120px);
    > div {
      cursor: pointer;
      &:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.05);
      }
      &:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.1);
      }
      border-bottom: 1px solid var(--themeTextColor);
      &.active {
        background-color: var(--primary);
        color: #fff;
        // border-bottom: 2px solid var(--primary);
        position: relative;
        &::after {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 0 6px 7px;
          border-color: transparent transparent transparent
            var(--themeTextColor);
          position: absolute;
          left: calc(100% - 7px);
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .title {
      font-size: 18px;
      line-height: 1.5;
      opacity: 0.75;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
    }
    .content {
      font-size: 8px;
      line-height: 1;
    }
  }
  .main-content {
    word-break: break-all;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.08);
  }
  .cardHeader {
    font-size: 21px;
    line-height: 2;
  }
  .card-border {
    border: 1px solid #999;
  }
}

.report-title {
  // box-shadow: 0 10px 10px #000;
  // background-color: #4e73df;
  // color: #fff;
  position: relative;
  &::after {
    content: "";
    width: 100%;

    height: 10px;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.125);
    bottom: 0;
    display: table;
    z-index: 1000;
    position: absolute;
  }
}
.version-content {
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
}
</style>
