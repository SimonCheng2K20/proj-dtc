<template>
  <div class="pageLeftContent pb-1">
    <b-card
      bg-variant="transparent"
      no-body
      class="mx-1"
    >
      <b-card-header class="bg-primary text-white cardHeader py-2">
        <b-row no-gutters>
          <b-col cols="6">檢查室每週例行排程</b-col>
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
                    v-model="room"
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
                    <font-awesome-icon icon="undo" />還原 </b-button>
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
                    <font-awesome-icon icon="save" />儲存 </b-button>
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
                class="default"
                ref="schDefaultSpecialTime"
                width="100%"
                timezone="Asia/Taipei"
                :showHeaderBar="false"
                :showQuickInfo="false"
                :showTimeIndicator="false"
                startHour="08:00"
                endHour="23:00"
                currentView="Week"
                :timeScale="timeScale"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :selectedDate="selectedDate"
                :workHours="{ start: '08:00', end: '23:00' }"
                :eventRendered="onEventRendered"
                :eventSettings="eventSettings"
                :dateHeaderTemplate="dateHeaderTemplate"
                :editorTemplate="editorTemplate"
                :actionBegin="actionBegin"
                :resizeStart="resizeStart"
                :dragStop="dragStop"
                :popupOpen="onPopupOpen"
                :popupClose="onPopupClose"
                :dataBinding="onDataBinding"
                height="830px"
              >
                <e-views>
                  <e-view option="Week"></e-view>
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
import { SchedulePlugin, Day, Week, Resize, DragAndDrop } from "@syncfusion/ej2-vue-schedule";
import { DropDownListPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import DateHelper from "@/library/DateHelper";
import editorTemplate from "./DetailEditor";
import tooltipTemplate from "./Tooltip";
import DayHeaderTemplate from "@/components/DayHeaderTemplate";
import BatchModify from "@/library/BatchModify";
import scheduleColors from "@/assets/scheduleGroundColor.js";
import { TreeViewPlugin } from "@syncfusion/ej2-vue-navigations";
import { ContextMenuPlugin } from "@syncfusion/ej2-vue-navigations";

Vue.use(TreeViewPlugin);
Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(DropDownListPlugin);
Vue.use(ContextMenuPlugin);
let batchModify = new BatchModify();

export default {
  data () {
    return {
      intervalValue: "30",
      intervalData: ["5", "10", "20", "30", "60"],
      timeScale: { enable: true, interval: 30, slotCount: 1 },
      rooms: [],
      room: null,
      dsExamineSource: [],
      selectedDate: new Date(2001, 0, 1),
      screenHeight: 100,
      specialTimeChanged: false,
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          Type: { name: "Type", validation: { required: true } },
          subject: { name: "TypeName" },
          checkItemNames: { name: "CheckItemNames" },
          description: { name: "Description" },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        },
        enableTooltip: true,
        tooltipTemplate() {
          return { template: tooltipTemplate };
        }
      },
      editorTemplate() {
        return { template: editorTemplate };
      },
      dateHeaderTemplate() {
        return {
          template: DayHeaderTemplate
        };
      },
      slotStart: DateHelper.getNextMonthFirst(),
      slotEnd: DateHelper.getNextMonthLast(),
      readonly: true,
      slotNoChanged: true,
      dsRoomCheckItem: [],
      unlockDateItem: [],
      menuItems: [
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
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    schedule: [Day, Week, Resize, DragAndDrop],
    multiselect: [CheckBoxSelection]
  },
  methods: {
    changeInterval(args) {
      let scheduleObj = this.$refs.schDefaultSpecialTime;
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
    onEventRendered(args) {
      args.element.style.backgroundColor = scheduleColors[args.data.Type];
    },
    InDateRange(time) {
      let slotStart = new Date(this.year, this.month - 1, 1);
      let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
      return time >= slotStart && time <= slotEnd;
    },
    actionFailure(args) {
      if (args.error != null && args.error.error != null && args.error.error.constructor === XMLHttpRequest)
        Swal.fire("伺服器錯誤！", args.error.error.response, "error");
      else if (args.length > 0) {
        let error = args[0].error;
        Swal.fire(error.status === 409 ? "驗證錯誤！" : "伺服器錯誤！", error.response, "error");
      }
    },
    actionBegin(args) {
      var specialTime;
      switch (args.requestType) {
        case "eventCreate":
          specialTime = args.data[0];
          if(specialTime.StartTime.getTime() == specialTime.EndTime.getTime()){
            Swal.fire("開始及結束時間相同，無法新增！", "", "info");            
            args.cancel = true;
            return;
          }
          if (this.dateRangeOverlaps(specialTime)) {
            Swal.fire("時間區段重疊，無法新增！", "", "info");
            args.cancel = true;
            return;
          }
          if (typeof specialTime.CheckItemNames == "string") specialTime.CheckItemNames = specialTime.CheckItemNames.split(",");
          this.specialTimeChanged = true;
          specialTime.RoomId = this.room;
          batchModify.insert(specialTime);
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
          var schDefaultSpecialTime = this.$refs.schDefaultSpecialTime.ej2Instances.eventSettings.dataSource;
          var specialTimeIndex = schDefaultSpecialTime.findIndex(s => s.Id == specialTime.Id);
          schDefaultSpecialTime[specialTimeIndex] = specialTime;
          //fix ej2-schedule bug }

          batchModify.update(specialTime);
          break;
        case "eventRemove":
          var event = args.data.length ? args.data[0] : args.deletedRecords[0];
          if (event) batchModify.delete(event);
          this.specialTimeChanged = batchModify.hasChanged();
          break;
      }
    },
    resizeStart(args) {
      if (args.data.Type == 3) {
        args.cancel = true;
        Swal.fire("直接預約格時間區段會依照檢查時間，無法變更！", "", "info");
      }
    },
    dateRangeOverlaps(changeSpecialTime, prevCheck) {
      var schDefaultSpecialTime = this.$refs.schDefaultSpecialTime.ej2Instances.getEvents();
      var checkEndTime = changeSpecialTime.EndTime;
      return schDefaultSpecialTime.some(
        s =>
          s.Id != changeSpecialTime.Id &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeSpecialTime.StartTime, checkEndTime) &&
          (prevCheck != true || s.EndTime >= checkEndTime)
      );
    },
    dragStop(args) {
      if (this.dateRangeOverlaps(args.data)) {
        Swal.fire("時間區段重疊，無法變更！", "", "info");
        args.cancel = true;
      }
    },
    onDataBinding(args) {
      //
      //因為每次紀錄完event, 會將event id變成字串,
      //所以在這裡將字串的id轉回int, 避免error
      // let _this = this;
      args.result.forEach(i => {
        if (!Number.isInteger(i.Id)) {
          i.Id = parseInt(i.Id);
        }
      });
    },
    onPopupOpen(args) {
      console.log(args);
      if (args.type === "Editor") {
        if (this.dateRangeOverlaps(args.data, true)) {
          Swal.fire("時間區段重疊，無法新增！", "", "info");
          args.cancel = true;
          return;
        }

        if (!Number.isInteger(args.data.Id)) {
          args.data.Id = parseInt(args.data.Id);
        }

        args.data.CheckItemNames = "";
        if (this.rooms.find(l => l.Id == this.room).Modality == "MR") {
          args.element.querySelector("#isMri").value = "1";
        }

        let newArr = Array.from(this.dsRoomCheckItem);

        //原本的code
        if (args.element.querySelector("#CheckItemId")) args.element.querySelector("#CheckItemId").ej2_instances[0].dataSource = newArr; //this.dsRoomCheckItem;

        if (args.element.querySelector("#CheckItemIds")) {
          args.element.querySelector("#CheckItemIds").ej2_instances[0].dataSource = newArr;
        }
      }
    },
    onPopupClose(args) {
      if(args.data == null){
        let scheduleObj = this.$refs.schDefaultSpecialTime;
        scheduleObj.ej2Instances.timeScale.slotCount = 2;
        scheduleObj.dataBind();
        scheduleObj.ej2Instances.timeScale.slotCount = 1;
        scheduleObj.dataBind();
      }
    },
    onSave() {
      this.specialTimeChanged = false;
      let _this = this;
      console.log(batchModify);

      if (batchModify.modifyData.AddedRecords) {
        batchModify.modifyData.AddedRecords.forEach(i => {
          // console.log(i);
          i.CheckItemIds = i.CheckItemIds.map(j => {
            // console.log(j);
            return parseInt(j);
          });
        });
      }
      console.log(batchModify);
      console.log(batchModify.modifyData);
      window.axios
        .put("/room/UpdateDefaultSpecialTimes", batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500
          });
        })
        .catch(function (error) {
          _this.specialTimeChanged = true;
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    onClear() {
      let _this = this;
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
    scheduleFilter() {
      let _this = this;
      window.axios.get("/room/DefaultSpecialTimes?id=" + this.room).then(e => {
        _this.$refs.schDefaultSpecialTime.ej2Instances.eventSettings.dataSource = e.Items;
        _this.specialTimeChanged = false;
        batchModify.reset();
      });
      window.axios.get("/room/SpecialTimeCheckItem?id=" + this.room).then(e => {
        _this.dsRoomCheckItem = e.Items;
      });
    },
    onContextMenuBeforeOpen (args) {
      let menuObj = this.$refs.menuObj;
      let scheduleObj = this.$refs.schDefaultSpecialTime;
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

        menuObj.hideItems(["Paste"], true);
        if (eventObj.Type == 98) menuObj.hideItems(["Copy"], true);
        else menuObj.showItems(["Copy"], true);
      } else {
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
      let scheduleObj = this.$refs.schDefaultSpecialTime.ej2Instances;
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
          if (cloneSlot.TypeName.startsWith("☆")) cloneSlot.TypeName = cloneSlot.TypeName.substr(1);
          this.$refs.schDefaultSpecialTime.addEvent(cloneSlot);
          break;
        case "Delete":
          var selectEvent = scheduleObj.getEventDetails(this.selectedTarget);
          this.$refs.schDefaultSpecialTime.deleteEvent(selectEvent.Id);
          break;
      }
    }
  },
  watch: {
    room() {
      this.scheduleFilter();
      window.defaultSpecialTime_room = this.room;
    }
  },
  created() {
    let _this = this;
    window.axios.get("/room/SelectList").then(e => {
      _this.rooms = e.Items;
      _this.room = _this.rooms[0].Id;
      if (window.defaultSpecialTime_room) _this.room = window.defaultSpecialTime_room;
    });
    window.axios.get("/GeneralData/SelectNoList?groupNo=PatientSource").then(e => {
      if (e != null) {
        _this.dsExamineSource = e.Items;
      }
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
<style>
.schedule-cell-dimension.e-schedule
  .e-vertical-view
  .e-date-header-wrap
  table
  col,
.schedule-cell-dimension.e-schedule .e-vertical-view .e-content-wrap table col {
  width: 200px;
}

.schedule-cell-dimension.e-schedule
  .e-vertical-view
  .e-time-cells-wrap
  table
  td,
.schedule-cell-dimension.e-schedule .e-vertical-view .e-work-cells {
  height: 100px;
}
</style>

<style lang="scss">
.pageLeftContent {
  .card-text {
    border-bottom: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
  }
  .e-float-input.e-control-wrapper {
    background-color: transparent !important;
  }
}
</style>
