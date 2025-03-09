<template>
  <section class="main-schedule" v-if="showScheduleConfirm">
    <main class="main-schedule-content">
      <div class="title">
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.14939 7.83131C8.57654 5.92179 10.0064 4 12 4C13.9936 4 15.4235 5.92179 14.8506 7.8313L13.2873 13.0422C13.2171 13.2762 13.182 13.3932 13.128 13.4895C12.989 13.7371 12.7513 13.9139 12.4743 13.9759C12.3664 14 12.2443 14 12 14C11.7557 14 11.6336 14 11.5257 13.9759C11.2487 13.9139 11.011 13.7371 10.872 13.4895C10.818 13.3932 10.7829 13.2762 10.7127 13.0422L9.14939 7.83131Z"
              fill="#fff"
              fill-opacity="0.24"
              stroke="#222222"
              stroke-width="1.2"
            />
            <circle
              cx="12"
              cy="19"
              r="2"
              fill="#fff"
              fill-opacity="0.24"
              stroke="#222222"
              stroke-width="1.2"
            />
          </svg>
          確認預約(可供編輯病患電話 / 備註)
        </div>
        <div class="close-btn" @click="showScheduleConfirm = false">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      <div class="main-content1">{{ editItem.StartDate || "" }}</div>

      <div class="main-content2">
        <b-input-group prepend="指定檢查室" style="min-width: 400px">
          <b-input
            class="text-black text-bold"
            v-model="editItem.LocationName"
            :readonly="true"
          />
        </b-input-group>
        <b-input-group prepend="預約檢查項目" style="min-width: 400px">
          <b-input
            class="text-black text-bold"
            :readonly="true"
            v-model="editItem.CheckItemName"
          />
        </b-input-group>
        <b-input-group prepend="開始時間" style="min-width: 400px">
          <b-input
            class="text-black text-bold"
            :readonly="true"
            v-model="editItem.startTimeformat"
          />
        </b-input-group>
        <b-input-group prepend="結束時間" style="min-width: 400px">
          <b-input
            class="text-black text-bold"
            :readonly="true"
            v-model="editItem.endTimeformat"
          />
        </b-input-group>
        <b-input-group prepend="電話[住家]" style="min-width: 400px">
          <b-input class="text-black text-bold" v-model="editItem.PhoneNo4Residence" />
        </b-input-group>
        <b-input-group prepend="電話[手機]" style="min-width: 400px">
          <b-input class="text-black text-bold" v-model="editItem.PhoneNo4Mobile" />
        </b-input-group>
        <b-input-group prepend="電話[工作]" style="min-width: 400px">
          <b-input class="text-black text-bold" v-model="editItem.PhoneNo4Work" />
        </b-input-group>
        <div class="comment-content">
          <div class="prepend-content">備註</div>
          <b-textarea
            class="text-black text-bold main-content"
            rows="4"
            v-model="editItem.Description"
          ></b-textarea>
        </div>
      </div>

      <footer class="page-footer">
        <b-button @click="scheduleConfirm" class="mr-2" variant="primary">
          <font-awesome-icon style="font-size: 24px" icon="book" class="mr-1" />確認預約
        </b-button>
        <b-button @click="showScheduleConfirm = false" class="mr-3">
          <font-awesome-icon style="font-size: 24px" icon="undo" class="mr-1" />取消預約
        </b-button>
      </footer>
    </main>
  </section>
</template>

<script>
// import Swal from "sweetalert2";

