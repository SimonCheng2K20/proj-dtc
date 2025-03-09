<template>
  <div class="pageLeftContent pb-1">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">小夜班月排程(CT/MR)</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <b-card no-body class="mx-1">
                <b-card-header class="bg-primary text-white cardHeader">
                  <b-row no-gutters>
                    <b-col>排班月份</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="text-left py-1">
                  <b-container fluid class="px-1">
                    <b-row no-gutters>
                      <b-col class="px-1">
                        <ejs-dropdownlist v-model="year" :dataSource="years" floatLabelType="Always" placeholder="時段年份"></ejs-dropdownlist>
                      </b-col>
                    </b-row>
                    <b-row no-gutters>
                      <b-col class="px-1">
                        <ejs-dropdownlist v-model="month" :dataSource="months" floatLabelType="Always" placeholder="時段月份"></ejs-dropdownlist>
                      </b-col>
                    </b-row>
                    <!-- <b-row no-gutters>
                      <b-col class="px-1">
                        <ejs-dropdownlist
                          v-model="device"
                          :dataSource="devices"
                          floatLabelType="Always"
                          placeholder="檢查儀器"
                          :fields="{ text: 'Name', value: 'Id' }"
                        ></ejs-dropdownlist>
                      </b-col>
                    </b-row> -->
                    <b-row no-gutters>
                      <b-col sm="6" class="px-2">
                        <b-button variant="success" @click="onClear"><font-awesome-icon icon="undo-alt" /> 還原</b-button>
                      </b-col>
                      <b-col sm="6" class="px-1">
                        <b-button variant="primary" @click="onSave" :disabled="!weekSchedulingChanged"><font-awesome-icon icon="save" /> 儲存</b-button>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
              <b-card no-body class="mx-1">
                <b-card-header class="bg-primary text-white cardHeader">
                  <b-row no-gutters>
                    <b-col>選擇值班醫師</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="text-left py-1">
                  <b-container fluid class="px-1">
                    <b-row
                      no-gutters
                      v-bind:style="{
                        height: employeeHeight,
                        overflow: 'auto',
                        width: '100%'
                      }"
                    >
                      <b-col sm="12" class="px-1" style="height:100%; overflow:auto;margin: 0px auto;">
                        <ejs-treeview
                          ref="treEmployee"
                          :allowDragAndDrop="true"
                          :fields="{
                            dataSource: dsEmployee,
                            id: 'Id',
                            text: 'Name',
                            imageUrl: 'image'
                          }"
                          :nodeSelected="nodeSelected"
                          :nodeClicked="nodeClicked"
                          :nodeDragging="onItemDrag"
                          :nodeDragStop="onTreeDragStop"
                        ></ejs-treeview>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col sm="10" class="px-1">
              <ejs-schedule
                ref="schEmployee"
                width="100%"
                height="100%"
                :showHeaderBar="false"
                :showQuickInfo="false"
                currentView="Month"
                :timezone="timezone"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :selectedDate="selectedDate"
                :timeScale="{ interval: 720, slotCount: 1 }"
                :eventSettings="eventSettings"
                :actionBegin="actionBegin"
                :popupOpen="onPopupOpen"
                :cellClick="onCellClick"
                :eventClick="onEventClick"
                :drag="onItemDrag"
              >
                <e-views>
                  <e-view option="Month" :eventTemplate="employeeEventTemplate"></e-view>
                </e-views>
              </ejs-schedule>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { closest } from "@syncfusion/ej2-base";
import { SchedulePlugin, Month, DragAndDrop } from "@syncfusion/ej2-vue-schedule";
import { TreeViewPlugin } from "@syncfusion/ej2-vue-navigations";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import BatchModify from "@/library/BatchModify";
import EmployeeEventTemplate from "@/components/EmployeeEventTemplate";
import Common from "@/library/Common";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";

Vue.use(SchedulePlugin);
Vue.use(TreeViewPlugin);
Vue.use(DropDownListPlugin);

