<template>
  <custom-modal ref="instantWork" title="快速作業" size="xl" :show="show">
    <div class="info" v-if="info">
      <template v-for="{ key, text } in columns">
        <b-input-group :prepend="text" :key="key" v-if="info[key]">
          <b-input v-model="info[key]" :readonly="true" style="color:white;" />
        </b-input-group>
      </template>
    </div>
    <div class="essay" v-if="info">
      <template v-for="{ key, text } in essay">
        <b-input-group style="margin-bottom: 3px;" :prepend="text" :key="key" v-if="info[key]">
          <b-form-textarea v-model="info[key]" :readonly="true" style="color:white;" />
        </b-input-group>
      </template>
    </div>

    <div class="w-100" slot="cus-footer">
      <template v-if="info">
        <div class="text-left" v-if="isChangeRoom">
          <b-form-group v-if="roomOptions" inline label="切換以下檢查室">
            <b-form-radio
              v-model="changingRoom"
              name="changeRoomRadio"
              inline
              v-for="room in roomOptions"
              :key="room.value"
              :value="room.value"
              :disabled="item.ScheduleLocation == room.value"
            >
              {{ room.text }}</b-form-radio
            >
          </b-form-group>
        </div>

        <div v-if="isChangeTime">
          <time-arrow
            :date="availableDate"
            :fontScale="2"
            v-on:changeDate="
              (date) => {
                availableDate = date;
                getAvailableTimeGap();
              }
            "
          />

          <b-spinner v-show="isFetchAvailableTime" variant="primary" type="grow" label="Spinning"></b-spinner>

          <template v-show="!isFetchAvailableTime">
            <div v-if="availableSchedule.length > 0" class="d-flex flex-wrap my-2">
              <b-button
                class="mr-1 mb-1"
                variant="primary"
                v-for="time in availableSchedule"
                :key="time.CheckItemId + time.StartTime"
                size="sm"
                @click="$emit('changeCheckinTime', { time, checkitem, bookinfo })"
                >{{ $moment(time.StartTime).format("HH:mm") }}</b-button
              >
            </div>
            <div v-else>今日已無資料，請點選下一日</div>
          </template>
        </div>

        <div class="d-flex align-items-center justify-content-stretch b-btns">
          <template v-if="isChangeRoom || isChangeTime">
            <b-button v-if="isChangeRoom" variant="danger" @click="$emit('changeCheckinRoom', changingRoom)" :disabled="changingRoom == null">確定更換</b-button>
            <b-button variant="primary" @click="changeSchedule('all')">回上一步</b-button>
          </template>

          <template v-else>
            <b-button v-if="item.Status === '12'" variant="warning" @click="changeSchedule('time')">換排檢時程</b-button>
            <b-button v-if="item.Status === '12'" variant="danger" @click="$emit('checkin')">快速報到</b-button>

            <b-button v-if="item.Status === '21'" variant="warning" @click="changeSchedule('room')">更換檢查室</b-button>
            <b-button v-if="item.Status === '21'" variant="danger" @click="$emit('cancelCheckin')">取消報到</b-button>
          </template>
          <b-button variant="info" @click="$emit('closeModal')">取消</b-button>
        </div>
      </template>
    </div>
  </custom-modal>
</template>

