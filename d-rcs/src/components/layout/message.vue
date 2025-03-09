<template>
  <Dialog
    class="custom-modal custom-scroll-bar"
    v-model:visible="showMessageModal"
    :draggable="false"
    :modal="true"
    style="width: 800px"
    @show="setData"
  >
    <template #header>
      <h3>通知資訊</h3>
    </template>

    <div
      class="mb-5 consultationSide mt-2"
      v-if="belongArr.includes(2) || belongArr.includes(3) || belongArr.includes(4)"
    >
      <div class="text-xl font-bold">會診端:</div>
      <div class="my-1 mr-2 text-md font-semibold flex">
        <!-- <img class="mr-2" src="/assets/notice-icon2.png" /> -->
        1. 單位尚未填寫會診紀錄的筆數: {{ staticDatas.data1 }} 筆
      </div>
      <div class="my-1 mr-2 text-md font-semibold">
        2. 本人尚未填寫會診紀錄的筆數: {{ staticDatas.data2 }} 筆
      </div>
      <button
        class="edit-block bg-blue-600 px-5 py-2 text-md shadow-sm font-medium tracking-wider text-white rounded hover:shadow-2xl hover:bg-blue-700 flex align-center"
        @click="goRecordList(1)"
      >
        <svg
          class="h-6 w-6 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
          <line x1="10" y1="14" x2="20" y2="4" />
          <polyline points="15 4 20 4 20 9" />
        </svg>
        <div style="margin-top: 0.5px">前往編輯</div>
      </button>
    </div>

    <div
      v-if="belongArr.includes(0) || belongArr.includes(1) || belongArr.includes(4)"
      class="consultingSide mt-2"
    >
      <div class="text-xl font-bold">諮詢端:</div>
      <div class="my-1 mr-2 text-md font-semibold">
        1. 單位: 會診中筆數 {{ staticDatas.data6 }} 筆、會診結束筆數
        {{ staticDatas.data3 }} 筆
      </div>
      <div class="my-1 mr-2 text-md font-semibold">
        2. 本人: 會診中筆數 {{ staticDatas.data7 }} 筆、會診結束筆數
        {{ staticDatas.data4 }} 筆
      </div>
      <div class="my-1 mr-2 text-md font-semibold">
        3. 單位電子病歷跨院同意書尚未上傳筆數: {{ staticDatas.data5 }} 筆
      </div>

      <button
        class="edit-block bg-green-600 px-5 py-2 text-md shadow-sm font-medium tracking-wider text-white rounded hover:shadow-2xl hover:bg-green-700 flex align-center"
        @click="goRecordList(2)"
      >
        <svg
          class="h-6 w-6 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
          <line x1="10" y1="14" x2="20" y2="4" />
          <polyline points="15 4 20 4 20 9" />
        </svg>
        <div style="margin-top: 0.5px">前往編輯</div>
      </button>
    </div>

    <div v-if="belongArr && belongArr.length === 0">
      <div class="my-1 mr-2 text-md font-semibold">
        目前沒有訊息
      </div>
    </div>

    <template #footer>
      <Button class="p-button-outlined" @click.stop="showMessageModal = false"
        >OK!我知道了</Button
      >
    </template>
  </Dialog>
</template>

<script>
import { inject, ref, defineComponent } from "vue";
import { getNetGroup, getSheetList, getNotify } from "Service/apis.js";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
// getNetGroup

