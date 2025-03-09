<template>
  <div fluid class="px-1 cal-bg" :style="linkStyle">
    <!-- 
    <div v-text="tabIndex" />
    <div v-text="itemTabs[this.tabIndex].MargeCheckItemIds" /> -->
    <b-row no-gutters>
      <b-col lg="3" cols="12" class="px-1 py-1">
        <b-row no-gutters>
          <b-col class="px-1">
            <div class="d-flex justify-content-between aling-items-center notice-message">
              <div class="text-danger" v-if="modalityStatus.ctmri">
                ※所有放射科施打顯影劑檢查不得同一天進行※
              </div>
              <b-button
                v-if="modalityStatus.mri || modalityStatus.ct"
                size="sm"
                variant="primary"
                @click.stop="$refs.remaining.show()"
                >{{
                  modalityStatus.mri ? "MRI" : modalityStatus.ct ? "CT" : ""
                }}提示</b-button
              >
            </div>

            <infoCard
              ref="infoCard"
              class="q-mt-md"
              title="病患資訊"
              :itemInfo="patientInfoArr"
              :maxHeight="patientInfoCardMaxHeight"
            />

            <infoCard
              class="q-mt-md"
              colorStyle="3"
              :title="bookingInfoCardTitle"
              :itemInfo="bookStateInfo"
              :BtnClick="CancelScheduleItem"
              :maxHeight="bookingInfoCardMaxHeight"
              :toEmit="ClickBookingInfoTag"
              :booking="true"
            />
          </b-col>
        </b-row>
        <!-- <infoCard class="q-mt-md" title="病患資訊" :itemInfo="patientInfoArr" />
        <infoCard class="q-mt-md" colorStyle="3" :title="bookStateInfo.title" :itemInfo="bookStateInfo.value" />-->
      </b-col>

      <b-col lg="9" cols="12" class="px-1">
        <b-card no-body class="m-2" ref="scheduleCard">
          <b-tabs v-model="tabIndex" lazy>
            <b-tab
              card
              :title="itemTab.Name"
              v-for="(itemTab, index) in itemTabs"
              :value="itemTab.Id"
              :key="itemTab.No"
              class="py-2"
              :title-link-class="linkClass(index, itemTab)"
              style="min-height: 700px"
            >
              <template v-slot:title>
                <font-awesome-icon icon="check" v-if="itemTab.Type == 'item'" />
                <font-awesome-icon icon="box" v-if="itemTab.Type == 'fix'" />
                <font-awesome-icon icon="cubes" v-if="itemTab.Type == 'combo'" />
                {{ itemTab.Name }}
              </template>

              <div class="d-flex justify-content-end align-items-center px-2">
                <div class="monthColumn">
                  <b-input-group prepend="選擇月份">
                    <b-form-input
                      id="type-days"
                      min="1"
                      max="12"
                      v-model="limitMonths"
                      type="number"
                    />
                  </b-input-group>
                </div>

                <div class="startTimeColumn mx-2">
                  <b-input-group prepend="開始時間">
                    <!-- <b-form-input id="type-date" v-model="quickDate" type="date" @change="changeStartTime" /> -->
                    <div class="flex-1">
                      <ejs-datetimepicker
                        v-model="quickDate"
                        step="5"
                        :allowEdit="false"
                        :validationRules="{ required: true }"
                        format="yyyy-MM-dd HH:mm"
                        :showClearButton="false"
                        :showTodayButton="false"
                        @change="changeDateTimePicker"
                      />
                    </div>
                  </b-input-group>
                </div>
                <b-button
                  @click.stop="quicklyPickUp"
                  :disabled="!isAbleToQuicklySelect"
                  variant="primary"
                  >快速選擇</b-button
                >
              </div>
              <!-- :ref="itemTab.MargeCheckItemIds" -->
              <!-- :ref="itemTab.Id" -->
              <scheduleView
                :ref="itemTab.Id"
                :type="itemTab.Type"
                :viewDate="viewDate"
                :patientInfo="patientInfos"
                :bookingInfo="bookingInfo"
                :itemTab="itemTab"
                :shouldBack="shouldBack"
                :isLimit="isOutSidePage"
                :modality="itemTab.Modality"
                v-on:AddTimeSlot="AddTimeSlot"
                v-on:Refresh="RefreshScheduleItemFromList"
              ></scheduleView>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>

    <b-modal ref="remaining" id="remaining" hide-footer class="remain">
      <template v-slot:modal-title> 提醒 </template>
      <div v-if="modalityStatus.mri">
        <p>MRI檢查排程前請先確認預約，若有以下之情形，請病人至放射櫃檯安排檢查:</p>
        <p>
          (一)心臟節律器 <br />
          (二)體內去顫器(不可執行MRI) <br />
          (三)顱內引流管 <br />
          (四) 其他體內電子植入物 <br />
          (五) 一個月內裝置之金屬植入物 <br />
          (六)有懷孕可能 <br />
          (七)需執行小兒鎮靜<br />
          (八)急做及特殊需求請至放射科排程
        </p>
        <p>
          MRI Breast檢查請安排在月經結束後7-10天執行檢查。具有MRI
          Abdomen之檢查，請病人禁食四小時。
        </p>
      </div>

      <div v-if="modalityStatus.ct">
        <p>CT檢查排程前請先確認，若有以下之情形，請病人至放射櫃檯安排檢查:</p>
        <p>
          <span class="notice-paragraph">
            (一)不打藥項目，可至放射科櫃台等候，不需排程<br />
          </span>
          (二)急做及特殊需求請至放射科排程
        </p>
      </div>

      <b-button class="mt-3" block @click="$refs.remaining.hide()">Close Me</b-button>
    </b-modal>
  </div>
