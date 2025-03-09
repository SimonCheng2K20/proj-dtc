<template>
  <div class="holiday px-2 pb-2 d-flex flex-column">
    <controlPanel
      :dateTime="dateTime"
      :treeWidth="leftWidth * 2"
    />
    <employeeTable
      class="flex-1"
      :gridItems="gridItems"
      :employees="getScheduleDrs"
      :holidays="existHolidays"
      :rowNumber="employeeRowNumber"
      @employeeEvent="askingHolidayEvent"
    />

    <b-modal
      @ok="confirmAskingHoliday"
      id="holidayPanel"
      ref="holidayPanel"
      :title="(dateInfo.removeId ? '修改':'新增') + '請假事件'"
      v-model="holidayEventDialog"
    >
      <div>
        <b-input-group prepend="日期">
          <b-form-datepicker
            id="holiday-datepicker"
            v-model="dateInfo.date"
          ></b-form-datepicker>
        </b-input-group>

        <div
          class="d-grid grid-col-2 mt-2"
          style="grid-gap: 2px;"
        >

          <pickingTime
            label="開始時間"
            :time.sync="dateInfo.start"
          />

          <pickingTime
            label="結束時間"
            :time.sync="dateInfo.end"
          />

        </div>
      </div>
    </b-modal>

  </div>
</template>

<script>
import controlPanel from "./controlPanel.vue";
import employeeTable from "./employeeTable.vue";
import { getEmployees, getScheduleDoctors, deleteHolidayItem, postHolidayItem, putHolidayItem, getHolidayItems } from "@/assets/service/dataManager.js";
import { mapMutations, mapGetters } from "vuex";
import pickingTime from "./pickingTime.vue";
export default {
  data () {
    return {
      dateTime: {
        type: 'week',
        position: 0 // 日，週 可用
      },
      leftWidth: 200,
      employeeCondition: [],
      employees: [],
      employeeRowNumber: 0,
      holidayEventDialog: false,
      defaultTime: { start: '08:00:00', end: '18:00:00' },
      dateInfo: {
        date: null,
        start: '',
        end: '',
        removeId: '',
      },
      existHolidays: {}
    }
  },
  computed: {
    ...mapGetters(["getScheduleDrs"]),
    gridItems () {
      return this.dateTime.type === 'week'
        ? this.getWholeWeekDays(this.dateTime.position)
        : this.dateTime.type === 'month'
          ? this.getMonthDays(this.dateTime.position)
          : this.dateTime.type === 'day'
            ? this.getSpecificDay(this.dateTime.position)
            : [];
    }

  },
  created () {
    ['start', 'end'].forEach(k => {
      this.dateInfo[k] = this.defaultTime[k];
    });
    this.getDoctorList();
    this.getWholeHolidays();
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE', 'SET_SCHEDULE_DR']),
    async getWholeHolidays () {
      const { Items } = await getHolidayItems();

      this.existHolidays = Items.reduce((acc, { EmployeeId, StartTime, EndTime }) => {
        const key = `${EmployeeId}-${this.$moment(StartTime).format("YYYY-MM-DD")}`;
        if (acc.hasOwnProperty(key)) {
          acc[key].push({ EmployeeId, StartTime, EndTime })
        } else {
          acc[key] = [{ EmployeeId, StartTime, EndTime }];
        }
        return acc;
      }, {})
    },
    finishStartEvent () {
      if (this.dateInfo.start >= this.dateInfo.end) {
        this.$nextTick(() => {
          this.dateInfo.start = this.$number2Digits(parseInt(this.dateInfo.end.substr(0, 2)) - 1) + this.dateInfo.end.slice(-6);
        });
      }
    },
    finishEndEvent () {
      if (this.dateInfo.start >= this.dateInfo.end) {
        this.$nextTick(() => {
          this.dateInfo.end = this.$number2Digits(parseInt(this.dateInfo.start.substr(0, 2)) + 1) + this.dateInfo.start.slice(-6);
        });
      }
    },
    askingHolidayEvent ({ date, id, range = null }) {
      this.holidayEventDialog = true;
      if (range) {
        Object.keys(range).forEach(k => {
          this.dateInfo[k] = range[k];
        });
        this.dateInfo.removeId = id + ',' + this.$moment(date + ' ' + range.start).format('YYYYMMDDHHmm');
      } else {
        ['start', 'end'].forEach(k => {
          this.dateInfo[k] = this.defaultTime[k];
        });
        this.dateInfo.removeId = '';
      }
      this.dateInfo.date = date;
      this.dateInfo.id = id;
    },
    async confirmAskingHoliday () {
      const { id, date, start, end } = this.dateInfo;
      if (start > end) return;

      const combineDate = (time) => {  // this.$moment().toJSON();

        const _date = time.substr(0, 2) !== '24'
          ? date
          : this.$moment(date).add(1, 'day').format('YYYY-MM-DD');

        const _time = time.substr(0, 2) !== '24'
          ? time
          : '00:00:00';
        return `${_date}T${_time}`;
      }
      this.SHOW_LOADING();
      try {
        if (this.dateInfo.removeId) {
          const [id, time] = this.dateInfo.removeId.split(',');
          const year = time.substr(0, 4);
          const month = time.substr(4, 2);
          const day = time.substr(6, 2);
          const hour = time.substr(8, 2);
          const mins = time.substr(10, 2);
          await deleteHolidayItem(id, time);  // 移除舊的日期
          this.existHolidays[`${id}-${year}-${month}-${day}`] = this.existHolidays[`${id}-${year}-${month}-${day}`].filter(({ StartTime }) => StartTime != `${year}-${month}-${day}T${hour}:${mins}:00`);
          this.dateInfo.removeId = '';
        }
        const res = await postHolidayItem(id, combineDate(start), combineDate(end));  // 新增日期
        this.getWholeHolidays();
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + ', 稍候再試', type: 2 })
      } finally {
        this.HIDE_LOADING();
      }
    },
    getSpecificDay (position) {
      return [(position === 0
        ? this.$moment()
        : position > 0
          ? this.$moment().add(position, 'day')
          : this.$moment().subtract(Math.abs(position), 'day')).format('YYYY-MM-DD')];
    },
    getWholeWeekDays (position) {
      const baseMoment = this.$moment(Date.now() + (position * 1000 * 60 * 60 * 24 * 7));
      const weekOfDay = baseMoment.format('E');
      const monday = baseMoment.subtract(weekOfDay - 1, 'day');
      return new Array(7).fill('').map((v, i) => (i === 0 ? monday : monday.add(1, 'day')).format('YYYY-MM-DD'));
    },
    getMonthDays (position) {
      const base = position === 0
        ? this.$moment()
        : position > 0
          ? this.$moment().add(position, 'month')
          : this.$moment().subtract(Math.abs(position), 'month')
      return new Array(
        new Date(base.format('YYYY'), parseInt(base.format('MM')), 0).getDate()
      ).fill('').map((v, i) => this.$moment(`${base.format('YYYY-MM')}-${i + 1}`).format('YYYY-MM-DD'));
    },
    async getDoctorList () {
      if (this.getScheduleDrs.length === 0) {
        const {
          actual: { Items },
        } = await getScheduleDoctors();
        this.SET_SCHEDULE_DR(Items);
      }
    },
  },
  watch: {
    "dateTime.type" () {
      this.dateTime.position = 0;
    }
  },
  components: {
    controlPanel, employeeTable, pickingTime
  }
}
</script>

<style lang="scss" scoped>
.holiday {
  // background-color: #ccc;
  padding-top: 56px;
  height: 100vh;
}
</style>
