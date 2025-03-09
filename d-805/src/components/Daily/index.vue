<template>
  <div
    class="working-calendar p-1"
    :class="{ hideModality: !showModality }"
    :style="{ '--roomsMinWidth': roomsMinWidth }"
  >
    <div
      class="modality-select ml-auto d-table mb-1"
      v-if="showModality"
    >
      <div class="modality-btns">
        <b-button
          v-for="k in Object.keys(roomColor)"
          :key="k"
          :class="{ [roomColor[k].join(' ')]: true, active: modality === k }"
          v-text="k"
          @click="modality = k"
        />
      </div>
    </div>
    <div class="d-flex alig-items-center controls mb-3">
      <div class="time-scales mt-1 ml-1">
        <b-form-group>
          <b-form-radio-group
            button-variant="danger"
            size="sm"
            id="time-scales"
            v-model="timeScale"
            :options="timeScales"
            class="text-white"
            @change="
              $nextTick(() => {
                updateGridInfo();
              })
            "
            buttons
            name="radios-btn-default"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <div class="time-scales mt-1 ml-1">
        <b-form-group>
          <b-form-radio-group
            button-variant="primary"
            size="sm"
            id="filter-mode"
            v-model="filterModel"
            :options="filters"
            class="text-white"
            @change="
              $nextTick(() => {
                updateGridInfo();
              })
            "
            buttons
            name="radios-btn-default"
          ></b-form-radio-group>
        </b-form-group>
      </div>

      <div class="room-check px-2 d-flex align-items-center justify-content-center">
        <b-form-checkbox-group
          id="room-checkbox"
          v-model="chosenRooms"
          :options="roomOptions"
          switches
        />
      </div>

      <time-arrow
        :date="dailyDate"
        v-on:changeDate="
          date => {
            dailyDate = date;
            getModalityRooms();
          }
        "
      />

      <b-icon-x-circle-fill
        @click="closeCalendar"
        class="cursor-pointer"
        style="width: 36px; height: 36px;"
      />
    </div>
    <div
      class="inner d-block"
      :class="{ isLoading: isLoading }"
    >
      <div
        ref="calendarHeadGrid"
        class="calendar-grid"
        :style="{
          gridTemplateColumns: getGridColumns //'100px repeat(' + filterRooms.length + ', minmax(150px, 1fr))'
        }"
      >
        <div />
        <template v-for="(room, idx) in filterRooms">
          <div :key="'t_' + idx"
            style="border-right: none;"
          />
          <div
            class="chead py-2 d-flex justify-content-center align-items-center"
            :class="'ch' + (idx + 1)"
            :key="'h_' + idx"
          >
            {{ room.Name }}
            <div class="text-dark bg-warning rounded-circle member-number text-center ml-1">{{ getRoomEventLength(room.Events) }}</div>
          </div>
        </template>
      </div>

      <div
        ref="calendarGrid"
        class="calendar-grid"
        :style="{
          '--gridRowNumber': filteredTime.length,
          gridTemplateColumns: getGridColumns
        }"
      >
        <template v-for="(i, timeidx) in filteredTime">
          <div
            :key="'b1' + i"
            class="time d-flex flex-column align-items-center justify-content-between"
            :class="'row' + (i % 2 === 1 ? 'odd' : 'even')"
            :id="'t' + i"
          >
            <div>{{ getCalendarTime(i * timeScale) }}</div>
            <div>{{ getCalendarTime((i + 1) * timeScale - 1) }}</div>
          </div>

          <template v-for="(room, idx) in filterRooms">
            <div
              v-if="timeidx === 0"
              :class="'cbody position-relative b' + (idx + 1)"
              :key="'cb' + (i + 1) + '_' + idx"
            >
              <div
                :key="`${room.Id}_${weekDay}_${j}`"
                v-for="(sTime, j) in defaultSpecialTime[`${room.Id}_${weekDay}`]"
                class="cursor-pointer position-absolute cbar"
                :class="{ 'd-table': sTime.isExtend }"
                :point="createPointTage(sTime)"
                :style="{
                  width: (sTime.isExtend ? sTimeWidth : 15) + 'px',
                  padding: (sTime.isExtend ? 5 : 0) + 'px',
                  minHeight: sTime.isExtend ? 'fit-content' : '15px',
                  zIndex: sTime.isExtend ? '500' : 'unset',
                  backgroundColor: scheduleColors[sTime.Type]
                }"
                @click="extendSpecialTime(sTime, defaultSpecialTime[`${room.Id}_${weekDay}`])"
                mousetip
                :mousetip-msg="
                  `時段類型: ${sTime.TypeName}</br>
                              ${sTime.CheckItemNames.length>0 ? `項目: <ol class='pl-3'>${sTime.CheckItemNames.reduce( (a,v)=> (a + '<li>' + v + '</li>'), '')}</ol> `: ''}
                              開始時間: ${$moment(sTime.StartTime).format('hh:mm A')}</br>
                              結束時間: ${$moment(sTime.EndTime).format('hh:mm A')}</br>
                              備註: ${sTime.Description ? sTime.Description : '暫無資料'}
                              `
                "
              >
                <div
                  v-if="!sTime.isExtend"
                  v-text="sTime.TypeName"
                />
                <div
                  class="text-center"
                  v-else
                  v-html="
                    `<div class='text-bold bg-white text-black'>時段類型</div> ${sTime.TypeName} </br>
                              ${sTime.CheckItemNames.length>0 ? `<div class='text-bold mt-2 bg-white text-black'>項目:</div> <ol class='pl-3'>${sTime.CheckItemNames.reduce( (a,v)=> (a + '<li>' + v + '</li>'), '')}</ol> `: ''}
                              <div class='text-bold mt-2 bg-white text-black'>開始時間</div> ${$moment(sTime.StartTime).format('hh:mm A')}
                              <div class='text-bold mt-2 bg-white text-black'>結束時間</div> ${$moment(sTime.EndTime).format('hh:mm A')}
                              <div class='text-bold mt-2 bg-white text-black'>備註</div> ${sTime.Description ? sTime.Description : '暫無資料'}
                              `
                  "
                />
              </div>
            </div>
            <div
              :class="'row' + (i % 2 === 1 ? 'odd' : 'even')"
              :key="room.Id + '_b' + (i + 1) + '_' + idx"
            >
              <events
                :key="room.timeStamp + '_' + i"
                class="flex-1"
                v-if="room.Events.length > 0"
                :items="room.Events.filter(e => e.point >= i * timeScale && e.point < (i + 1) * timeScale)"
                :overItems="room.Events.filter(e => 
                  $moment(e.ScheduleTime).format('YYYY-MM-DD') == $moment(e.ScheduleEndTime).format('YYYY-MM-DD') && 
                  e.finish && 
                  e.finish > i * timeScale && 
                  (e.finish < (i + 1) * timeScale || (e.finish > (i + 1) * timeScale && e.point < i * timeScale) || (e.finish > i * timeScale && e.point < i * timeScale)) &&
                  (e.finish - e.point) / timeScale > 1 )"
                @handlePatientState="handlePatient"
              />
            </div>
          </template>
        </template>
      </div>

      <div
        v-if="isLoading"
        class="loading"
      >
        <b-spinner variant="primary" />
      </div>
    </div>

    <patientQuickWork
      ref="service-modal"
      :show="!!chosenPatient"
      :item="chosenPatient"
      :roomOptions="roomOptions"
      title="快速工作"
      v-on:closeModal="hideModal"
      v-on:cancelCheckin="cancelCheckin"
      v-on:checkin="checkin"
      v-on:changeCheckinRoom="changeCheckinRoom"
      v-on:changeCheckinTime="changeCheckinTime"
    />

    <!-- <bookingView :bookingObjs="bookingObjs" :bookingDate="viewDate" :patientInfo="patientInfo"></bookingView> -->
  </div>
