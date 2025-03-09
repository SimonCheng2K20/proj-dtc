<template>
  <div
    class="d-grid grid-col-8 vacancy-table"
    style="grid-gap: 1px;"
  >
    <div
      v-if="items.length > 0"
      class="text-center py-2 bg-primary text-white"
    >病患來源</div>
    <div
      class="week text-center py-2 bg-primary text-white"
      v-for="(day,weekIdx) in items"
      :key="weekIdx"
      v-text="weekData[weekIdx]"
    />
    <template v-for="(patient,pidx) in patientSourceList.filter(p=>p.value!=='U')">
      <div
        v-if="items.length > 0"
        class="text-center py-2 border-left border-bottom"
        :class="{'odd-row': pidx % 2 ===0}"
        v-text="patient.text"
        :key="patient.value + 'name'"
      />
      <div
        v-for="(day,idx) in weeksDay"
        class="week text-center pb-1 border-left border-bottom"
        :class="{'border-right': idx===6, 'odd-row': pidx % 2 ===0}"
        :key="patient.value + day"
      >
        <b-btn
          class="ml-1 mt-1"
          size="sm"
          :variant="idx%2===0 ?'warning':'success'"
          @click.stop="addEvent(idx, item)"
          v-for="(item,bIdx) in items[idx][patient.value]"
          :key="bIdx+'_'+idx"
          v-text="`${item.StartTime}~${item.EndTime}`"
        />
      </div>
    </template>

    <div
      class="text-center grid-span-8 py-2"
      v-if="items.length === 0"
    > 暫無資料 </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data () {
    return {
      weekData: {
        0: '週一',
        1: '週二',
        2: '週三',
        3: '週四',
        4: '週五',
        5: '週六',
        6: '週日',
      }
    };
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },

  methods: {
    addEvent (week, item) {
      // 直接點擊時間
      week += 1;
      const { twentyEighteen } = this.$store.state.workingSchedule;
      this.$store.commit("wsSetCurrent", { week });
      this.$store.commit("wsSetEmployee", {
        WorkTime: `${twentyEighteen}0${week}T${this.$number2Digits(item.StartTime)}:00:00`,
        WorkEndTime: `${twentyEighteen}0${week}T${this.$number2Digits(item.EndTime)}:00:00`,
      });

      // this.$refs.models.showModel("eventModel");
      this.$store.commit("wsSetShowDialog", true);
      setTimeout(() => {
        this.$store.commit("wsSetShowDialog", false);
      }, 2500);
    },
  },
  mounted () {

  },
  computed: {
    ...mapState(['patientSourceList']),
    weeksDay () {
      return Object.keys(this.items).map(key => this.weekData[key]);
    }
  }
};
</script>

<style>
.vacancy-table {
  max-height: 50vh;
  overflow-y: auto;
  grid-template-columns: 70px repeat(7, 1fr);
}
.odd-row {
  background-color: rgba(255, 255, 255, 0.1);
}
.lightTheme .odd-row {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
