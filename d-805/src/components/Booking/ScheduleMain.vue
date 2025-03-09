<template>
  <div
    fluid
    class="px-1"
    style="positino:relative;"
    autofocus
  >
    <b-button
      variant="danger"
      class="dtc-back-btn"
      @click="closeDlg"
      v-show="$route.query.token == null && shouldBack"
    >
      <font-awesome-icon
        style="font-size:24px;"
        icon="undo"
        class="mr-1"
      />返回
    </b-button>
    <b-button
      variant="danger"
      class="dtc-back-btn"
      @click="closeWin"
      v-show="$route.query.token != null && shouldBack"
    >
      <font-awesome-icon
        style="font-size:24px;"
        icon="times"
        class="mr-1"
      />關閉
    </b-button>
    <b-row
      no-gutters
      v-show="!hasLabRoom"
    >
      <b-col
        sm="12"
        class="px-1 mb-2"
      >
        <b-input-group>
          <b-button
            disabled
            variant="danger"
            text-variant="white"
          >此檢查項目尚未設定檢查室, 無法進行預約排程。</b-button>
        </b-input-group>
      </b-col>
    </b-row>

    <b-row
      no-gutters
      v-show="hasLabRoom"
    >
      <b-col
        sm="3"
        class="px-1 mb-2"
      >
        <b-input-group hidden>
          <b-input-group-prepend>
            <b-button
              disabled
              variant="success"
            >已預約</b-button>
            <b-button
              
              variant="success"
            >快速預約</b-button>
          </b-input-group-prepend>
          <b-select
            hidden
            v-if="booked"
            ref="fastSelect"
            style="background-color:gray; border-color:gray"
            v-model="selectedFastBookingSlot"
            :options="optionsFastBookingSlot"
            :disabled="booked"
            @change="fastBookingSlotChanged"
          />
          <b-select
            v-else
            ref="fastSelect"
            v-model="selectedFastBookingSlot"
            :options="optionsFastBookingSlot"
            :disabled="booked"
            @change="fastBookingSlotChanged"
          />
        </b-input-group>
      </b-col>
    </b-row>
    <b-row
      no-gutters
      v-show="hasLabRoom"
    >
      <b-col
        sm="12"
        class="px-1 dtc-result"
      >
        <div
          v-if="loadingApi && isAbleToPickup"
          class="no-data"
        >
          <div>
            資料處理中請稍後。
            <b-spinner
              type="grow"
              label="Spinning"
            ></b-spinner>
            <b-spinner
              type="grow"
              label="Spinning"
            ></b-spinner>
            <b-spinner
              type="grow"
              label="Spinning"
            ></b-spinner>
          </div>
        </div>
        <div
          class="dtc-success"
          v-if="dtcBookDone"
          @click="dtcBookDone = false"
        >
          <header>
            <div>預約排程系統資訊</div>
            <div></div>
            <div>X</div>
            <div></div>
          </header>
          <main style="font-size:24px;">
            成功預約排程時段
            <font-awesome-icon
              style="font-size:24px;"
              icon="check"
              class="mr-1 text-success"
            />
          </main>
        </div>
        <div
          v-if="dtcShowForm"
          class="dtc-form"
        >
          <div class="my-form">
            <header>
              <font-awesome-icon
                icon="info"
                class="m1-1 mr-2"
              />預約確認 (可供編輯病患電話 / 備註)
            </header>

            <div class="text-white" style="font-size: 28px;" v-text="$moment(myBookItem.StartTime).format('YYYY-MM-DD')" />

            <b-input-group
              prepend="指定檢查室"
              style="min-width:400px;"
            >
              <b-input
                class="text-black text-bold"
                v-model="myBookItem.LocationName"
                :readonly="true"
              />
            </b-input-group>
            <b-input-group
              prepend="預約檢查項目"
              style="min-width:400px;"
            >
              <b-input
                class="text-black text-bold"
                v-model="myBookItem.CheckItemName"
                :readonly="true"
              />
            </b-input-group>
            <b-input-group
              prepend="開始時間"
              style="min-width:400px;"
            >
              <b-input
                class="text-black text-bold"
                v-model="myBookItem.show1"
                :readonly="true"
              />
            </b-input-group>
            <b-input-group
              prepend="結束時間"
              style="min-width:400px;"
            >
              <b-input
                class="text-black text-bold"
                v-model="myBookItem.show2"
                :readonly="true"
              />
            </b-input-group>
            <b-input-group
              prepend="電話[住家]"
              style="min-width:400px;"
            >
              <b-input class="text-black text-bold" v-model="myBookItem.PhoneNo4Residence" />
            </b-input-group>
            <b-input-group
              prepend="電話[手機]"
              style="min-width:400px;"
            >
              <b-input class="text-black text-bold" v-model="myBookItem.PhoneNo4Mobile" />
            </b-input-group>
            <b-input-group
              prepend="電話[工作]"
              style="min-width:400px;"
            >
              <b-input class="text-black text-bold" v-model="myBookItem.PhoneNo4Work" />
            </b-input-group>
            <b-input-group
              prepend="備註"
              style="min-width:400px;"
            >
              <b-textarea class="text-black text-bold" v-model="myBookItem.Description"></b-textarea>
            </b-input-group>
            <footer>
              <div></div>
              <b-button
                variant="primary"
                @click="submitDtcForm"
              >
                <font-awesome-icon
                  style="font-size:24px;"
                  icon="book"
                  class="mr-1"
                />確認預約
              </b-button>
              <b-button @click="dtcShowForm = false">
                <font-awesome-icon
                  style="font-size:24px;"
                  icon="undo"
                  class="mr-1"
                />取消預約
              </b-button>
            </footer>
          </div>
        </div>
        <div
          v-if="!loadingApi && !day1.length && !day2.length && !day3.length && !day4.length && !day5.length && !day6.length && !day7.length"
          class="no-data"
        >
          <div>溫馨提醒 : 此指定排程時段,暫無資料</div>
        </div>
        <main>
          <div
            class="dtc-room-grid"
            v-if="day1.length || day2.length || day3.length || day4.length || day5.length || day6.length || day7.length"
            style="border-radius:5px;border-bottom:none;"
          >
            <div class="dtc-day-title">
              <div
                :data-msg="day1Arr.length"
                v-if="day1.length"
                v-html="getDtdDayName(day1[0].StartTime)"
              ></div>
              <div v-if="day1.length">{{ getDtcDay(day1[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day1.length"
                v-html="getDtdDayName(sevenDays[0])"
              ></div>
              <div v-if="!day1.length">{{ sevenDays[0] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day2Arr.length"
                v-if="day2.length"
                v-html="getDtdDayName(day2[0].StartTime)"
              ></div>
              <div v-if="day2.length">{{ getDtcDay(day2[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day2.length"
                v-html="getDtdDayName(sevenDays[1])"
              ></div>
              <div v-if="!day2.length">{{ sevenDays[1] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day3Arr.length"
                v-if="day3.length"
                v-html="getDtdDayName(day3[0].StartTime)"
              ></div>
              <div v-if="day3.length">{{ getDtcDay(day3[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day3.length"
                v-html="getDtdDayName(sevenDays[2])"
              >></div>
              <div v-if="!day3.length">{{ sevenDays[2] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day4Arr.length"
                v-if="day4.length"
                v-html="getDtdDayName(day4[0].StartTime)"
              ></div>
              <div v-if="day4.length">{{ getDtcDay(day4[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day4.length"
                v-html="getDtdDayName(sevenDays[3])"
              ></div>
              <div v-if="!day4.length">{{ sevenDays[3] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day5Arr.length"
                v-if="day5.length"
                v-html="getDtdDayName(day5[0].StartTime)"
              ></div>
              <div v-if="day5.length">{{ getDtcDay(day5[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day5.length"
                v-html="getDtdDayName(sevenDays[4])"
              >></div>
              <div v-if="!day5.length">{{ sevenDays[4] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day6Arr.length"
                v-if="day6.length"
                v-html="getDtdDayName(day6[0].StartTime)"
              ></div>
              <div v-if="day6.length">{{ getDtcDay(day6[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day6.length"
                v-html="getDtdDayName(sevenDays[5])"
              ></div>
              <div v-if="!day6.length">{{ sevenDays[5] }}</div>
            </div>
            <div class="dtc-day-title">
              <div
                :data-msg="day7Arr.length"
                v-if="day7.length"
                v-html="getDtdDayName(day7[0].StartTime)"
              ></div>
              <div v-if="day7.length">{{ getDtcDay(day7[0].StartTime) }}</div>

              <div
                :data-msg="0"
                v-if="!day7.length"
                v-html="getDtdDayName(sevenDays[6])"
              ></div>
              <div v-if="!day7.length">{{ sevenDays[6] }}</div>
            </div>
          </div>
          <div
            class="dtc-room-grid"
            v-if="day1.length || day2.length || day3.length || day4.length || day5.length || day6.length || day7.length"
            style="padding-top:0.6rem;"
          >
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day1Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 32 + 32}ms`"
              >{{ getDtcTime(item.StartTime) }}</b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day2Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i + 1 * 32}ms`"
              >{{ getDtcTime(item.StartTime) }}</b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day3Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 32}ms`"
              >
                {{ getDtcTime(item.StartTime) }}
              </b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day4Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 34}ms`"
              >
                {{ getDtcTime(item.StartTime) }}
              </b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day5Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 35}ms`"
              >
                {{ getDtcTime(item.StartTime) }}
              </b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day6Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 36}ms`"
              >
                {{ getDtcTime(item.StartTime) }}
              </b-button>
            </section>
            <section>
              <b-button
                @click="showDtcDlg(item)"
                v-for="(item, i) in day7Arr"
                :variant="getBtnClass(item.StartTime)"
                size="md"
                :key="i"
                :style="`animation-delay: ${i * 37}ms`"
              >
                {{ getDtcTime(item.StartTime) }}
              </b-button>
            </section>
          </div>
        </main>
        <ejs-schedule
          class="dtc-ej2"
          ref="schLocation"
          :height="height"
          :timezone="timezone"
          :showHeaderBar="true"
          :showQuickInfo="false"
          :currentView="currentView"
          :timeScale="dtcTimeScale2"
          startHour="08:00"
          endHour="08:01"
          :workDays="workDays"
          :firstDayOfWeek="1"
          :workHours="{ start: '08:00', end: '08:01' }"
          :eventSettings="eventSettings"
          :editorTemplate="editorTemplate"
          :group="group"
          :actionBegin="schLocation_actionBegin"
          :navigating="schLocation_navigating"
          :eventRendered="onEventRendered"
        >
          <header class="dtc-book-header">
            <div>{{ getTimeName + " @ " }}</div>
            <div>{{ getRoomName.indexOf("檢查室") > -1 ? getRoomName : `${getRoomName} 檢查室` }}</div>
            <div class="text-danger" v-if="!this.isAbleToPickup && limitations[modality]" v-text="limitationInstruction" />
          </header>
          <e-views>
            <!-- <e-view option="Day" :eventTemplate="bookingEventTemplate"></e-view> -->
            <e-view
              option="Week"
              :eventTemplate="bookingEventTemplate"
            ></e-view>
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
  </div>
</template>

<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { CalendarPlugin } from "@syncfusion/ej2-vue-calendars";
import { Timezone } from "@syncfusion/ej2-schedule";
import { SchedulePlugin, Day, Week } from "@syncfusion/ej2-vue-schedule";
import { MultiSelectPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import * as configs from "@/config";
import DateHelper from "@/library/DateHelper";
import tooltipTemplate from "./Tooltip";
import editorTemplate from "./DetailEditor";
import infoCard from "./InfoCard";
import moment from "moment";
import BookingEventTemplate from "@/components/BookingEventTemplate";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { mapState, mapMutations } from "vuex";
import { getOptionsPatientSource, getFirstFreeTimeSlot } from "@/assets/service/dataManager.js";
//星期一
const weeks = {
  Monday: "週一",
  Tuesday: "週二",
  Wednesday: "週三",
  Thursday: "週四",
  Friday: "週五",
  Saturday: "週六",
  Sunday: "週日",
};

const colorList = ["#ea7a57", "#7fa900", "#5978ee", "#fec200", "#df5286", "#00bdae", "#865fcf", "#1aaa55", "#df5286", "#710193"];
const hubReconnectCountLimit = 3;

let timezone = new Timezone();

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear();
};

Vue.use(CalendarPlugin);
Vue.use(SchedulePlugin);
Vue.use(MultiSelectPlugin);
Vue.use(CheckBoxPlugin);

export default {
  name: "scheduleView",
  props: ["bookingInfo", "itemTab", "type", "viewDate", "patientInfo", "shouldBack", "isLimit", "modality"],
  components: {
    infoCard,
  },
  mixins: [dateFormatMixin],

  data () {
    return {
      timer: null,
      bookingProxy: null,
      sevenDays: [],
      dtcBookDone: false,
      dtcRoomId: "",
      myBookItem: "",
      dtcShowForm: false,
      loadingApi: false,
      workDays: [0],
      viewType: "全天",
      dtcTimeScale2: { interval: 120, slotCount: 0 },
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: [],
      day7: [],
      dtcItems: [],
      height: "650px",
      timezone: "Asia/Taipei",
      checkItems: [],
      selectCheckItem: [],
      locations: [],
      selectLocation: [],
      patientId: 0,
      currentView: "Week",
      monthSchedule: [],
      startDate: null,
      endDate: null,
      hasLabRoom: true,
      sockConnection: null,
      group: {
        enableCompactView: false,
        resources: ["LocationView"],
      },
      dsLocationView: [{ Id: "" }],
      screenHeight: 100,
      eventSettings: {
        dataSource: [],
        allowAdding: false,
        fields: {
          id: "Id",
          subject: { name: "CheckItemName" },
          description: { name: "Description" },
          patientName: { name: "PatientName" },
          PhoneNo4Residence: { name: "PhoneNo4Residence" },
          PhoneNo4Mobile: { name: "PhoneNo4Mobile" },
          PhoneNo4Work: { name: "PhoneNo4Work" },
          startTime: { name: "StartTime", validation: { required: true } },
          endTime: { name: "EndTime", validation: { required: true } },
        },
        enableTooltip: true,
        tooltipTemplate: function () {
          return { template: tooltipTemplate };
        },
      },
      editorTemplate: function () {
        return { template: editorTemplate };
      },
      bookTimeStr: null,
      bookStateInfo: {
        title: "預約資訊",
        value: "尚未預約",
      },
      bookingEventTemplate: function () {
        return {
          template: BookingEventTemplate,
        };
      },
      //
      //快速預約 屬性參數
      selectedFastBookingSlot: null,
      optionsFastBookingSlot: [],
      booked: true,
      limitations: {
        'US': new Date('2021/11/1 00:00:00'),
        // 'CT': new Date('2020/12/1 00:00:00'),
        'MR': new Date('2020/11/1 00:00:00'),
        'RF': new Date('2020/10/1 00:00:00'),
        // 'OT': new Date('2020/11/1 00:00:00'),
        'MG': new Date('2021/11/1 00:00:00'),
        'XA': new Date('2020/11/1 00:00:00')
      }
    }
  },
  computed: {
    ...mapState(['patientSourceList']),
    isAbleToPickup () {

      return !(this.isLimit && this.limitations[this.modality] && this.endDate < this.limitations[this.modality]) && !(this.modality === 'XA' && this.$route.name == 'bookingWindow') 
    },
    getRoomName () {
      if (!this.dtcRoomId) return "全部檢查室";
      return this.dsLocationView.find((s) => s.Id == this.dtcRoomId).Name;
    },
    getTimeName () {
      let str = "";
      if (this.viewType == "AM") {
        str = "上午";
      } else if (this.viewType == "PM") {
        str = "下午";
      } else {
        str = "全天";
      }
      return str;
    },
    day1Arr () {
      let arr = [];
      if (!this.day1.length) return arr;
      const now = moment(this.day1[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day1.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day1.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day1;
      }

      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day2Arr () {
      let arr = [];
      if (!this.day2.length) return arr;
      const now = moment(this.day2[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day2.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day2.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day2;
      }
      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day3Arr () {
      let arr = [];
      if (!this.day3.length) return arr;
      const now = moment(this.day3[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day3.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day3.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day3;
      }

      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day4Arr () {
      let arr = [];
      if (!this.day4.length) return arr;
      const now = moment(this.day4[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day4.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day4.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day4;
      }
      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day5Arr () {
      let arr = [];
      if (!this.day5.length) return arr;
      const now = moment(this.day5[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day5.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day5.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day5;
      }
      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day6Arr () {
      let arr = [];
      if (!this.day6.length) return arr;
      const now = moment(this.day6[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day6.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day6.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day6;
      }
      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    day7Arr () {
      let arr = [];
      if (!this.day7.length) return arr;
      const now = moment(this.day7[0].StartTime);
      let deadline = now
        .clone()
        .hour(12)
        .minute(0)
        .second(1);

      if (this.viewType == "AM") {
        arr = this.day7.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isBefore(deadline)) {
            return true;
          }
        });
      } else if (this.viewType == "PM") {
        arr = this.day7.filter((s) => {
          const t = moment(s.StartTime);
          if (t.isAfter(deadline)) {
            return true;
          }
        });
      } else {
        arr = this.day7;
      }
      if (this.dtcRoomId) {
        arr = arr.filter((s) => s.RoomId == this.dtcRoomId);
      }
      return arr;
    },
    patientInfoArr: function () {
      let info = [
        {
          label: "病患姓名",
          value: this.patientInfo.name,
        },
        {
          label: "身分證號",
          value: this.patientInfo.id,
        },
        {
          label: "性別",
          value: this.patientInfo.gender,
        },
        {
          label: "生日",
          value: moment(this.patientInfo.birthDay).format("YYYY/MM/DD"),
        },
        {
          label: "病歷號碼",
          value: this.patientInfo.hrNum,
        },
        {
          label: "申請單號",
          value: this.itemTab.MargeOrderNos,
        },
      ];

      return info;
    },
    limitationInstruction() {
      return !this.limitations[this.modality]
        ? ''
        : this.modality === 'XA'
          ? '不開放線上排程'
          : `必需在${ this.$moment(this.limitations[this.modality]).format('YYYY-MM-DD HH:mm:ss') }後，方可選擇`;
    }
  },
  provide: {
    schedule: [Day, Week],
    multiselect: [CheckBoxSelection],
  },
  methods: {
    ...mapMutations(['SET_PATIENT_SOURCE_LIST', 'SHOW_LOADING', 'HIDE_LOADING']),
    detectShouldRefresh(timeSlot) {
      let startTime = new Date(timeSlot.StartTime);
      if (
        this.selectLocation.some((l) => l == timeSlot.RoomId) &&
          this.selectCheckItem == timeSlot.CheckItemId &&
          this.startDate <= startTime &&
          this.endDate >= startTime
      ) {
        console.log('-----------detectShouldRefresh------------');
        this.scheduleFilter();
      }
    },
    async getFirstFreeTime({dateTime, days}) {
      const sourceType = this.checkVal(this.patientInfo.sourceType)
        ? this.patientInfo.sourceType
        : this.patientSourceList.find(({text})=> this.patientInfo.sourceType === text)['value'];
        
      const params = `type=${this.type}&checkItemId=${this.itemTab.Id}&startTime=${dateTime}&limit=${days}&patientBirthDay=${this.$moment(this.patientInfo.birthDay).toJSON()}&sourceType=${sourceType}&ignoreRule=${!this.$route.query.token}${this.dtcRoomId ? '&assignRoomId=' + this.dtcRoomId : ''}`;
      this.SHOW_LOADING();
      try {
        const res = await getFirstFreeTimeSlot(params);
        this.myBookItem = res;
        this.myBookItem.PhoneNo4Residence = window.dtcNP.PhoneNo4Residence;
        this.myBookItem.PhoneNo4Mobile = window.dtcNP.PhoneNo4Mobile;
        this.myBookItem.PhoneNo4Work = window.dtcNP.PhoneNo4Work;
        this.myBookItem.LocationName = this.myBookItem.LocationName ? this.myBookItem.LocationName : this.myBookItem.RoomName;
        this.myBookItem.show1 = this.getDtcTime(this.myBookItem.StartTime);
        this.myBookItem.show2 = this.getDtcTime(this.myBookItem.EndTime);
        this.dtcShowForm = true;
      } catch(err) {
        Swal.fire("搜尋失敗，請重新選擇條件", "", "info");
      } finally {
        this.HIDE_LOADING();
      }
    },
    showDtcDlg (item) {
      //var s = JSON.stringify(item);
      //alert(s);
      this.myBookItem = item;
      this.myBookItem.PhoneNo4Residence = window.dtcNP.PhoneNo4Residence;
      this.myBookItem.PhoneNo4Mobile = window.dtcNP.PhoneNo4Mobile;
      this.myBookItem.PhoneNo4Work = window.dtcNP.PhoneNo4Work;
      this.myBookItem.LocationName = this.myBookItem.LocationName ? this.myBookItem.LocationName : this.myBookItem.RoomName;
      this.myBookItem.show1 = this.getDtcTime(this.myBookItem.StartTime);
      this.myBookItem.show2 = this.getDtcTime(this.myBookItem.EndTime);
      this.dtcShowForm = true;
      //this.addTimeSlot(item);
    },
    submitDtcForm () {
      this.addTimeSlot(this.myBookItem);
      this.dtcShowForm = false;
    },
    onEventRendered: function (args) {
      if (args.data.PatientId == this.patientInfo.hrNum) {
        args.element.style.backgroundColor = "#FF8C00";
      } else if (args.data.Id > 0) {
        args.element.style.backgroundColor = "#BA55D3";
      } else {
        args.element.style.backgroundColor = "#2e6a00";
      }
    },
    setFocusOnSchedule () {
      this.$refs.schLocation.focus();
    },
    addTimeSlot: function (slot) {
      this.loadingApi = true;
      let _this = this;
      slot.Type = 0;

      slot.CheckItemNo = this.itemTab.No;
      slot.CheckItemId = this.itemTab.Id;
      slot.CheckItemName = this.itemTab.Name;
      slot.MargeCheckItemIds = this.itemTab.MargeCheckItemIds;
      slot.OrderNo = this.itemTab.MargeOrderNos;
      slot.PatientId = this.patientInfo.hrNum;
      // slot.FromHis = this.$route.query.token != null;
      slot.FromHis = true;

      let process_slot = { ...slot };
      process_slot.StartTime = timezone.removeLocalOffset(new Date(slot.StartTime));
      process_slot.EndTime = timezone.removeLocalOffset(new Date(slot.EndTime));
      _this.$emit("AddTimeSlot", process_slot);
      // this.sockConnection = $.hubConnection(configs.hubUrl);
      // this.bookingProxy = this.sockConnection.createHubProxy("bookingHub");
      

      // this.sockConnection.start().done(()=>{
      //   this.bookingProxy
      //   .invoke("addTimeSlot", process_slot, this.$store.state.Profile4User.JWTToke)
      //   .then((e) => {
      //     if (e.Success) {
      //       this.day1 = this.day2 = this.day3 = this.day4 = this.day5 = this.day6 = this.day7 = [];
      //       _this.$emit("AddTimeSlot", process_slot);
      //       this.bookTimeStr = process_slot.StartTime.toLocaleString("zh-TW", {
      //         timeZone: "UTC",
      //       });
      //       this.loadingApi = false;
      //       //document.querySelector("#accordion-2").click();
      //       this.$root.$emit("bv::toggle::collapse", "accordion-1");
      //       this.$root.$emit("bv::toggle::collapse", "accordion-2");
      //       this.dtcBookDone = true;
      //       setTimeout(() => (this.dtcBookDone = false), 3500);
      //       _this.bookStateInfo.value = _this.bookTimeStr;
      //       _this.scheduleFilter();
      //     } else {
      //       this.loadingApi = false;
      //       _this.$emit("Refresh");
      //       Swal.fire(e.Message, "", "info");
      //     }
      //   })
      //   .fail(function (error) {
      //     this.loadingApi = false;
      //     Swal.fire("發生錯誤，稍後再試", "", "info");
      //     console.log(error);
      //   });

      // });


      
    },
    EnableAndFilterScheduler () {
      console.log('-----EnableAndFilterScheduler-----');
      this.$refs.schLocation.ej2Instances.readonly = false;
      this.scheduleFilter();
      this.booked = false;
      this.selectedFastBookingSlot = null;
      this.getOptionsFastBookingSlot();
    },
    DisableScheduler () {
      console.log('-----DisableScheduler-----');
      this.$refs.schLocation.ej2Instances.readonly = true;
      this.scheduleFilter();
      this.booked = true;
    },

    schLocation_actionBegin: function (args) {
      if (args.requestType == "eventCreate") {
        let slot = args.data[0];
        if (this.addTimeSlot(slot) == false) args.cancel = true;
      } else if (args.requestType == "eventChange") {
        let slot = args.data;
        if (this.addTimeSlot(slot) == false) args.cancel = true;
      }
    },
    schLocation_navigating: function (e) {
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
      console.log('-----schLocation_navigating-----');
      this.scheduleFilter();
    },
    getDtdDayName (t) {
      const key = moment(t).format("dddd");
      const isToday = this.getDtcDay(Date()) === this.getDtcDay(t) ? true : false;
      if (key == "Saturday" || key == "Sunday") {
        return `<span>${weeks[key]}</span>`;
      } else if (isToday) {
        return `<span style="color:var(--primary)">${weeks[key]}</span>`;
      } else return weeks[key];
    },
    getDtcDay (t) {
      return moment(t).format("YYYY-MM-DD");
    },
    getBtnClass (t) {
      const str = moment(t).format("hh:mmA");
      return str.includes("PM") && !str.startsWith("12:00") ? "orange" : "success";
    },
    closeDlg () {
      if (this.shouldBack) {
        if(document.querySelector(".mu-appbar-title button.back-btn")) document.querySelector(".mu-appbar-title button.back-btn").click();
      } else {
        this.closeWin();
      }
    },
    closeWin () {
      window.close();
    },
    getDtcTime (t) {
      return moment(t).format("hh:mmA");
    },
    dateRangeOverlaps: function (changeTime, prevCheck) {
      var schLocationTimeSlot = this.$refs.schLocation.ej2Instances.getEvents();
      return schLocationTimeSlot.some(
        (s) =>
          (s.IsBlock || s.IsReadonly) &&
          (s.RoomId == changeTime.RoomId[0] || s.RoomId == changeTime.RoomId) &&
          DateHelper.dateRangeOverlaps(s.StartTime, s.EndTime, changeTime.StartTime, changeTime.EndTime) &&
          (prevCheck != true || s.EndTime >= changeTime.EndTime)
      );
    },

    scheduleFilter: function () {

      if(this.timer && Date.now() - this.timer < 500) return;
      this.timer = Date.now();


      // 外部及該modality在限制內
      if(!this.isAbleToPickup) {
        this.sevenDays = [];
        new Array(7).fill(1).forEach((v,i) => {
          this[`day${v + i}`] = [];
        })
        return;
      }
      

      // let _this = this;
      this.$refs.schLocation.ej2Instances.selectedDate = new Date(this.startDate);
      this.day1 = this.day2 = this.day3 = this.day4 = this.day5 = this.day6 = this.day7 = [];
      this.loadingApi = true;

      const sourceType = this.checkVal(this.patientInfo.sourceType)
        ? this.patientInfo.sourceType
        : this.patientSourceList.find(({text})=> this.patientInfo.sourceType === text)['value'];
      window.axios
        .get(
          "/schedule/GetFreeTimeSlot?type=" +
          this.type +
          "&checkItemId=" +
          this.itemTab.Id +
          "&startTime=" +
          this.startDate.toJSON() +
          "&endTime=" +
          this.endDate.toJSON() +
          "&patientBirthDay=" +
          this.$moment(this.patientInfo.birthDay).toJSON() +
          "&sourceType=" + sourceType +
          "&ignoreRule=" + !this.$route.query.token
          // this.patientInfo.sourceType // sourceCode, sourceType
        )
        .then((e) => {
          if (!e.Items || !e.Items.length) {
            this.loadingApi = false;
            return;
          }

          // console.log(this.$moment(e.Items[0].StartTime) >= this.$moment(this.startDate) && this.$moment(this.endDate) > this.$moment(e.Items[0].StartTime));

          if (this.$moment(e.Items[0].StartTime) < this.$moment(this.startDate) || this.$moment(e.Items[0].StartTime) >= this.$moment(this.endDate)) return;

          let items = e.Items.filter((s) => {
            return !s.IsBlock && s.Id < 1;
          });
          // it might has no data after the filtering step
          if (!items || !items.length) {
            this.loadingApi = false;
            return;
          }

          // console.log(JSON.stringify(items.slice(0, 1), 0, 2));
          // Oldest time first
          items.sort((a, b) => a.StartTime.localeCompare(b.StartTime));

          let day1 = moment(this.startDate.toJSON())
            .add("8", "hours")
            .format()
            .split("T")[0];
          const dArr = [day1];
          for (let i = 1; i < 8; ++i) {
            // if (!items.length) break;
            const currday = this.$moment(this.startDate).add(i-1, 'day').format("YYYY-MM-DD");
            this["day" + i] = this.isLimit && this.$moment(this.limitations[this.modality]).isAfter(currday)
              ? []
              : items.filter((s) => s.StartTime.startsWith(day1));

            items.splice(0, this["day" + i].length);
            day1 = moment(day1)
              .add(1, "days")
              .format()
              .split("T")[0];
            dArr.push(day1);
          } // end of for

          this.sevenDays = dArr;
          this.loadingApi = false;
          // _this.$refs.schLocation.ej2Instances.eventSettings.dataSource = this.day1[0];
        })
        .catch(err => {
          Swal.fire("發生錯誤，稍後再試", err, "info");
        })
    },
    checkVal(str) {
       return /^[a-zA-Z]+$/.test(str);
    },
    //
    //取得快速預約可選項目
    async getOptionsFastBookingSlot () {
      let _this = this;
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      let subPath = "../schedule/GetMonthFreeTimeSlot";
      let params =
        "?type=" +
        this.type +
        "&checkItemId=" +
        this.itemTab.Id +
        "&checkItemNo=" +
        this.itemTab.No +
        "&patientBirthDay=" +
        this.$moment(this.patientInfo.birthDay).toJSON() +
        "&sourceType=" +
        this.patientInfo.sourceType;
      let opStatus = false;
      await new DataManager({
        url: configs.publicPath + subPath + params,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      let index = 0;
      itemPack.forEach((i) => {
        let dateString = _this.DateToString(i.StartTime, true);
        let locationName = i.LocationName;
        let collection = {
          value: index,
          text: dateString + " " + locationName,
          slot: i,
        };
        convertedCollections.push(collection);
        index++;
      });
      this.optionsFastBookingSlot = convertedCollections;
    },
    fastBookingSlotChanged (x) {
      this.optionsFastBookingSlot.some((i) => {
        if (i.value === x) {
          this.addTimeSlot(i.slot);
          return true;
        }
      });
    },
    //
    //觸發翻上一週功能鍵
    triggerGoPrevious () {
      let _this = this;
      this.$refs.schLocation.$el.focus();
      let btn = window.$(".e-toolbar-item.e-prev.e-tbtn-align.e-overflow-show").find("button");
      if (btn) {
        this.$nextTick(() => {
          btn[0].click();
        });
      }
    },
    //
    //觸發翻下一週功能鍵
    triggerGoNext () {
      let _this = this;
      this.$refs.schLocation.$el.focus();
      let btn = window.$(".e-toolbar-item.e-next.e-tbtn-align.e-overflow-show").find("button");
      if (btn) {
        this.$nextTick(() => {
          btn[0].click();
        });
      }
    },
    async getPatientSourceList() {
      const {
        actual: { Items },
      } = await getOptionsPatientSource();
      this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })));
    },
    setWeekDate (date) {
      this.startDate = DateHelper.getWeekFist(date, false);
      this.endDate = DateHelper.getWeekLast(date, false);
    }
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
  },
  created: function () {
    // this.startDate = this.viewDate;
    // this.endDate = new Date(this.startDate);
    // this.endDate.setDate(this.startDate.getDate() + 1);

    // //預設以週排程 view呈現, 起始日期計算:
    // this.startDate = DateHelper.getWeekFist(this.startDate, false);
    // // this.endDate.setDate(this.startDate.getDate() + 7);
    // this.endDate = DateHelper.getWeekLast(this.startDate, false);
    this.setWeekDate(this.viewDate);
    let _this = this;
    window.axios.get("/checkItem/ForSpecialTime?includeCombo=true").then((e) => {
      _this.checkItems = e.Items;
      _this.selectCheckItem = _this.itemTab.Id;

      window.axios.get("/checkItem/Room?type=" + _this.type + "&id=" + _this.itemTab.Id).then((e) => {
        _this.locations = e.Items;
        this.dtcRoomId = e.Items && e.Items.length ? e.Items[0].Id : "";
        this.$root.$emit("update-dtc-rooms", e.Items);
        //沒有檢查室旗標切換
        if (_this.locations.length == 0) {
          _this.hasLabRoom = false;
        } else {
          _this.hasLabRoom = true;
        }
        _this.selectLocation = _this.locations.map((l) => l.Id);
        _this.scheduleFilter();
      });
    });

    if (!_this.itemTab.MargeOrderNos) {
      console.error("_this.itemTab.MargeOrderNos order id is not valid");
    }
    if (_this.itemTab.MargeOrderNos)
      window.axios.get("/schedule/BookingInfo?orderNo=" + _this.itemTab.MargeOrderNos + "&margeCheckItemIds=" + _this.itemTab.MargeCheckItemIds).then((e) => {
        // _this.booked = _this.$refs.schLocation.ej2Instances.readonly =
        //   e.length > 0;
        _this.bookStateInfo.value = "";
        e.forEach((i) => {
          _this.bookStateInfo.value += "預約檢查項目:" + i.CheckItemName + "<br>預約檢查時間:" + _this.$moment(i.StartTime).format("YYYY/MM/DD HH:mm") + "<br>";
        });
      });

    // if(this.$route.name != 'FI0101') {
    //   this.ConnectionHubConnection();
    // }
    // this.bookingProxy.on("scheduleChanged", (timeSlot) => {
    //   let startTime = new Date(timeSlot.StartTime);
    //   if (
    //     _this.selectLocation.some((l) => l == timeSlot.RoomId) &&
    //     _this.selectCheckItem == timeSlot.CheckItemId &&
    //     _this.startDate <= startTime &&
    //     _this.endDate >= startTime
    //   ) {
    //     _this.scheduleFilter();
    //   }
    //   console.log(timeSlot.StartTime);
    // });

    this.height = window.innerHeight - 190 + "px";
    if(this.patientSourceList.length === 0) this.getPatientSourceList();
  },
  mounted: function () {
    // this.loadingApi = true;
    // this.getOptionsFastBookingSlot(); //取得快速預約slots
  },
  beforeMount () {
    this.$root.$on("book-type", (type) => {
      this.viewType = type;
    });
    this.$root.$on("dtc-room-update", (id) => {
      this.dtcRoomId = isNaN(id) ? "" : id;
    });
  },
  beforeDestroy: function () {
    this.destroyed = true;
    if(this.sockConnection) this.sockConnection.stop();
  },
};
</script>

<style lang="scss" scoped>
.dtc-back-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  display: block;
  margin-left: -110px;
  margin-top: 120px;
  width: 100px;
  height: 50px;
  z-index: 6;
  border-radius: 15px;
}
.dtc-ej2 {
  position: relative;
  .dtc-book-header {
    position: absolute;
    top: 9px;
    left: 370px;
    font-size: 1rem;
    color: var(--primary);
    display: grid;
    width: 550px;
    height: 30px;
    grid-template-columns: max-content max-content max-content;
    grid-gap: 1rem;
  }
}
.dtc-day-title {
  position: relative;
  > div:first-child::after {
    content: attr(data-msg);
    position: absolute;
    background: var(--danger);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 12px;
    line-height: 25px;
    text-align: center;
    color: var(--light);
    font-weight: 900px;
    top: 0;
    right: 40px;
    display: block;
  }
  @media (max-width: 1600px) {
    > div:first-child::after {
      right: 22px;
    }
  }
}

.dtc-room-grid {
  button {
    min-width: 100px;
    font-size: 18px;
    animation: dtcButtons 220ms ease-in forwards;
  }
  .btn:hover {
    transform: scale(1.3) !important;
  }
}
@keyframes dtcButtons {
  0% {
    opacity: 0;
    transform: scale3d(0, 0, 1) rotate(120deg) translateY(-200px);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1) rotate(0deg) translateY(0);
  }
}

.dtc-result {
  position: relative;
  width: 100%;

  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 560px;
    height: 40px;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 20px;
    display: block;
    z-index: 999999;
    margin-left: 100px;
    background: #282828;
  }
  .dtc-success {
    position: fixed;
    top: 90px;
    right: 22px;
    width: 400px;
    height: 100px;
    border-radius: 5px;
    background: white;
    z-index: 999999;
    font-size: 1rem;
    cursor: pointer;
    header {
      width: 100%;
      background: var(--success);
      color: white;
      height: 30px;
      padding-top: 2px;
      padding-left: 12px;
      border-radius: 5px;
      display: grid;
      grid-template-columns: max-content 1fr max-content 12px;
    }
    main {
      padding-left: 1rem;
      border-radius: 5px;
      border: 1px solid;
    }
  }
  .dtc-form {
    position: fixed;
    background: rgba(#282828, 0.5);
    z-index: 1999999;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .my-form {
      border-radius: 5px;
      border: 1px solid white;
      background: var(--dark);
      width: 600px;
      height: 600px;
      display: grid;
      grid-template-columns: 1fr;
      padding: 12px;
      position: relative;
      padding-top: 42px;

      header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: var(--success);
        height: 30px;
        padding: 4px;
      }
      > div {
        margin-bottom: 12px;
        max-height: 30px;
      }
      > div:last-child {
        min-height: 400px;
      }
      footer {
        margin-top: 1rem;
        width: 100%;
        padding-top: 1rem;
        height: 50px;
        display: grid;
        grid-template-columns: 1fr max-content max-content;
        grid-gap: 1rem;
        border-top: 1px solid white;
      }
    }
    .input-group-prepend .input-group-text {
      min-width: 130px;
    }
  }
  main {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    display: block;
    margin-top: 45px;
    padding-top: 6px;
    z-index: 2;
    background: var(--themeBgColor);
  }
  .dtc-room-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    overflow-y: auto;
    width: 100%;
    max-height: calc(100vh - 320px);
    min-width: calc(100vh - 320px);
    @media (max-width: 1080px) {
      min-width: 14vw;
    }
    grid-gap: 10px;
    > div {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    > section {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      margin-bottom: 10px;
      justify-content: flex-start;
      align-items: center;
      > button {
        margin-bottom: 4px;
      }
    }
  }
}
.e-schedule-toolbar-container {
  display: inline-block;
  margin-top: -200px;
}
.btn-orange:hover,
.btn-success:hover {
  color: #343a40;
  background: #f8f9fa;
  font-size: 24px;
}
</style>

<style>
.e-btn.e-flat.e-primary,
.e-css.e-btn.e-flat.e-primary {
  background: var(--primary) !important;
  color: white !important;
}
.btn-orange {
  background: var(--orange);
  color: white;
}
</style>
