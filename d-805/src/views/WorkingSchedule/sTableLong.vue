<template>
  <div
    class="d-flex flex-column w-100"
    style="overflow-x: auto;"
  >
    <div class="d-grid rounded-top schTable weeks">
      <div
        class="week-day py-2 text-white text-center"
        v-for="({ text, value }, idx) in [{ text: '小時', value: '' }].concat(weeks)"
        :key="value"
        :style="`width: ${Math.max(eventboxWdts[idx - 1], 128)}px;`"
        v-text="text"
      />
    </div>

    <div
      ref="scheduleTable"
      class="d-grid rounded-bottom schTable days flex-1"
      :style="{minWidth: wholeBoxWdt}"
    >
      <div
        ref="timeScale"
        class="time-scale"
      >
        <div
          v-for="time in 24"
          :key="'d_' + time"
          class="p-2 hours-format d-flex flex-column justify-content-between align-items-end"
          :class="{
            'even-row': time % 2 === 0,
            gap: time % 6 == 0,
            dawn: time <= 6,
            morning: time > 6 && time <= 12,
            afternoon: time > 12 && time <= 18,
            night: time > 18 && time <= 24,
          }"
        >
          <div
            class="p-1 mb-1"
            v-text="`${$number2Digits(time - 1)}:00:00`"
          />
          <!-- <div>to</div> -->
          <div
            class="p-1 mt-1 text-right"
            v-text="`${$number2Digits(time - 1)}:59:59`"
          />
        </div>
      </div>

      <div
        v-for="week in weeks.length"
        :key="`${week}-${events[week] ? events[week].length : 0}`"
        :class="{ 'even-column': week % 2 === 0 }"
        class="eventBox"
        @click.stop="(e) => addEventByTime(e, week)"
        @drop="(e) => dropEvent(e, { week })"
        @dragover.prevent
        @dragenter.prevent
      >
        <scheduleEvents
          ref="scheduleEvts"
          v-if="events[week]"
          :items="events[week]"
          :eventKey="week"
          :weekName="weeks[week - 1].text"
          :timeScaleHgt="76"
          @removeEvt="removeEvt"
          @callEditPanel="$refs.models.showModel('eventModel', 'update')"
        />
        <div
          v-else
          class="eventBoxInner h-100 d-grid grid-row-24"
        />
      </div>
    </div>

    <models
      ref="models"
      :patientSource="patientSource"
      :tag="tag"
      @closeModal="closeModal"
      @confirmBtn="confirmEvents"
    />
  </div>
</template>

