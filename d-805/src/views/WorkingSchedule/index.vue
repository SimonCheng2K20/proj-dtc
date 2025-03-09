<template>
  <div class="schedule-container d-flex">
    <div class="p-2 control-section">
      <controllPanel
        ref="controllPanel"
        :isModify="Object.values(batchModify.modifyData).some((items) => items.length > 0)"
        @changeMonth="changeMonth"
        @saveScheduling="updateScheduling"
        @resetScheduling="revertScheduling"
        @cloneScheduling="copyScheduling"
      />
    </div>
    <div class="p-2 flex-1 table-section d-flex flex-column">
      <sHeader
        ref="sheader"
        v-if="procedureGroup.length > 0"
        :procedureGroup="procedureGroup"
        :chosenRange="chosenRange"
        @readVacancyData="toggleVacancyEvent"
      />
      <sVacancy
        v-if="vacancy.show"
        :items="vacancy.items"
      />
      <sTable
        ref="scheduleTable"
        v-if="isMounted && Object.keys(procedureEvent).length > 0"
        class="mt-3 flex-1 w-100"
        style="max-width: calc(100vw - 216px);"
        :key="currentProcedure"
        :tag="currentProcedure"
        :events.sync="procedureEvent[currentProcedure]"
        @updateEvents="updateBatchData"
        @cloneSchedule="cloneSchedule"
      />

      <b-overlay
        :show="showConfirm"
        no-wrap
      >
        <template v-slot:overlay>
          <div
            ref="dialog"
            tabindex="-1"
            role="dialog"
            aria-modal="false"
            aria-labelledby="form-confirm-label"
            class="text-center p-3"
          >
            <p><strong class="text-black">確定複製？原先的設定將會遺失</strong></p>
            <div class="d-flex justify-content-end">
              <b-button
                variant="outline-primary"
                class="mr-3"
                @click="cancelClone"
              >
                Cancel
              </b-button>
              <b-button
                variant="outline-danger"
                @click="confirmClone"
              >OK</b-button>
            </div>
          </div>
        </template>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import schedule from "schedule";
