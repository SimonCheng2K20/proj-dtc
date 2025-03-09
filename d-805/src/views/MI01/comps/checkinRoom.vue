<template>
  <div
    class="checking-rooms"
    :class="{ 'jump-out': isFixed, 'no-jump': !isFixed }"
  >
    <b-card
      no-body
      bg-variant="transparent"
      v-for="room in roomList"
      :key="room.RoomNo"
    >
      <b-button
        squared
        block
        href="#"
        :variant="getVariant(room.Modality)"
        @click="getDetail(room.RoomNo)"
        class="text-white"
      >{{
        `${room.RoomName} - (等候: ${room.WaitCount},報到: ${room.CheckInCount}
          ${excludeRoom.includes(room.RoomNo) ? "" : ", 排定: " + room.ScheduleCount}  )
        `
      }}</b-button>
      <b-collapse
        @show="showRoom(room.RoomNo)"
        :visible="room.RoomNo === currentRoomNo"
        :id="room.RoomNo"
        accordion="my-accordion"
        role="tabpanel"
      >
        <div class="position-relative py-2">
          {{
            `等候人數： ${room.WaitCount}, 報到人數: ${room.CheckInCount}
          ${excludeRoom.includes(room.RoomNo) ? "" : ", 排定人數: " + room.ScheduleCount}`
          }}
          <div class="listData mt-2">
            <font
              class="no-data"
              v-if="!room.WaitList || room.WaitList.length === 0"
            > 【無人數資料】 </font>
            <div
              v-else
              v-for="({ PatientId, PatientName, ProcedureCode, ProcedureName, No, ProcedureIdx }, idx) in room.WaitList"
              :key="room.RoomNo + idx"
              class="d-flex align-items-center justify-content-between member-list px-2 member-row"
            >
              <div
                v-if="No"
                v-text="`序號: ${No}`"
              />
              <div v-text="PatientName" />
              <div v-text="ProcedureName" />
            </div>
          </div>
        </div>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { getWaitingPatients } from "@/assets/service/dataManager.js";
// getCallNoCurrentDayList
export default {
  data () {
    return {
      callNoList: {},
      isLoading: false,
      currentRoomNo: null,
      roomColor: this.modalityColor,
      excludeRoom: ["CR001", "CR003", "CR006", "CR008", "CR015", "PCR"], // 不需排定人數
      basicSize: { top: 0, width: 0 },
      isFixed: false,
      fixTimeOut: null
    };
  },
  inject: ["modalityColor"],
  mounted () {
    this.basicSize.top = this.$el.offsetParent.offsetTop + document.getElementById("mainNav").offsetHeight - 13;
    this.basicSize.width = this.$el.offsetParent.clientWidth;
    this.setStyle();
  },
  props: {
    rooms: {
      type: Array,
      required: true
    },
    isFixedMode: {
      type: Boolean,
      default: false
    },
    specificMod: {
      type: String
    }
  },
  methods: {
    setStyle () {
      this.$el.style.top = this.basicSize.top + "px";
      this.$el.style.maxWidth = this.basicSize.width + "px";
    },
    getVariant (mo) {
      return (this.roomColor[mo] ? this.roomColor[mo][0] : "bg-secondary").substr(3);
    },
    getDetail (roomNo) {
      this.currentRoomNo = roomNo;
    },
    showRoom (roomNo) {
      if (!roomNo.startsWith("CR")) return;
      // &date=${this.$moment().format("YYYY-MM-DD")} getCallNoCurrentDayList
      getWaitingPatients(roomNo).then(res => {
        const origList = this.roomList.find(room => room.RoomNo === roomNo).WaitList;
        if (res.length !== origList.length || origList.every((ori, i) => !Object.keys(ori).some(k => ori[k] != res[i][k]))) {
          this.$emit("updateSpecificRoomMember", { WaitList: res, RoomNo: roomNo });
        }
      }).catch(err => {
        window.console.log(err);
      })
    }
  },
  computed: {
    roomList () {
      const sortedRooms =
        !this.rooms || this.rooms.length == 0
          ? []
          : this.specificMod
            ? this.rooms.filter(({ RoomNo }) => RoomNo.substr(0, 2) === this.specificMod).sort((c, n) => (c.RoomNo > n.RoomNo ? 1 : -1))
            : this.rooms.sort((c, n) => (c.RoomNo > n.RoomNo ? 1 : -1));

      sortedRooms.forEach(room => {
        // room.WaitList.forEach((member, idx) => {
        //   member["ProcedureIdx"] =
        //     idx === 0 ? 1 : room.WaitList[idx - 1].PatientId === member.PatientId ? room.WaitList[idx - 1]["ProcedureIdx"] : room.WaitList[idx - 1]["ProcedureIdx"] + 1;
        // });
        room.WaitList = room.WaitList.sort((p1, p2) => (p1.No > p2.No ? 1 : -1));
      });
      // console.log(sortedRooms);
      return sortedRooms;
    }
  },
  watch: {
    isFixedMode (value) {
      if (this.fixTimeOut) clearTimeout(this.fixTimeOut);
      if (value) {
        this.isFixed = value;
        this.$el.style.top = "29px";
      } else {
        this.$el.style.top = this.basicSize.top + "px";
        this.fixTimeOut = setTimeout(() => {
          this.isFixed = value;
        }, 500);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/colors.scss";

.checking-rooms {
  background-color: #fff;
  background-color: var(--themeBgColor);
  transition: ease 0.5s all;
  top: "226px";
  &.jump-out {
    position: fixed;
    z-index: 1041;
  }
  &.no-jump {
    max-width: 100%;
    max-height: calc(100vh - 225px);
    overflow-y: auto;
  }
}

.member-list {
  border-top: 1px solid #aaa;
}
.spinner {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.member-row {
  // background-color: #eee;
  // &:nth-child(odd) {
  // background-color: #999;
  // color: #fff;
  // }
  > div {
    flex: 1;
    text-align: left;
  }
}
.listData {
  .no-data {
    font-weight: bold;
    font-size: 12px;
    color: #aaa;
  }
}
</style>