</template>

<script>
// import Vue from "vue";
import scheduleView from "./ScheduleMain";
import * as configs from "@/config";
import moment from "moment";
import infoCard from "./InfoCard";
import Swal from "sweetalert2";
import { mapMutations } from "vuex";
import socketService from "@/mixins/socketConnectionService.js";
// import { modalityKey } from "@/assets/js/common.js";

const colorList = [
  "#ea7a57",
  "#7fa900",
  "#5978ee",
  "#fec200",
  "#df5286",
  "#00bdae",
  "#865fcf",
  "#1aaa55",
  "#df5286",
  "#710193",
];
// const hubReconnectCountLimit = 3;

const tabVariant_bright = [
  ["mr-1", "bg-info", "text-white", "font-weight-bold"],
  ["mr-1", "bg-warning", "text-white", "font-weight-bold"],
  ["mr-1", "bg-primary", "text-white", "font-weight-bold"],
  ["mr-1", "bg-danger", "text-white", "font-weight-bold"],
];

const tabVariant_dark = [
  ["mr-1", "bg-dark", "text-info", "border-secondary"],
  ["mr-1", "bg-dark", "text-warning", "border-secondary"],
  ["mr-1", "bg-dark", "text-primary", "border-secondary"],
  ["mr-1", "bg-dark", "text-danger", "border-secondary"],
];

