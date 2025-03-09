<template>
  <main class="main-content">
    <ScheduleMainRevise
      ref="scheduleMainRevise"
      :patientInfo="patientInfo"
      :finalSelected="finalSelected"
      :mergedBookingSelected="mergedBookingSelected"
      :bookingObjs="bookingObjs"
      @addBooking="addBooking"
    ></ScheduleMainRevise>
    <ViewDtail ref="scheduleDetail" :bookingDetail="bookingDetail"></ViewDtail>
    <aside class="left-side">
      <section class="my-booking">
        <div class="my-title0">
          <div class="my-title0-left">
            檢查項目:
            <b-button
              v-for="(item, i) in mergedBookingData"
              :key="`headers${i}`"
              variant="roombtn"
              class="mr-1 mb-1"
              @click="setMergedBookingSelected(item)"
              :class="item.Name == mergedBookingSelected.Name ? 'selectedMerged' : ''"
              >{{ item.Name }}</b-button
            >
          </div>

          <div class="my-title0-right">
            <b-input-group prepend="快速預約" class="quick-section">
              <ejs-datetimepicker
                v-model="quickDate"
                step="5"
                :allowEdit="false"
                :validationRules="{ required: true }"
                format="yyyy-MM-dd HH:mm"
                :showClearButton="false"
                :showTodayButton="false"
                style="width: 200px"
              />
              <b-input-group-append>
                <b-button
                  variant="outline-primary"
                  class="append-section"
                  @click="reserveQuick"
                  >Reserve</b-button
                >
                <!-- <div >Reserve</div> -->
              </b-input-group-append>
            </b-input-group>
          </div>
        </div>
        <div class="my-title">此病患開立的檢查單如下:</div>
        <header class="dtc-grid my-dark">
          <div v-for="(item, i) in allReserveHeaders" :key="`headers${i}`" class="header">
            {{ item.name }}
          </div>
        </header>
        <main
          class="dtc-grid"
          v-for="(item, idx) in allReserveData"
          :key="`content${idx}`"
          style="color: #39312e"
          :style="
            idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color: #E1F1FE;'
          "
        >
          <div class="content" :title="item.allCheckDetail.No">
            {{ item.allCheckDetail.No || "" }}
          </div>

          <div class="content" :title="item.CheckItemName">
            {{ item.CheckItemName || "" }}
          </div>

          <div class="content" :title="item.StartTimeDate">
            {{ item.StartTimeDate || "" }}
          </div>

          <div class="content" :title="item.StartTimeData">
            {{ item.StartTimeData || "" }}
          </div>
          <div class="content" style="cursor: pointer" @click="showBookingDetail(item)">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75V16.25ZM16 17.75C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25V17.75ZM8 12.25C7.58579 12.25 7.25 12.5858 7.25 13C7.25 13.4142 7.58579 13.75 8 13.75V12.25ZM14 13.75C14.4142 13.75 14.75 13.4142 14.75 13C14.75 12.5858 14.4142 12.25 14 12.25V13.75ZM19 4.5H19.75C19.75 4.08579 19.4142 3.75 19 3.75V4.5ZM19 21V21.75C19.4142 21.75 19.75 21.4142 19.75 21H19ZM5 21H4.25C4.25 21.4142 4.58579 21.75 5 21.75V21ZM5 4.5V3.75C4.58579 3.75 4.25 4.08579 4.25 4.5H5ZM9 3V2.25C8.58579 2.25 8.25 2.58579 8.25 3H9ZM15 3H15.75C15.75 2.58579 15.4142 2.25 15 2.25V3ZM15 6V6.75C15.4142 6.75 15.75 6.41421 15.75 6H15ZM9 6H8.25C8.25 6.41421 8.58579 6.75 9 6.75V6ZM8 17.75H16V16.25H8V17.75ZM8 13.75H14V12.25H8V13.75ZM18.25 4.5V21H19.75V4.5H18.25ZM19 20.25H5V21.75H19V20.25ZM5.75 21V4.5H4.25V21H5.75ZM5 5.25H9V3.75H5V5.25ZM19 3.75H15V5.25H19V3.75ZM9 3.75H15V2.25H9V3.75ZM15 5.25H9V6.75H15V5.25ZM9.75 6V4.5H8.25V6H9.75ZM9.75 4.5V3H8.25V4.5H9.75ZM14.25 3V4.5H15.75V3H14.25ZM14.25 4.5V6H15.75V4.5H14.25Z"
                fill="#001A72"
              />
            </svg>
          </div>
          <div class="content" :title="item.RoomName">
            {{ item.RoomName || "" }}
          </div>
          <div class="content">
            <b-button variant="cancelbtn" @click="cancelBooking(item)">取消</b-button>
          </div>
        </main>
      </section>
      <section class="my-calendar">
        <div class="my-calendar-header">
          <b-button
            class="week-btn"
            variant="outline-primary"
            size="sm"
            @click="changeMonth('subtract')"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.29258 11.7952L15.7412 5.88114C16.2715 5.50998 17 5.88931 17 6.53652V17.4635C17 18.1107 16.2715 18.49 15.7412 18.1189L7.29258 12.2048C7.1504 12.1053 7.1504 11.8947 7.29258 11.7952Z"
                fill="#4B6DBB"
              />
            </svg>
            <div>上個月</div>
          </b-button>

          <div class="now-time">{{ nowTimeSelectedShow }}</div>
          <b-button
            class="week-btn"
            variant="outline-primary"
            size="sm"
            @click="changeMonth('add')"
          >
            <div>下個月</div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5528 11.7764L6.15777 5.57889C5.62585 5.31293 5 5.69972 5 6.29443V17.7056C5 18.3003 5.62585 18.6871 6.15777 18.4211L18.5528 12.2236C18.737 12.1315 18.737 11.8685 18.5528 11.7764Z"
                fill="#4B6DBB"
              />
            </svg>
          </b-button>
        </div>
        <div v-if="calandarType === 'date'" class="my-calendar-table">
          <Loading v-if="isLoading"></Loading>

          <div v-for="weekName in weekHeaders" :key="weekName" class="week">
            週{{ weekName }}
          </div>

          <button
            :style="!dateData.hasScheduleTime ? 'pointer-events: none;' : ''"
            :class="dateData.disable ? 'cannot-edit-date' : 'can-edit-date'"
            v-for="(dateData, index) in dateTable"
            :key="index"
            @click="setDateSelected(dateData)"
            class="edit-date"
          >
            <div
              class="date-content"
              :class="dateSelected.DayFull == dateData.DayFull ? 'selectDate' : ''"
            >
              {{ dateData.Day }}
              <div class="cross-content" v-if="!dateData.hasScheduleTime && !isLoading">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="#F17294"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="#F17294"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </section>
    </aside>

    <aside class="right-side">
      <!-- <div class="title0">
      
        檢查項目:
        <b-button
          v-for="(item, i) in mergedBookingData"
          :key="`headers${i}`"
          variant="roombtn"
          class="mr-1 mb-1"
          @click="setMergedBookingSelected(item)"
          :class="item.Name == mergedBookingSelected.Name ? 'selectedMerged' : ''"
          >{{ item.Name }}</b-button
        >
      </div> -->
      <div class="title1">
        選擇檢查室:
        <b-button
          v-for="(item, ir) in rooms"
          :key="`rooms${ir}`"
          variant="roombtn"
          class="mr-1 mb-1"
          @click="setRoomSelected(item)"
          :class="item.Id == roomSelected.Id ? 'selectedMerged' : ''"
          >{{ item.Name }}</b-button
        >
      </div>
      <div class="title2">
        <div>
          <div>{{ zoneSelected }} @ {{ roomSelected.Name }}</div>
          <div>{{ dateSelectedForShow }}</div>
        </div>

        <div>
          <b-button variant="timebtn1" @click="setZone('全天')">全天</b-button
          ><b-button variant="timebtn2" @click="setZone('上午')">上午</b-button
          ><b-button variant="timebtn3" @click="setZone('下午')">下午</b-button>
        </div>
      </div>
      <section id="time-content-section" class="time-content">
        <!-- <Loading v-if="isLoading"></Loading> -->
        <div
          :class="itemTime.timeformat.includes('AM') ? 'morning' : 'afternoon'"
          v-for="(itemTime, itime) in dateSelectedAvailiableTime"
          :key="`itemTime${itime}`"
          @click="showConfirm(itemTime)"
        >
          {{ itemTime.timeformat || "" }}
        </div>
      </section>
    </aside>
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
  </main>
