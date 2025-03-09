<template>
  <div>
    <div class="d-flex align-items-end mb-2">
      <div>
        <h5 class="mb-0 text-bold">排班週程表</h5>
        <div class="d-flex range-controller align-items-center">
          <b-form-select
            style="width: 300px;"
            v-model="procedure"
            size="sm"
            :options="procedureGroup"
          />
          <b-button
            variant="primary"
            class="ml-2"
            @click.stop="$emit('readVacancyData')"
            size="sm"
          >未排時間</b-button>
        </div>
      </div>
      <div class="flex-1 d-flex justify-content-end align-items-center">
        <div
          v-if="Object.values(chosenRange).every((v) => v)"
          @click.stop="changeMonth('prev')"
          class="bg-primary text-white rounded text-center mr-2 px-1 cursor-pointer"
        >
          <font-awesome-icon icon="arrow-left" />
        </div>
        <div v-text="chosenMonth" />
        <input
          type="month"
          v-model="rangeTime"
          @change="changeMonth('specfic')"
        />

        <div
          v-if="Object.values(chosenRange).every((v) => v)"
          @click.stop="changeMonth('next')"
          class="bg-primary text-white rounded text-center ml-2 px-1 cursor-pointer"
        >
          <font-awesome-icon icon="arrow-right" />
        </div>
      </div>
    </div>

    <div class="schedule-line"></div>
  </div>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
export default {
  data () {
    return {
      procedure: null,
      chosenMonth: null,
    };
  },
  props: {
    chosenRange: {
      type: Object,
    },
    procedureGroup: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    rangeTime: {
      get () {
        return `${this.chosenRange["year"]}-${this.chosenRange["month"]}`;
      },
      set (val) {
        const [year, month] = val.split("-");
        this.chosenRange["year"] = year;
        this.chosenRange["month"] = month;
      },
    },
  },
  methods: {
    changeMonth (method) {
      if (method === "prev" || method === "next") {
        const currentMonth = new Date(this.rangeTime);
        currentMonth.setMonth(currentMonth.getMonth() + (method === "prev" ? -1 : 1));
        this.rangeTime = this.$moment(currentMonth).format("YYYY-MM");
      }

      BusFactory.$emit("changeMonthEvent", { method, time: this.rangeTime });
    }
  },
  mounted () {
    if (this.procedureGroup.length > 0) this.procedure = this.procedureGroup[0].value;
  },
};
</script>

<style>
.schedule-line {
  height: 1px;
  background-color: #888;
}
</style>
