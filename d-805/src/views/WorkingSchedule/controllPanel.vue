<template>
  <div class="h-100 d-flex flex-column align-items-stretch">
    <b-card
      no-body
      class="mb-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-success text-white cardHeader">
        排班日期
      </b-card-header>
      <b-card-text class="text-left p-1">
        <b-input-group
          prepend="選擇年份"
          class="mb-1"
        >
          <b-form-select
            v-model="chosenDate.year"
            :options="yearOptions"
            @change="setDateEvent"
          />
        </b-input-group>

        <b-input-group prepend="選擇月份">
          <b-form-select
            v-model="chosenDate.month"
            :options="monthOptions"
            @change="setDateEvent"
          />
        </b-input-group>

        <div class="mt-1 d-flex justify-content-start">
          <b-btn
            variant="primary"
            size="sm"
            @click="$emit('saveScheduling')"
          >保存</b-btn>
          <b-btn
            class="mx-1"
            variant="success"
            size="sm"
            @click="$emit('resetScheduling')"
          >還原</b-btn>
          <b-btn
            variant="success"
            size="sm"
            :disabled="isModify"
            @click="$emit('cloneScheduling')"
          >複製</b-btn>
        </div>
        <!-- <div>
          <b-form-checkbox
            switch
            class="specific-time"
            v-model="specificTime"
            @change="$store.commit('wsSetSpecificMode', !specificTime)"
          >
            特定時間
          </b-form-checkbox>
        </div> -->
      </b-card-text>
    </b-card>

    <b-card
      no-body
      class="flex-1 d-flex flex-column"
      bg-variant="transparent"
    >
      <b-card-header class="bg-secondary text-white cardHeader">
        選擇值班醫師
      </b-card-header>

      <b-card-text class="text-left py-1 dx-doctor-list flex-1">
        <div
          v-for="(dr,idx) in getScheduleDrs"
          :key="dr.value"
          class="border-bottom py-0"
        >
          <div
            class="d-flex doctor align-items-center p-2"
            draggable="true"
            @dragstart="(event) => onDragStart(event, dr)"
            @dragend="onDragEnd"
          >
            <span v-text="dr.text" />
            <span
              class="text-white px-2 rounded ml-2 flex-1"
              :class="`dtColor-${(idx+1) % 20 + 1}`"
              style="height: 10px;"
            />

          </div>
        </div>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
import { getScheduleDoctors } from "@/assets/service/dataManager.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  data () {
    return {
      yearOptions: [],
      monthOptions: [],
      chosenDate: {
        year: this.$moment().format("YYYY"), // '2018'
        month: this.$moment().format("MM"), // '01'
      },
      busFactory: BusFactory(this),
      changeTimer: null,
    };
  },
  props: {
    isModify: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["getScheduleDrs"]),
  },
  created () {
    this.getDoctorList();
    const startYear = parseInt(this.$moment().format("YYYY")) - 10;
    this.yearOptions = new Array(31).fill("").map((k, i) => ({ text: startYear + i, value: startYear + i }));
    this.monthOptions = new Array(12).fill("").map((k, i) => ({ text: this.$number2Digits(1 + i), value: this.$number2Digits(1 + i) }));
    this.setDateEvent();
    this.busFactory.$on("changeMonthEvent", ({ method, time }) => {
      const [year, month] = time.split("-");
      this.chosenDate.year = year;
      this.chosenDate.month = month;

      this.setDateEvent();
    });

    this.busFactory.$on("changeToMonthEvent", ({ year, month }) => {
      this.chosenDate.year = year;
      this.chosenDate.month = month;
      this.$store.commit("wsSetCurrent", { year, month });
      // this.setDateEvent();
    });
  },
  methods: {
    ...mapMutations(["SET_SCHEDULE_DR", "SHOW_LOADING", "HIDE_LOADING"]),
    async getDoctorList () {
      if (this.getScheduleDrs.length === 0) {
        const {
          actual: { Items },
        } = await getScheduleDoctors();
        this.SET_SCHEDULE_DR(Items);
      }
    },
    onDragStart (evt, dr) {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.target.style.opacity = 1;
      evt.target.style.backgroundColor = "var(--primary)";
      evt.target.style.color = "#fff";
      // evt.dataTransfer.setData('doctor', dr);
      this.$store.commit("wsSetFrom", null);
      this.$store.commit("wsSetEmployee", {
        EmployeeId: dr.value,
        EmployeeName: dr.text,
        MonthDate: "",
        Rate: 1,
        WorkEndTime: "",
        WorkTime: "",
        WorkDate: 0,
      });
    },
    onDragEnd (evt) {
      evt.target.style.backgroundColor = "unset";
      evt.target.style.color = "unset";
    },
    setDateEvent () {
      if (this.changeTimer) {
        clearTimeout(this.changeTimer);
      }
      this.SHOW_LOADING();
      this.changeTimer = setTimeout(() => {
        this.$emit("changeMonth", { ...this.chosenDate });
        this.HIDE_LOADING();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";
.dx-doctor-list {
  @include scroll-style2;
  height: 100%;
  overflow: auto;
  .doctor {
    cursor: move;
    &:hover {
      background-color: var(--primary);
      color: #fff;
    }
  }
}
.range-controller {
  font-size: 12px;
}
div.lightTheme .specific-time /deep/ label.custom-control-label,
div.darkTheme .specific-time /deep/ label.custom-control-label {
  color: inherit !important;
}
</style>