</template>

<script>
import Swal from "sweetalert2";

import socketService from "@/mixins/socketConnectionService.js";
import Loading from "@/components/home/Loading";
import ScheduleMainRevise from "@/components/Booking/ScheduleMainRevise";
import ViewDtail from "@/components/Booking/ViewDtail";

export default {
  name: "bookingView",
  props: [
    "bookingObjs",
    "bookingDate",
    "patientInfo",
    "shouldBack",
    "bookingProxy",
    "specialTimeArr",
  ],
  components: { Loading, ScheduleMainRevise, ViewDtail },
  data() {
    return {
      weekHeaders: ["日", "一", "二", "三", "四", "五", "六"],
      quickDate: "",
      dateTable: Array(42).fill({}),
      calandarType: "date",
      startDate: this.$moment().startOf("month"),
      endDate: this.$moment().endOf("month"),
      nowTimeSelected: this.$moment(), //時間的定位點
      nowTimeSelectedShow: "",
      dateSelected: {}, //目前所選取的日期
      dateSelectedForShow: "",
      dateSelectedAvailiableTime: [],

      mergedBookingData: [], // 目前所選取的所有檢查項目類型
      mergedBookingSelected: { Id: "" }, // 目前所選取的檢查項目

      rooms: [], // 目前所有檢查室
      roomSelected: {}, // 目前所選取的檢查室

      allReserveData: [], //目前所選取的所有預約資訊
      allReserveHeaders: [
        { name: "檢查代碼" },
        { name: "檢查項目名稱" },
        { name: "日期" },
        { name: "時間" },
        { name: "檢查明細" },
        { name: "檢查室" },
        { name: "操作" },
      ],

      allScheduleTimes: [],
      isLoading: false,

      zoneSelected: null, //選取是全天、上午還是下午
      finalSelected: {}, //最後要選取的時間點

      localBookingProxy: null,

      bookingDetail: {},
      modalityStatus: {
        mri: false,
        ct: false,
      },
    };
  },

  mixins: [socketService],
  beforeMount() {
    this.$root.$on("close-dtc-booking-dlg", () => {
      this.patientInfos = {};
      //alert("close-dtc-booking-dlg");
    });
  },
  watch: {},
  methods: {
    changeMonth(type) {
      if (type == "subtract") {
        this.startDate = this.startDate.subtract(1, "months").startOf("month");
        this.endDate = this.endDate.subtract(1, "months").endOf("month");
        this.nowTimeSelected = this.nowTimeSelected.subtract(1, "months");
        this.nowTimeSelectedShow = this.$moment(this.nowTimeSelected).format(
          "YYYY年MM月"
        );
      } else {
        this.startDate = this.startDate.add(1, "months").startOf("month");
        this.endDate = this.endDate.add(1, "months").endOf("month");
        this.nowTimeSelected = this.nowTimeSelected.add(1, "months");
        this.nowTimeSelectedShow = this.$moment(this.nowTimeSelected).format(
          "YYYY年MM月"
        );
      }
      this.setDateTable();
      this.dateSelectedAvailiableTime = [];
    },
    setDateTable() {
      let startDateData = this.startDate;
      let endDateData = this.endDate;

      const endDateDay = +this.$moment(this.endDate).format("DD"); //endDateData._d.getDay()

      let arr = [];

      for (let i = 0; i < +endDateDay; i++) {
        arr.push({
          date: this.$moment(startDateData).add(i, "days"),
          disable: false,
        });
      }

      for (let i = 1; i < startDateData._d.getDay() + 1; i++) {
        arr.unshift({
          date: this.$moment(startDateData).subtract(i, "days"),
          disable: true,
        });
      }

      for (let i = 1; i < 6 - +endDateData._d.getDay() + 1; i++) {
        arr.push({
          date: this.$moment(endDateData).add(i, "days"),
          disable: true,
        });
      }

      arr = arr.map((s) => {
        s.Day = this.$moment(s.date).format("DD");
        s.DayFull = this.$moment(s.date).format("YYYY-MM-DD");
        return s;
      });

      this.dateTable = [...arr];

      this.checkSchedule();
    },
    async setReserveData() {
      let allBooking = [...this.bookingObjs];
      console.log("allBooking", allBooking);
      allBooking = allBooking.map((s) => {
        s.checkNo = s.checkItemNos[0]; //檢查代碼
        s.checkObj = this.specialTimeArr.find((k) => k.No == s.checkItemNos[0]); //檢查代碼
        return s;
      });

      allBooking = allBooking.map((s) => {
        s.checkId = s.checkObj.Id;
        return s;
      });

      // 目前所選取的所有檢查項目類型
      const bookingId = allBooking.map((s) => `${s.checkId}`).join(",");
      const mergedBookingData = await window.axios.get(
        "/checkItem/MargeCheckItem?ignoreCr=true&checkItems=" + bookingId
      );

      this.mergedBookingData = [...mergedBookingData];

      if (!this.mergedBookingSelected.Id) {
        this.mergedBookingSelected = mergedBookingData[0];
      }

      //目前所選取的所有預約資訊
      let allReserveData = [];
      for (let value of allBooking) {
        const res = await window.axios.get(
          "/schedule/BookingInfo?orderNo=" +
            value.orderNo +
            "&margeCheckItemIds=" +
            value.checkId
        );
        allReserveData = [...allReserveData, ...res];
      }

      allReserveData = allReserveData.map((s) => {
        s.allCheckDetail = this.specialTimeArr.find((k) => +k.Id == +s.CheckItemId) || {};
        s.StartTimeDate = this.$moment(s.StartTime).format("YYYYMMDD");
        s.StartTimeData = this.$moment(s.StartTime).format("HH:mm");
        return s;
      });

      this.allReserveData = [...allReserveData];
    },

    async checkSchedule() {
      const startTime = this.$moment(this.startDate).format("YYYY-MM-DDT00:00:00");
      const endTime = this.$moment(this.endDate).format("YYYY-MM-DDT23:59:59");
      const patientBirthday = this.patientInfo.Birthday
        ? this.$moment(this.patientInfo.Birthday).format("YYYY-MM-DDT00:00:00")
        : "";
      const query = `type=${this.mergedBookingSelected.Type}&checkItemId=${this.mergedBookingSelected.Id}&startTime=${startTime}&endTime=${endTime}&patientBirthDay=${patientBirthday}&sourceType=${this.patientInfo.sourceCode}&ignoreRule=true`;

      this.isLoading = true;

      let { Items } = await window.axios.get("/schedule/GetFreeTimeSlot?" + query);
      this.isLoading = false;

      Items = Items.map((s) => {
        s.StartDate = this.$moment(s.StartTime).format("YYYY-MM-DD");
        s.StartDateMilliseconds = Date.parse(s.StartTime);
        return s;
      });

      this.dateTable = this.dateTable.map((s) => {
        s.hasScheduleTime = Items.find((k) => k.StartDate == s.DayFull) ? true : false;

        return s;
      });
      this.allScheduleTimes = [...Items];
    },

    async setMergedBookingSelected(item) {
      this.mergedBookingSelected = { ...item };
      await this.checkSchedule();
      this.setDateSelected(this.dateSelected);
      this.getAllRoom();
      this.setZone(this.zoneSelected);
    },
    setRoomSelected(item) {
      this.roomSelected = { ...item };

      this.dateSelectedAvailiableTime = this.allScheduleTimes.filter(
        (s) => s.StartDate == this.dateSelected.DayFull
      );

      if (item.Id != "null") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter(
          (s) => s.RoomId == item.Id
        );
      }

      if (this.zoneSelected == "上午") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter((s) =>
          s.timeformat.includes("AM")
        );
      }

      if (this.zoneSelected == "下午") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter((s) =>
          s.timeformat.includes("PM")
        );
      }
    },
    setDateSelected(item) {
      //獲得這天所有可用的時間
      document.getElementById("time-content-section").scrollTop = 0;
      this.dateSelected = { ...item };
      let dayChinese = +this.$moment(item.DayFull).weekday();
      switch (dayChinese) {
        case 0:
          dayChinese = "週日";
          break;
        case 1:
          dayChinese = "週一";
          break;
        case 2:
          dayChinese = "週二";
          break;
        case 3:
          dayChinese = "週三";
          break;
        case 4:
          dayChinese = "週四";
          break;
        case 5:
          dayChinese = "週五";
          break;
        case 6:
          dayChinese = "週六";
          break;
        default:
          console.log(`Sorry`);
      }

      this.dateSelectedForShow =
        this.$moment(item.DayFull).format("YYYY-MM-DD") + " " + dayChinese;

      let availiableTime = this.allScheduleTimes.filter(
        (s) => s.StartDate == item.DayFull
      );

      availiableTime = availiableTime.map((s) => {
        s.timeformat = this.$moment(s.StartTime).format("hh:mm A") + " " + s.LocationName;
        s.startTimeformat = this.$moment(s.StartTime).format("hh:mm A");
        s.endTimeformat = this.$moment(s.EndTime).format("hh:mm A");
        return s;
      });

      this.dateSelectedAvailiableTime = [...availiableTime];

      if (this.rooms.length) {
        this.roomSelected = this.rooms[0];
      }
      this.zoneSelected = "全天";
    },
    setZone(item) {
      this.zoneSelected = item == "全天" || !item ? "全天" : item;

      this.dateSelectedAvailiableTime = this.allScheduleTimes.filter(
        (s) => s.StartDate == this.dateSelected.DayFull
      );

      if (this.roomSelected.Id != "null") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter(
          (s) => s.RoomId == this.roomSelected.Id
        );
      }

      if (this.zoneSelected == "上午") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter((s) =>
          s.timeformat.includes("AM")
        );
      }
      if (this.zoneSelected == "下午") {
        this.dateSelectedAvailiableTime = this.dateSelectedAvailiableTime.filter((s) =>
          s.timeformat.includes("PM")
        );
      }
    },
    async getAllRoom() {
      //取的所有檢查室
      const { Items } = await window.axios.get(
        "/checkItem/Room?type=" +
          this.mergedBookingSelected.Type +
          "&id=" +
          this.mergedBookingSelected.Id
      );

      if (Items.length && Items.length > 1) {
        this.rooms = [{ Id: "null", Name: "全部檢查室" }, ...Items];
        this.roomSelected = { Id: "null", Name: "全部檢查室" };
      } else {
        this.rooms = [...Items];
        this.roomSelected = this.rooms[0];
      }

      // this.mergedBookingSelected = { ...item };this.mergedBookingSelected
    },
    cancelBooking(item) {
      this.localBookingProxy
        .invoke(
          "removeTimeSlot",
          item.OrderNo,
          +item.MargeCheckItemIds,
          this.$store.state.Profile4User.JWTToke
        )
        .then((e) => {
          if (e.Success) {
            this.allReserveData = this.allReserveData.filter(
              (s) =>
                s.OrderNo != item.OrderNo &&
                +s.MargeCheckItemIds != +item.MargeCheckItemIds
            );

            Swal.fire({
              type: "success",
              title: "取消預約成功！",
            });
          } else {
            Swal.fire("取消預約失敗！" + e.Message, "", "info");
          }
        })
        .fail(function (error) {
          console.log(error);
          Swal.fire("取消預約失敗！" + error, "", "info");
        });
    },
    addBooking(data) {
      this.localBookingProxy
        .invoke("addTimeSlot", data, this.$store.state.Profile4User.JWTToke)
        .then((e) => {
          if (e.Success) {
            this.setReserveData();
            Swal.fire({
              type: "success",
              title: "預約成功！",
            });
          } else {
            Swal.fire("預約失敗！" + e.Message, "", "info");
          }
        })
        .fail(function (error) {
          console.log(error);
          Swal.fire("預約失敗！" + error, "", "info");
        });
    },
    reserveQuick() {
      const reserveQuickMilliseconds = Date.parse(this.quickDate);
      const nowMilliseconds = Date.now();

      let allScheduleTimesData = [...this.allScheduleTimes];

      allScheduleTimesData = allScheduleTimesData.map((s) => {
        s.timeformat = this.$moment(s.StartTime).format("hh:mm A") + " " + s.LocationName;
        s.startTimeformat = this.$moment(s.StartTime).format("hh:mm A");
        s.endTimeformat = this.$moment(s.EndTime).format("hh:mm A");
        return s;
      });

      const obj = allScheduleTimesData.find(
        (s) =>
          +s.StartDateMilliseconds >= +reserveQuickMilliseconds &&
          +s.StartDateMilliseconds >= +nowMilliseconds
      );

      this.finalSelected = { ...obj };
      this.$refs["scheduleMainRevise"].showSchedule();
    },
    showConfirm(item) {
      this.finalSelected = { ...item };
      this.$refs["scheduleMainRevise"].showSchedule();
    },
    showBookingDetail(item) {
      this.bookingDetail = { ...item };
      this.$refs["scheduleDetail"].showBookingDetail();
    },
  },
  computed: {},
  created: function () {
    this.quickDate = this.$moment().format("YYYY-MM-DD");
    if (this.bookingProxy) this.localBookingProxy = this.bookingProxy;
  },
  async mounted() {
    console.log(
      "bookingObjs",
      this.bookingObjs,
      "bookingDate",
      this.bookingDate,
      "patientInfo",
      this.patientInfo,
      "shouldBack",
      this.shouldBack,
      "bookingProxy",
      this.bookingProxy,
      "specialTimeArr",
      this.specialTimeArr
    );
    await this.setReserveData();
    await this.setDateTable();
    await this.getAllRoom();

    this.nowTimeSelectedShow = this.$moment(this.nowTimeSelected).format("YYYY年MM月");

    this.setDateSelected({
      DayFull: this.$moment().format("YYYY-MM-DD"),
    });
    this.setZone();

    //為了顯示提醒資訊
    let checkData = this.bookingObjs[0].checkObj.Name;
    if (`${checkData}`.includes("MRI")) {
      this.modalityStatus.mri = true;
      this.$refs["remaining"].show();
    }
    if (`${checkData}`.includes("CT")) {
      this.modalityStatus.ct = true;
      this.$refs["remaining"].show();
    }
  },
  beforeDestroy: function () {},
  destroyed() {},
};
</script>
<style lang="scss" scoped>
.main-content {
  display: grid;
  grid-template-columns: 65% 1fr;
  grid-column-gap: 17px;
  padding: 20px;
  color: #1c2a54;
  .left-side {
    .my-calendar {
      border: 1px solid #dddede;
      border-radius: 5px;
      .my-calendar-header {
        display: flex;
        justify-content: center;
        padding: 10px 0;
        border-bottom: 1px solid #3f8cd9;

        background-color: #e5f2ff !important;
        > .now-time {
          width: 600px;
          border: 1px solid #3f8cd9;
          border-radius: 5px;
          font-weight: 700;
          background-color: #ffffff !important;
          margin: 0px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .week-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff !important;
        }
        .week-btn:hover {
          color: #3f8cd9;
        }
      }
      .my-calendar-table {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        position: relative;
        background: white;
        > button {
          border: 0px;
          height: 60px;
          font-size: 20px;
          background: transparent;
        }
        > .week {
          display: flex;
          height: 50px;
          font-weight: 700;
          justify-content: center;
          align-items: center;
          background-color: #e5f2ff !important;
        }
        > .cannot-edit-date {
          color: #aaaaaa;
          pointer-events: none;
        }
        > .can-edit-date {
          color: #353b41;
          .date-content {
            // width: 80px;
            padding: 6px 0;
            &:hover {
              background: #2995e9;
              color: #fff;
              border-radius: 3px;
            }
          }
        }
        > .edit-date {
          .date-content {
            position: relative;
            .cross-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
  }

  .right-side {
    border: 1px solid #dddede;
    border-radius: 5px;
    background: white;
    .title0 {
      color: #2f3c62;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 0 6px 10px;
    }
    .title1 {
      color: #2f3c62;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 0 6px 10px;
    }
    .title2 {
      color: #2f3c62;
      border-bottom: 1px solid #eeeeee;
      padding: 6px 10px 6px 10px;
      display: flex;
      justify-content: space-between;
    }

    .time-content {
      padding: 8px 20px;
      color: #2f3c62;
      text-align: center;
      font-weight: 600;
      // height: 450px;
      height: calc(100vh - 350px);
      overflow-y: scroll;
      position: relative;

      > div {
        border-radius: 3px;
        margin: 3px 0;
        padding: 5px 0;
        cursor: pointer;
      }
      .morning {
        background: #e5e8fe;
        &:hover {
          background: #cabfff;
        }
      }
      .afternoon {
        background: #fff4e0;
        &:hover {
          background: #fdd487;
        }
      }
    }
  }
}
.my-booking {
  border: 1px solid #dddede;
  border-radius: 5px 5px 1px 1px;
  margin-bottom: 10px;
  background: white;
  .my-title0 {
    color: #2f3c62;
    border-bottom: 1px solid #eeeeee;
    padding: 6px 0 6px 10px;
    display: flex;
    justify-content: space-between;
  }
  .my-title {
    color: #2f3c62;
    padding: 6px 0 6px 10px;
    border-bottom: 1px solid #bad5f1;
  }
  .dtc-grid {
    display: grid;
    grid-template-columns: 130px 1fr 100px 130px 105px 170px 100px;
    text-align: center;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-size: 15px;
      padding: 4px 0;
      border-right: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      display: -webkit-box;
      height: 40px;
      line-height: 30px;
      font-size: 16px;
      color: rgb(46, 45, 45);
    }
    > div:first-child {
      border-left: 2px solid #ffffff;
    }
    > .header {
      line-height: 2rem;
      font-weight: 700;
      color: #1c2a54;
    }
    > .content {
      padding: 6px;
      padding-top: 4px;
      height: 43px;
    }
  }

  .my-dark {
    > div {
      background: #e9e9e9;
      color: #2f3c62;
      font-weight: bolder;
    }
  }
}

/deep/ .btn-cancelbtn,
.btn-roombtn,
.btn-timebtn1,
.btn-timebtn2,
.btn-timebtn3 {
  background: #f37493 0% 0% no-repeat padding-box;
  color: #fff;
  padding: 4px 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  cursor: pointer;
}
/deep/ .btn-cancelbtn:hover {
  background: #c9627b 0% 0% no-repeat padding-box;
}
/deep/ .btn-cancelbtn:focus {
  box-shadow: 0 0 0 0.2rem #887366;
}

/deep/.btn-roombtn {
  background: #e9f5ff 0% 0% no-repeat padding-box;
  color: #2f3c62;
  border-color: #66b2ed;
}

/deep/.btn-roombtn:hover {
  color: #fff;
  background: #3096e6 0% 0% no-repeat padding-box;
}

/deep/.btn-timebtn1 {
  background: #c2f6e7 0% 0% no-repeat padding-box;
  border-color: #b6d1c9;
  color: #2f3c62;
  margin-right: 3px;
  &:hover {
    background: #a7d1c5 0% 0% no-repeat padding-box;
  }
}

/deep/ .btn-timebtn2 {
  background: #e5e8fe 0% 0% no-repeat padding-box;
  border-color: #cabffd;
  color: #2f3c62;
  margin-right: 3px;
  &:hover {
    background: #c6c8db 0% 0% no-repeat padding-box;
  }
}

/deep/ .btn-timebtn3 {
  background: #fff4e0 0% 0% no-repeat padding-box;
  border-color: #f1e0c1;
  color: #2f3c62;
  &:hover {
    background: #e0d7c3 0% 0% no-repeat padding-box;
  }
}

/deep/.selectedMerged {
  background: #3096e6 0% 0% no-repeat padding-box;
  color: #fff;
}

/deep/.selectDate {
  color: red;
}
/deep/.e-input-group.e-control-wrapper.e-valid-input.e-non-edit.e-datetime-wrapper {
  width: 216px !important;
  height: 31px;
}

/deep/.quick-section {
  margin-right: 5px;
  .input-group-prepend {
    height: 31px;
  }
  .input-group-append {
    height: 31px;

    .append-section {
      cursor: pointer;
      padding: 3px 12px;
    }
  }
}
</style>

<style>
.swal2-container {
  z-index: 100000000000 !important;
}
#remaining___BV_modal_outer_ {
  z-index: 20141231 !important;
}
</style>