//import "muse-ui/dist/muse-ui.css";
export default {
  name: "bookingView",
  props: ["bookingObjs", "bookingDate", "patientInfo", "shouldBack", "bookingProxy"],
  data() {
    return {
      selectLocation: [],
      locations: [],
      bookStateInfo: [],
      ObjApp: null,
      // sockConnection: null,
      localBookingProxy: null,
      // hubReconnectCount: 0,
      destroyed: false,
      bookingInfo: [],

      currentTabItemId: null,
      itemTabs: [],
      viewDate: new Date(),
      patientInfos: null,
      checkItems: null,
      quickDate: null,
      limitMonths: 1,

      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black,
      },

      //資訊卡最大高度
      patientInfoCardMaxHeight: 500,
      bookingInfoCardMaxHeight: 420,
      //
      patientInfoArr: [],
      tabIndex: 0,
      isMounted: false,
    };
  },
  components: {
    scheduleView,
    infoCard,
  },
  mixins: [socketService],
  beforeMount() {
    this.$root.$on("close-dtc-booking-dlg", () => {
      this.patientInfos = {};
      //alert("close-dtc-booking-dlg");
    });
  },
  watch: {
    selectLocation: function (newValue) {
      this.dsLocationView = [];
      let _this = this;
      this.locations.forEach((item) => {
        if (newValue.some((l) => l == item.Id))
          _this.dsLocationView.push({
            Id: item.Id,
            Name: item.Name,
            color: colorList[_this.dsLocationView.length % 10],
          });
      });
      // this.$refs.schLocation.ej2Instances.dataBind();
    },
    "modalityStatus.mri"(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.$refs.remaining.show();
      }
    },
    "modalityStatus.ct"(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.$refs.remaining.show();
      }
    },
    tabIndex(val) {
      if (this.itemTabs.length === 0) return;
      this.currentTabItemId = this.itemTabs[val].Id;
    },
    scheduleCompons(val) {
      const isExpire = !this.$moment(val.limitations[val.modality]).isAfter(
        this.$moment().add(1, "days").format("YYYY-MM-DD 08:00:00")
      );
      this.quickDate = isExpire
        ? this.$moment().add(1, "days").format("YYYY-MM-DD 08:00:00")
        : this.$moment(val.limitations[val.modality]).format("YYYY-MM-DD 08:00:00");
    },
  },
  methods: {
    ...mapMutations(["SET_SIDE_MESSAGE"]),
    changeDateTimePicker({ value }) {
      this.viewDate = value;
      this.reFreshData({ StartTime: value });
      // this.RefreshScheduleItemFromList();
    },
    changeStartTime(val) {
      if (this.scheduleCompons.isLimit) {
        const isExpire = !this.$moment(
          this.scheduleCompons.limitations[this.scheduleCompons.modality]
        ).isAfter(this.$moment().add(1, "days").format("YYYY-MM-DD 08:00:00"));
        const limitTime = isExpire
          ? this.$moment().add(1, "days").format("YYYY-MM-DD 08:00:00")
          : this.$moment(
              this.scheduleCompons.limitations[this.scheduleCompons.modality]
            ).format("YYYY-MM-DD 08:00:00");
        if (limitTime > val) {
          this.quickDate = limitTime;
          this.SET_SIDE_MESSAGE({ msg: "選擇時間不得低於限制時間", type: 2 });
        }
      }
    },
    quicklyPickUp() {
      this.scheduleCompons.getFirstFreeTime({
        dateTime: this.$moment(this.quickDate).toJSON(),
        days: this.limitMonths * 31,
      });
      // this.$refs[this.itemTabs[this.tabIndex].MargeCheckItemIds][0].getFirstFreeTime({dateTime: this.$moment(this.quickDate).toJSON(), days: this.limitMonths * 31});
    },
    getPatientInfoArr: function () {
      // const s = JSON.stringify(this.patientInfos);
      //alert(s);
      let info = [
        {
          label: "申請單號",
          value: this.orderNumbers,
        },
        {
          label: "病歷號碼",
          value: this.patientInfos.hrNum,
        },
        {
          label: "病患來源",
          value: this.patientInfos.sourceType,
        },
        {
          label: "病患姓名",
          value: this.patientInfos.name,
        },
        {
          label: "身分證號",
          value: this.patientInfos.id,
        },
        {
          label: "病患性別",
          value:
            this.patientInfos.gender == "F"
              ? "女"
              : this.patientInfos.gender == "M"
              ? "男"
              : "O",
        },
        {
          label: "病患生日",
          value: moment(this.patientInfos.birthDay).format("YYYY-MM-DD"),
        },
        {
          label: "電話[住家]",
          value: this.patientInfos.PhoneNo4Residence,
        },
        {
          label: "電話[手機]",
          value: this.patientInfos.PhoneNo4Mobile,
        },
        {
          label: "電話[工作]",
          value: this.patientInfos.PhoneNo4Work,
        },
      ];

      window.dtcNP = Object.assign({}, this.patientInfos);

      return info;
    },
    ShowToast(title, msg, type = 1) {
      let hClass = ["bg-success", "text-light", "zhTW"];
      let bClass = ["bg-light", "text-dark", "zhTW"];
      let hideDelay = 3000;
      let noHide = false;
      if (type == 2) {
        hClass = ["bg-danger", "text-light", "zhTW"];
        bClass = ["bg-light", "text-danger", "zhTW"];
      } else if (type == 3) {
        hClass = ["bg-warning", "text-dark", "zhTW"];
        bClass = ["bg-light", "text-danger", "zhTW"];
        hideDelay = 0;
        noHide = true;
      }

      this.$bvToast.toast(msg, {
        id: "myToast",
        title: title,
        headerClass: hClass,
        bodyClass: bClass,
        autoHideDelay: hideDelay,
        noAutoHide: noHide,
        appendToast: true,
      });
    },
    //hub connection
    // ConnectionHubConnection () {
    //   // connect
    //   let _this = this;
    //   if (this.sockConnection == null) {
    //     this.sockConnection = $.hubConnection(configs.hubUrl);
    //     this.bookingProxy = this.sockConnection.createHubProxy("bookingHub");
    //     this.bookingProxy.on("statusChanged", timeSlot => {
    //       alert(timeSlot);
    //       this.reFreshData(timeSlot);
    //     });

    //     this.sockConnection.disconnected(() => {
    //       setTimeout(() => {
    //         _this.sockConnection.stop();
    //         _this.sockConnection = null;
    //         if (!_this.destroyed) {
    //           _this.hubReconnectCount++;
    //           if (_this.hubReconnectCount <= _this.hubReconnectCountLimit) {
    //             let msg = "";
    //             if (_this.sockConnection.lastError) msg = _this.sockConnection.lastError.message;

    //             //依照指示, 不顯示重連線訊息
    //             // _this.$bvToast.hide("myToast");
    //             // _this.ShowToast(
    //             //   "連線中斷",
    //             //   `錯誤訊息: ${msg}, 重新連線中, 嘗試第 ${_this.hubReconnectCount} 次`,
    //             //   2
    //             // );

    //             _this.ConnectionHubConnection();
    //           } else {
    //             alert("hubconnection連線中斷, 請嘗試重新開啟頁面, 或通報資訊人員.");
    //           }
    //         }
    //       }, 3000);
    //     });

    //     this.sockConnection.reconnecting(() => {
    //       console.log(this.$logs('hubconnection 重新連線中...'))
    //     });

    //     this.sockConnection.reconnected(() => {
    //       _this.useWebSocket = true;
    //       console.log(this.$logs('hubconnection 已重新連線.'))
    //     });
    //   }

    //   this.sockConnection
    //     .start({ jsonp: true, transport: ["webSockets",'serverSentEvents'] })
    //     .done(function (conn) {
    //       //將斷線偵測的timeout 調整到12秒 (預設為30秒)
    //       conn.disconnectTimeout = 12000;
    //       console.log("Now connected, connection ID=" + conn.id);
    //       console.log("Connected, transport = " + conn.transport.name);
    //     })
    //     .fail(function (e) {
    //         _this.useWebSocket = false;
    //       console.log("Could not connect");
    //     });
    // },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === "ArrowLeft") {
        // //粗體Method自定義
        this.GoPrevious();
      } else if (event.code === "ArrowRight") {
        // //粗體Method自定義
        this.GoNext();
      }
    },
    GoPrevious() {
      let _this = this;
      let index = 0;
      this.itemTabs.forEach((i) => {
        if (index == _this.currentTabItemId) {
          if (_this.$refs[i.MargeCheckItemIds]) {
            _this.$refs[i.MargeCheckItemIds].forEach((y) => y.triggerGoPrevious());
            return;
          }
        }
        index++;
      });
    },
    GoNext() {
      let _this = this;
      let index = 0;
      this.itemTabs.forEach((i) => {
        if (index == _this.currentTabItemId) {
          console.log("" + i.MargeCheckItemIds);
          if (_this.$refs[i.MargeCheckItemIds]) {
            _this.$refs[i.MargeCheckItemIds].forEach((y) => y.triggerGoNext());
            return;
          }
        }
        index++;
      });
    },
    //
    //刷新預約資訊
    RefreshScheduleItemFromList() {
      this.bookStateInfo = [];
      this.GetBookingInfo();
    },
    //
    //取消預約
    CancelScheduleItem(x) {
      console.log(this.$logs("取消預約"));
      let _this = this;
      this.localBookingProxy
        .invoke(
          "removeTimeSlot",
          x.obj.OrderNo,
          x.obj.MargeCheckItemIds,
          this.$store.state.Profile4User.JWTToke
        )
        .then((e) => {
          console.log(e);
          if (e.Success) {
            // this.ObjApp.TimingMessage("已取消預約！", 1);
            _this.RefreshScheduleItemFromList(x);
            _this.itemTabs.some((i) => {
              if (i.MargeCheckItemIds.includes("" + x.obj.CheckItemId)) {
                console.log("i.MargeCheckItemIds: " + i.MargeCheckItemIds);
                if (_this.$refs[i.MargeCheckItemIds])
                  _this.$refs[i.MargeCheckItemIds].forEach((y) =>
                    y.EnableAndFilterScheduler()
                  );
                return true;
              }
            });
            if (_this.itemTabs) x.obj.CheckItemId;

            // _this.ShowToast("提示", "已取消預約！", 1);
            Swal.fire({
              type: "success",
              title: "已取消預約！",
            });
          } else {
            Swal.fire("取消預約失敗！" + e.Message, "", "info");
            // this.ObjApp.TimingMessage("取消預約失敗！" + e.Message, 2);
          }
        })
        .fail(function (error) {
          console.log(error);
          Swal.fire("取消預約失敗！" + error, "", "info");
          // this.ObjApp.TimingMessage("取消預約失敗！" + error, 2);
        });
    },
    //
    //取得預約資訊
    async GetBookingInfo(callback) {
      let _this = this;
      this.bookingInfo.forEach((b) => {
        this.itemTabs.forEach((i) => {
          if (!b.orderNo) {
            console.error("GetBookingInfo is not valid");
          }
          if (b.orderNo)
            window.axios
              .get(
                "/schedule/BookingInfo?orderNo=" +
                  b.orderNo +
                  "&margeCheckItemIds=" +
                  i.MargeCheckItemIds
              )
              .then((e) => {
                // _this.$refs.schLocation.ej2Instances.readonly = e.length > 0;
                e.forEach((i) => {
                  // let item1 = {
                  //   label: "預約項目",
                  //   value: i.CheckItemName
                  // };

                  // let item2 = {
                  //   label: "預約時間",
                  //   value: _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm")
                  // };

                  let item = {
                    label: i.CheckItemName,
                    value:
                      _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") +
                      "  " +
                      i.RoomName,
                    obj: i,
                  };

                  this.itemTabs.forEach((j) => {
                    if (j.Name == i.CheckItemName) {
                      item.prependVariant = j.variant[1].replace("bg-", "");
                    }
                  });

                  _this.bookStateInfo.push(item);
                  // _this.bookStateInfo.value += "預約檢查項目:" + i.CheckItemName + "<br>預約檢查時間:" + _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") + "<br>";
                });

                if (callback) callback();
              })
              .catch((error) => {
                alert(error);
              });
        });
      });
    },
    reFreshData(timeSlot) {
      // websuck 註冊在父層的話
      this.$refs[this.currentTabItemId][0].setWeekDate(timeSlot.StartTime);
      this.$refs[this.currentTabItemId][0].scheduleFilter();
    },
    //
    //新增預約
    AddTimeSlot(process_slot) {
      let _this = this;
      // this.sockConnection.start().done(()=>{
      const currentScheduleComp =
        this.currentTabItemId && _this.$refs[this.currentTabItemId][0]
          ? this.$refs[this.currentTabItemId][0]
          : null;

      if (this.$route.name === "bookingWindow") {
        process_slot["FromHis"] = true;
      }
      try {
        this.localBookingProxy
          .invoke("addTimeSlot", process_slot, _this.$store.state.Profile4User.JWTToke)
          .then((e) => {
            if (e.Success) {
              _this.day1 = _this.day2 = _this.day3 = _this.day4 = _this.day5 = _this.day6 = _this.day7 = [];
              console.log(
                "-------------------------RefreshScheduleItemFromList---------------------------1"
              );
              _this.RefreshScheduleItemFromList();

              if (
                process_slot.PhoneNo4Residence != _this.patientInfos.PhoneNo4Residence
              ) {
                _this.patientInfos.PhoneNo4Residence = process_slot.PhoneNo4Residence;
              }

              if (process_slot.PhoneNo4Mobile != _this.patientInfos.PhoneNo4Mobile) {
                _this.patientInfos.PhoneNo4Mobile = process_slot.PhoneNo4Mobile;
              }

              if (process_slot.PhoneNo4Work != _this.patientInfos.PhoneNo4Work) {
                _this.patientInfos.PhoneNo4Work = process_slot.PhoneNo4Work;
              }

              _this.patientInfoArr = _this.getPatientInfoArr();

              // let item = {
              //   label: process_slot.CheckItemName,
              //   value: _this.$moment(process_slot.StartTime).format("YYYY/MM/DD HH:mm"),
              //   obj: process_slot
              // };
              // _this.bookStateInfo.push(item);
              _this.bookTimeStr = process_slot.StartTime.toLocaleString("zh-TW", {
                timeZone: "UTC",
              });

              if (currentScheduleComp) currentScheduleComp.loadingApi = false;
              //document.querySelector("#accordion-2").click();
              _this.$root.$emit("bv::toggle::collapse", "accordion-1");
              _this.$root.$emit("bv::toggle::collapse", "accordion-2");
              _this.dtcBookDone = true;
              setTimeout(() => (_this.dtcBookDone = false), 3500);
              _this.bookStateInfo.value = _this.bookTimeStr;
              // console.log('------------booking call scheduleMain-------');

              if (currentScheduleComp) currentScheduleComp.scheduleFilter();
            } else {
              if (currentScheduleComp) currentScheduleComp.loadingApi = false;
              _this.$emit("Refresh");
              Swal.fire(e.Message, "", "info");
            }
          })
          .fail(function (error) {
            if (currentScheduleComp) currentScheduleComp.loadingApi = false;
            Swal.fire("發生錯誤，稍後再試", "", "info");
            console.log(error);
          });
      } catch (err) {
        console.log(this.$logs("SOCKET DISCONNECTED"));
        Swal.fire("發生錯誤，稍後再試", "", "info");
        if (currentScheduleComp) currentScheduleComp.loadingApi = false;
      }

      // });
    },
    setDefaultBackgroundColor() {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage["theme-modal-bg-color"];
      this.isWhite = cls == "white" || !cls;
      this.isBlack = cls == "black";
      this.isGray = !this.isWhite && !this.isBlack && cls == "#868e96";
      !cls ? (cls = "white") : "";
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
      }

      document.addEventListener("fullscreenchange", () => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        if (document.querySelector("#blkReportInput"))
          document.querySelector("#blkReportInput").scrollTop = 0;
        if (document.fullscreenElement) {
          this.fullScreen = true;
        } else {
          this.fullScreen = false;
          if (document.querySelector(".close")) document.querySelector(".close").click();
        }
      });
    },
    //
    linkClass(idx, itemTab) {
      let n = idx % 4;
      itemTab.variant = tabVariant_bright[n];
      if (this.tabIndex === idx) {
        return tabVariant_bright[n];
        // if (idx % 4 == 0) {
        //   return tabVariant_bright[n]
        // } else if (idx % 4 == 1) {
        //   return ["mr-1", "bg-warning", "text-white", "font-weight-bold"];
        // } else if (idx % 4 == 2) {
        //   return ["mr-1", "bg-primary", "text-white", "font-weight-bold"];
        // } else if (idx % 4 == 3) {
        //   return ["mr-1", "bg-danger", "text-white", "font-weight-bold"];
        // } else {
        //   return ["mr-1", "bg-info", "text-white", "font-weight-bold"];
        // }
      } else {
        return tabVariant_dark[n];
        // if (idx % 4 == 0) {
        //   return ["mr-1", "bg-secondary", "text-info", "border-secondary"];
        // } else if (idx % 4 == 1) {
        //   return ["mr-1", "bg-secondary", "text-warning", "border-secondary"];
        // } else if (idx % 4 == 2) {
        //   return ["mr-1", "bg-secondary", "text-primary", "border-secondary"];
        // } else if (idx % 4 == 3) {
        //   return ["mr-1", "bg-secondary", "text-danger", "border-secondary"];
        // } else {
        //   return ["mr-1", "bg-secondary", "text-info", "border-secondary"];
        // }
      }
    },
    bgUpdate(cls) {
      this.isWhite = this.isBlack = this.isGray = false;
      if (cls == "white") {
        this.isWhite = true;
      } else if (cls == "black") {
        this.isBlack = true;
      } else {
        this.isGray = true;
      }
      localStorage["theme-modal-bg-color"] = cls;
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
      }
    },
    ThemeSwitch(color) {
      // Theme:Black 切換
      //
      // this.themePacks.themeBlack = !this.themePacks.themeBlack
      this.themePacks.themeBlack = color !== "white";
      //
      let activate = this.themePacks.themeBlack;
      let className = this.themePacks.themeBlackName;
      const el = document.body;
      //
      if (activate) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }

      //連動改變table component的背景主題
      this.SwtchTableTheme();

      console.log(this.$logs(this.$IsThemeBlack() ? "Black" : "White"));
    },
    SwtchTableTheme() {},
    async GetMergeItemIds() {
      //取得mergecheckitemids
      // let strCheckItemId = "";
      let _this = this;

      this.GetCheckItemIds().then((checkItems) => {
        if (checkItems != null) {
          // checkItems.forEach(i => {
          //   let itemIds = i.map(i => i.Id).join(",");
          //   if (strCheckItemId != "") strCheckItemId += ",";
          //   strCheckItemId += itemIds;
          // });

          const _selectedIds = checkItems
            .flat()
            .reduce((acc, cur) => {
              if (!acc.includes(cur.Id)) acc.push(cur.Id);
              return acc;
            }, [])
            .join();

          window.axios
            .get("/checkItem/MargeCheckItem?ignoreCr=true&checkItems=" + _selectedIds)
            .then((e) => {
              e.forEach((i) => {
                i.MargeOrderNos = "";
                if (i.MargeCheckItemNos)
                  i.MargeCheckItemNos.split(",").forEach((no) => {
                    if (i.MargeOrderNos.length > 0) i.MargeOrderNos += ",";
                    i.MargeOrderNos += _this.bookingInfo.find((b) =>
                      b.checkItemNos.includes(no)
                    ).orderNo;
                  });
              });
              _this.itemTabs = _this.itemTabs.concat(e);

              if (_this.itemTabs.length > 0)
                _this.currentTabItemId = _this.itemTabs[0].Id;

              _this.GetBookingInfo(() => {
                _this.isMounted = true;
              });
            });
        }
      });
    },
    async GetCheckItemIds() {
      let _this = this;
      let bookingCheckItems = [];
      let promises = [];
      await this.bookingInfo.forEach((obj) => {
        promises.push(
          new Promise((resolve, reject) => {
            _this.MapSelectedItems(obj).then((value) => {
              // bookingCheckItems.concat(value);
              resolve(value);
            });
          })
        );
      });
      // let promiseResult = Promise.all(promises);
      // let strCheckItemId = promiseResult.map(i => i.Id).join(",");
      return Promise.all(promises);
    },
    async MapSelectedItems(obj) {
      let _this = this;
      let bookingCheckItems = [];
      await window.axios.get("/checkItem/ForSpecialTime").then((e) => {
        _this.checkItems = e.Items;
        bookingCheckItems.push(
          _this.checkItems.find((j) => obj.checkItemNos.includes(j.No))
        );
      });
      return bookingCheckItems;
    },
    ClickBookingInfoTag(x) {
      let _this = this;
      for (var i = 0; i < this.itemTabs.length; i++) {
        if (this.itemTabs[i].MargeCheckItemIds == x.obj.MargeCheckItemIds) {
          this.currentTabItemId = i;
          return;
        }
      }
    },
  },
  computed: {
    scheduleCompons() {
      //  ||!this.tabIndex || this.itemTabs.length === 0 || !this.itemTabs[this.tabIndex] || !this.itemTabs[this.tabIndex].MargeCheckItemIds
      if (!this.isMounted) return null;
      // const _ids = this.itemTabs[this.tabIndex].MargeCheckItemIds[0]
      const _id = this.itemTabs[this.tabIndex].Id;
      return !this.isMounted || !this.$refs[_id] || !this.$refs[_id].length === 0
        ? null
        : this.$refs[_id][0];
    },
    isOutSidePage() {
      return this.$route.name === "bookingWindow";
    },
    bookingInfoCardTitle: function () {
      return "預約資訊: " + this.bookStateInfo.length + "筆";
    },
    orderNumbers: function () {
      let result = [];
      this.bookingInfo.forEach((n) => {
        result.push(n.orderNo);
      });
      return result.join(",");
    },
    linkStyle() {
      return {
        height: window.innerHeight + "px",
      };
    },
    modalityStatus() {
      return !this.currentTabItemId || this.itemTabs.length === 0
        ? { ctmri: false, mri: false, ct: false }
        : {
            ctmri: ["CT", "MR"].some(
              (k) =>
                k === this.itemTabs.find(({ Id }) => this.currentTabItemId == Id).Modality
            ), //
            ct: ["CT"].some(
              (k) =>
                k === this.itemTabs.find(({ Id }) => this.currentTabItemId == Id).Modality
            ),
            mri: ["MR"].some(
              (k) =>
                k === this.itemTabs.find(({ Id }) => this.currentTabItemId == Id).Modality
            ),
          };
    },
    isAbleToQuicklySelect() {
      return this.tabIndex < 0
        ? true
        : !(
            this.$route.name === "bookingWindow" &&
            this.itemTabs[this.tabIndex].Modality === "XA"
          );
    },
  },
  created: function () {
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // connect
    // FI0101 已有mixin 去call websocket
    if (this.bookingProxy) this.localBookingProxy = this.bookingProxy;
    if (this.$route.name != "FI0101") {
      this.ConnectionHubConnection(true);
    }

    // if (this.sockConnection == null) {
    //   this.sockConnection = hubConnection(configs.hubUrl);
    //   this.bookingProxy = this.sockConnection.createHubProxy("bookingHub");
    //   this.sockConnection.disconnected(() => {
    //     alert("hubconnection 未連接");
    //   });
    // }

    // this.sockConnection
    //   .start({ jsonp: true, transport: ["webSockets"] })
    //   .done(function(conn) {
    //     console.log("Now connected, connection ID=" + conn.id);
    //     console.log("Connected, transport = " + conn.transport.name);
    //   })
    //   .fail(function(e) {
    //     console.log("Could not connect");
    //   });
    //
    // 取得 App.vue 參照
    let methodName = "created";
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    if (this.bookingObjs != null) {
      this.bookingInfo = this.bookingObjs;
      this.viewDate = this.bookingDate;
      this.patientInfos = this.patientInfo;
    } else {
      if (this.$route.query.orders) {
        let orders = JSON.parse(this.$route.query.orders);
        this.bookingInfo = orders.bookingInfo;
        this.viewDate = new Date();
        this.patientInfos = orders.patientInfo;
      }
    }
    // console.log('---------------------PATIENTINFO--------------------')
    // console.log(this.patientInfos);
    this.patientInfoArr = this.getPatientInfoArr();
    // let _this = this;
    // window.axios.get(configs.publicPath + "../checkItem/ForSpecialTime").then(e => {
    //   _this.checkItems = e.Items;
    //   let bookingCheckItems = [];
    //   let checkItemNos = (_this.checkItemNos == null ? _this.$route.params.checkItemNo : _this.checkItemNos).split(",");
    //   checkItemNos.forEach(no => {
    //     bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
    //   });
    //   let strCheckItemId = bookingCheckItems.map(i => i.Id).join(",");
    //   window.axios.get(configs.publicPath + "../checkItem/MargeCheckItem?checkItems=" + strCheckItemId).then(e => {
    //     _this.itemTabs = e;
    //     _this.currentTabItemId = _this.itemTabs[0].Id;
    //     this.GetBookingInfo();
    //   });
    // });
    //
    //取得mergecheckitemids
    this.GetMergeItemIds();
    // this.bookingObjs.forEach(obj => {
    //   let bookingCheckItems = [];
    //   window.axios.get(configs.publicPath + "../checkItem/ForSpecialTime").then(e => {
    //     _this.checkItems = e.Items;
    //     obj.checkItemNos.forEach(no => {
    //       bookingCheckItems.push(_this.checkItems.find(j => j.No == no));
    //     });
    //     let strCheckItemId = bookingCheckItems.map(i => i.Id).join(",");

    //     window.axios.get(configs.publicPath + "../checkItem/MargeCheckItem?checkItems=" + strCheckItemId).then(e => {
    //       _this.itemTabs = _this.itemTabs.concat(e);
    //       _this.currentTabItemId = _this.itemTabs[0].Id;

    //       this.GetBookingInfo();
    //     });
    //   });
    // });
    this.quickDate = this.$moment().format("YYYY-MM-DD");
  },
  mounted() {
    // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
    // this.ThemeSwitch()
    // const str = JSON.stringify(this.patientInfo);
    //alert(str);
    // this.setDefaultBackgroundColor();
    //計算高度
    // let sh = this.$refs.scheduleCard.clientHeight;
  },
  beforeDestroy: function () {
    this.destroyed = true;
    if (this.sockConnection) this.sockConnection.stop();
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);

    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  },
};
</script>
<style>
.swal2-container {
  z-index: 30141225 !important;
}

