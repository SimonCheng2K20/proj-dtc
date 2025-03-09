<template>
  <div>
    <AnimationModal :positionTop="positionTop + 'px'" ref="animationModal" :shadow="true" v-on:closeModal="$emit('closeModal')">
      <div class="d-flex justify-content-between align-items-center">
        <div class="history-title rounded mb-2 mr-auto px-2">
          <!-- <font-awesome-icon
            icon="wpforms"
            class="mr-1"
          /> -->
          <span class="zhTW">歷史診斷報告</span>
        </div>
        <div class="text-left">TIP:</div>
        <div class="bg-primary text-white px-1 mx-1 rounded">CTRL + 左右鍵可切換歷史報告</div>
        <div class="bg-primary text-white px-1 mx-1 rounded">ESC 可離開編輯畫面</div>
      </div>

      <patientInfo :item="chosenHistory" />

      <div class="history-list d-flex flex-wrap mb-1" id="historyList">
        <b-button
          size="sm"
          @click.stop="
            chosenHistory = item;
            this.historyIndex = i;
          "
          :variant="item === chosenHistory ? 'primary' : 'secondary'"
          v-for="(item, i) in historyList"
          :key="i"
          class="mr-1"
        >
          <div v-text="item.ProcedureName ? item.ProcedureName : item.ReportContent" />
          <div v-text="$moment(item.IssueTime).format('YYYY-MM-DD')" />
        </b-button>
      </div>

      <div class="mb-2 report-editor border rounded pb-1" ref="reportEditing" :style="reportHgt">
        <div class="mb-2" style="margin-top:1rem;">
          <b-button class="mr-1" v-if="updateHistory && updateHistory.ReportContent" @click="copyPasteText()" variant="info">
            <font-awesome-icon icon="copy" class="mr-1" />複製並覆蓋(CTRL + M)
          </b-button>

          <b-button class="ml-1" v-if="updateHistory && updateHistory.ReportContent" @click="insertPasteText()" variant="info">
            <font-awesome-icon icon="copy" class="mr-1" />複製並插入(CTRL + I)
          </b-button>
        </div>
        <!-- <div v-if="copyOk" style="color:red;">資料已複製並貼上</div> -->
        <div class="grid-frame grid-col-2" :style="`height: calc(100% - ${updateHistory ? 60 : 20}px)`">
          <div class="border rounded">
            <div class="rounded-top bg-primary text-white">書寫報告</div>
            <!-- <b-textarea v-if="theReport.ReportContent" v-model="theReport.ReportContent" class="copying-area"></b-textarea> -->
            <b-textarea
              style="height: calc(100% - 24px)"
              class="reportContent"
              ref="reportContent"
              no-resize
              v-model="theReport.ReportContent"
              placeholder="請於此處輸入報告內容"
              wrap="hard"
            />
          </div>

          <div class="border rounded">
            <div class="rounded-top bg-secondary text-white" v-text="chosenHistory.ProcedureName ? chosenHistory.ProcedureName : chosenHistory.ReportContent" />

            <b-textarea
              v-if="updateHistory && updateHistory.ReportContent"
              no-resize
              class="reportContent"
              style="height: calc(100% - 24px)"
              v-model="updateHistory.ReportContent"
              placeholder="請於此處輸入報告內容"
              wrap="hard"
              :disabled="true"
            />
            <div v-else class="d-flex align-items-center justify-content-center py-2">暫無記錄</div>
            <!-- <b-textarea v-if="updateHistory.ReportContent" v-model="chosenHistory.ReportContent" class="copying-area"></b-textarea>
            <div class="d-flex align-items-center justify-content-center" v-else>暫無記錄</div> -->
          </div>
        </div>
      </div>

      <!-- <judgeContent :item="chosenHistory" /> -->

      <div class="view-history-pop">
        <div v-if="updateHistory && updateHistory.CSTName1">
          <vue-tabs active-tab-color="#e74c3c" active-text-color="white" class="dtc-vue-tab-history">
            <v-tab v-for="item in 6" :key="item" :title="updateHistory[`CSTName${item}`]" class="p-1 position-relative" v-if="updateHistory[`CSTName${item}`]">
              <div slot="title">{{ updateHistory[`CSTName${item}`] }}</div>
              <div class="text-left" v-html="updateHistory[`StructureContent${item}`]" />
              <!-- <img class="img-border" :src="viewItem[`StructureImage${item}`]" /> -->
            </v-tab>
          </vue-tabs>
        </div>
      </div>
    </AnimationModal>
  </div>
</template>

