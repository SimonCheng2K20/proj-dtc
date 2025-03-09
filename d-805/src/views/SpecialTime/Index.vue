<template>
  <div class="pageLeftContent pb-1">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader py-2">
        <b-row no-gutters>
          <b-col cols="6">檢查室特定時段排程</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-row no-gutters>
                <b-col
                  sm="12"
                  class="px-1"
                >
                  <ejs-dropdownlist
                    v-model="selectYear"
                    :dataSource="years"
                    floatLabelType="Always"
                    placeholder="時段年份"
                  ></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row no-gutters>
                <b-col class="px-1">
                  <ejs-dropdownlist
                    v-model="selectMonth"
                    :dataSource="months"
                    floatLabelType="Always"
                    placeholder="時段月份"
                  ></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row no-gutters>
                <b-col class="px-1">
                  <ejs-dropdownlist
                    v-model="roomId"
                    :dataSource="rooms"
                    :fields="{ text: 'Name', value: 'Id' }"
                    floatLabelType="Always"
                    placeholder="檢查室"
                  ></ejs-dropdownlist>
                </b-col>
              </b-row>
              <b-row style="padding: 10px;">
                <b-col
                  sm="6"
                  class="px-2 text-right"
                >
                  <b-button
                    variant="success"
                    @click="onClear"
                    :disabled="!specialTimeChanged"
                  >
                    <font-awesome-icon icon="undo" /> 還原</b-button>
                </b-col>
                <b-col
                  sm="6"
                  class="px-1"
                >
                  <b-button
                    variant="primary"
                    @click="onSave"
                    :disabled="!specialTimeChanged"
                  >
                    <font-awesome-icon icon="save" /> 儲存</b-button>
                </b-col>
              </b-row>
              <b-row no-gutters>
                <b-col
                  sm="12"
                  class="px-1"
                >
                  <ejs-dropdownlist
                    v-model="intervalValue"
                    :change="changeInterval"
                    :dataSource="intervalData"
                    :fields="{ text: 'Name', value: 'Id' }"
                    floatLabelType="Always"
                    placeholder="時段刻度"
                  ></ejs-dropdownlist>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              sm="10"
              class="px-1"
            >
              <ejs-schedule
                ref="schSpecialTime"
                width="100%"
                :showHeaderBar="true"
                :showQuickInfo="false"
                startHour="08:00"
                endHour="23:00"
                :currentView="currentView"
                :timeScale="timeScale"
                timezone="Asia/Taipei"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :selectedDate="selectedDate"
                :workHours="{ start: '08:00', end: '23:00' }"
                :navigating="schSpecialTime_navigating"
                :eventRendered="onEventRendered"
                :eventSettings="eventSettings"
                :editorTemplate="editorTemplate"
                :actionBegin="actionBegin"
                :popupOpen="onPopupOpen"
                :popupClose="onPopupClose"
                :dragStart="dragStart"
                :dragStop="dragStop"
                :resizeStart="dragStart"
                height="830px"
              >
                <e-views>
                  <e-view option="Week"></e-view>
                  <e-view option="Month"></e-view>
                </e-views>
              </ejs-schedule>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <div>
      <ejs-contextmenu
        id="contextmenu"
        ref="menuObj"
        cssClass="schedule-context-menu"
        target=".e-schedule"
        :items="menuItems"
        :beforeOpen="onContextMenuBeforeOpen"
        :select="onMenuItemSelect"
      ></ejs-contextmenu>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import { closest, isNullOrUndefined } from "@syncfusion/ej2-base";
