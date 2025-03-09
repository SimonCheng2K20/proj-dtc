<template>
  <div>
    <!-- :title="pickTime['week'] && pickTime['range'] ? `增加事件 ${pickTime.week.text} (${pickTime.range.join(' ~ ')})`:''" -->
    <b-modal
      ref="eventModel"
      @ok="confirmEvent"
      ok-title="確認"
      cancel-title="取消"
      :no-close-on-backdrop="true"
      :ok-disabled="isValid"
    >
      <template v-slot:modal-title>
        <div class="d-flex justify-content-between align-items-end">
          <div class="mr-3">{{ (methods === "add" ? "增加" : "更新") + "事件" }}</div>
          <b-form-checkbox
            switch
            class="specific-time d-flex align-items-center"
            v-model="isSpecificTime"
            @change="$store.commit('wsSetSpecificMode', !isSpecificTime)"
          >
            選定特定時間
          </b-form-checkbox>
        </div>
      </template>

      <b-input-group
        prepend="值班醫生"
        class="mb-2"
      >
        <b-form-select
          v-model="doctor"
          :options="getScheduleDrs"
        />
      </b-input-group>
      <div
        class="d-grid grid-col-2 mb-2"
        style="grid-gap: 5px;"
      >
        <b-input-group prepend="開始時間">
          <b-form-input
            v-model="workTime"
            type="number"
            step="0.5"
            max="24"
            min="0"
          />
        </b-input-group>

        <b-input-group prepend="結束時間">
          <b-form-input
            v-model="endTime"
            type="number"
            step="0.5"
            max="24"
            min="0"
          />
        </b-input-group>
      </div>

      <b-input-group
        prepend="病患來源"
        class="grid-span-2 d-flex align-items-stretch"
      >
        <treeselect
          id="patientSource"
          class="flex-1"
          v-model="patientSrc"
          :multiple="true"
          :searchable="true"
          :options="patientSrcOptions"
        />
        <b-form-checkbox
          class="ml-2 mt-2"
          v-show="!sourceAll"
          v-model="sourceAll"
        />
      </b-input-group>
      <b-input-group
        prepend="權重"
        class="my-2"
      >
        <b-form-spinbutton
          v-model="rate"
          wrap
          min="1"
          max="10"
          placeholder="--"
        />
      </b-input-group>

      <b-form-datepicker
        v-if="isSpecificTime"
        v-model="specificDate"
        :min="timeRange[0]"
        :max="timeRange[1]"
      />
      <span
        class="bg-danger text-white p-1 rounded specific-time-warning"
        v-show="isSpecificTime"
      >(會依選擇的週次而換位置)</span>
    </b-modal>

    <b-modal
      ref="cloneSchedule"
      title="複製週程表"
      @ok="confirmCloneEvent"
      ok-title="確認"
      cancel-title="取消"
      :ok-disabled="isMonthValid"
    >
      <b-input-group
        prepend="來源月份"
        class="d-flex"
      >
        <input
          class="flex-1 rounded-right"
          type="month"
          v-model="referenceMonth"
          disabled="true"
        />
      </b-input-group>

      <b-input-group
        prepend="覆蓋月份"
        class="d-flex mt-1"
      >
        <input
          class="flex-1"
          type="month"
          v-model="cloneMonth"
        />
      </b-input-group>
    </b-modal>
  </div>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