<script>
import models from "./models";
import scheduleEvents from "./sEvents";
import MouseTip from "@/assets/MouseTip.js";
import { getOptionsPatientSource } from "@/assets/service/dataManager.js";
function throttle (fn, waiting = 500) {
  var time = Date.now();
  return function () {
    if (time + waiting - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

export default {
  data () {
    return {
      weeks: ["一", "二", "三", "四", "五", "六", "日"].map((w, i) => ({ text: `週${w}`, value: i + 1 })),
      isMounted: false,
      patientSource: [],
      batchModify: null,
      // events: {}
    };
  },
  props: {
    events: {
      type: Object,
      default: () => ({}),
    },
    tag: {
      type: String,
      default: "",
    },
  },
  created () {
    getOptionsPatientSource().then(({ actual: { Items } }) => {
      this.patientSource = Items.map(({ Name, No }) => ({ text: Name, value: No }));
    });
  },
  mounted () {
    // this.refreshToolTip();
    this.isMounted = true;
    this.$refs.scheduleTable.addEventListener(
      "scroll",
      throttle(() => this.calcuateEvents(event))
    );
  },
  methods: {
    addEventByTime (event, week) {
      // 直接點擊時間
      if (event.target.className.includes("eventBox")) {
        const { offsetHeight: _hgt } = this.$refs["timeScale"];
        const time = Math.floor(event.offsetY / (_hgt / 24));
        // const { year, month } = this.$store.state.workingSchedule.current;
        const { twentyEighteen } = this.$store.state.workingSchedule;
        this.$store.commit("wsSetCurrent", { week });
        this.$store.commit("wsSetEmployee", {
          WorkTime: `${twentyEighteen}0${week}T${this.$number2Digits(time)}:00:00`,
          WorkEndTime: `${twentyEighteen}0${week}T${this.$number2Digits(time + 1)}:00:00`,
        });
        this.$refs.models.showModel("eventModel");
      }
    },
    dropEvent (event, eventTime) {
      // drop觸發事件
      this.$store.commit("wsSetCurrent", eventTime);
      const {
        fromEvent,
        employee,
        current: { year, month },
        twentyEighteen,
      } = this.$store.state.workingSchedule;
      let time, time2;
      const getExistPosition = function (target) {
        return (target.getAttribute('mousetip-msg').replace(/\s/g, '').split('<br/>')).filter(str => str.includes('開始') || str.includes('結束')).map(str => parseFloat(str.split(':')[1]));
      }
      const _classList = Array.from(event.target.classList);
      if (_classList.some(k => k === 'eventBoxInner' || k === 'eventBox')) {
        const { offsetHeight: _hgt } = this.$refs["timeScale"];

        // console.log(event.offsetY, (_hgt / 48));
        time = Math.floor(event.offsetY / (_hgt / 48)) / 2;
        time2 = !fromEvent ? time + 1 : Math.min(time + this.timeConver2Num(employee.WorkEndTime) - this.timeConver2Num(employee.WorkTime));

        if(time2 > 24) {
          const rest = time2 - 24;
          time2 = 24;
          time -= rest;
          if(time < 0) time = 0;
        }

      } else if (_classList.some(k => k === 'doctorName' || k === 'doctorInfo')) {
        const _parent = event.target.closest(".doctorFrame");
        [time, time2] = getExistPosition(_parent);
      } else {
        [time, time2] = getExistPosition(event.target);
      }

      const _t1Obj = this.getHourAndMins(time);
      const _t2Obj = this.getHourAndMins(time2);

      this.$store.commit("wsSetEmployee", {
        ...employee,
        WorkTime: `${twentyEighteen}0${eventTime.week}T${this.$number2Digits(_t1Obj.hour)}:${this.$number2Digits(_t1Obj.minutes)}:00`,
        EndTime: `${twentyEighteen}0${eventTime.week}T${this.$number2Digits(_t2Obj.hour)}:${this.$number2Digits(_t2Obj.minutes)}:00`,
        WorkEndTime: `${twentyEighteen}0${eventTime.week}T${this.$number2Digits(_t2Obj.hour)}:${this.$number2Digits(_t2Obj.minutes)}:00`,
        MonthDate: `${year}-${month}-01T00:00:00`,
      });
      if (fromEvent) {
        //搬移醫師
        if (fromEvent !== eventTime.week) this.events[fromEvent] = this.events[fromEvent].filter(({ Id }) => Id !== employee.Id);
        this.confirmEvents({ key: fromEvent === eventTime.week ? "update" : "add" });
      } else {
        this.$refs.models.showModel("eventModel");
      }
    },
    collectEventSrc ({ week, range }) {
      return { range, week: this.weeks.find(({ value }) => value === week) };
    },
    allowDrop (e) {
      // hover事件 用不到
      // console.log(e);
    },

    closeModal (key) {
      // 關閉models事件 用key區別
      if (key === "add") {
        setTimeout(() => {
          this.$store.commit("wsClearEmployee");
          this.$store.commit("wsSetFrom", null);
        }, 200);
      }
    },
    confirmEvents ({ key, value }) {
      // models點擊confirm事件 用key區別
      if (key === "add" || key === "update") {
        const { employee, current } = this.$store.state.workingSchedule;
        const newWeek = parseFloat(employee.WorkTime.substr(8, 2));
        const _events = { ...this.events };
        // const { week } = this.$store.state.workingSchedule.current;
        // if (_events[week] && _events[week].length > 0) {
        //   const oldDataIdx = _events[week].findIndex((evt) => evt.EmployeeId === employee.EmployeeId);
        //   if (oldDataIdx >= 0) {
        //     _events[week].splice(oldDataIdx, 1);
        //   }
        // }
        employee.TagNo = this.tag;
        this.isMounted = false;
        if (!_events[newWeek]) {
          _events[newWeek] = [];
        }
        // console.log(employee);
        if (key === "add" || employee.WorkDate) {
          _events[newWeek].push(employee);
          if (employee.WorkDate && key !== "add") {
            _events[current.week] = _events[current.week].filter(({ Id }) => Id !== employee.Id);
          }
        } else {
          const existEvent = _events[newWeek].find(({ Id }) => Id === employee.Id);
          Object.keys(existEvent).forEach((k) => (existEvent[k] = employee[k]));
        }

        this.arrangeOrder(_events, newWeek);
        this.refreshToolTip();
        this.$nextTick(() => {
          this.$store.commit("wsSetFrom", null);
          this.$store.commit("wsClearEmployee");
          this.isMounted = true;
        });
        this.$emit("updateEvents", {
          event: employee,
          methods: key === "add" ? "insert" : "update",
        });
      } else if (key === "clone") {
        this.$emit("cloneSchedule", value);
      }
    },
    getHourAndMins(num) {
      return {
        hour: Math.floor(num),
        minutes: num % 1 * 60
      }
    },
    timeConver2Num(dateTime) {
      const [whole, year, month, date, hour, min, sec] = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
      return parseInt(hour) + parseFloat(min / 60);
    },
    arrangeOrder (_events, week) {
      // 排序事件
      this.isMounted = false;
      if (_events[week].length > 1) {
        _events[week] = _events[week].reduce((acc, cur) => {
          if (
            // item.WorkEndTime >= cur.WorkTime &&
            //     cur.WorkEndTime >= cur.WorkTime &&
            // parseFloat(item.WorkEndTime.substr(11, 2)) >= parseFloat(cur.WorkTime.substr(11, 2)) &&
            //     parseFloat(cur.WorkEndTime.substr(11, 2)) >= parseFloat(item.WorkTime.substr(11, 2)) &&
            // // ((item.WorkDate || cur.WorkDate) && item.WorkDate === cur.WorkDate)
            !acc.some((item) => {
              if (
                parseFloat(item.WorkEndTime.substr(11, 2)) >= parseFloat(cur.WorkTime.substr(11, 2)) &&
                parseFloat(cur.WorkEndTime.substr(11, 2)) >= parseFloat(item.WorkTime.substr(11, 2)) &&
                item.PatientSourceTypeCode === cur.PatientSourceTypeCode &&
                item.EmployeeName === cur.EmployeeName &&
                item.WorkDate === cur.WorkDate
              ) {
                const max = Math.max(...[item.WorkEndTime, cur.WorkEndTime].map((dt) => parseFloat(dt.substr(11, 2))));
                const min = Math.min(...[item.WorkTime, cur.WorkTime].map((dt) => parseFloat(dt.substr(11, 2))));
                const { twentyEighteen } = this.$store.state.workingSchedule;
                item.WorkTime = `${twentyEighteen}0${week}T${this.$number2Digits(min)}:00:00`;
                item.WorkEndTime = `${twentyEighteen}0${week}T${this.$number2Digits(max)}:00:00`;
                if (cur.Id > 0) {
                  this.$emit("updateEvents", {      // 加入移除資料
                    event: cur,
                    methods: "delete",
                  });
                }
                this.$emit("updateEvents", {      // 加入移除資料
                  event: item,
                  methods: "update",
                });
                return true;
              } else {
                return false;
              }
            })
          ) {
            acc.push(cur);
          }
          return acc;
        }, []);
        // item.WorkDate
        _events[week].sort((e1, e2) => (parseFloat(e1.WorkTime.substr(11, 2)) >= parseFloat(e2.WorkTime.substr(11, 2)) ? 1 : -1));
        _events[week].sort((e1, e2) => (!e1.WorkDate || e1.WorkDate < e2.WorkDate) ? -1 : 1);
      }
      const _evtGroup = [];
      _events[week].forEach((et) => {

        if (et.WorkEndTime.substr(11, 2) === '00') {   // 時間為隔天硬轉成24:00:00
          et.WorkEndTime = et.WorkTime.substr(0, 11) + '24:00:00';
        }

        if (_evtGroup.length > 0) {
          let flag = _evtGroup.some((evts) => {
            let allRange = new Array(48).fill(0).map((k, i) => i);
            evts.forEach(({ WorkTime, WorkEndTime }) => {
              const start = this.timeConver2Num(WorkTime) * 2;
              const end = this.timeConver2Num(WorkEndTime) * 2;
              const occu = new Array(end - start).fill(start).map((v, i) => v + i);
              occu.forEach((oc) => {
                allRange = allRange.filter((v) => v !== oc);
              });
            });
            const etStart = this.timeConver2Num(et.WorkTime) * 2; // 已佔據的事件
            const etEnd = this.timeConver2Num(et.WorkEndTime) * 2;
            const etOccu = new Array(etEnd - etStart).fill(etStart).map((v, i) => v + i); // 佔據的時數
            if (etOccu.every((num) => allRange.includes(num))) {
              evts.push(et);
              return true;
            } else {
              return false;
            }
          });
          if (!flag) {
            _evtGroup.push([et]);
          }
        } else {
          _evtGroup.push([et]);
        }
      });

      _events[week] = _evtGroup
        .map((evts, idx) => {
          evts.forEach((evt) => {
            evt["row"] = (week * 5 + idx) % 20;
          });
          return evts.sort((e1, e2) => {
            const time1 = parseFloat(e1.WorkTime.substr(11, 2));
            const time2 = parseFloat(e2.WorkTime.substr(11, 2));
            return time1 >= time2 ? 1 : -1;
          });
        })
        .flat();

      this.$emit("update:events", _events);
      // this.isMounted = true;
      this.$nextTick(() => {
        this.isMounted = true;
      });
    },
    refreshOrders () {
      Object.keys(this.events).forEach((k) => {
        this.arrangeOrder(this.events, k);
      });
    },
    refreshToolTip () {
      if (this.mouseTip) {
        this.mouseTip.stop();
        this.mouseTip = null;
      }
      setTimeout(() => {
        this.mouseTip = new MouseTip();
        this.mouseTip.start();
      }, 500);
    },
    removeEvt ({ week, removeItem }) {
      this.events[week] = this.events[week].filter((unit) => unit !== removeItem);
      this.isMounted = false;
      this.refreshToolTip();
      this.$emit("updateEvents", {
        event: removeItem,
        methods: "delete",
      });
      this.$nextTick(() => {
        this.isMounted = true;
      });
    },
    calcuateEvents (event) {
      if (this.$refs.scheduleEvts) {
        setTimeout(() => this.$refs.scheduleEvts.forEach((evts) => evts.setTopMargin(event.target.scrollTop)), 500);
      }
    },
  },
  components: { models, scheduleEvents },
  computed: {
    eventboxWdts () {
      return this.isMounted
        ? [].map.call(document.querySelectorAll(".eventBox"), (el) => el.clientWidth)
        : [];
    },
    wholeBoxWdt () {
      return this.isMounted
        ? [].reduce.call(document.querySelectorAll(".eventBox"), (acc, el) => acc + el.clientWidth, 75) + 'px'
        : '1000px';
    }
  },
  beforeDestroy () {
    // this.$refs.scheduleTable.removeEventLister("scroll", throttle(() => {
    //   console.log("TEST");
    // }));
  },
  watch: {
    "$store.state.workingSchedule.showDialog" (val) {
      if (val) {
        this.$refs.models.showModel("eventModel");
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/mixins.scss";

$colorLength: 2px;
.schTable {
  min-width: 1280px;
  grid-template-rows: max-content;
  grid-gap: 1px;
  grid-template-columns: 70px repeat(7, 1fr);
  .gap {
    padding-bottom: 10px + $colorLength;
    position: relative;
    &::after {
      position: absolute;
      left: 1px;
      bottom: 0;
      height: $colorLength;
      width: 100%;
      content: "";
    }
  }
  .dawn {
    background-color: #f1f100;
  }
  &.days {
    @include scroll-style3;
    overflow-x: hidden;
  }
  .hours-format {
    font-size: 12px;
    position: relative;
    user-select: none;
    &::before {
      content: "";
      width: $colorLength;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .dawn {
    &::before,
    & ~ .gap::after {
      background-color: #c9c9ff;
    }
  }

  .morning {
    &::before,
    & ~ .gap::after {
      background-color: #4343ff;
    }
  }

  .afternoon {
    &::before,
    & ~ .gap::after {
      background-color: #f1f100;
    }
  }

  .night {
    &::before,
    & ~ .gap::after {
      background-color: #0d0d0d;
    }
  }
}

.lightTheme {
  .schTable.days > div {
    background-color: #fefefe;
    &.even-column {
      background-color: #ededff;
    }
    .hours-format {
      background-color: #b4aae2;
      color: #fff;
      &.even-row {
        background-color: #8f80d3;
      }
    }
  }

  .schTable.days {
    .eventBox {
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 25%,
        rgba(0, 0, 0, 0.025) 25%,
        rgba(0, 0, 0, 0.025) 50%,
        rgba(0, 0, 0, 0.05) 50%,
        rgba(0, 0, 0, 0.05) 75%,
        rgba(0, 0, 0, 0.075) 75%,
        rgba(0, 0, 0, 0.075) 100%
      );
    }
  }
}

.darkTheme {
  .schTable.days > div {
    background-color: rgba(255, 255, 255, 0.025);
    &.even-column {
      background-color: rgba(255, 255, 255, 0.05);
    }
    .hours-format {
      background-color: #261c54;
      color: #fff;
      &.even-row {
        background-color: #130e2a;
      }
    }
  }
  .schTable.days {
    .eventBox {
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 25%,
        rgba(255, 255, 255, 0.025) 25%,
        rgba(255, 255, 255, 0.025) 50%,
        rgba(255, 255, 255, 0.05) 50%,
        rgba(255, 255, 255, 0.05) 75%,
        rgba(255, 255, 255, 0.075) 75%,
        rgba(255, 255, 255, 0.075) 100%
      );
    }
  }
}

// .schTable.days > div.hours-format {
//   background-color: #b4aae2;
//   color: #fff;
//   &.even-row {
//     background-color: #8f80d3;
//   }
// background-color: #261c54;
// color: #fff;
// &.even-row {
//   background-color: #130e2a;
// }
// background-color: #576575;
// color: #fff;
// &.even-row {
//   background-color: #465464;
// }
// background-color: #ff5f7e;
// color: #fff;
// &.even-row {
//   background-color: #ee4e6d;
// }
// }

.week-day {
  background-color: #715ec8;
}

.eventBox,
.schTable.days {
  height: 1824px;
}
.eventBox .eventBoxInner {
  min-width: 128px;
}
</style>