import { CalendarPlugin } from "@syncfusion/ej2-vue-calendars";
import { SchedulePlugin, Day, Week, Month, Resize, DragAndDrop } from "@syncfusion/ej2-vue-schedule";
import { DropDownListPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import { ContextMenuPlugin } from "@syncfusion/ej2-vue-navigations";
import DateHelper from "@/library/DateHelper";
import BatchModify from "@/library/BatchModify";
import editorTemplate from "./DetailEditor";
import tooltipTemplate from "../DefaultSpecialTime/Tooltip";
import Common from "@/library/Common";
import { dateFormatMixin } from "@/SupportLib_J.js";

Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(DropDownListPlugin);
Vue.use(ContextMenuPlugin);
let batchModify = new BatchModify();

export default {
  data () {
    return {
      currentView: "Week",
      intervalValue: "30",
      intervalData: ["5", "10", "20", "30", "60"],
      timeScale: { enable: true, interval: 30, slotCount: 1 },
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      year: new Date().getFullYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      month: new Date().getMonth() + 1,
      startDate: new Date(),
      endDate: new Date(),
      rooms: [],
      room: null,
      copySourceSlot: null,
      selectedDate: new Date(),
      loadStartTime: new Date(),
      loadEndTime: new Date(),
      dsSpecialTimeView: [{ text: "" }],
      screenHeight: 100,
      specialTimeChanged: false,
      toMonthFirst: true,
      dsRoomCheckItem: [],
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          Type: { name: "Type", validation: { required: true } },
          subject: { name: "TypeName" },
          description: { name: "Description" },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        },
        enableTooltip: true,
        tooltipTemplate () {
          return { template: tooltipTemplate };
        }
      },
      editorTemplate () {
        return { template: editorTemplate };
      },
      slotStart: DateHelper.getNextMonthFirst(),
      menuItems: [
        {
          text: "釋放例行排程時段",
          id: "Free"
        },
        {
          text: "刪除",
          id: "Delete"
        },
        {
          text: "複製",
          id: "Copy"
        },
        {
          text: "貼上",
          id: "Paste"
        }
      ]
    };
  },
  mixins: [dateFormatMixin],
  provide: {
    schedule: [Day, Week, Month, Resize, DragAndDrop],
    multiselect: [CheckBoxSelection]
  },
  methods: {
    changeView (currentDate) {
      currentDate = new Date(currentDate);
      var mStartDate = new Date(currentDate.setDate(1)); //設置到當月第一天
      mStartDate.setHours(0, 0, 0, 0);
      this.startDate = DateHelper.getWeekFist(mStartDate, false);
      var mEndDate = DateHelper.getMonthLast(currentDate);
      this.endDate = DateHelper.getWeekLast(mEndDate, false);
      this.month = currentDate.getMonth() + 1;
      this.scheduleFilter();
    },
    schSpecialTime_navigating (e) {
      switch (e.action) {
        case "date":
          let _this = this;
          if (e.currentDate != e.previousDate && (e.currentDate < this.startDate || e.currentDate > this.endDate)) {
            this.toMonthFirst = false;
            this.selectedDate = e.currentDate;
            this.year = this.selectedDate.getFullYear();
            this.month = this.selectedDate.getMonth();
            if (!batchModify.hasChanged()) {
              this.changeView(e.currentDate);
            } else{
              var previousDate = e.previousDate;
              Swal.fire({
                title: "確認切換編輯月份？",
                text: "這樣將會放棄您在本月份的所有修改！",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "確定放棄！",
                cancelButtonText: "取消"
              }).then(function (d) {
                if (d.value) {
                  _this.changeView(e.currentDate);
                } else
                _this.selectedDate = previousDate;
              });
            }
          }

          break;
        case "view":
          this.currentView = e.currentView;
          break;
      }
    },
    changeInterval (args) {
      let scheduleObj = this.$refs.schSpecialTime;
      scheduleObj.ej2Instances.timeScale.interval = parseInt(args.value, 10);
      scheduleObj.ej2Instances.timeScale.slotCount = 1;
      scheduleObj.dataBind();
    },
    //keypressed偵測
    // HKWatch(event) {
    //   if (event.code === "ArrowUp") {
    //     //
    //     this.currentTimeScaleIndex += 1;
    //     if (this.currentTimeScaleIndex >= this.timeScale.length) this.currentTimeScaleIndex = 0;
    //   } else if (event.code === "ArrowDown") {
    //     //
    //     this.currentTimeScaleIndex -= 1;
    //     if (this.currentTimeScaleIndex < 0) this.currentTimeScaleIndex = this.timeScale.length - 1;
    //   }
    // },
    onEventRendered (args) {
      if (args.data.IsDefaultSpecialTime) {
        switch (args.data.Type) {
          case 0:
            args.element.style.backgroundColor = "#F57F37";
            break;
          case 1:
            args.element.style.backgroundColor = "#ff2020";
            break;
          case 2:
            args.element.style.backgroundColor = "#4e8a20";
            break;
          case 3:
            args.element.style.backgroundColor = "#8e24aa";
            break;
          case 10:
            args.element.style.backgroundColor = "#2e20ff";
            break;
        }
      } else {
        switch (args.data.Type) {
          case 0:
            args.element.style.backgroundColor = "#d55F17";
            break;
          case 1:
            args.element.style.backgroundColor = "#df0000";
            break;
          case 2:
            args.element.style.backgroundColor = "#2e6a00";
            break;
          case 3:
            args.element.style.backgroundColor = "#6e048a";
            break;
          case 10:
            args.element.style.backgroundColor = "#0e00df";
            break;
          case 98:
            args.element.style.backgroundColor = "#9a9a9a";
            break;
        }
      }
    },
    InDateRange (time) {
      let slotStart = new Date(this.year, this.month - 1, 1);
      let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
      return time >= slotStart && time <= slotEnd;
    },
    actionFailure (args) {
      Common.actionFailure(args);
    },
    cloneSpecialTimes (specialTime, duration, cloneEndTime) {
      let nextSlotStart = new Date(specialTime.StartTime);
      let nextSlotEnd = new Date(specialTime.EndTime);
      nextSlotStart.setTime(nextSlotStart.getTime() + duration);
      nextSlotEnd.setTime(nextSlotEnd.getTime() + duration);
      while (nextSlotEnd.getTime() <= cloneEndTime) {
        let nextSlot = { ...specialTime };
        nextSlot.StartTime = new Date(nextSlotStart);
        nextSlot.EndTime = new Date(nextSlotEnd);
        nextSlot.RepeatRule = null;
        nextSlot.isClone = true;
        this.$refs.schSpecialTime.addEvent(nextSlot);
        nextSlotStart.setTime(nextSlotStart.getTime() + duration);
        nextSlotEnd.setTime(nextSlotEnd.getTime() + duration);
      }
    },
    actionBegin (args) {
      var specialTime;
      switch (args.requestType) {
        case "eventCreate":
          specialTime = args.data[0];
          if(specialTime.StartTime.getTime() == specialTime.EndTime.getTime()){
            Swal.fire("開始及結束時間相同，無法新增！", "", "info");            
            args.cancel = true;
            return;
          }
          if (specialTime.IsDefaultSpecialTime) return;
          if (this.dateRangeOverlaps(specialTime)) {
            if (!specialTime.isClone) Swal.fire("時間區段重疊，無法新增！", "", "info");
            else specialTime.isClone = null;
            args.cancel = true;
            return;
          }
          if (typeof specialTime.CheckItemNames == "string") specialTime.CheckItemNames = specialTime.CheckItemNames.split(",");
          this.specialTimeChanged = true;
          specialTime.RoomId = this.room;
          batchModify.insert(specialTime);
          if (specialTime.RepeatRule) {
            let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
            switch (specialTime.RepeatRule) {
              case "DayRepeat":
                this.cloneSpecialTimes(specialTime, 24 * 60 * 60000, slotEnd);
                break;
              case "WeekRepeat":
                this.cloneSpecialTimes(specialTime, 7 * 24 * 60 * 60000, slotEnd);
                break;
            }
          }
          break;
        case "eventChange":
          specialTime = args.data;
          if(specialTime.StartTime.getTime() == specialTime.EndTime.getTime()){
            Swal.fire("開始及結束時間相同，無法變更！", "", "info");            
            args.cancel = true;
            return;
          }
          if (this.dateRangeOverlaps(specialTime)) {
            Swal.fire("時間區段重疊，無法變更！", "", "info");
            args.cancel = true;
            return;
          }
          if (typeof specialTime.CheckItemNames == "string") specialTime.CheckItemNames = specialTime.CheckItemNames.split(",");
          this.specialTimeChanged = true;

          //fix ej2-schedule bug {
          var schSpecialTime = this.$refs.schSpecialTime.ej2Instances.eventSettings.dataSource;
          var specialTimeIndex = schSpecialTime.findIndex(s => s.Id == specialTime.Id);
          schSpecialTime[specialTimeIndex] = specialTime;
          //fix ej2-schedule bug }

          batchModify.update(specialTime);
          break;
        case "eventRemove":
          var event = args.data.length ? args.data[0] : args.deletedRecords[0];
          if (event && !event.IsDefaultSpecialTime) batchModify.delete(event);
          this.specialTimeChanged = batchModify.hasChanged();
          break;
      }
    },
    dateRangeOverlaps (changeSpecialTime, prevCheck) {
      var schSpecialTime = this.$refs.schSpecialTime.ej2Instances.getEvents();
      var checkEndTime = changeSpecialTime.EndTime;
      var checkSpecialTime = schSpecialTime.some(
        s =>
          s.IsDefaultSpecialTime != true &&
          s.Type != 98 &&
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeSpecialTime.StartTime, checkEndTime) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
      if (checkSpecialTime) return true;
      var checkDefaultSpecialTime = schSpecialTime.some(
        s =>
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeSpecialTime.StartTime, checkEndTime) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
      if (checkDefaultSpecialTime && prevCheck != true) Swal.fire("此排程與每週例行排程重疊，將覆蓋重疊的每週例行排程！", "", "info");
      return false;
    },
    dragStart (args) {
      if (args.data.IsDefaultSpecialTime || args.data.Type == 98) args.cancel = true;
    },
    dragStop (args) {
      if (!this.InDateRange(args.data.StartTime)) {
        args.cancel = true;
        Swal.fire("目前點擊的時間點超出編輯的月份範圍！", "", "info");
        return;
      }
      if (this.dateRangeOverlaps(args.data)) {
        Swal.fire("時間區段重疊，無法變更！", "", "info");
        args.cancel = true;
      }
      if (args.data.IsDefaultSpecialTime == true) {
        args.cancel = true;
        Swal.fire("每週例行排程，在此作業無法變更！", "", "info");
      }
    },
    onPopupOpen (args) {
      if (args.type === "Editor") {
        if (!this.InDateRange(args.data.StartTime)) {
          args.cancel = true;
          Swal.fire("目前點擊的時間點超出編輯的月份範圍！", "", "info");
          return;
        }
        if (this.dateRangeOverlaps(args.data, true)) {
          Swal.fire("時間區段重疊，無法新增！", "", "info");
          args.cancel = true;
          return;
        }
        if (this.rooms.find(l => l.Id == this.room).Modality == "MR") {
          args.element.querySelector("#isMri").value = "1";
        }
        if (args.data.IsDefaultSpecialTime == true || args.data.Type == 98) {
          args.cancel = true;
        } else {
          args.element.querySelector("#CheckItemIds").ej2_instances[0].dataSource = this.dsRoomCheckItem;
        }
      }
    },
    onPopupClose(args) {
      if(args.data == null){
        let scheduleObj = this.$refs.schSpecialTime;
        scheduleObj.ej2Instances.timeScale.slotCount = 2;
        scheduleObj.dataBind();
        scheduleObj.ej2Instances.timeScale.slotCount = 1;
        scheduleObj.dataBind();
      }
    },
    onSave () {
      this.specialTimeChanged = false;
      let _this = this;
      window.axios
        .put("/room/UpdateSpecialTimes", batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500
          });
          _this.scheduleFilter();
        })
        .catch(function (error) {
          _this.specialTimeChanged = true;
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    onClear () {
      let _this = this;
      if (batchModify.hasChanged())
        Swal.fire({
          title: "確認還原？",
          text: "這樣將會放棄您本次所有的修改！",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "確定還原！",
          cancelButtonText: "取消"
        }).then(function (e) {
          if (e.value) {
            _this.scheduleFilter();
          }
        });
    },
    scheduleFilter () {
      let _this = this;
      let viewStartDate = this.DateToString(this.startDate, false);
      let viewEndDate = this.DateToString(this.endDate, false);
      window.axios.get("/room/GetSpecialTimes?id=" + this.room + "&startDate=" + viewStartDate + "&endDate=" + viewEndDate).then(e => {
        _this.$refs.schSpecialTime.ej2Instances.eventSettings.dataSource = e.Items;
        _this.specialTimeChanged = false;
        batchModify.reset();
      });
    },
    onContextMenuBeforeOpen (args) {
      let menuObj = this.$refs.menuObj;
      let scheduleObj = this.$refs.schSpecialTime;
      let targetElement = args.event.target;
      this.selectedTarget = closest(
        targetElement,
        ".e-appointment,.e-work-cells," + ".e-vertical-view .e-date-header-wrap .e-all-day-cells,.e-vertical-view .e-date-header-wrap .e-header-cells"
      );
      if (isNullOrUndefined(this.selectedTarget)) {
        args.cancel = true;
        return;
      }
      if (this.selectedTarget.classList.contains("e-appointment")) {
        let eventObj = scheduleObj.getEventDetails(this.selectedTarget);
        if (eventObj.IsDefaultSpecialTime) menuObj.hideItems(["Delete"], true);
        else menuObj.showItems(["Delete"], true);

        if (eventObj.IsDefaultSpecialTime) menuObj.showItems(["Free"], true);
        else menuObj.hideItems(["Free"], true);
        menuObj.hideItems(["Paste"], true);
        if (eventObj.Type == 98) menuObj.hideItems(["Copy"], true);
        else menuObj.showItems(["Copy"], true);
      } else {
        menuObj.hideItems(["Free"], true);
        menuObj.hideItems(["Copy"], true);
        menuObj.hideItems(["Delete"], true);
        if (this.copySourceSlot != null) menuObj.showItems(["Paste"], true);
        else {
          menuObj.hideItems(["Paste"], true);
          args.cancel = true;
        }
      }
    },
    onMenuItemSelect (args) {
      let scheduleObj = this.$refs.schSpecialTime.ej2Instances;
      let selectedMenuItem = args.item.id;
      var cloneSlot, activeCellsData, diff;
      switch (selectedMenuItem) {
        case "Copy":
          if (this.selectedTarget.classList.contains("e-appointment")) {
            this.copySourceSlot = scheduleObj.getEventDetails(this.selectedTarget);
          }
          break;
        case "Paste":
          cloneSlot = { ...this.copySourceSlot };
          activeCellsData = scheduleObj.getCellDetails(this.selectedTarget);
          cloneSlot.StartTime = activeCellsData.startTime;
          diff = this.copySourceSlot.EndTime - this.copySourceSlot.StartTime;
          cloneSlot.EndTime = new Date(cloneSlot.StartTime.getTime() + diff);
          cloneSlot.RepeatRule = null;
          cloneSlot.isClone = true;
          cloneSlot.IsDefaultSpecialTime = false;
          if (cloneSlot.TypeName.startsWith("☆")) cloneSlot.TypeName = cloneSlot.TypeName.substr(1);
          this.$refs.schSpecialTime.addEvent(cloneSlot);
          break;
        case "Free":
          cloneSlot = { ...scheduleObj.getEventDetails(this.selectedTarget) };
          cloneSlot.RepeatRule = null;
          cloneSlot.isClone = true;
          cloneSlot.IsDefaultSpecialTime = false;
          cloneSlot.Type = 98;
          if (cloneSlot.TypeName.startsWith("☆")) cloneSlot.TypeName = cloneSlot.TypeName.substr(1);
          cloneSlot.TypeName = "釋放" + cloneSlot.TypeName;
          this.$refs.schSpecialTime.deleteEvent(cloneSlot.Id);
          this.$refs.schSpecialTime.addEvent(cloneSlot);
          break;
        case "Delete":
          var selectEvent = scheduleObj.getEventDetails(this.selectedTarget);
          if (selectEvent.Type != 98) {
            this.$refs.schSpecialTime.deleteEvent(selectEvent.Id);
          } else {
            cloneSlot = { ...selectEvent };
            cloneSlot.RepeatRule = null;
            cloneSlot.isClone = true;
            cloneSlot.IsDefaultSpecialTime = true;
            cloneSlot.Type = 99;
            cloneSlot.TypeName = "☆" + cloneSlot.TypeName.substr(2);
            this.$refs.schSpecialTime.deleteEvent(selectEvent.Id);
            this.$refs.schSpecialTime.addEvent(cloneSlot);
          }
          break;
      }
    }
  },
  watch: {
    room (newValue) {
      this.scheduleFilter();
      let _this = this;
      window.axios.get("/room/SpecialTimeCheckItem?id=" + newValue).then(e => {
        _this.dsRoomCheckItem = e.Items;
      });
    }
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
    roomId: {
      get () {
        return this.room;
      },
      set (value) {
        let _this = this;
        if (value != this.room) {
          if (!batchModify.hasChanged()) {
            this.room = value;
          } else
            Swal.fire({
              title: "確認切換檢查室？",
              text: "這樣將會放棄您在檢查室本次所有的修改！",
              type: "question",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "確定放棄！",
              cancelButtonText: "取消"
            }).then(function (e) {
              if (e.value) {
                _this.room = value;
              }
            });
        }
      }
    },
    selectYear: {
      get () {
        return this.year;
      },
      set (value) {
        this.year = value;
        if(this.toMonthFirst)
          this.selectedDate = new Date(this.year, this.month-1, 1);
        this.toMonthFirst = true;
      }
    },
    selectMonth: {
      get () {
        return this.month;
      },
      set (value) {
        this.month = value;
        if(this.toMonthFirst)
          this.selectedDate = new Date(this.year, this.month-1, 1);
        this.toMonthFirst = true;
      }
    }
  },
  created () {
    //
    //初始化資料起訖日期
    let sd = new Date(this.year, this.month - 1, 1, 0, 0, 0, 0);
    this.startDate = DateHelper.getWeekFist(sd, false);

    let ed = DateHelper.getMonthLast(sd);
    this.endDate = DateHelper.getWeekLast(ed, false);

    let _this = this;
    window.axios.get("/room/SelectList").then(e => {
      _this.rooms = e.Items;
      _this.room = _this.rooms[0].Id;
    });

    //按鍵監聽
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
  },
  destroyed () {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  }
};
</script>
<style lang="scss">
.pageLeftContent {
  .card-text {
    border-bottom: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
  }
}
</style>