import { mapGetters } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data () {
    return {
      isMounted: false,
      doctor: null,
      patientSrc: [],
      workTime: "",
      endTime: "",
      rate: null,
      methods: "add",
      busFactory: BusFactory(this),
      referenceMonth: null,
      cloneMonth: null,
      specificDate: null,
      isSpecificTime: false,
      timeRange: [],
    };
  },
  props: {
    patientSource: {
      type: Array,
      default: () => [],
    },
    tag: {
      type: String,
      default: ''
    }
  },
  methods: {
    showModel (key, methods = "add") {
      this.methods = methods;
      this.$refs[key].show();
    },
    hideModel (key) {
      this.$refs[key].hide();
    },
    timeConver2Num(dateTime) {
      const [whole, year, month, date, hour, min, sec] = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
      return parseInt(hour) + parseFloat(min / 60);
    },
    getHourAndMins(num) {
      return {
        hour: Math.floor(num),
        minutes: num % 1 * 60
      }
    },
    confirmEvent () {
      const { text, value } = this.getScheduleDrs.find(({ value }) => this.doctor === value);
      const { week } = this.isSpecificTime ? { week: new Date(this.specificDate).getDay() || 7 } : this.$store.state.workingSchedule.current;
      const { twentyEighteen } = this.$store.state.workingSchedule;


      // const _hour = this.endTime
      const _endTime = this.getHourAndMins(this.endTime);
      const _workTime = this.getHourAndMins(this.workTime);


      this.$store.commit(
        "wsSetEmployee",
        Object.assign(this.$store.state.workingSchedule.employee, {
          EmployeeId: value,
          EmployeeName: text,
          Rate: this.rate,
          WorkEndTime: `${twentyEighteen}0${week}T${this.$number2Digits(_endTime.hour)}:${this.$number2Digits(_endTime.minutes)}:00`,
          PatientSourceTypeCode: this.patientSrc.join(","),
          WorkTime: `${twentyEighteen}0${week}T${this.$number2Digits(_workTime.hour)}:${this.$number2Digits(_workTime.minutes)}:00`,
          WorkDate: this.isSpecificTime ? new Date(this.specificDate).getDate() : "",
        })
      );
      this.$emit("confirmBtn", { key: this.methods });
    },
    confirmCloneEvent () {
      this.$emit("confirmBtn", { key: "clone", value: { reference: this.referenceMonth, clone: this.cloneMonth } });
    },
  },
  created () {
    this.busFactory.$on("callCloneModel", () => {
      const { year, month } = this.$store.state.workingSchedule.current;
      let cYear = year;
      let cMonth = parseInt(month) + 1;
      if (cMonth > 12) {
        cMonth = 1;
        cYear = parseInt(cYear) + 1;
      }
      this.referenceMonth = `${year}-${month}`;
      this.cloneMonth = `${cYear}-${this.$number2Digits(cMonth)}`;
      this.$refs.cloneSchedule.show();
    });
  },
  mounted () {
    this.isMounted = true;
  },
  computed: {
    ...mapGetters(["getScheduleDrs"]),
    addModelState () {
      return this.isMounted ? this.$refs.eventModel.isShow : false;
    },
    isValid () {
      return this.patientSrc.length === 0 || !this.doctor || (this.isSpecificTime && !this.specificDate);
    },
    isMonthValid () {
      return !(this.referenceMonth && this.cloneMonth && this.referenceMonth != this.cloneMonth);
    },
    sourceAll: {
      get () {
        return this.patientSrcOptions.every(({ id }) => this.patientSrc.includes(id));
      },
      set (val) {
        if (val) {
          // return this.patientSource
          this.patientSrc = this.patientSrcOptions.map(({ id }) => id);
        }
      }
    },
    patientSrcOptions () {
      return this.tag === 'PhysicalExam'
        ? this.patientSource.filter(({ value }) => value === 'G').map(({ text, value }) => ({ id: value, label: text }))
        : this.tag === 'CR'
          ? this.patientSource.filter(({ value }) => value !== 'G').map(({ text, value }) => ({ id: value, label: text }))
          : this.patientSource.map(({ text, value }) => ({ id: value, label: text }))
    }
  },
  components: {
    Treeselect,
  },
  watch: {
    addModelState (val) {
      if (!val && this.isMounted) this.$emit("closeModal", "add"); // 關掉modal事件
      if (val && this.isMounted) {
        // 開啟modal事件
        const { year, month } = this.$store.state.workingSchedule.current;
        this.timeRange = [new Date(year, parseInt(month) - 1, 1), new Date(year, parseInt(month), 0)];

        if (this.$store.state.workingSchedule && this.$store.state.workingSchedule.employee) {
          const { EmployeeId, WorkTime, WorkEndTime, Rate, PatientSourceTypeCode, WorkDate } = this.$store.state.workingSchedule.employee;
          this.doctor = EmployeeId;
          this.workTime = this.timeConver2Num(WorkTime);
          this.endTime = this.timeConver2Num(WorkEndTime);
          this.rate = Rate;
          this.patientSrc = PatientSourceTypeCode
            ? PatientSourceTypeCode.split(",").filter((v) => v)
            : this.patientSrcOptions.map(({ id }) => id);
          if (WorkDate) {
            this.specificDate = `${year}-${month}-${this.$number2Digits(WorkDate)}`;
            this.isSpecificTime = true;
          } else {
            this.specificDate = null;
            this.isSpecificTime = false;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.specific-time,
.specific-time-warning {
  font-size: 12px;
}
</style>