export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const showMessageModal = ref(false);
    const belongArr = ref([]);

    const staticDatas = ref({
      data1: "",
      data2: "",
      data3: "",
      data4: "",
      data5: "",
      data6: "",
      data7: "",
    });

    const allRecords = ref([]);

    const setGroup = async () => {
      let groupbelong = sessionStorage.getItem("groupbelong")
        ? JSON.parse(sessionStorage.getItem("groupbelong"))
        : [];

      belongArr.value = [...groupbelong];

      console.log(belongArr.value)

      if (!groupbelong.length) {
        const accountInstitutionNo = store.state?.others
          ? store.state?.others.InstitutionNo
          : "";

        const res1 = await getNetGroup(
          `?$filter=Stations/any(d:d/No eq '${accountInstitutionNo}')`
        );

        const res2 = await getNetGroup(
          `?$filter=ResponsibilityHospitals/any(d:d/No eq '${accountInstitutionNo}')`
        );
        const res3 = await getNetGroup(
          `?$filter=PartnerHospitals/any(d:d/No eq '${accountInstitutionNo}')`
        );

        let { Count: Count1 } = res1.data;
        let { Count: Count2 } = res2.data;
        let { Count: Count3 } = res3.data;

        const belong1 = +Count1 > 0 ? 1 : "";
        const belong2 = +Count2 > 0 ? 2 : "";
        const belong3 = +Count3 > 0 ? 3 : "";

        let arr = [belong1, belong2, belong3];
        arr = arr.filter((s) => Boolean(s));

        belongArr.value = [...arr];
        sessionStorage.setItem("groupbelong", JSON.stringify(arr));
      }
    };

    const getRecordDatas = async () => {
      const res = await getSheetList(
        `?$filter=(Status eq 10 or Status eq 20)&$orderby= ApplyTime desc`
      );
      let arr = [];

      const accountInstitutionNo = store.state?.others
        ? store.state?.others.InstitutionNo
        : "";

      const accountName = store.state?.others ? store.state?.others.Name : "";

      let { Items, Count } = res.data;
      arr = Items.map((s) => ({
        name: s.Patient.Name || "",

        applyTime: Boolean(s.ApplyTime)
          ? s.ApplyTime.split("T")[0] + " " + s.ApplyTime.split("T")[1]
          : "",
        allDoctors: s.MeetingInstitutionMembers.join("、"),
        ...s,
      }));

      allRecords.value = [...arr];

      //set static data
      // staticDatas.data1--會診端 單位尚未填寫會診紀錄的筆數
      // staticDatas.data2--會診端 本人尚未填寫會診紀錄的筆數
      // staticDatas.data3--諮詢端 單位會診結束筆數
      // staticDatas.data4--諮詢端 本人會診結束比數
      // staticDatas.data5--諮詢端 單位電子病歷跨院同意書尚未上傳筆數

      staticDatas.value.data1 = arr.filter(
        (s) => s.InstitutionNo != accountInstitutionNo
      ).length;

      staticDatas.value.data2 = arr.filter(
        (s) =>
          s.InstitutionNo != accountInstitutionNo &&
          `${s.MeetingInstitutionMembers}`.includes(accountName) &&
          s.CanRecording
      ).length;

      staticDatas.value.data3 = arr.filter(
        (s) => s.InstitutionNo == accountInstitutionNo
      ).length;

      staticDatas.value.data4 = arr.filter(
        (s) =>
          s.InstitutionNo == accountInstitutionNo &&
          `${s.MeetingInstitutionMembers}`.includes(accountName)
      ).length;

      staticDatas.value.data5 = "";
    };

    const getRecordDatas2 = async () => {
      const res = await getNotify();
      let allData = res.data;

      staticDatas.value.data1 = allData?.UnRecordCount;
      staticDatas.value.data2 = allData?.MyUnRecordCount;
      staticDatas.value.data3 = allData?.UnCloseCount;
      staticDatas.value.data4 = allData?.MyUnCloseCount;
      staticDatas.value.data5 = allData?.UnUploadConsentFormCount;

      staticDatas.value.data6 = allData?.MeetingUnCloseCount;
      staticDatas.value.data7 = allData?.MeetingMyUnCloseCount;
    };

    const setData = async () => {
      await setGroup();
      await getRecordDatas2();
    };

    const goRecordList = (key) => {
      //1:會診端 2:諮詢端
      const accountInstitutionNo = store.state?.others
        ? store.state?.others.InstitutionNo
        : "";
      const obj1 = {
        selectedDate: "",
        selectedPatientName: "",
        selectedUnit: key == 2 ? accountInstitutionNo : "",
        selectedIdNumber: "",
        selectedDoctor: "",
        selectedStatus: [10, 20],
      };

      //pagation data
      const obj2 = {
        offset: 0,
        rows: 5,
        orderByArr: ["ApplyTime desc,Id desc"],
        headers: [
          { name: "操作", key: "", sortDesc: null },
          { name: "附件", key: "", sortDesc: null },
          { name: "會診單下載", key: "", sortDesc: null },
          { name: "視訊紀錄", key: "", sortDesc: null },
          { name: "歷程紀錄", key: "", sortDesc: null },
          { name: "會診狀態", key: "Status", sortDesc: null },
          { name: "子狀態", key: "", sortDesc: null },
          { name: "執行空轉", key: "", sortDesc: null },
          { name: "姓名", key: "", sortDesc: null },
          { name: "身分證字號", key: "", sortDesc: null },
          { name: "會診申請單位", key: "InstitutionNo", sortDesc: null },
          { name: "會診申請醫師", key: "CreateAccountNo", sortDesc: null },
          { name: "會診申請時間", key: "ApplyTime", sortDesc: null },
        ],
      };

      sessionStorage.setItem("filterData", JSON.stringify(obj1));
      sessionStorage.setItem("paginationData", JSON.stringify(obj2));

      showMessageModal.value = false;

      // console.log("route", route.name);

      if (key == 1) {
        sessionStorage.setItem("querymode", "showUneditConsultationSide");
        if (route.name == "recordingMaintain") {
          // window.onbeforeunload = null;
          history.go(0);
        } else {
          router.push({
            name: "recordingMaintain",
          });
        }
      } else if (key == 2) {
        sessionStorage.setItem("querymode", "showUneditConsultingSide");

        if (route.name == "recordingMaintain") {
          // window.onbeforeunload = null;
          history.go(0);
        } else {
          router.push({
            name: "recordingMaintain",
          });
        }
      }
    };
    // emit("update:modelValue", _newValues);
    return {
      showMessageModal,
      belongArr,
      setData,
      goRecordList,
      staticDatas,
      allRecords,
    };
  },
});
</script>

<style lang="scss" scoped>
.consultationSide {
  position: relative;
  .edit-block {
    position: absolute;
    left: 323px;
    top: -7px;
  }
}
.consultingSide {
  position: relative;
  .edit-block {
    position: absolute;
    left: 323px;
    top: -10px;
  }
}
</style>
