<template>
  <div class="d-flex flex-column">
    <!-- <div
      class="d-grid table-data"
      :style="gridStyle"
    >
      <div class="bg-primary text-white text-center py-1">
        <span v-text="isMonth ? $moment(gridItems[0]).format('YYYY-MM'): '　'"></span>
      </div>
      <div
        v-for="(time,idx) in gridItems"
        class="bg-primary text-white text-center py-1 time-th"
        :key="idx"
        v-text="$moment(time).format(`${isMonth?'':'YYYY-MM-'}DD`)"
      />
    </div> -->
    <div
      class="flex-1 table-outer position-relative"
      ref="tableOuter"
    >
      <div
        class="d-grid table-data position-absolute w-100 table-head"
        :style="gridStyle + ';' + topHeight"
      >

        <div class="bg-success text-white text-center py-1">
          <span v-text="isMonth ? $moment(gridItems[0]).format('YYYY-MM'): '　'"></span>
        </div>
        <div
          v-for="(time,idx) in gridItems"
          class="bg-success text-white text-center py-1 time-th"
          :key="idx"
          v-text="$moment(time).format(`${isMonth?'':'YYYY-MM-'}DD`)"
        />
      </div>

      <div
        class="d-grid table-data"
        :style="gridStyle"
      >

        <!-- <div class="bg-primary text-white text-center py-1">
          <span v-text="isMonth ? $moment(gridItems[0]).format('YYYY-MM'): '　'"></span>
        </div>
        <div
          v-for="(time,idx) in gridItems"
          class="bg-primary text-white text-center py-1 time-th"
          :key="idx"
          v-text="$moment(time).format(`${isMonth?'':'YYYY-MM-'}DD`)"
        /> -->

        <template v-for="(employee, employeeIdx) in employees">
          <div
            :key="'name_' + employee.value"
            class="p-1"
            :class="{'even-row': employeeIdx % 2 }"
          >
            <div
              class="employee-name"
              v-text="employee.text"
            />
            <div
              class="employee-role"
              v-text="employee.value"
            />
          </div>

          <div
            v-for="(time,idx) in gridItems"
            :key="idx + '_' + time +'_'+employee.value"
            @click.stop="holidayClickEvent(time, employee.value)"
            class="p-1 holidays-items"
            :class="{'d-flex align-items-start': !isMonth, 'ismonth' : isMonth, 'even-row': employeeIdx % 2 }"
          >
            <!-- <div v-text="`${employee.value}-${time}`"></div> -->
            <template v-if="holidays.hasOwnProperty(`${employee.value}-${time}`)">
              <div
                v-for="(event,idx) in holidays[`${employee.value}-${time}`]"
                class="bg-primary text-white rounded px-2 position-relative holiday-event"
                :class="{'month-date': isMonth}"
                :key="`${idx}-${employee.value}-${time}`"
              >
                <!-- <div v-text="event" /> .add(8, 'hours').add(8, 'hours')-->
                {{ $moment(event.StartTime).format('HH:mm') }}
                {{ isMonth ? '': '~' }}
                {{ $moment(event.EndTime).format('HH:mm') === '00:00' ? '24:00' : $moment(event.EndTime).format('HH:mm') }}

                <div class="icon-func position-absolute">
                  <div
                    class="rounded-circle modify-icon bg-warning text-black text-center mr-1"
                    @click.stop="modifyEvent(employee.value, event, `${employee.value}-${time}`)"
                  >
                    <font-awesome-icon icon="pen" />
                  </div>

                  <div
                    class="rounded-circle remove-icon bg-warning text-black text-center"
                    @click.stop="removeEvent(employee.value, event, `${employee.value}-${time}`)"
                  >
                    <font-awesome-icon icon="trash-alt" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getEmployeeTypeList, getEmployees, deleteHolidayItem } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
export default {
  data () {
    return {
      PagingCurrentPage: 1,
      PagingRowPerPage: 10,
      headTop: 0
    }
  },
  props: {
    nameWidth: {
      type: Number,
      default: 200
    },
    gridItems: {
      type: Array,
      required: true
    },
    employees: {
      type: Array,
      required: true
    },
    holidays: {
      type: Object,
      default: {} // 'EmployeeId-StartTime': [{EmployeeId, StartTime, EndTime}]
    }
  },
  mounted () {
    this.$refs.tableOuter.addEventListener('scroll', this.handleScroll);
    // this.PagingCurrentPage = this.pagination.current;
    // this.PagingRowPerPage = this.pagination.per;
  },
  computed: {
    gridStyle () {
      const repeatNum = this.gridItems.length;
      return `grid-template-columns: ${this.nameWidth}px repeat(${repeatNum}, 1fr)`;
    },
    isMonth () {
      return this.gridItems.length > 27;
    },
    topHeight () {
      return 'top: ' + this.headTop + 'px';
    }
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    holidayClickEvent (date, id) {
      this.$emit('employeeEvent', { date, id });
    },
    handleScroll (e) {
      this.headTop = e.target.scrollTop;
    },
    modifyEvent (id, event) {
      const date = this.$moment(event.StartTime).format("YYYY-MM-DD");
      const range = { 'start': this.$moment(event.StartTime).format("HH:mm:ss"), 'end': this.$moment(event.EndTime).format("HH") === '00' ? '24:00:00' : this.$moment(event.EndTime).format("HH:mm:ss") };
      this.$emit('employeeEvent', { date, id, range });
    },
    async removeEvent (id, event, key) {
      this.SHOW_LOADING();
      try {
        const res = await deleteHolidayItem(id, this.$moment(event.StartTime).format('YYYYMMDDHHmm'));  // .add(8, "hours")
        this.holidays[key] = this.holidays[key].filter(item => item != event);
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + ', 稍候再試', type: 2 })
      } finally {
        this.HIDE_LOADING();
      }
    }
  },
  beforeDestroy () {
    this.$refs.tableOuter.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixins.scss";

.month-date {
  font-size: 12px;
}

.table-data {
  grid-gap: 1px;
  &.table-head {
    z-index: 200;
  }
}

.darkTheme {
  .holiday {
    .table-data {
      > div {
        background-color: #111;
        &.even-row {
          background-color: #010101;
        }
      }
    }
  }
}
.lightTheme {
  .holiday {
    .table-data {
      > div {
        background-color: #ddd;
        &.even-row {
          background-color: #efefef;
        }
      }
    }
  }
}

.table-outer {
  padding-top: 32px;
  overflow-y: auto;
  @include scroll-style3;
  border-radius: 5px;
  box-shadow: 0 0 10px #666;
}

.employee- {
  &name {
    font-size: 21px;
  }
  &role {
    font-size: 12px;
  }
}
.holidays-items {
  > div {
    margin-bottom: 3px;
    margin-left: 3px;
    &:nth-child(1) {
      margin-left: 0px;
    }
  }
  &.ismonth {
    > div {
      margin-left: 0;
    }
  }
}

.time-th,
.holidays-items {
  min-width: 50px;
}

$iconSize: 25px;

.icon-func {
  right: -13px;
  top: -13px;
  cursor: pointer;
  z-index: 201;
  display: none;
}

.remove-icon,
.modify-icon {
  width: $iconSize;
  height: $iconSize;
  display: flex;
  justify-content: center;
  align-items: center;
}

.holiday-event:hover {
  .icon-func {
    background-color: transparent !important;
    display: flex;
  }
}
</style>