</template>

<script>
import timeArrow from "./timeArrow";
import events from "./workingEvents.vue";
import * as configs from "@/config";
import { DataManager, WebApiAdaptor, Query, Predicate } from "@syncfusion/ej2-data";
import { roomColor } from "./roomColor.js";
import patientQuickWork from "./patientQuicklyWork.vue";
import { mapState } from "vuex";
import MouseTip from "@/assets/MouseTip.js";
import scheduleColors from "@/assets/scheduleGroundColor.js";
import { getDailyPatients } from "@/assets/service/dataManager.js";

export default {
  data () {
    return {
      rooms: [],
      roomOptions: [],
      chosenRooms: [],
      dailyDate: null,
      roomList: null,
      isLoading: false,
      isMounted: false,
      modality: "",
      chosenPatient: null,
      roomColor,
      timeScales: [],
      timeScale: 60,
      filters: [
        { text: "上午", value: 1 },
        { text: "下午", value: 2 },
        { text: "晚上", value: 3 },
        { text: "全天", value: 0 }
      ],
      filterModel: 0,
      defaultSpecialTime: {},
      gridUnitInfo: null,
      mouseTip: null,
      sTimeWidth: 150,
      scheduleColors
    };
  },
  components: {
    events,
    timeArrow,
    patientQuickWork
  },
  props: {
    roomTabs: {
      type: Array,
      default: new Array()
    },
    pRoom: {
      type: String
    },
    showModality: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState(["Profile4User"]),
    getGridColumns () {
      return this.filterRooms && this.defaultSpecialTime
        ? this.filterRooms.reduce((a, c) => {
          // let repstr = "0";
          // if (this.defaultSpecialTime[`${c.Id}_${this.weekDay}`] && this.defaultSpecialTime[`${c.Id}_${this.weekDay}`].length > 0) {
          //   repstr = this.defaultSpecialTime[`${c.Id}_${this.weekDay}`].reduce((da, dc) => {
          //     return da + (dc.isExtend ? this.sTimeWidth : 15);
          //   }, 0);
          // }
          // const repstr = this.defaultSpecialTime[`${c.Id}_${this.weekDay}`].some(dc => dc.isExtend) ? this.sTimeWidth : 15;
          // return a + `${repstr}px minmax(150px, 1fr)`;
          return a + '15px minmax(150px, 1fr)';
        }, "100px ")
        : "";
    },
    weekDay () {
      return this.dailyDate ? this.$moment(this.dailyDate).day() : 0;
    },
    rate () {
      return 60 / this.timeScale;
    },
    currentRooms () {
      return this.roomList.reduce((a, { Modality, No, Name, Id }) => (Modality === this.modality ? a.concat({ Name, No, Id }) : a), []);
    },
    modalitys () {
      return !this.roomTabs ? [] : this.roomTabs.map(v => ({ value: v, text: v }));
    },
    roomsMinWidth () {
      return this.filterRooms.length * 150 + "px";
    },
    filterRooms () {
      return !this.rooms || this.chosenRooms.length === 0 
        ? [] 
        : this.rooms.filter(r => this.chosenRooms.includes(r.No));
    },
    timeRange () {
      const time = this.$moment(this.dailyDate.getTime() - 1000 * 60 * 60 * 8).format("YYYY-MM-DD");
      return { start: `${time}T00:00:00.000Z`, end: `${time}T23:59:59.999Z` };
    },
    filterCondition () {
      return this.filterModel === 1
        ? [[6 * this.rate, 12 * this.rate]]
        : this.filterModel === 2
          ? [[12 * this.rate, 18 * this.rate]]
          : [
            [0, 6 * this.rate],
            [18 * this.rate, 24 * this.rate]
          ];
    },
    filteredTime () {
      return new Array((24 * 60) / this.timeScale)
        .fill()
        .map((v, i) => i)
        .filter(time => (this.filterModel === 0 ? true : this.filterCondition.some(condit => this.filterTime(condit, time))));
    }
  },
  created () {
    this.isLoading = true;
    if (this.isMounted) this.isMounted = false;
    this.dailyDate = new Date();
    window.axios.get("/room/SelectNoList?isAll=true").then(({ Items }) => {
      this.roomList = Items;
      window.axios.get("room/SelectList?isAll=true").then(Rooms => {
        this.isLoading = false;
        this.isMounted = true;
        Rooms.Items.forEach(item => {
          this.roomList.some(room => {
            if (room.Name === item.Name) {
              room["Id"] = item.Id;
            }
            return room.Name === item.Name;
          });
        });
        // 更換modality 即會取得資料
        if (this.roomTabs.length > 0) this.modality = (this.pRoom && this.pRoom !== "null" && this.pRoom !== 'all') ? this.pRoom.substr(0, 2) : this.roomTabs[0];
      });
    });

    this.timeScales = [10, 30, 60, 240, 360].map(time => {
      const { hours, mins } = this.converTimeToChar(time);
      return {
        text: (hours > 0 ? hours + "小時" : "") + (mins > 0 ? mins + "分鐘" : ""),
        value: time
      };
    });
  },
  mounted () {
    this.$nextTick(() => {
      this.isMounted = true;
    });
  },
  methods: {
    createPointTage ({ StartTime, EndTime }) {
      const mergeHourMinute = time => {
        return (this.$moment(time).hour() + this.$moment(time).minutes() / 60) * this.rate;
      };
      return `${mergeHourMinute(StartTime)}_${mergeHourMinute(EndTime)}`;
    },
    extendSpecialTime (sTime, sTimes) {
      if (sTime.isExtend) {
        sTime.isExtend = false;
      } else {
        sTimes.some(st => {
          if (st.isExtend) {
            st.isExtend = false;
            return true;
          } else {
            return false;
          }
        });
        sTime.isExtend = true;
      }
    },
    convert2GridData (time, property) {
      return this.gridUnitInfo && this.gridUnitInfo[time] ? this.gridUnitInfo[time][property] : 0;
    },
    isInRange (items, time) {
      return items
        ? items.some(({ StartTime, EndTime }) => time >= parseInt(this.$moment(StartTime).format("HH")) && time <= parseInt(this.$moment(EndTime).format("HH")))
        : false;
    },
    filterTime ([start, end], time) {
      return time >= start && time < end;
    },
    updateGridInfo () {
      if (!this.$refs.calendarGrid) return;

      Array.from(this.$refs.calendarGrid.getElementsByClassName("cbar")).forEach(bar => {
        bar.style.height = "0px";
        bar.style.top = '0px';
      });

      this.gridUnitInfo =
        this.isMounted && this.$refs.calendarGrid
          ? Array.from(this.$refs.calendarGrid.getElementsByClassName("time")).reduce((a, el) => {
            return { ...a, [el.id.substr(1)]: { top: el.offsetTop, height: el.clientHeight } };
          }, {})
          : null;
      if (this.gridUnitInfo && this.$refs.calendarGrid) {
        if (this.mouseTip) {
          this.mouseTip.stop();
          this.mouseTip = null;
        }
        setTimeout(() => {
          Array.from(this.$refs.calendarGrid.getElementsByClassName("cbar")).forEach(bar => {
            let [start, end] = bar.getAttribute("point").split("_");//.map(v => v * this.rate)
            let send = end % 1;
            let sstart = start % 1;
            const wholeKeys = Object.keys(this.gridUnitInfo);
            if (wholeKeys.includes(Math.floor(start) + "") || (wholeKeys.includes(Math.floor(end) + '') && wholeKeys[0] != Math.floor(end))) {

              if (wholeKeys.includes(Math.floor(start) + "")) {
                start = Math.floor(start) + "";
                if (sstart > 0) {
                  sstart = this.gridUnitInfo[start].height * sstart;
                }
              } else {
                if (!wholeKeys.some(k => {
                  if (k > start) {
                    start = k;
                    return true;
                  } else {
                    return false
                  }
                })) {
                  start = wholeKeys[0]; // just in case
                }
                sstart = 0;
              }

              if (wholeKeys.includes(Math.floor(end) + "")) {
                end = Math.floor(end) + "";
                if (send > 0) {
                  send = this.gridUnitInfo[end].height * send;
                }
              } else {
                end = wholeKeys[wholeKeys.length - 1];
                send = this.gridUnitInfo[end].height;
              }

              // alert(`end: ${end}, start: ${start}`);

              bar.style.height = `${this.gridUnitInfo[end].top - this.gridUnitInfo[start].top + send - sstart}px`;
              bar.style.top = `${this.gridUnitInfo[start].top + sstart - this.gridUnitInfo[wholeKeys[0]].top}px`;
              bar.style.display = "unset";
            } else {
              bar.style.display = "none";
            }
          });

          if (!this.mouseTip) {
            this.mouseTip = new MouseTip();
            this.mouseTip.start();
          }
          this.$refs.calendarGrid.style.minHeight = `calc(100vh - ${this.$refs.calendarGrid.offsetTop + 105}px)`;
          //this.$refs.calendarGrid.style.minHeight = 'calc(100vh - 106px)';
        }, 250);
      }
    },
    getRoomEventLength (events) {
      return events.filter(({ ScheduleTime }) => {
        return this.filterModel === 0
          ? true
          : this.filterCondition.some(condit => {
            return this.filterTime(condit, parseInt(this.$moment(ScheduleTime).format("HH")) * this.rate);
          });
      }).length;

      // return events.length;
    },
    getCalendarTime (time) {
      const { hours, mins } = this.converTimeToChar(time);
      return this.$moment()
        .hours(hours)
        .minutes(mins)
        .format(`${hours == 0 ? "00" : "hh"}:mm A`);
    },
    converTimeToChar (time) {
      return { hours: Math.floor(time / 60), mins: time % 60 };
    },
    changeModality (key) {
      if (this.modality != key) this.modality = key;
    },
    async getModalityRooms () {
      try {
        if (this.mouseTip) {
          this.mouseTip.stop();
          this.mouseTip = null;
        }

        this.isLoading = true;
        this.defaultSpecialTime = await this.fetchDefaultSpecialEvents(); // 取得special time
        this.rooms = this.currentRooms.map(r => ({ 
          ...r, 
          Events: [], 
          timeStamp: Date.now() + Math.floor(Math.random() * 10000) 
        }));
        // for checkbox options
        this.roomOptions = this.currentRooms.map(r => ({ text: r.Name, value: r.No }));
        const patientData = await this.getPatientData(); // 取病患資料
        // const [start, end] = Object.values(this.timeRange).map(v => new Date(v).getTime());
        patientData.forEach(p => {
          this.rooms.some(room => {
            // const patentSchTime = new Date(p.ScheduleTime).getTime();
            // const isInRange = patentSchTime > start && patentSchTime < end;     // 二次確認
            if (!p.ScheduleLocation || !p.ScheduleTime) return false;
            // if (room.Id === parseInt(p.ScheduleLocation.substr(2))) {
            if (room.No == p.ScheduleLocation) {

              [{ key: 'point', value: 'ScheduleTime' }, { key: 'finish', value: 'ScheduleEndTime' }].forEach(({ key, value }) => {
                if (p[value]) {
                  p[key] = this.$moment(p[value]).format("HH:mm").split(":").reduce((a, n, i) => a + n * (i === 0 ? 60 : 1), 0);
                }
              })
              room.Events.push(p);
              
              return true;
            } else {
              return false;
            }
          });
        });
        this.chosenRooms = this.currentRooms.map(({ No }) => No);
        this.isLoading = false;
        this.$nextTick(() => {
          this.updateGridInfo();
          this.mouseTip = new MouseTip();
          this.mouseTip.start();
        });
      } catch (err) {
        window.console.log(err);
        this.isLoading = false;
      }
    },
    closeCalendar () {
      this.$emit("closeCalendar");
    },
    getPatientData () {
      // const { start, end } = this.timeRange;
      const start = this.$moment(this.dailyDate).format("YYYY/MM/DD 00:00:00");
      // let conditions = new Predicate("Modality", "equal", this.modality);
      // .and(new Predicate('ScheduleTime', 'greaterThan', start))
      // .and(new Predicate('ScheduleTime', 'lessThanOrEqual', end))
      // .and(new Predicate("Status", "equal", "12"))
      // .or(new Predicate("Status", "equal", "21"));
      // `../exam/List?orderDateStart=${start}&orderDateEnd=${end}`


      return new Promise((resolve, reject) => {

        const params = ['scheduleTimeStart=' + start, 'scheduleTimeEnd=' + start, 'modality=' + this.modality];
        getDailyPatients(params.join('&'))
          .then(res => resolve(res.result))
          .catch(err => reject(err));


        // new DataManager({
        //   //status 11 未排檢、12已排檢、21已報到
        //   // ?scheduleTimeStart=${start}&scheduleTimeEnd=${end}
        //   url: configs.publicPath + `../exam/List?scheduleTimeStart=${start}&scheduleTimeEnd=${start}`,
        //   adaptor: new WebApiAdaptor(),
        //   crossDomain: true
        // })
        //   .executeQuery(new Query().where(conditions))
        //   .then(res => resolve(res.result))
        //   .catch(err => reject(err));
      });
    },
    handlePatient (patient) {
      //status 11 未排檢、12已排檢、21已報到
      console.log({patient});
      this.chosenPatient = patient;
      // this.$refs["service-modal"].show();
    },
    checkin () {
      const isCheckUp = this.chosenPatient.PatientSourceTypeCode === "G";
      this.$emit("checkinService", {
        Accessions: [this.chosenPatient.AccessionNo],
        ScheduleLocation: this.chosenPatient.ScheduleLocation,
        ScheduleLocationName: this.chosenPatient.ScheduleLocationName,
        isCheckUp
      });
      this.hideModal();
    },
    cancelCheckin () {
      if (this.chosenPatient.ProcedureCompleted) {
        this.ObjApp.TimingMessage("已有檢查完成時間不得取消.", 2);
      } else {
        this.$emit("checkoutService", [this.chosenPatient.AccessionNo]);
      }
      this.hideModal();
    },
    async changeCheckinTime ({ time, checkitem, bookinfo }) {
      if (!time) {
        // this.errorMessage = "未選擇時段，無法變更！";
        return;
      }
      let slot = Object.assign({}, time);
      slot.CheckItemNo = checkitem.No;
      slot.CheckItemId = parseInt(checkitem.Id);
      slot.CheckItemName = checkitem.Name;
      slot.MargeCheckItemIds = checkitem.Id;
      slot.OrderNo = bookinfo.OrderNo;
      slot.PatientId = this.chosenPatient.PatientId;
      slot.FromHis = this.$route.query.token != null;
      // slot.StartTime = timezone.removeLocalOffset(slot.StartTime);
      // slot.EndTime = timezone.removeLocalOffset(slot.EndTime);
      slot.Id = bookinfo.Id;
      this.$emit("changeTimeService", slot);
      this.hideModal();
    },
    changeCheckinRoom (RoomNo) {
      this.$emit("changeRoomService", { AccessionNos: [this.chosenPatient.AccessionNo], RoomNo });
      this.hideModal();
    },
    reFreshData () {
      this.getModalityRooms();
    },
    hideModal () {
      this.chosenPatient = null;
    },
    isToday (time) {
      return this.$moment().format("YYYY-MM-DD") === this.$moment(time).format("YYYY-MM-DD");
    },
    fetchDefaultSpecialEvents () {
      return new Promise(async (resolve, reject) => {
        try {
          const { Items } = await window.axios.get(
            `/room/GetSpecialTimes?modality=${this.modality}&startDate=${new Date(
              this.$moment(this.dailyDate).format("YYYY-MM-DD 00:00:00")
            ).toJSON()}&endDate=${new Date(this.$moment(this.dailyDate).format("YYYY-MM-DD 23:59:59")).toJSON()}`
          );

          resolve(
            Items.reduce((a, c) => {
              const newTime = {
                StartTime: c.StartTime,
                EndTime: c.EndTime,
                TypeName: c.TypeName,
                Type: c.Type,
                isExtend: false,
                Description: c.Description,
                CheckItemNames: c.CheckItemNames
              };
              if (a.hasOwnProperty(`${c.RoomId}_${this.weekDay}`)) {
                // return a[`${c.RoomId}_${c.Weekly}`].concat([newTime]);
                a[`${c.RoomId}_${this.weekDay}`].push(newTime);
                return a;
              } else {
                return { ...a, [`${c.RoomId}_${this.weekDay}`]: [newTime] };
              }
            }, {})
          );
        } catch (err) {
          reject({});
        }
      });
    }
  },
  watch: {
    modality () {
      this.getModalityRooms();
    }
  },
  filters: {
    numberToTwo: function (value) {
      return (value - 1 < 10 ? "0" : "") + (value - 1);
    }
  },
  beforeDestroy () {
    Array.from(document.querySelectorAll("#mousetip")).forEach(el => {
      el.parentNode.removeChild(el);
    });
  }
};
</script>

<style lang="scss">
@import "./daily.scss";
@import "@/assets/styles/mixins.scss";
.time-scales {
  fieldset {
    margin: 0;
    padding: 0;
    height: 40;
  }
}
.time {
  color: #999;
}
.cbar {
  background-color: #555;
}
.inner {
  @include scroll-style;
}
div.lightTheme label.custom-control-label,
div.darkTheme label.custom-control-label {
  color: inherit !important;
}
</style>
