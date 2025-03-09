<template>
  <div class="pop-out" v-show="isShowApplyAccountAuditSchedule">
    <div
      id="popup-modal"
      tabindex="-1"
      class="overflow-y-auto overflow-x-hidden z-50 md:inset-0 h-modal justify-center items-center"
      aria-hidden="true"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1020px;
      "
    >
      <div
        class="relative bg-white rounded-lg shadow dark:bg-gray-700"
        style="border: 1px solid rgb(229 225 225 / 69%)"
      >
        <button
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
          data-modal-toggle="popup-modal"
          @click="isShowApplyAccountAuditSchedule = false"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <div class="p-6 text-center">
          <div class="text-2xl font-normal text-gray-800">
            審核流程檢視( 狀態:
            <span class="text-2xl font-bold text-blue-600">{{
              modalItem.StatusName
            }}</span>
            )
          </div>
          <div class="schedule" style="margin-top: 50px">
            <div class="schedule-content">
              <!-- <img
                class="mr-2"
                style="width: 76px"
                src="/assets/usericon.png"
              /> -->

              <svg
                width="82"
                height="82"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="10" r="3" fill="#222222" />
                <circle cx="12" cy="12" r="9" stroke="#222222" stroke-width="1.2" />
                <path
                  d="M17.8719 18.8083C17.9489 18.7468 17.9799 18.6436 17.9452 18.5513C17.5693 17.5518 16.8134 16.6706 15.7814 16.0332C14.6966 15.3632 13.3674 15 12 15C10.6326 15 9.30341 15.3632 8.21858 16.0332C7.18663 16.6706 6.43066 17.5518 6.05477 18.5513C6.02009 18.6436 6.05115 18.7468 6.12813 18.8083C9.56196 21.552 14.438 21.552 17.8719 18.8083Z"
                  fill="#2A4157"
                  fill-opacity="0.24"
                  stroke="#222222"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div
              class="myarrow schedule-content"
              :class="+modalItem.Status == 3 ? 'myarrow2' : ''"
            >
              <span>&#8674;</span>
            </div>

            <div class="schedule-content">
              <img style="width: 76px" src="/assets/management.png" />
            </div>
            <div
              class="myarrow schedule-content"
              :class="+modalItem.Status != 3 ? 'myarrow2' : ''"
            >
              <span>&#8674;</span>
            </div>
            <div class="schedule-content">
              <img
                style="width: 76px"
                :src="
                  +modalItem.Status == 2 ? '/assets/rejected.png' : '/assets/approved.png'
                "
              />
            </div>
          </div>
          <div class="schedule2" style="margin-bottom: 30px">
            <div class="schedule-content">
              <div
                class="schedule-content-result text-center"
                :title="dayjs(modalItem.CreateTime).format('YYYY-MM-DD HH:mm')"
              >
                {{ dayjs(modalItem.CreateTime).format("YYYY-MM-DD HH:mm") }}
              </div>
              <div class="text-left">
                <span class="schedule-content-title">單位: </span>
                <span class="schedule-content-result">{{
                  modalItem.InstitutionNoName || ""
                }}</span>
              </div>
              <div class="text-left">
                <span class="schedule-content-title">申請人: </span>
                <span class="schedule-content-result">{{
                  modalItem.Name || modalItem.No || ""
                }}</span>
              </div>
            </div>
            <div class="schedule-content"></div>
            <div class="schedule-content">
              <div
                class="schedule-content-result text-center"
                :title="dayjs(modalItem.ApprovalTime).format('YYYY-MM-DD HH:mm')"
              >
                {{
                  !!modalItem.ApprovalTime
                    ? dayjs(modalItem.ApprovalTime).format("YYYY-MM-DD HH:mm")
                    : " "
                }}
              </div>
              <div class="text-left">
                <span class="schedule-content-title">單位: </span>
                <span class="schedule-content-result">{{
                  modalItem.AuthInstitutionName || "No Data"
                }}</span>
              </div>
              <div class="text-left">
                <span class="schedule-content-title">審核人: </span>
                <span class="schedule-content-result">{{
                  modalItem.AuthName || "No Data"
                }}</span>
              </div>
            </div>
            <div class="schedule-content"></div>
            <div class="schedule-content">
              <div>&emsp;&emsp;</div>
              <div>&emsp;&emsp;</div>
              <div>&emsp;&emsp;</div>
              <!-- <div class="schedule-content-title text-left">結果:</div>
              <div
                class="text-left schedule-content-result"
                :style="
                  +modalItem.Status == 2
                    ? 'color:red'
                    : +modalItem.Status == 100
                    ? 'color:#6C9F43'
                    : ''
                "
              >
                {{ modalItem.StatusName }}
              </div> -->
            </div>
          </div>
          <button
            data-modal-toggle="popup-modal"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="isShowApplyAccountAuditSchedule = false"
          >
            關閉
          </button>
          <!-- {{ modalItem }} -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, toRef, toRefs, watch, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { changePassword } from "Service/apis.js";
