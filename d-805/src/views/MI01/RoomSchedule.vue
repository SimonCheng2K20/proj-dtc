<template>
  <div class="pt-0">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="12" class="float-left text-left">排程總覽．{{ selectedModality }}</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="3" class="px-1">
              <!-- <b-row no-gutters>
                <b-col sm="12" class="px-1">
                  檢查項目
                  <ejs-multiselect
                    v-model="selectCheckItem"
                    :dataSource="checkItems"
                    :fields="{ text: 'Name', value: 'Id' }"
                    placeholder="檢查項目"
                    mode="Box"
                  ></ejs-multiselect>
                </b-col>
              </b-row>-->
              <b-row no-gutters>
                <!-- <b-col class="px-1">
                  檢查室
                  <ejs-multiselect
                    v-model="selectLocation"
                    :dataSource="locations"
                    :fields="{ text: 'Name', value: 'Id' }"
                    placeholder="檢查室"
                    mode="Box"
                  ></ejs-multiselect>
                </b-col>-->
              </b-row>
            </b-col>
            <b-col sm="12" class="px-1">
              <ejs-schedule
                ref="schLocation"
                width="100%"
                height="780px"
                :timezone="timezone"
                :showHeaderBar="true"
                :showQuickInfo="true"
                currentView="Day"
                :timeScale="{ interval: 30, slotCount: 6 }"
                startHour="08:00"
                endHour="23:00"
                :workDays="[0, 1, 2, 3, 4, 5, 6]"
                :firstDayOfWeek="1"
                :workHours="{ start: '08:00', end: '23:00' }"
                :readonly="true"
                :eventSettings="eventSettings"
                :group="group"
                :navigating="schLocation_navigating"
                :eventRendered="schLocation_eventRendered"
                :eventClick="false"
              >
                <e-views>
                  <e-view option="Day" :eventTemplate="scheduleEventTemplate"></e-view>
                  <e-view option="Week" :eventTemplate="scheduleEventTemplate"></e-view>
                </e-views>
                <e-resources>
                  <e-resource
                    field="RoomId"
                    title="Location Type"
                    name="LocationView"
                    allowMultiple="true"
                    textField="Name"
                    idField="Id"
                    colorField="color"
                    :dataSource="dsLocationView"
                  ></e-resource>
                </e-resources>
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
import { extend } from "@syncfusion/ej2-base";
import { SchedulePlugin, Day, Week } from "@syncfusion/ej2-vue-schedule";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import tooltipTemplate from "../Schedule/Tooltip";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { MultiSelectPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import ScheduleEventTemplate from "@/components/ScheduleEventTemplate";

const colorList = ["#ea7a57", "#7fa900", "#5978ee", "#fec200", "#df5286", "#00bdae", "#865fcf", "#1aaa55", "#df5286", "#710193"];
Vue.use(SchedulePlugin);
Vue.use(TextBoxPlugin);
Vue.use(MultiSelectPlugin);

export default {
  data() {
    return {
      ObjApp: null,
      sockConnection: null,
      hubProxy: null,
      timezone: "Asia/Taipei",
      checkItems: [],
      // selectCheckItem: [],
      locations: [],
      selectLocation: [],
      currentView: "Day",
      startDate: new Date(),
      endDate: null,
      monthSchedule: [],
      group: {
        enableCompactView: false,
        resources: ["LocationView"]
      },
      dsLocationView: [{ Id: "" }],
      screenHeight: 100,
      eventSettings: {
        dataSource: [],
        fields: {
          id: "id",
          Type: { name: "Type", validation: { required: true } },
          subject: { name: "CheckItemName" },
          description: { name: "Description", validation: { required: true } },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } }
        },
        enableTooltip: true,
        tooltipTemplate: function() {
          return { template: tooltipTemplate };
        }
      },
      scheduleEventTemplate: function() {
        return {
          template: ScheduleEventTemplate
        };
      }
    };
  },
  props: {
    selectedModality: { Type: String, default: "" }
  },
  provide: {
    schedule: [Day, Week]
  },
  methods: {
    onEventClick() {},
    //用取得屬於此modality的檢查室列表
    async getModalityRooms() {
      if (this.selectedModality && this.selectedModality.length > 0) {
        console.log(this.$logs());
        let _this = this;
        //
        this.ObjApp.WaitingShow();
        let opStatus = false;
        //
        let itemPack = null;
        this.selectLocation = [];
        //
        // let checkItemArr = [];
        // items.forEach(i => {
        //   checkItemArr.push(i.ProcedureCode);
        // });
        // let checkItems = checkItemArr.join(",");
        //
        let subPath = "../exam/GetModalityRooms?modality=" + this.selectedModality;
        //
        new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            itemPack = r.actual; //資料;
            _this.locations = itemPack;
            itemPack.forEach(i => {
              _this.selectLocation.push(i.Id);
            });
            _this.scheduleFilter();

            // _this.locations.sort((a, b) => {
            //   return a.Name.localeCompare(b.Name, "zh-TW");
            //   // if (a.Name > b.Name) return 1;
            //   // else if (a.Name < b.Name) return -1;
            //   // else return 0;
            // });

            opStatus = true;
            this.ObjApp.WaitingHide();
          })
          .catch(e => {
            this.ObjApp.TimingMessage("讀取檢查室失敗! 請稍後再試.", 2);
            this.ObjApp.WaitingHide();
          });
      }
    },
    schLocation_navigating: function(e) {
      switch (e.action) {
        case "date":
          this.startDate = e.currentDate;
          break;
        case "view":
          this.currentView = e.currentView;
          break;
      }
      if (this.currentView == "Day") {
        this.endDate.setDate(this.startDate.getDate() + 1);
      } else if (this.currentView == "Week") {
        this.startDate = DateHelper.getWeekFist(this.startDate, false);
        this.endDate = DateHelper.getWeekLast(this.startDate, false);
      }
      this.scheduleFilter();
    },
    schLocation_eventRendered: function(args) {
      if (args.data.status === "free") {
        args.element.style.backgroundColor = "#bfbfbf";
      }

      if (args.data.IsBlock) {
        args.element.style.backgroundColor = "#444444";
      } else {
        if (args.data.Status >= "36") args.element.style.backgroundColor = "059e1c";
        else if (args.data.Status == "31") args.element.style.backgroundColor = "e009a7";
        else args.element.style.backgroundColor = "#EE7700";
      }
    },
    scheduleFilter: function() {
      let _this = this;
      this.$refs.schLocation.ej2Instances.selectedDate = new Date(this.startDate);
      window.axios.get("/schedule/GetUsingTimeSlot?startTime=" + this.startDate.toJSON() + "&endTime=" + this.endDate.toJSON()).then(e => {
        _this.monthSchedule = e.Items;
        _this.$refs.schLocation.ej2Instances.eventSettings.dataSource = extend([], _this.monthSchedule, null, true);
      });
    },
    getSelectList() {
      let _this = this;
      window.axios.get("/checkItem/SelectList").then(e => {
        if (e != null) {
          _this.checkItems = e.Items;
          // _this.selectCheckItem = _this.checkItems.map(i => i.Id);
        }
      });

      // window.axios.get("/room/SelectList").then(e => {
      //   _this.locations = e.Items;
      //   //

      //   // _this.selectLocation = _this.locations.map(i => i.Id);
      //   if (_this.selectLocation.length == 0)
      //     _this.selectLocation.push(_this.locations[0].Id);
      //   _this.scheduleFilter(_this.year, _this.month, _this.location);
      // });
    }
  },
  watch: {
    year: function(newValue, oldValue) {
      this.scheduleFilter(newValue, this.month);
    },
    month: function(newValue, oldValue) {
      this.scheduleFilter(this.year, newValue);
    },
    // selectCheckItem: function(newValue, oldValue) {
    //   let _this = this;
    //   this.$refs.schLocation.ej2Instances.eventSettings.dataSource = extend(
    //     [],
    //     this.monthSchedule.filter(t =>
    //       _this.selectCheckItem.some(c => c == t.CheckItemId)
    //     ),
    //     null,
    //     true
    //   );
    // },
    selectLocation: function(newValue, oldValue) {
      this.dsLocationView = [];
      let _this = this;
      this.locations.forEach(item => {
        if (newValue.some(l => l == item.Id))
          _this.dsLocationView.push({
            Id: item.Id,
            Name: item.Name,
            color: colorList[_this.dsLocationView.length % 10]
          });
      });
      localStorage.schedule_selectLocation = this.selectLocation;

      this.$refs.schLocation.ej2Instances.dataBind();
    }
  },
  created: function() {
    let _this = this;

    let methodName = "RoomSchedule";

    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }

    // this.startDate = DateHelper.getNextMonthFirst();
    this.startDate = new Date();
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.startDate.getDate() + 1);

    this.getModalityRooms();

    this.getSelectList();

    if (this.sockConnection == null) {
      this.sockConnection = $.hubConnection(configs.hubUrl);
      this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
    }
    // set up event listeners i.e. for incoming "message" event
    this.hubProxy.on("scheduleChanged", timeSlot => {
      let startTime = new Date(timeSlot.StartTime);
      if (
        _this.selectLocation.some(l => l == timeSlot.RoomId) &&
        // _this.selectCheckItem.some(i => i.Id == timeSlot.CheckItemId) &&
        _this.startDate <= startTime &&
        _this.endDate >= startTime
      ) {
        _this.scheduleFilter();
      }
      console.log(timeSlot.StartTime);
    });
    // this.sockConnection.events.on("onDisconnect", function() {
    //   setTimeout(function() {
    //     _this.hubProxy.start();
    //   }, 5000); // Restart connection after 5 seconds.you can set the time based your requirement
    // });
    this.sockConnection
      .start({ jsonp: true, transport: ["webSockets"] })
      .done(function(conn) {
        console.log("Now connected, connection ID=" + conn.id);
        console.log("Connected, transport = " + conn.transport.name);
      })
      .fail(function() {
        console.log("Could not connect");
      });
  },
  mounted() {}
};
</script>