let batchModify = new BatchModify();

export default {
  provide: {
    schedule: [Month, DragAndDrop]
  },
  data() {
    return {
      timezone: "Asia/Taipei",
      activeTab: "default",
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      year: DateHelper.getNextMonthFirst().getFullYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      month: DateHelper.getNextMonthFirst().getMonth() + 1,
      // devices: [],
      // device: null,
      employeeHeight: "auto",
      dsEmployee: [],
      selectEmployeeId: null,
      prevCliekEmployeeNode: null,
      selectedDate: new Date(),
      loadStartTime: new Date(),
      loadEndTime: new Date(),
      dsSpecialTimeView: [{ text: "" }],
      screenHeight: 100,
      weekSchedulingChanged: false,
      dsDeviceCheckItem: [],
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          subject: { name: "EmployeeName" },
          startTime: { name: "StartDate", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        }
      },
      slotStart: DateHelper.getNextMonthFirst(),
      readonly: true,
      slotNoChanged: true,
      employeeEventTemplate: function() {
        return {
          template: EmployeeEventTemplate
        };
      }
    };
  },
  methods: {
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    actionBegin: function(args) {
      var schEmployee = this.$refs.schEmployee.ej2Instances.eventSettings.dataSource;
      switch (args.requestType) {
        case "eventCreate":
          var weekScheduling = args.data[0];
          if (
            schEmployee.some(
              s =>
                s.EmployeeId == weekScheduling.EmployeeId &&
                s.DeviceId == weekScheduling.DeviceId &&
                new Date(s.StartDate).getTime() == weekScheduling.StartDate.getTime()
            )
          ) {
            Swal.fire("『" + weekScheduling.EmployeeName + "』醫師已排入該時段，無須重複排入！", "", "info");
            args.cancel = true;
            return;
          }
          this.weekSchedulingChanged = true;
          if (weekScheduling.StartDate.getDay() == 0 || weekScheduling.StartDate.getDay() == 6) {
            weekScheduling.StartDate = new Date(weekScheduling.StartDate.getFullYear(), weekScheduling.StartDate.getMonth(), weekScheduling.StartDate.getDate());
            weekScheduling.EndTime = new Date(weekScheduling.StartDate);
            weekScheduling.EndTime.setDate(weekScheduling.EndTime.getDate() + 1);
          }
          batchModify.insert(weekScheduling);
          break;
        case "eventRemove":
          batchModify.delete(args.data);
          this.weekSchedulingChanged = batchModify.hasChanged();
          break;
      }
    },
    InDateRange(time) {
      let slotStart = new Date(this.year, this.month - 1, 1);
      let slotEnd = DateHelper.getMonthLast(new Date(this.year, this.month - 1, 1));
      return time >= slotStart && time <= slotEnd;
    },
    onPopupOpen: function(args) {
      if (args.type != "DeleteAlert" && args.type != "EventContainer") args.cancel = true;
    },
    addEmployeeEvent: function(employee, args) {
      let scheduling = {
        StartDate: args.startTime,
        EndTime: args.endTime,
        EmployeeId: employee.Id,
        EmployeeName: employee.Name
        // DeviceId: this.device
      };
      this.$refs.schEmployee.addEvent(scheduling);
    },
    onCellClick: function(args) {
      if (!this.InDateRange(args.startTime)) {
        args.cancel = true;
        Swal.fire("欲編輯的區段超出範圍！", "", "info");
        return;
      }
      if (this.selectEmployeeId > 0) {
        var employee = this.dsEmployee.find(s => s.Id == this.selectEmployeeId);
        this.addEmployeeEvent(employee, args);
      }
    },
    onEventClick: function(args) {
      if (this.selectEmployeeId < 0) {
        this.$refs.schEmployee.ej2Instances.deleteEvent(args.event);
      }
    },
    onItemDrag: function(event) {
      let scheduleObj = this.$refs.schEmployee.ej2Instances;
      if (scheduleObj.isAdaptive) {
        let classElement = document.querySelector(".e-device-hover");
        if (classElement) {
          classElement.classList.remove("e-device-hover");
        }
        // if (event.target.classList.contains("e-work-cells")) {
        //   addClass([event.target], "e-device-hover");
        // }
      }
      if (document.body.style.cursor === "not-allowed") {
        document.body.style.cursor = "";
      }
      if (event.name == "nodeDragging") {
        let dragElementIcon = document.querySelectorAll(".e-drag-item .e-icon-expandable");
        for (let i = 0; i < dragElementIcon.length; i++) {
          dragElementIcon[i].style.display = "none";
        }
      }
    },
    onTreeDragStop: function(event) {
      let treeElement = closest(event.target, ".e-treeview");
      let classElement = document.querySelector(".e-device-hover");
      if (classElement) {
        classElement.classList.remove("e-device-hover");
      }
      if (!treeElement) {
        event.cancel = true;
        let scheduleElement = closest(event.target, ".e-content-wrap");
        if (scheduleElement) {
          if (event.target.classList.contains("e-work-cells")) {
            let cellData = this.$refs.schEmployee.getCellDetails(event.target);
            if (!this.InDateRange(cellData.startTime)) {
              Swal.fire("欲編輯的區段超出範圍！", "", "info");
              return;
            }
            var employee = this.dsEmployee.find(s => s.Id == event.draggedNodeData.id);
            this.addEmployeeEvent(employee, cellData);
          }
        }
      }
    },
    nodeSelected: function(args) {
      this.selectEmployeeId = args.nodeData.id;
    },
    nodeClicked: function(args) {
      if (this.prevCliekEmployeeNode == args.node) {
        this.prevCliekEmployeeNode = null;
        this.selectEmployeeId = null;
        this.$refs.treEmployee.ej2Instances.selectedNodes = [];
      } else this.prevCliekEmployeeNode = args.node;
    },
    onSave: function() {
      this.weekSchedulingChanged = false;
      let _this = this;
      window.axios
        .put("/monthScheduling/UpdateMonth", batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500
          });
          _this.scheduleFilter();
        })
        .catch(function(error) {
          _this.weekSchedulingChanged = true;
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    onClear: function() {
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
      }).then(function(e) {
        if (e.value) {
          _this.scheduleFilter();
        }
      });
    },
    scheduleFilter: function() {
      let _this = this;
      window.axios.get("/monthScheduling/Month?year=" + this.year + "&month=" + this.month).then(e => {
        _this.$refs.schEmployee.ej2Instances.eventSettings.dataSource = e.Items;
        _this.selectedDate = new Date(_this.year, _this.month - 1, 1);
        _this.weekSchedulingChanged = false;
        batchModify.reset();
      });
    }
  },
  watch: {
    year: function() {
      this.scheduleFilter();
    },
    month: function() {
      this.scheduleFilter();
    }
    // device: function() {
    //   this.scheduleFilter();
    // }
  },
  created: function() {
    let _this = this;
    // window.axios.get(configs.publicPath + "../device/SelectList").then(e => {
    //   if (e != null) {
    //     _this.devices = e.Items;
    //     _this.device = _this.devices[0].Id;
    //   }
    // });
    window.axios.get("/employee/SelectList?getAll=false&staffType=21,23,25,27,28,29").then(e => {
      _this.dsEmployee = [
        {
          Id: -1,
          Name: "移除排程項目",
          image: require("@/assets/erase.png")
        }
      ];
      if (e != null) {
        e.Items.forEach(employee => {
          employee.image = require("@/assets/doctor.png");
        });
        _this.dsEmployee = _this.dsEmployee.concat(e.Items);
        _this.scheduleFilter();
      }
    });
  },
  mounted: function() {
    this.employeeHeight = window.innerHeight - 454 + "px";
  }
};
</script>
<style>
.employeeSchedule .e-schedule .e-timeline-view .e-appointment {
  height: 24px;
}
</style>
