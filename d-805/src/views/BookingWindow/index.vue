<template>
  <div>

    <page-title
      title="預約檢查表"
      img="list"
    >
      <div class="flex-1 ml-auto d-flex align-items-center ml-sm-2">
        <bar
          class="ml-auto pb-2 bar-header"
          :when.sync="when"
          :dialogOpened.sync="dialogOpened"
          :rooms="dtcRooms"
          :variants="variants"
          :showClose="false"
          :defaultIsAll="true"
          :dtcBtnId="dtcBtnId"
          @callLastDay="showLastDay"
          @upTime="({text, value})=> updateDtcTime(text, value)"
          @upRoom="({item, value})=> updateDtcRoom(item, value)"
          @executeAfterFresh="onAfterFresh"
          @UpView="UpdateView"
        />

      </div>
    </page-title>

    <booking :shouldBack="false" />
  </div>
</template>

<script>
import booking from "@/components/Booking/Index";
import bar from "@/components/Booking/Bar";


export default {
  data () {
    return {
      when: "全天",
      dialogOpened: false,
      dtcRooms: [],
      variants: ["primary", "secondary", "success", "danger", "info", "light", "dark"],
      dtcBtnId: ''
    }
  },
  methods: {
    showLastDay () {
      if (window.dtcDebug) {
        alert(window.dtcLastDay);
      }
    },
    updateDtcTime (str, type) {
      this.when = str;
      this.$root.$emit("book-type", type);
    },
    updateDtcRoom (item, str) {
      if (str) {
        this.dtcBtnId = str;
        this.$root.$emit("dtc-room-update", str);
      } else {
        this.dtcBtnId = item.Id;
        this.$root.$emit("dtc-room-update", item.Id);
      }
    },
    onAfterFresh () {
      console.log('---------onAfterFresh------');
    },
    UpdateView () {
      console.log('---------UpdateView------');
    }
  },
  created () {
    // window.axios.get("/checkItem/Room?type=" + _this.type + "&id=" + _this.itemTab.Id).then((e) => {
  },
  beforeMount () {
    this.$root.$on("update-dtc-rooms", (rooms) => {
      rooms.length > 0 ? (this.dtcBtnId = rooms[0].Id) : (this.dtcBtnId = "");
      this.dtcRooms = rooms;
    });
  },
  components: {
    booking, bar
  }
}
</script>

<style lang="scss" scoped>
.bar-header {
  width: 100%;
  @media (min-width: 800px) {
    width: calc(75vw - 30px);
  }
}
</style>