import { useToast } from "vue-toastification";
import dayjs from "dayjs";

export default {
  setup() {
    const step = ref(1);
    const modalItem = ref({});

    const store = useStore();
    const toast = useToast();

    const isShowApplyAccountAuditSchedule = ref(false);

    const jobOptions = ref([
      { text: "醫生", value: "醫生" },
      { text: "護理人員", value: "護理人員" },
      { text: "行政人員", value: "行政人員" },

      { text: "其他", value: "其他" },
    ]);

    const reasonOptions = ref([
      {
        text: "偏遠地區遠距醫療建置計畫(醫事司)",
        value: "偏遠地區遠距醫療建置計畫(醫事司)",
      },
      {
        text: "緊急救護零時差多方資訊影像會診計畫(照護司)",
        value: "緊急救護零時差多方資訊影像會診計畫(照護司)",
      },
      {
        text: "優化兒童醫療照護計畫(醫事司)",
        value: "優化兒童醫療照護計畫(醫事司)",
      },

      { text: "其他", value: "其他" },
    ]);

    const institutionOptions = ref([
      { text: "衛生福利部桃園醫院", value: "衛生福利部桃園醫院" },
      { text: "臺北市立聯合醫院", value: "臺北市立聯合醫院" },
      { text: "衛生福利部苗栗醫院", value: "衛生福利部苗栗醫院" },
      { text: "國立陽明大學附設醫院", value: "國立陽明大學附設醫院" },
      { text: "其他", value: "其他" },
    ]);

    const saveModal = async () => {
      try {
        // await changePassword(obj);
        // toast.success(`密碼更新成功`, {
        //   timeout: 2000,
        //   hideProgressBar: true,
        // });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    };

    // function setData() {
    //   step.value = 1;
    //   // modalItem.value = {};
    // }

    return {
      modalItem,
      isShowApplyAccountAuditSchedule,

      saveModal,
      // setData,
      step,
      jobOptions,
      reasonOptions,
      institutionOptions,
      dayjs,
    };
  },
};
</script>
<style lang="scss" scoped>
.pop-out {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  display: grid;
  place-items: center;

  z-index: 100000000000000020000;
}
.schedule,
.schedule2 {
  display: grid;
  justify-content: center;
  align-items: center;
  margin: 20px 16px;
  grid-template-columns: 260px 50px 260px 50px 260px;
  .schedule-content {
    display: grid;
    justify-content: center;
    grid-template-rows: auto auto auto;
  }
}
.schedule2 {
  grid-template-columns: minmax(260px, auto) 50px minmax(260px, auto) 50px 260px;
  .schedule-content {
    grid-template-rows: 30px auto auto;
  }
}

.myarrow {
  font-size: 57px;
  color: #a7a7a7;
}
.myarrow2 {
  color: #4587f1;
}
.schedule-content-title {
  color: #041c79;
  margin-right: 3px;
}
.schedule-content-result {
  color: rgb(110, 110, 110);
  font-family: adobe-clean-han-japanese, -apple-system, BlinkMacSystemFont, Segoe UI,
    Roboto, sans-serif;
  font-size: 17px;
}
</style>
