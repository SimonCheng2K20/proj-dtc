<template>
  <div class="pageLeftContent pb-1">
    <!-- <b-card-header class="bg-primary text-white cardHeader">
      <b-row no-gutters>
        <b-col cols="6">日班週排程</b-col>
      </b-row>
    </b-card-header>-->
    <b-container
      fluid
      class="px-1"
    >
      <b-row no-gutters>
        <b-col
          sm="2"
          class="p-1"
        >
          <b-card
            no-body
            class="mx-1"
            bg-variant="transparent"
          >
            <b-card-header class="bg-primary text-white cardHeader">
              <b-row no-gutters>
                <b-col>排班月份</b-col>
              </b-row>
            </b-card-header>
            <b-card-text class="text-left py-1">
              <b-container
                fluid
                class="px-1"
              >
                <b-row no-gutters>
                  <b-col class="px-1">
                    <ejs-dropdownlist
                      v-model="year"
                      :dataSource="years"
                      floatLabelType="Always"
                      placeholder="時段年份"
                    ></ejs-dropdownlist>
                  </b-col>
                </b-row>
                <b-row no-gutters>
                  <b-col class="px-1">
                    <ejs-dropdownlist
                      v-model="month"
                      :dataSource="months"
                      floatLabelType="Always"
                      placeholder="時段月份"
                    ></ejs-dropdownlist>
                  </b-col>
                </b-row>
                <b-row
                  no-gutters
                  class="mt-1"
                >
                  <b-col class="px-2">
                    <b-button
                      variant="success"
                      style="width: 80px;"
                      @click="onClear"
                    >
                      <font-awesome-icon icon="undo-alt" />還原 </b-button>&nbsp;
                    <b-button
                      variant="primary"
                      style="width: 80px;"
                      @click="onSave"
                      :disabled="!weekSchedulingChanged"
                    >
                      <font-awesome-icon icon="save" />儲存 </b-button>&nbsp;
                    <b-button
                      variant="danger"
                      style="width: 80px;"
                      @click="onExtend"
                    >
                      <font-awesome-icon icon="copy" />複製 </b-button>
                  </b-col>
                </b-row>
              </b-container>
            </b-card-text>
          </b-card>
          <b-card
            no-body
            class="m-1"
            bg-variant="transparent"
          >
            <b-card-header class="bg-primary text-white cardHeader">
              <b-row no-gutters>
                <b-col>選擇值班醫師</b-col>
              </b-row>
            </b-card-header>
            <b-card-text class="text-left py-1">
              <b-container
                fluid
                class="px-1"
              >
                <b-row no-gutters>
                  <b-col align="center">
                    <b-form-radio-group
                      v-model="isDated"
                      buttons
                      button-variant="outline-primary"
                    >
                      <b-form-radio value="false">例行排程</b-form-radio>
                      <b-form-radio value="true">指定日期</b-form-radio>
                    </b-form-radio-group>
                  </b-col>
                </b-row>
                <b-row
                  no-gutters
                  v-bind:style="{
                    height: employeeHeight,
                    overflow: 'auto',
                    width: '100%',
                  }"
                >
                  <b-col
                    sm="12"
                    class="px-1"
                    style="height:100%; overflow:auto;margin: 0px auto;"
                  >
                    <ejs-treeview
                      ref="treEmployee"
                      :allowDragAndDrop="true"
                      :fields="{
                        dataSource: dsEmployee,
                        id: 'Id',
                        text: 'Name',
                        imageUrl: 'image',
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
        <b-col
          sm="10"
          class="px-1"
        >
          <b-card
            no-body
            class="m-1 p-1"
            ref="scheduleCard"
          >
            <b-tabs v-model="currentTabItemId">
              <b-tab
                card
                :title="itemTab.Name"
                v-for="(itemTab, index) in itemTabs"
                :key="itemTab.No"
                class="py-2"
                :title-link-class="linkClass(index, itemTab)"
              >
                <template v-slot:title>
                  <font-awesome-icon
                    icon="check"
                    v-if="itemTab.Type == 'item'"
                  />
                  <font-awesome-icon
                    icon="box"
                    v-if="itemTab.Type == 'fix'"
                  />
                  <font-awesome-icon
                    icon="cubes"
                    v-if="itemTab.Type == 'combo'"
                  />
                  {{ itemTab.Name }}
                </template>

                <ejs-schedule
                  id="weekSchedule0"
                  v-if="index == 0"
                  ref="schEmployeeRef_0"
                  class="weekScheduling"
                  width="100%"
                  :height="scheduleHeight"
                  timezone="Asia/Taipei"
                  allowResizing="false"
                  :allowDragAndDrop="false"
                  :showHeaderBar="false"
                  :showQuickInfo="false"
                  :showTimeIndicator="false"
                  currentView="TimelineWeek"
                  :dateHeaderTemplate="dateHeaderTemplate"
                  :workDays="[0, 1, 2, 3, 4, 5, 6]"
                  :firstDayOfWeek="1"
                  :workHours="{ start: '00:00', end: '12:00' }"
                  :selectedDate="selectedDate"
                  :group="group"
                  :timeScale="{ interval: 720, slotCount: 1 }"
                  :eventRendered="onEventRendered"
                  :eventSettings="eventSettings"
                  :actionBegin="actionBegin"
                  :actionComplete="actionComplete"
                  :popupOpen="onPopupOpen"
                  :cellClick="onCellClick"
                  :eventClick="onEventClick"
                  :drag="onItemDrag"
                  :rowAutoHeight="true"
                >
                  <e-views>
                    <e-view
                      option="TimelineWeek"
                      :eventTemplate="employeeEventTemplate"
                    ></e-view>
                  </e-views>
                  <e-resources>
                    <e-resource
                      field="TagNo"
                      title="Modality Tag"
                      name="TagView"
                      allowMultiple="true"
                      textField="Name"
                      idField="No"
                      colorField="color"
                      :dataSource="dsTag"
                    ></e-resource>
                  </e-resources>
                </ejs-schedule>

                <ejs-schedule
                  id="weekSchedule1"
                  v-if="index == 1"
                  ref="schEmployeeRef_1"
                  class="weekScheduling"
                  width="100%"
                  :height="scheduleHeight"
                  timezone="Asia/Taipei"
                  allowResizing="false"
                  :allowDragAndDrop="false"
                  :showHeaderBar="false"
                  :showQuickInfo="false"
                  :showTimeIndicator="false"
                  currentView="TimelineWeek"
                  :dateHeaderTemplate="dateHeaderTemplate"
                  :workDays="[0, 5, 6]"
                  :showWeekend="false"
                  :firstDayOfWeek="5"
                  :workHours="{ start: '00:00', end: '12:00' }"
                  :selectedDate="selectedDate_special"
                  :group="group"
                  :timeScale="{ interval: 720, slotCount: 1 }"
                  :eventRendered="onEventRendered"
                  :eventSettings="eventSettings"
                  :actionBegin="actionBegin"
                  :popupOpen="onPopupOpen"
                  :cellClick="onCellClickSpecial"
                  :eventClick="onEventClick"
                  :drag="onItemDrag"
                >
                  <e-views>
                    <e-view
                      option="TimelineWeek"
                      :eventTemplate="employeeEventTemplate"
                    ></e-view>
                  </e-views>
                  <e-resources>
                    <e-resource
                      field="TagNo"
                      title="Modality Tag"
                      name="TagView"
                      allowMultiple="true"
                      textField="Name"
                      idField="No"
                      colorField="color"
                      :dataSource="specialDsTag"
                    ></e-resource>
                  </e-resources>
                </ejs-schedule>

                <!-- <b-container v-else fluid class="px-1">
                  <b-row no-gutters :style="{height:specialSlotSectionHeight+'px'}">
                    <b-col v-for="(index) in 2" v-bind:key="index" class="px-1">
                     
                      <SpecialTimeSlot v-if="index==0" :scections="specialSections_X" />
                      
                      <SpecialTimeSlot v-if="index==1" :scections="specialSections_CT_MRI" />
                    </b-col>
                  </b-row>
                </b-container>-->
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-modal
      v-model="historyExtend"
      title="選擇複製來源班表月份"
      ok-title="確定"
      cancel-title="取消"
      @ok="scheduleFilterForHistoryImport"
    >
      <b-container
        fluid
        class="px-1"
      >
        <b-row no-gutters>
          <b-col class="px-1">
            <ejs-dropdownlist
              v-model="srcYear"
              :dataSource="years"
              floatLabelType="Always"
              placeholder="時段年份"
            ></ejs-dropdownlist>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-col class="px-1">
            <ejs-dropdownlist
              v-model="srcMonth"
              :dataSource="months"
              floatLabelType="Always"
              placeholder="時段月份"
            ></ejs-dropdownlist>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal
      v-model="isDatedSchduling"
      title="選擇指定日期"
      ok-title="確定"
      cancel-title="取消"
      @ok="addEmployeeEventOnDatedScheduled"
    >
      <b-container
        fluid
        class="px-1"
      >
        <b-row no-gutters>
          <b-col class="px-1">
            <ejs-dropdownlist
              v-model="DatedSchedule"
              :dataSource="datesSchedulesObj.schedules"
              floatLabelType="Always"
              placeholder="日期"
              :fields="{ text: 'label', value: 'value' }"
            ></ejs-dropdownlist>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import { addClass, closest } from "@syncfusion/ej2-base";
