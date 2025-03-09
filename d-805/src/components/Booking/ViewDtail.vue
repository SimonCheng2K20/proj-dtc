<template>
  <section class="main-schedule" v-if="showDetail">
    <main class="main-schedule-content">
      <div class="title">
        <div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.5 12.5L15.5 12.5" stroke="#fff" stroke-linecap="round" />
            <path d="M8.5 15.5L12.5 15.5" stroke="#fff" stroke-linecap="round" />
            <path
              d="M5.5 5.9C5.5 5.05992 5.5 4.63988 5.66349 4.31901C5.8073 4.03677 6.03677 3.8073 6.31901 3.66349C6.63988 3.5 7.05992 3.5 7.9 3.5H12.5059C12.8728 3.5 13.0562 3.5 13.2288 3.54145C13.3819 3.57819 13.5282 3.6388 13.6624 3.72104C13.8138 3.8138 13.9435 3.94352 14.2029 4.20294L17.7971 7.79706C18.0565 8.05648 18.1862 8.1862 18.279 8.33757C18.3612 8.47178 18.4218 8.6181 18.4586 8.77115C18.5 8.94378 18.5 9.12723 18.5 9.49411V18.1C18.5 18.9401 18.5 19.3601 18.3365 19.681C18.1927 19.9632 17.9632 20.1927 17.681 20.3365C17.3601 20.5 16.9401 20.5 16.1 20.5H7.9C7.05992 20.5 6.63988 20.5 6.31901 20.3365C6.03677 20.1927 5.8073 19.9632 5.66349 19.681C5.5 19.3601 5.5 18.9401 5.5 18.1V5.9Z"
              stroke="#fff"
            />
            <path
              d="M12.5 3.5V7.1C12.5 7.94008 12.5 8.36012 12.6635 8.68099C12.8073 8.96323 13.0368 9.1927 13.319 9.33651C13.6399 9.5 14.0599 9.5 14.9 9.5H18.5"
              stroke="#fff"
            />
          </svg>

          檢視明細
        </div>
        <div class="close-btn" @click="showDetail = false">
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
        <!-- <b-input-group prepend="備註" style="min-width: 400px">
          <b-textarea
            class="text-black text-bold"
            rows="4"
            v-model="editItem.Description"
            :readonly="true"
          ></b-textarea>
        </b-input-group> -->
        <div class="comment-content">
          <div class="prepend-content">備註</div>
          <b-textarea
            class="text-black text-bold main-content"
            rows="4"
            v-model="editItem.Description"
            :readonly="true"
          ></b-textarea>
        </div>
      </div>

      <footer class="page-footer">
        <b-button class="mr-3" @click="showDetail = false"> 關閉 </b-button>
      </footer>
    </main>
  </section>
</template>

<script>
// import Swal from "sweetalert2";

export default {
  name: "ScheduleMainRevise",

  props: ["bookingDetail"],
  data() {
    return {
      showDetail: false,
      editItem: {},
    };
  },
  methods: {
    showBookingDetail() {
      this.editItem = {};
      this.showDetail = true;

      this.$nextTick(() => {
        this.editItem = { ...this.bookingDetail };
        this.editItem.StartDate = this.$moment(this.editItem.StartTime).format(
          "YYYY-MM-DD"
        );
      });
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