#remaining___BV_modal_outer_ {
  z-index: 20141231 !important;
}

/* schedule 檢查室header */
.themeBlack .e-header-cells {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule 日期header */
.themeBlack .e-resource-cells {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule slot bg */
.themeBlack .e-work-cells {
  background-color: rgba(60, 60, 60, 0.7) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule slot blocked */
.themeBlack .e-block-appointment {
  background-color: rgba(0, 0, 0, 0.7) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule time section left column */
.themeBlack .e-time-slots {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule time range header bar */
.themeBlack .e-toolbar-items {
  background-color: rgba(40, 40, 40, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule buttons */
.themeBlack .e-btn {
  background-color: rgba(0, 0, 0, 0) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule left top square area */
.themeBlack .e-left-indent {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

/* schedule left top square area */
.themeBlack .e-tbar-btn-text {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule left top square area */
.themeBlack .e-btn-icon {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog bg  */
.themeBlack .e-dialog {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog content  */
.themeBlack .e-dlg-content {
  background-color: rgba(60, 60, 60, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog header  */
.themeBlack .e-dlg-header-content {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog header text */
.themeBlack .e-title-text {
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-input-group {
  background-color: rgba(30, 30, 30, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-footer-content {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule dialog inputs  */
.themeBlack .e-event-save {
  background-color: rgba(0, 0, 0, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule tabs bar bg */
.themeBlack .nav {
  background-color: rgba(30, 30, 30, 1) !important;
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack .cal-bg {
  background-color: rgba(60, 60, 60, 1);
  color: rgba(255, 255, 255, 0.7);
}

.cardHeader {
  padding: 0 1.25rem; /*2px 1.25rem;*/
  white-space: nowrap;
}

.scrollBox {
  width: 100%;
  height: 132px; /*132px*/
  white-space: nowrap;
  overflow: auto;
}

.sb4RHis {
  width: 100%;
  height: 344px;
  white-space: nowrap;
  overflow: auto;
}

.themeBlack select {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>

<style lang="scss">
.pageLeftContent {
  .card-text {
    border-bottom: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
  }
}

.monthColumn {
  width: 180px;
}
.startTimeColumn {
  width: 320px;
  .e-input-group {
    height: 37px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.notice-message {
  button {
    white-space: nowrap;
  }
}
</style>