import { SchedulePlugin, Week, TimelineViews, DragAndDrop } from "@syncfusion/ej2-vue-schedule";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import BatchModify from "@/library/BatchModify";
import { TreeViewPlugin } from "@syncfusion/ej2-vue-navigations";
import DayHeaderTemplate from "@/components/DayHeaderTemplate";
import EmployeeEventTemplate from "@/components/EmployeeEventTemplate";
import Common from "@/library/Common";
import tooltipTemplate from "./Tooltip";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";

Vue.use(SchedulePlugin);
Vue.use(TreeViewPlugin);
Vue.use(DropDownListPlugin);

const colorList = ["#ea7a57", "#7fa900", "#5978ee", "#fec200", "#df5286", "#00bdae", "#865fcf", "#1aaa55", "#df5286", "#710193"];
let batchModify = new BatchModify();

export default {
  provide: {
    schedule: [Week, TimelineViews, DragAndDrop],
  },

  data () {
    return {
      activeTab: "default",
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      year: DateHelper.getNextMonthFirst().getFullYear(),
      srcYear: DateHelper.getNextMonthFirst().getFullYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      month: DateHelper.getNextMonthFirst().getMonth() + 1,
      srcMonth: DateHelper.getNextMonthFirst().getMonth() + 1,
      employeeHeight: "auto",
      scheduleHeight: "780px",
      dsEmployee: [],
      selectEmployeeId: null,
      prevCliekEmployeeNode: null,
      selectedDate: new Date(2001, 0, 1),
      selectedDate_special: new Date(2001, 5, 1),
      group: {
        enableCompactView: false,
        resources: ["TagView"],
      },
      dsTag: [],
      specialDsTag: [],
      eventSettings: {
        dataSource: [],
        fields: {
          id: "Id",
          subject: { name: "EmployeeName" },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } },
        },
        enableTooltip: true,
        tooltipTemplate () {
          return { template: tooltipTemplate };
        },
      },
      dateHeaderTemplate () {
        return {
          template: DayHeaderTemplate,
        };
      },
      employeeEventTemplate () {
        return {
          template: EmployeeEventTemplate,
        };
      },
      // dsDeviceCheckItem: [],
      weekSchedulingChanged: false,
      historyExtend: false,
      isDated: "false",
      isDatedSchduling: false,
      DatedSchedule: null,
      datesSchedulesObj: {
        employee: null,
        args: null,
        schedules: [],
        type: 0,
      },
      datedSchPopup: {
        top: "0px",
        left: "0px",
      },
      itemTabs: [
        {
          Name: "日班週排程",
          No: "0",
          Type: "fix",
        },
        {
          Name: "特殊時段排程",
          No: "1",
          Type: "item",
        },
      ],
      currentTabItemId: null,
      specialSlotSectionHeight: 400,
      //
      specialSections_X: [{ sectionTitle: "週五 14:00 ~ 週六 12:00" }, { sectionTitle: "週六 12:00 ~ 週日 12:00" }],
      specialSections_CT_MRI: [{ sectionTitle: "週五 17:00 ~ 週六 12:00" }, { sectionTitle: "週六 12:00 ~ 週日 12:00" }],
      //
      //暫存shcedule的scroll bar 位置, 因為schedule每次 create 或 remove後都re-render回最top
      schScrollOffsetY: 0,
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
    GetSchEmployeeRef () {
      return "schEmployeeRef_" + this.currentTabItemId;
    },
    historyExtendTitle () {
      return "排班: " + this.year + "年" + this.month + "月";
    },
  },
  methods: {
    //
    linkClass (idx, itemTab) {
      if (this.currentTabItemId === idx) {
        return ["mr-1", "bg-info", "text-white", "font-weight-bold"];
      } else {
        return ["mr-1", "bg-light", "text-info", "border-info"];
      }
    },
    //
    onEventRendered (args) {
      switch (args.data.Type) {
        case 0:
          args.element.style.backgroundColor = "#F57F17";
          break;
        case 1:
          args.element.style.backgroundColor = "#df0000";
          break;
        case 2:
          args.element.style.backgroundColor = "#8e24aa";
          break;
        case 3:
          args.element.style.backgroundColor = "#5e007a";
          break;
      }
    },
    actionFailure (args) {
      Common.actionFailure(args);
    },
    actionBegin (args) {
      var schEmployee = this.$refs[this.GetSchEmployeeRef][0].ej2Instances.eventSettings.dataSource;
      switch (args.requestType) {
        case "eventCreate":
          var weekScheduling = args.data[0];
          var tagNo = weekScheduling.TagNo;
          if (tagNo == "EMERG_X") {
            //設定特殊時段
            if (weekScheduling.StartTime.getDay() == 5) {
              //週五1400 ~ 週六1200
              weekScheduling.StartTime.setHours(14);
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate() + 1);
              weekScheduling.EndTime.setHours(12);
            } else if (weekScheduling.StartTime.getDay() == 6 && weekScheduling.StartTime.getHours() < 12) {
              //週五1400 ~ 週六1200
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate());
              weekScheduling.EndTime.setHours(12);
              weekScheduling.StartTime.setDate(weekScheduling.StartTime.getDate() - 1);
              weekScheduling.StartTime.setHours(14);
            } else if (weekScheduling.StartTime.getDay() == 6 && weekScheduling.StartTime.getHours() >= 12) {
              //週六1200 ~ 週日1200
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate() + 1);
              weekScheduling.EndTime.setHours(12);
            } else if (weekScheduling.StartTime.getDay() == 0) {
              //週六1200 ~ 週日1200
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate());
              weekScheduling.EndTime.setHours(12);
              weekScheduling.StartTime.setDate(weekScheduling.StartTime.getDate() - 1);
              weekScheduling.StartTime.setHours(12);
            }
          } else if (tagNo == "EMERG_CTMR") {
            //設定特殊時段
            if (weekScheduling.StartTime.getDay() == 5) {
              //週五1400 ~ 週六1200
              weekScheduling.StartTime.setHours(17);
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate() + 1);
              weekScheduling.EndTime.setHours(12);
            } else if (weekScheduling.StartTime.getDay() == 6 && weekScheduling.StartTime.getHours() < 12) {
              //週五1400 ~ 週六1200
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate());
              weekScheduling.EndTime.setHours(12);
              weekScheduling.StartTime.setDate(weekScheduling.StartTime.getDate() - 1);
              weekScheduling.StartTime.setHours(17);
            } else if (weekScheduling.StartTime.getDay() == 6 && weekScheduling.StartTime.getHours() >= 12) {
              //週六1200 ~ 週日1200
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate() + 1);
              weekScheduling.EndTime.setHours(12);
            } else if (weekScheduling.StartTime.getDay() == 0) {
              //週六1200 ~ 週日1200
              // weekScheduling.EndTime.setDate(
              //   weekScheduling.StartTime.getDate()
              // );
              // weekScheduling.EndTime.setHours(12);
              weekScheduling.StartTime.setDate(weekScheduling.StartTime.getDate() - 1);
              weekScheduling.StartTime.setHours(12);
              weekScheduling.EndTime.setDate(weekScheduling.StartTime.getDate() + 1);
              weekScheduling.EndTime.setHours(12);
            }
          } else if (tagNo == "PhysicalExam" && weekScheduling.StartTime.getDay() >= 1 && weekScheduling.StartTime.getDay() <= 5) {
            if (weekScheduling.StartTime.getHours() < 12) {
              weekScheduling.EndTime.setHours(14);
            } else {
              weekScheduling.StartTime.setHours(14);
            }
          } else {
            //TODO: "PhysicalExam" 健檢片也是特殊時間
            if (weekScheduling.StartTime.getDay() == 0 || weekScheduling.StartTime.getDay() == 6) {
              weekScheduling.StartTime = new Date(weekScheduling.StartTime.getFullYear(), weekScheduling.StartTime.getMonth(), weekScheduling.StartTime.getDate());
              weekScheduling.EndTime = new Date(weekScheduling.StartTime);
              weekScheduling.EndTime.setDate(weekScheduling.EndTime.getDate() + 1);
            }
          }

          if (
            schEmployee.some(
              (s) =>
                s.EmployeeId == weekScheduling.EmployeeId &&
                s.TagNo == weekScheduling.TagNo &&
                s.WorkDate == weekScheduling.WorkDate &&
                new Date(s.StartTime).getTime() == weekScheduling.StartTime.getTime()
            )
          ) {
            Swal.fire("『" + weekScheduling.EmployeeName + "』醫師已排入該時段，無須重複排入！", "", "info");
            args.cancel = true;
            return;
          }

          batchModify.insert(weekScheduling);
          this.weekSchedulingChanged = true;
          break;
        case "eventRemove":
          batchModify.delete(args.data);
          this.weekSchedulingChanged = batchModify.hasChanged();
          break;
      }
    },
    actionComplete (args) {
      console.log("action complate");
      if (args.requestType == "eventCreated" || args.requestType == "eventRemoved") {
        this.schScrollOffsetY = this.$refs[this.GetSchEmployeeRef][0].$el.scrollTop;
      }
    },
    onPopupOpen (args) {
      if (args.type != "DeleteAlert" && args.type != "EventContainer") {
        args.cancel = true;
        return;
      }
    },
    addEmployeeEvent (employee, args, type) {
      let startTime = args.startTime;
      let endTime = args.endTime;
      let tagNo = this.dsTag[args.groupIndex].No;
      //
      //特殊時段排程
      if (type == 1) {
        tagNo = this.specialDsTag[args.groupIndex].No;
      }

      let scheduling = {
        StartTime: args.startTime,
        EndTime: args.endTime,
        EmployeeId: employee.Id,
        EmployeeName: employee.Name,
        WorkDate: 0,
        WorkMonth: this.month,
        TagNo: tagNo,
      };
      this.$refs[this.GetSchEmployeeRef][0].addEvent(scheduling);
    },
    /**
     * James fixed - 指定日期新增排班
     */
    addEmployeeEventOnDatedScheduled () {
      let employee = this.datesSchedulesObj.employee;
      let args = this.datesSchedulesObj.args;
      let workDate = this.DatedSchedule;
      let tagNo = this.dsTag[args.groupIndex].No;
      if (this.datesSchedulesObj.type == 1) {
        tagNo = this.specialDsTag[args.groupIndex].No;
      }
      let scheduling = {
        StartTime: args.startTime,
        EndTime: args.endTime,
        EmployeeId: employee.Id,
        EmployeeName: employee.Name,
        WorkDate: workDate,
        WorkMonth: this.month,
        TagNo: tagNo,
      };
      this.$refs[this.GetSchEmployeeRef][0].addEvent(scheduling);
    },
    addEvent (employee, args, type) {
      let cursorDiffPos = this.getCursorDiffPos(event);
      this.datedSchPopup.left = cursorDiffPos[0] + "px";
      this.datedSchPopup.top = cursorDiffPos[1] + "px";

      if (this.isDated == "true") {
        this.DatedSchedule = null;
        let daDate = new Date(this.year, this.month - 1, 1);
        this.isDatedSchduling = true;
        let daDay = args.startTime.getDay();
        this.datesSchedulesObj.schedules = DateHelper.getAllSpecificDayInDaMonth(daDate, daDay);
        this.DatedSchedule = this.datesSchedulesObj.schedules[0].value;
        this.datesSchedulesObj.employee = employee;
        this.datesSchedulesObj.args = args;
        this.datesSchedulesObj.type = type;
      } else {
        this.addEmployeeEvent(employee, args, type);
      }
    },
    onCellClick (args) {
      if (this.selectEmployeeId > 0) {
        var employee = this.dsEmployee.find((s) => s.Id == this.selectEmployeeId);
        this.addEvent(employee, args, 0);
      }
    },
    //
    //特殊時段排程 醫師排班
    onCellClickSpecial (args) {
      if (this.selectEmployeeId > 0) {
        var employee = this.dsEmployee.find((s) => s.Id == this.selectEmployeeId);
        this.addEvent(employee, args, 1);
      }
    },

    onEventClick (args) {
      if (this.selectEmployeeId < 0) {
        this.$refs[this.GetSchEmployeeRef][0].ej2Instances.deleteEvent(args.event);
      }
    },
    onItemDrag (event) {
      let scheduleObj = this.$refs[this.GetSchEmployeeRef][0].ej2Instances;
      if (scheduleObj.isAdaptive) {
        let classElement = document.querySelector(".e-device-hover");
        if (classElement) {
          classElement.classList.remove("e-device-hover");
        }
        if (event.target.classList.contains("e-work-cells")) {
          addClass([event.target], "e-device-hover");
        }
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
    onTreeDragStop (event) {
      let type = this.currentTabItemId;
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
            let cellData = this.$refs[this.GetSchEmployeeRef][0].getCellDetails(event.target);
            var employee = this.dsEmployee.find((s) => s.Id == event.draggedNodeData.id);
            this.addEvent(employee, cellData, type);
          }
        }
      }
    },
    nodeSelected (args) {
      this.selectEmployeeId = args.nodeData.id;
    },
    nodeClicked (args) {
      if (this.prevCliekEmployeeNode == args.node) {
        this.prevCliekEmployeeNode = null;
        this.selectEmployeeId = null;
        this.$refs.treEmployee.ej2Instances.selectedNodes = [];
      } else this.prevCliekEmployeeNode = args.node;
    },
    onSave () {
      let _this = this;
      this.weekSchedulingChanged = false;
      window.axios
        .put("/weekScheduling/UpdateMonth?year=" + this.year + "&month=" + this.month, batchModify.modifyData)
        .then(() => {
          batchModify.reset();
          Swal.fire({
            type: "success",
            title: "儲存成功！",
            timer: 1500,
          });
          _this.scheduleFilter();
        })
        .catch(function (error) {
          _this.weekSchedulingChanged = true;
          Swal.fire("儲存失敗！", error, "error");
        });
    },
    onClear () {
      let _this = this;
      Swal.fire({
        title: "確認還原？",
        text: "這樣將會放棄您本次所有的修改！",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "確定還原！",
        cancelButtonText: "取消",
      }).then(function (e) {
        if (e.value) {
          _this.scheduleFilter();
        }
      });
    },
    onExtend () {
      this.historyExtend = !this.historyExtend;
    },
    scheduleFilter (freezeModify) {
      if (freezeModify) return;
      let _this = this;
      window.axios.get("/weekScheduling/Month?year=" + this.year + "&month=" + this.month).then((e) => {
        //Sort 1: workdate(有指定日期) 排序
        e.Items.sort((a, b) => {
          return a.WorkDate - b.WorkDate;
        });
        _this.$refs[_this.GetSchEmployeeRef][0].ej2Instances.eventSettings.dataSource = e.Items;
        _this.weekSchedulingChanged = false;
        batchModify.reset();
      });
    },
    /**James fixed - 匯入過去月份排班*/
    scheduleFilterForHistoryImport () {
      //get old items
      let oldItems = this.$refs[this.GetSchEmployeeRef][0].ej2Instances.eventSettings.dataSource;
      oldItems.forEach((i) => {
        batchModify.delete(i);
      });
      this.weekSchedulingChanged = true;

      let _this = this;
      window.axios.get("/weekScheduling/Month?year=" + this.srcYear + "&month=" + this.srcMonth).then((e) => {
        _this.$refs[_this.GetSchEmployeeRef][0].ej2Instances.eventSettings.dataSource = e.Items;
        let dataItems = e.Items;
        //_this.weekSchedulingChanged = false;
        // batchModify.reset();
        this.weekSchedulingChanged = true;

        for (var i = 0; i < dataItems.length; i++) batchModify.insert(dataItems[i]);
      });
    },
    /**James fixed - 取得滑鼠座標與畫面中心x, y 差距*/
    getCursorDiffPos (event) {
      let cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;

      //x軸加上偏移量, 讓dialog不要擋住cell
      return [event.pageX - cx - 110, event.pageY - cy];
    },
    windowResizeHandler () {
      this.employeeHeight = window.innerHeight - 484 + "px";
    },
  },
  watch: {
    currentTabItemId (newValue) {
      if (newValue == 0) {
        let oldItems = this.$refs["schEmployeeRef_1"][0].ej2Instances.eventSettings.dataSource;
        this.$refs["schEmployeeRef_0"][0].ej2Instances.eventSettings.dataSource = oldItems;
      } else {
        let oldItems = this.$refs["schEmployeeRef_0"][0].ej2Instances.eventSettings.dataSource;
        this.$refs["schEmployeeRef_1"][0].ej2Instances.eventSettings.dataSource = oldItems;
      }
      this.scheduleFilter(true);
    },
    year () {
      this.scheduleFilter();
    },
    month () {
      this.scheduleFilter();
    },
  },
  created () {
    let _this = this;

    window.addEventListener("resize", this.windowResizeHandler);

    this.specialDsTag = [
      {
        Name: "急診X光",
        No: "EMERG_X",
        color: colorList[0],
      },
      {
        Name: "急診CT/MRI",
        No: "EMERG_CTMR",
        color: colorList[1],
      },
    ];

    window.axios.get("/procedureGroup/SelectNoList").then((e) => {
      if (e != null) {
        e.Items.forEach((item) => {
          _this.dsTag.push({
            No: item.No,
            Name: item.Name,
            color: colorList[_this.dsTag.length % 10],
          });
        });
      }
    });
    window.axios.get("/employee/SelectList?getAll=false&staffType=21,23,25,27,28,29&$filter=InstitutionId eq 270").then((e) => {
      this.dsEmployee = [
        {
          Id: -1,
          Name: "移除排程項目",
          image: require("@/assets/erase.png"),
        },
      ];
      if (e != null) {
        e.Items.forEach((employee) => {
          employee.image = require("@/assets/doctor.png");
        });
        _this.dsEmployee = _this.dsEmployee.concat(e.Items);
        _this.scheduleFilter();
      }
    });
  },
  destroyed () {
    window.removeEventListener("resize", this.windowResizeHandler);
  },
  mounted () {
    this.employeeHeight = window.innerHeight - 389 + "px";
    this.scheduleHeight = window.innerHeight - 145 + "px";
  },
};
</script>
<style>
#weekSchedule0 .e-appointment {
  height: 26px !important;
}

.ldiv {
  height: 100%;
}

.weekScheduling > .e-header-date,
.e-navigate {
  height: 0px !important;
  display: none;
}

.datedSchPopup {
  width: 200px;
  max-width: 300px;
}

.e-text-content {
  margin-left: -50px !important;
}
</style>
<style lang="scss">
div.darkTheme {
  .e-list-text {
    color: #fff;
  }
}

div.lightTheme {
  .e-list-text {
    color: #333;
  }
}
</style>