<script>
import customModal from "@/components/CustomModal.vue";
import timeArrow from "./timeArrow";
export default {
  data() {
    return {
      isMounted: false,
      isChangeRoom: false,
      isChangeTime: false,
      changingRoom: null,
      isFetchAvailableTime: false,
      availableDate: new Date(),
      checkitem: null,
      bookinfo: null,
      availableSchedule: [],
      columns: [
        { key: "PatientId", text: "病歷號" },
        { key: "PatientName", text: "姓名" },
        { key: "AccessionNo", text: "申請單號" },
        { key: "PatientBirthday", text: "生日" },
        { key: "PatientAge", text: "年齡" },
        { key: "PatientSex", text: "性別" },
        { key: "PhoneNo4Mobile", text: "聯繫電話" },
        { key: "PhoneNo4Residence", text: "住家電話" },
        { key: "PhoneNo4Work", text: "工作電話" },
        { key: "Modality", text: "儀器" },
        { key: "OrderDate", text: "開單時間" },
        { key: "BedNo", text: "病床號" },
        { key: "ScheduleLocationName", text: "檢查室" },
        { key: "ScheduleTime", text: "排程時間" },
        { key: "Status", text: "報到狀態" },
        { key: "PreAuditTime", text: "審單時間" },
        { key: "EmgFlag", text: "優先順序" },
        { key: "PreAuditPhysician", text: "審單醫師" },
      ],
      essay: [
        { key: "PreAuditNote", text: "審單作業" },
        { key: "ProcedureName", text: "檢查項目" },
        { key: "Subjective", text: "主訴" },
        { key: "Objective", text: "客訴" },
        { key: "Description", text: "備註" },
      ],
    };
  },
  mounted() {
    this.isMounted = true;
  },
  props: {
    item: {
      type: Object,
    },
    show: {
      type: Boolean,
      default: false,
    },
    roomOptions: {
      type: Array,
    },
  },
  computed: {
    showState() {
      return this.isMounted ? this.$refs["instantWork"].showState : false;
    },
    info() {
      return !this.isMounted || !this.item
        ? null
        : Object.keys(this.item).reduce((a, k) => {
            return !this.item[k]
              ? a
              : {
                  ...a,
                  [k]: ["PatientBirthday", "ScheduleTime", "PreAuditTime", "OrderDate"].some((d) => d === k)
                    ? this.$moment(this.item[k]).format("YYYY-MM-DD HH:mm")
                    : k === "Status"
                    ? this.item[k] === "12"
                      ? "已排程"
                      : "已報到"
                    : k === "EmgFlag"
                    ? this.item[k] === "Y"
                      ? "急作"
                      : "一般"
                    : this.item[k],
                };
          }, {});
    },
  },
  components: {
    customModal,
    timeArrow,
  },
  methods: {
    changeCheckinRoom() {},
    changeSchedule(method) {
      if (method === "room") {
        this.changingRoom = this.item.ScheduleLocation;
        this.isChangeRoom = true;
      } else if (method === "time") {
        this.isChangeTime = !this.isChangeTime;
        this.getAvailableTimeGap();
      } else if (method === "all") {
        this.isChangeRoom = this.isChangeTime = false;
        this.changingRoom = null;
      }
    },
    async getAvailableTimeGap() {
      this.isFetchAvailableTime = true;
      const { ProcedureName, AccessionNo } = this.item;
      // CheckCategoryName
      // let obj = {
      //   orderNo: this.item.OrderNo,
      //   checkItemNos: [this.item.ProcedureCode],
      // };
      const { Items } = await window.axios.get("/checkItem/ForSpecialTime?includeCombo=true");
      this.checkitem = Items.find((j) => ProcedureName == j.Name);

      // console.log(this.checkitem);

      this.bookinfo = await window.axios.get("/schedule/BookingInfo?orderNo=" + AccessionNo.slice(0,10) + "&margeCheckItemIds=" + this.checkitem.Id);
      this.bookinfo = this.bookinfo[0];
      let params = `?type=item
                      &checkItemId=${this.checkitem.Id}
                      &checkItemNo=${this.checkitem.No}
                      &patientBirthDate=${this.item.PatientBirthday}
                      &sourceType=${this.item.PatientSourceTypeCode}
                      &startTime=${this.$moment(this.availableDate).format("YYYY-MM-DDT00:00:00") + ".000Z"}
                      &endTime=${this.$moment(this.availableDate).format("YYYY-MM-DDT23:59:59") + ".999Z"}
                      &ignoreRule=${!this.$route.query.token}
                      `;
      const res = await window.axios.get("/schedule/GetFreeTimeSlot" + params);
      this.availableSchedule = res.Items;
      this.isFetchAvailableTime = false;
    },
    async getAvailableSchedule() {
      this.isFetchAvailableTime = true;
      let obj = {
        orderNo: this.item.OrderNo,
        checkItemNos: [this.item.ProcedureCode],
      };
      const { Items } = await window.axios.get("/checkItem/ForSpecialTime?includeCombo=true");
      this.checkitem = Items.find((j) => obj.checkItemNos.includes(j.No));
      this.bookinfo = await window.axios.get("/schedule/BookingInfo?orderNo=" + this.item.OrderNo + "&margeCheckItemIds=" + this.checkitem.Id);
      this.bookinfo = this.bookinfo[0];
      // let subPath = '../schedule/GetFreeTimeSlotList'
      let subPath = "../schedule/GetMonthFreeTimeSlot";
      let params =
        "?type=item" +
        "&checkItemId=" +
        this.checkitem.Id +
        "&checkItemNo=" +
        this.checkitem.No +
        "&patientBirthDate=" +
        this.item.PatientBirthday +
        "&sourceType=" +
        this.item.PatientSourceTypeCode +
        "&ignoreRule=" + !this.$route.query.token

      const { actual } = await new DataManager({
        url: configs.publicPath + subPath + params,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }).executeQuery(new Query());

      this.availableSchedule = actual.map((a, i) => ({
        value: i,
        text: this.$moment(a.StartTime).format("YYYY-MM-DD HH:mm:ss") + " " + a.LocationName,
        slot: a,
      }));
      this.isFetchAvailableTime = false;
    },
  },
  watch: {
    showState(value) {
      if (!value) {
        this.$emit("closeModal");
        this.isFetchAvailableTime = this.isChangeTime = this.isChangeRoom = false;
        this.changingRoom = null;
        this.availableDate = new Date();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.info {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 3px;
  grid-template-columns: repeat(3, 1fr);
}

.essay {
  padding: 0 3px;
}

.input-group-prepend .input-group-text {
  width: 90px;
}

.form-control[readonly] {
  color: #000 !important;
}
</style>