<script>
import AnimationModal from "@/components/AnimationModal";
import patientInfo from "./patientInfo.vue";
import report from "@/components/report";
import { getReportByAccessionNo } from "@/assets/service/dataManager.js";
export default {
  data() {
    return {
      chosenHistory: null,
      updateHistory: null,
      historyIndex: 0,
      ObjApp: null,
      reportHgt: "",
      positionTop: 210,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.keyEventListener);
    // reportHgt

    this.$nextTick(() => {
      this.reportHgt = `height: calc(100vh - ${document.getElementById("historyList").clientHeight + this.positionTop + 150}px);`;
      console.log(this.reportHgt);
    });
  },
  props: {
    theReport: {
      type: Object,
      required: true,
    },
    theProcedure: {
      type: Object,
      required: true,
    },
    historyList: {
      type: Array,
      required: true,
    },
    viewHistoryItem: {
      type: Object,
      required: true,
    },
  },
  created() {
    let obj = this.$GetApp(this);
    this.ObjApp = obj[0];
    const _index = this.historyList.findIndex((item) => ["ProcedureName", "CREATEDTTM", "DxrVersion"].every((k) => item[k] === this.viewHistoryItem[k]));
    if (_index > 0) {
      this.historyIndex = _index;
    }

    if (this.historyList.length > 0) this.chosenHistory = this.historyList[this.historyIndex];
  },
  methods: {
    keyEventListener(event) {
      if (event.code === "Escape") {
        this.$refs.animationModal.modalHide();
      } else if (event.ctrlKey && event.code === "ArrowRight" && this.historyIndex < this.historyList.length - 1) {
        this.historyIndex += 1;
        this.chosenHistory = this.historyList[this.historyIndex];
      } else if (event.ctrlKey && event.code === "ArrowLeft" && this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.chosenHistory = this.historyList[this.historyIndex];
      } else if (event.ctrlKey && event.code === "KeyM" && this.updateHistory) {
        this.copyPasteText();
      } else if (event.ctrlKey && event.code === "KeyI" && this.updateHistory) {
        this.insertPasteText();
      }
    },
    insertPasteText() {
      if (this.updateHistory) {
        // 前文
        const textBefore = this.theReport.ReportContent.substring(0, this.$refs.reportContent.selectionStart);
        // 後文
        const textAfter = this.theReport.ReportContent.substring(this.$refs.reportContent.selectionStart, this.theReport.ReportContent.length);
        // 插入後的新位置
        const newSelectPos = textBefore.length + this.updateHistory.ReportContent.length;

        this.theReport.ReportContent = textBefore + this.updateHistory.ReportContent + textAfter;
        this.$nextTick(() => (this.$refs.reportContent.selectionEnd = newSelectPos));
      }
    },
    copyPasteText() {
      if (this.updateHistory) this.theReport.ReportContent = this.updateHistory.ReportContent;
    },
    async updateHistoryReport(item) {
      //console.log(JSON.stringify(item,0,2));
      if (item.ReportSource == "DTC") {
        //get report details;
        this.ObjApp.WaitingShow("報告");

        item = await getReportByAccessionNo(item.AccessionNo, item.PatientId);
        this.ObjApp.WaitingHide();
      }
      //viewHistoryItem[`CSTName${item}`]
      const a6 = new Array(6).fill();
      a6.forEach((s, i) => {
        let n = i + 1;
        if (item[`CSTName${n}`]) {
          item[`CSTName${n}`] = item[`CSTName${n}`] + `-${n}`;
        }
      });

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (item.ReportSource == "DTC") {
            a6.forEach((s, i) => {
              let n = i + 1;
              if (item[`CSTName${n}`] && item[`StructureData${n}`]) {
                let obj = {
                  CSTName: item[`CSTName${n}`],
                  structureData: item[`StructureData${n}`],
                };
                // this.updateVtabTitle(obj);
              }
            });
          }
          resolve(item);
        }, 1200);
      });
    },
  },
  components: {
    AnimationModal,
    report,
    patientInfo,
  },
  watch: {
    async chosenHistory(val) {
      this.updateHistory = null;
      this.updateHistory = await this.updateHistoryReport(val);
    },
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEventListener);
  },
};
</script>

<style lang="scss" scoped>
.history-list {
  max-height: 300px;
}

.reportContent {
  height: 200px;
}

.grid-frame {
  display: grid;
  padding: 2px;
  grid-gap: 2px;
  align-self: start;
}

.hisItem {
  width: 25px;
  height: 25px;
}

.history-title {
  background-color: var(--warning);
  color: #000;
  font-size: 21px;
  font-weight: bold;
}

// grid-template-columns: repeat(4, 1fr);
</style>