import { procedureGroupSelectList, weekSchedulingByMonth, updateWeekScheduling, getVacancyTime, getOptionsPatientSource } from "@/assets/service/dataManager.js";
import controllPanel from "./controllPanel";
import sHeader from "./sHeader";
import sTable from "./sTableLong";
import sVacancy from "./sVacancy";
import BatchModify from "@/library/BatchModify";
import BusFactory from "@/assets/js/busFactory.js";
import Swal from "sweetalert2";
export default {
  data () {
    return {
      isMounted: false,
      procedureGroup: [],
      procedureEvent: {},
      originalItems: [],
      batchModify: new BatchModify(),
      showConfirm: false,
      cloneTargetDateTime: null,
      tableRandomKey: 0,
      vacancy: {
        items: null,
        show: false
      }
    };
  },
  computed: {
    ...mapState(['patientSourceList']),
    chosenRange () {
      return this.isMounted && this.$refs["controllPanel"] ? this.$refs["controllPanel"].chosenDate : { year: null, month: null };
    },
    currentProcedure () {
      return this.isMounted && this.procedureGroup.length > 0 && this.$refs["sheader"] ? this.$refs["sheader"].procedure : "";
    },
  },
  created () {
    procedureGroupSelectList().then(({ Items }) => {
      this.isMounted = false;
      this.procedureGroup = Items.map(({ No, Name }) => ({ text: Name, value: No }));
      this.procedureEvent = Items.reduce((acc, { No }) => ({ ...acc, [No]: {} }), {});
      setTimeout(() => {
        this.isMounted = true;
      }, 200);
    });

    if (this.$store.state.workingSchedule) {
      this.$store.unregisterModule("workingSchedule");
    }

    if (this.patientSourceList.length === 0) {

      getOptionsPatientSource().then(({ actual: { Items } }) => {
        this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })));
      });

    }
  },
  mounted () {
    this.$nextTick(function () {
      document.body.style.overflowY = "hidden";
    });

    this.isMounted = true;
    this.$store.registerModule("workingSchedule", {
      state: {
        fromEvent: "",
        current: { year: "", month: "", week: "" },
        twentyEighteen: "2018-01-", // 儲存的標準時間
        isSpecific: false,
        showDialog: false,
        employee: {
          EmployeeId: "",
          EmployeeName: "",
          MonthDate: "",
          PatientSourceTypeCode: "",
          Rate: 1,
          WorkEndTime: "",
          TagNo: this.currentProcedure,
          WorkTime: "",
          WorkDate: 0,
        },
      },
      mutations: {
        wsSetEmployee (state, employee) {
          // console.log(employee);
          for (const key in employee) {
            state.employee[key] = employee[key];
          }
        },
        wsClearEmployee (state) {
          state.employee = {
            EmployeeId: "",
            EmployeeName: "",
            MonthDate: "",
            PatientSourceTypeCode: "",
            Rate: 1,
            WorkEndTime: "",
            TagNo: this.currentProcedure,
            WorkTime: "",
            WorkDate: 0,
          };
        },
        wsSetCurrent (state, current) {
          Object.keys(current).forEach((k) => {
            if (current[k]) state.current[k] = current[k];
          });
        },
        wsSetFrom (state, key) {
          state.fromEvent = key;
        },
        wsSetSpecificMode (state, isSpecific) {
          state.isSpecific = isSpecific;
        },
        wsSetShowDialog (state, show) {
          state.showDialog = show;
        }
      },
    });
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE', 'SET_PATIENT_SOURCE_LIST']),
    async fetchVacancyEvent () {

      const { year, month } = this.$store.state.workingSchedule.current;
      if (!year || !month) return;
      try {
        const res = await getVacancyTime(year, month, this.currentProcedure);

        this.vacancy.items = res.reduce((acc, cur, idx) =>
          // acc.concat(
          //   cur.reduce((ac2, { PatientSourceTypeCode, TimeRanges }) => ({ ...ac2, [PatientSourceTypeCode]: TimeRanges.map(({ StartTime, EndTime }) => ({ StartTime, EndTime })) }), {}))
          // , []);
          acc.concat(
            cur.TimeRanges.reduce((ac2, { PatientSourceTypeCode, StartTime, EndTime }) => {
              if (!ac2.hasOwnProperty(PatientSourceTypeCode)) {
                ac2[PatientSourceTypeCode] = [{ StartTime, EndTime }];
              } else {
                ac2[PatientSourceTypeCode].push({ StartTime, EndTime });
              }
              return ac2;
            }, {})
          )

          , []);
        this.vacancy.items = [
          ...this.vacancy.items.filter((item, idx) => idx > 0),
          ...this.vacancy.items.filter((item, idx) => idx === 0)
        ]
      } catch (error) {
        this.vacancy.items = [];
      }
    },
    async toggleVacancyEvent () {
      this.vacancy.show = !this.vacancy.show;
    },
    async changeMonth ({ year, month }) {
      this.$store.commit("wsSetCurrent", { year, month });
      const { Items } = await weekSchedulingByMonth(year, month);
      this.originalItems = Items;
      this.fetchFromSpecificData(this.originalItems);
    },
    updateBatchData ({ methods, event }) {
      this.batchModify[methods](event);
    },
    updateScheduling () {
      console.log({batchModify: this.batchModify.modifyData});
      updateWeekScheduling(this.$store.state.workingSchedule.current, this.batchModify.modifyData).then((res) => {
        Swal.fire({
          type: "success",
          title: "儲存成功！"
        });
        this.changeMonth(this.$store.state.workingSchedule.current);
        this.batchModify.reset();
        this.fetchVacancyEvent();
      });
    },
    revertScheduling () {
      this.fetchFromSpecificData(this.originalItems);
      this.batchModify.reset();
    },
    copyScheduling () {
      BusFactory.$emit("callCloneModel");
    },
    fetchFromSpecificData (Items) {
      Object.keys(this.procedureEvent).forEach((key) => {
        this.procedureEvent[key] = Items.filter(({ TagNo, WorkTime }) => TagNo === key && WorkTime.substr(0, 4) === "2018").reduce(
          (acc, { Id, EmployeeId, EmployeeName, WorkEndTime, MonthDate, Rate, TagNo, WorkDate, WorkTime, PatientSourceTypeCode }) => {
            let week = WorkTime.substr(9, 1);
            if (!acc[week]) acc[week] = [];
            if (
              !acc[week].some((old) => old.Id === EmployeeId && old.WorkTime.substr(11) === WorkTime.substr(11) && old.WorkEndTime.substr(11) === WorkEndTime.substr(11))
            ) {
              acc[week].push({
                Id,
                EmployeeId,
                EmployeeName,
                WorkEndTime,
                WorkTime,
                MonthDate,
                Rate,
                TagNo,
                WorkDate,
                PatientSourceTypeCode,
              });
            }
            return acc;
          },
          {}
        );
      });

      this.$nextTick(() => {
        this.$refs.scheduleTable.refreshOrders();
        this.$refs.scheduleTable.refreshToolTip();
      });
    },
    convertTimeZone (key, time, week) {
      let minerTime = parseInt(time.substr(11, 2)) - 8;
      if (minerTime < 0 || (key === "end" && minerTime === 0)) {
        minerTime += 24;
      }
      const { twentyEighteen } = this.$store.state.workingSchedule;
      return `${twentyEighteen}0${week}T${this.$number2Digits(minerTime)}:00:00`;
    },
    cloneSchedule ({ clone }) {
      this.showConfirm = true;
      this.cloneTargetDateTime = clone;
    },
    async confirmClone () {
      const [year, month] = this.cloneTargetDateTime.split("-");
      BusFactory.$emit("changeToMonthEvent", { year, month }); // 更換顯示日期
      const { Items } = await weekSchedulingByMonth(year, month);
      this.batchModify.reset();

      this.originalItems.forEach((item) => {
        if (item.WorkTime.substr(0, 4) === "2018") this.batchModify.insert(item);
      });

      Items.forEach((item) => {
        this.batchModify.delete(item);
      });

      this.fetchFromSpecificData(this.originalItems); // 顯示的資料
      this.originalItems = Items;

      this.cloneTargetDateTime = null;
      this.showConfirm = false;
    },
    cancelClone () {
      this.cloneTargetDateTime = null;
      this.showConfirm = false;
    },
  },
  components: {
    controllPanel,
    sHeader,
    sTable,
    sVacancy
  },
  beforeDestroy () {
    if (this.$store.state.workingSchedule) {
      this.$store.unregisterModule("workingSchedule");
    }
    delete document.body.style.overflowY;
  },
  watch: {
    currentProcedure () {
      if (this.isMounted && !!this.$refs.scheduleTable) {
        this.$nextTick(() => {
          this.$refs.scheduleTable.refreshOrders();
        });
      }

      this.fetchVacancyEvent();
    },
    "$store.state.workingSchedule.current.month" () {
      this.fetchVacancyEvent();
    }
  },
};
</script>

<style lang="scss" scoped>
.schedule-container {
  padding-top: 56px;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
}
.control-section {
  width: 200px;
}
</style>

<style lang="scss">
$colors: #641e16, #78281f, #512e5f, #4a235a, #154360, #1b4f72, #0e6251, #0b5345,
  #145a32, #186a3b, #7d6608, #7e5109, #784212, #6e2c00, #7b7d7d, #626567,
  #4d5656, #424949, #1b2631, #17202a;

@each $color in $colors {
  $idx: index($colors, $color);
  .dtColor-#{$idx} {
    background-color: $color;
  }
}
</style>