export default {
  name: "ScheduleMainRevise",

  props: ["patientInfo", "finalSelected", "mergedBookingSelected", "bookingObjs"],
  data() {
    return {
      showScheduleConfirm: false,
      editItem: {},
    };
  },
  methods: {
    showSchedule() {
      this.editItem = {};
      this.showScheduleConfirm = true;

      this.$nextTick(() => {
        const obj = {
          CheckItemId: this.finalSelected.CheckItemId || "",
          CheckItemName: this.finalSelected.CheckItemName || "",
          Description: "",
          EndTime: this.finalSelected.EndTime || "",
          FromHis: this.finalSelected.FromHis,
          Id: this.finalSelected.Id,
          IsBlock: this.finalSelected.IsBlock,
          IsCheckIn: this.finalSelected.IsCheckIn,
          IsFree: this.finalSelected.IsFree,
          IsMri: this.finalSelected.IsMri,
          IsReadonly: this.finalSelected.IsReadonly,
          IsSpecialCheckItem: this.finalSelected.IsSpecialCheckItem,
          MargeCheckItemIds: this.mergedBookingSelected.MargeCheckItemIds,

          OrderNo: this.bookingObjs.find(
            (s) => +s.checkId == +this.finalSelected.CheckItemId
          ).orderNo,
          PackageName: this.finalSelected.PackageName,
          PatientId: this.patientInfo.id,
          PatientName: this.patientInfo.name,
          PhoneNo4Mobile: this.patientInfo.PhoneNo4Mobile,
          PhoneNo4Residence: this.patientInfo.PhoneNo4Residence,
          PhoneNo4Work: this.patientInfo.PhoneNo4Work,
          RoomId: this.finalSelected.RoomId,
          RoomName: this.finalSelected.RoomName,
          StartTime: this.finalSelected.StartTime,
          Status: this.finalSelected.Status,
          Type: this.finalSelected.Type,
          LocationName: this.finalSelected.LocationName,
          startTimeformat: this.finalSelected.startTimeformat,
          endTimeformat: this.finalSelected.endTimeformat,
          StartDate: this.finalSelected.StartDate,
        };

        this.editItem = { ...obj };
      });
    },
    scheduleConfirm() {
      console.log("editItem", this.editItem);
      const obj = {
        CheckItemId: this.editItem.CheckItemId || "",
        CheckItemName: this.editItem.CheckItemName || "",
        Description: this.editItem.Description || "",
        EndTime: this.editItem.EndTime || "",
        FromHis: this.editItem.FromHis,
        Id: this.editItem.Id,
        IsBlock: this.editItem.IsBlock,
        IsCheckIn: this.editItem.IsCheckIn,
        IsFree: this.editItem.IsFree,
        IsMri: this.editItem.IsMri,
        IsReadonly: this.editItem.IsReadonly,
        IsSpecialCheckItem: this.editItem.IsSpecialCheckItem,
        MargeCheckItemIds: this.editItem.MargeCheckItemIds,
        OrderNo: this.editItem.OrderNo,
        PackageName: this.editItem.PackageName,
        PatientId: this.editItem.PatientId,
        PatientName: this.editItem.PatientName,
        PhoneNo4Mobile: this.editItem.PhoneNo4Mobile,
        PhoneNo4Residence: this.editItem.PhoneNo4Residence,
        PhoneNo4Work: this.editItem.PhoneNo4Work,
        RoomId: this.editItem.RoomId,
        RoomName: this.editItem.RoomName,
        StartTime: this.editItem.StartTime,
        Status: this.editItem.Status,
        Type: 0,
      };

      this.$emit("addBooking", obj);
      this.showScheduleConfirm = false;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.main-schedule {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.6);

  display: grid;
  place-items: center;

  z-index: 99999999999999999999;
  .main-schedule-content {
    width: 650px;
    height: 646px;
    background: white;
    position: relative;
    border-radius: 10px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #3096e6;
      color: #fff;
      border-radius: 5px 5px 0px 0px;
      .close-btn {
        cursor: pointer;
        margin-right: 10px;
      }
    }

    .main-content1,
    .main-content2 {
      width: 90%;
      margin: 0 auto;
    }

    .main-content1 {
      margin-top: 10px;
      margin-bottom: 3px;
      font-size: 20px;
      font-weight: 700;
      color: rgb(73, 73, 73);
    }

    .page-footer {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
      width: 100%;
      z-index: 99;
      background: #fcfcfc;
      border-radius: 0px 0px 3px 3px;
      padding: 10px;
    }
  }
}

/deep/ .input-group-text {
  background-color: #dcf2fb !important;
  color: #353b41 !important;
  font-weight: 500;
  border: 1px solid #3096e6 !important;
  border-radius: 5px;
  width: 126px;
}
/deep/.form-control {
  border: 1px solid #3096e6 !important;
}

.input-group {
  margin-bottom: 8px;
}

.comment-content {
  display: flex;
  .prepend-content {
    background-color: #dcf2fb;
    border-radius: 5px 0 0 5px;
    border: 1px solid #3096e6 !important;
    width: 158px;
    border-right: 0px !important;
    display: flex;
    align-items: center;
    padding-left: 12px;
  }
  .main-content {
  }
}
</style>
