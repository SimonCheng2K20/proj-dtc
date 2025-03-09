<template>
  <section class="dtc-main-section px-3">
    <!-- audit -->
    <applyaccountaudit ref="applyaccountauditRef" @update="getData"></applyaccountaudit>
    <applyaccountschedule ref="applyaccountscheduleRef"></applyaccountschedule>
    <section class="search-block">
      <h5 class="big-title">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button
            class="flex items-center h-10 px-2 py-2 -mb-px text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:px-4 -px-1 dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
            @click.prevent="$router.push({ name: 'accountMaintain' })"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mx-1 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>

            <span class="mx-1 text-sm sm:text-base">帳號維護管理</span>
          </button>

          <button
            class="flex items-center h-10 px-2 py-2 -mb-px text-center text-indigo-600 bg-transparent border-b-2 border-indigo-500 sm:px-4 -px-1 dark:border-indigo-400 dark:text-indigo-300 whitespace-nowrap focus:outline-none"
            @click.prevent="$router.push({ name: 'accountauditMaintain' })"
            v-if="hasAuditfunction"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 13.0002C4 11.1146 4 10.1718 4.58579 9.58603C5.17157 9.00024 6.11438 9.00024 8 9.00024H16C17.8856 9.00024 18.8284 9.00024 19.4142 9.58603C20 10.1718 20 11.1146 20 13.0002V15.0002C20 17.8287 20 19.2429 19.1213 20.1216C18.2426 21.0002 16.8284 21.0002 14 21.0002H10C7.17157 21.0002 5.75736 21.0002 4.87868 20.1216C4 19.2429 4 17.8287 4 15.0002V13.0002Z"
                stroke="#6368EE"
              />
              <path
                d="M16.4999 9.00006L16.5775 8.37947C16.8364 6.30788 15.9043 4.2675 14.1688 3.10709V3.10709C12.1023 1.72543 9.36726 1.89573 7.48819 3.52305L6.66986 4.23174"
                stroke="#6368EE"
                stroke-linecap="round"
              />
              <circle cx="12" cy="15" r="2" fill="#6368EE" />
            </svg>

            <span class="mx-1 text-sm sm:text-base"> 帳號審核 </span>
          </button>
        </div>
      </h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup mr-5">
          <span class="p-inputgroup-addon">帳號狀態</span>
          <Dropdown
            v-model="selectedStatus"
            :options="statusOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="Id"
            @change="getData"
            :filter="true"
            :showClear="Boolean(selectedStatus) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">使用者帳號</span>
          <InputText type="text" v-model.trim="selectedNo" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">帳號姓名</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" />
        </div>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #0c69e1"
          @click="getData"
        >
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #6a9f3e"
          @click="clearSearch"
        >
          清除
        </button>
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #fabf3e"
          @click="showEditModal(1)"
          v-if="false"
        >
          +新增帳號
        </button>
      </div>
      <div class="p-2 search-section">
        <div class="p-inputgroup" v-show="isAdminAccount">
          <span class="p-inputgroup-addon">隸屬單位</span>
          <Dropdown
            v-model="selectedInstitutionNo"
            :options="institutionNoOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="FullName"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedInstitutionNo) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">職務</span>
          <Dropdown
            v-model="selectedJob"
            :options="jobOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedJob) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">計畫名稱</span>
          <!-- <InputText
            type="text"
            v-model.trim="selectedProject"
            @keydown.enter="getData"
          /> -->
          <Dropdown
            v-model="selectedProject"
            :options="projectOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedProject) ? true : false"
          />
        </div>
      </div>
    </section>

    <header class="dtc-grid my-dark">
      <div
        v-for="(item, i) in headers"
        :key="`headers${i}`"
        @click="sortData(item)"
        class="header"
      >
        {{ item.name }}
        <span v-show="item.sortDesc === null" v-if="item.key">
          <i class="pi pi-sort"></i>
        </span>
        <span v-show="item.sortDesc === false" v-if="item.key">
          <i class="pi pi-caret-up"></i>
        </span>
        <span v-show="item.sortDesc" v-if="item.key">
          <i class="pi pi-caret-down"></i>
        </span>
      </div>
    </header>
    <main
      class="dtc-grid"
      v-for="(item, idx) in items"
      :key="`content${idx}`"
      style="color: #39312e"
      :style="idx % 2 == 0 ? 'background-color:#ffffff ;' : 'background-color: #e7f2f3;'"
    >
      <div
        class="content"
        style="padding-top: 3px; display: flex !important; justify-content: center"
      >
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 text-sm"
          type="button"
          style="background: rgb(28 108 237); height: 36px"
          @click="showAudit(1, item)"
          title="審核流程檢視"
        >
          {{ item.Status == 3 ? "審核" : "檢視" }}
        </button>
        <div @click="showAudit(2, item)" title="申請帳號審核">
          <img style="width: 36px" class="cursor-pointer" src="/assets/history2.png" />
        </div>
      </div>
      <div class="content" :title="item.InstitutionNoName">
        {{ item.InstitutionNoName || "" }}
      </div>
      <div class="content" :title="item.No">
        {{ item.No || "" }}
      </div>
      <div class="content" :title="item.Name">
        {{ item.Name || "" }}
      </div>
      <div class="content" :title="item.Title">
        {{
          `${item.Title}`.includes("其他") ? `${item.Title}`.split("其他")[1] : item.Title
        }}
      </div>
      <div class="content" :title="item.StatusName">
        {{ item.StatusName || "" }}
      </div>
      <div class="content" :title="item.Phone">
        {{ item.Phone || "" }}
      </div>
      <div class="content" :title="item.Email">
        {{ item.Email || "" }}
      </div>
      <div class="content" :title="item.Identifier">
        {{ item.Identifier || "" }}
      </div>
      <div class="content" :title="item.DepartmentName">
        {{ item.DepartmentName || "" }}
      </div>
      <div class="content" :title="item.ReasonRoleName">
        {{ item.ReasonRoleName || "" }}
      </div>
    </main>
    <main
      v-if="!items.length"
      class="mt-2 text-center text-xl font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica"
    >
      No Data
    </main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator
        v-model:first="offset"
        v-model:rows="rows"
        :totalRecords="totalItemsCount"
        :rowsPerPageOptions="[5, 10, 50]"
      ></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>
  </section>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import {
  getAccountList,
  putAccountList,
  postAccountList,
  deleteAccountList,
  getInstitutionNos,
  getAccountStatusNos,
  resetPassword,
  getReasonRoleList,
  getRoleSelectNos,
} from "Service/apis.js";
import buildQuery from "odata-query";
import {
  arrFilter,
  appendArrFilter,
  substringofFilter,
  appendSubstringofFilter,
  equalFilter,
  appendEqualFilter,
  equalNumFilter,
  appendEqualNumFilter,
  getLocalISOString,
} from "Service/searchFunction.js";
import dayjs from "dayjs";

import applyaccountaudit from "@/components/layout/applyaccountaudit.vue";
import applyaccountschedule from "@/components/layout/applyaccountschedule.vue";
import { useStore } from "vuex";

// applyaccountschedule

export default defineComponent({
  name: "DefaultLayout",
  components: { applyaccountaudit, applyaccountschedule },
  props: {
    metaName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const store = useStore();
    const applyaccountauditRef = ref(null);
    const applyaccountscheduleRef = ref(null);
    const showAudit = (type, item) => {
      if (type == 1) {
        applyaccountauditRef.value.modalItem = { ...item };
        applyaccountauditRef.value.roleOptions = [...roleOptions.value];
        applyaccountauditRef.value.isShowApplyAccountAudit = true;
      } else {
        applyaccountscheduleRef.value.modalItem = { ...item };
        applyaccountscheduleRef.value.isShowApplyAccountAuditSchedule = true;
      }
    };

    //
    const isAdminAccount = computed(() => {
      const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : [];

      return userRoles.includes("Admins");
    });

    const hasAuditfunction = computed(() => {
      // console.log(' hasAuditfunction');
      const userHasAuditFunction = store.state?.dakar?.FunctionNos.find(
        (k) => k == "accountauditMaintain"
      )
        ? true
        : false;

      return userHasAuditFunction;
    });

    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "隸屬單位", key: "InstitutionNo", sortDesc: null },
      { name: "使用者帳號", key: "No", sortDesc: null },
      { name: "帳號姓名", key: "Name", sortDesc: null },
      { name: "職務", key: "", sortDesc: null },
      { name: "帳號狀態", key: "Status", sortDesc: null },
      { name: "連絡電話", key: "Phone", sortDesc: null },
      { name: "E-MAIL", key: "Email", sortDesc: null },
      { name: "身分證字號", key: "Identifier", sortDesc: null },
      { name: "科別", key: "DepartmentName", sortDesc: null },
      { name: "計畫名稱", key: "Expiration", sortDesc: null },
    ]);

    const items = ref([]);

    const offset = ref(0);
    const rows = ref(10);
    const totalItemsCount = ref(1);
    const orderByArr = ref([]);

    const toast = useToast();

    async function getData() {
      try {
        //odata3 qs
        const page = +offset.value / +rows.value + +1;
        const skip = (page - 1) * rows.value;
        const top = rows.value;
        const orderBy = orderByArr.value;

        if (!orderBy.length) {
          orderBy.push("CreateTime desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedStatus.value || selectedStatus.value == 0) {
          qs = equalNumFilter("Status", qs, selectedStatus.value);
          bQs = true;
        }

        if (selectedNo.value) {
          if (bQs) {
            qs = appendSubstringofFilter("No", qs, selectedNo.value.toLowerCase());
          } else {
            qs = substringofFilter("No", qs, selectedNo.value.toLowerCase());
          }
          bQs = true;
        }

        if (selectedName.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Name", qs, selectedName.value.toLowerCase());
          } else {
            qs = substringofFilter("Name", qs, selectedName.value.toLowerCase());
          }
          bQs = true;
        }

        if (selectedInstitutionNo.value) {
          if (bQs) {
            qs = appendEqualFilter("InstitutionNo", qs, selectedInstitutionNo.value);
          } else {
            qs = equalFilter("InstitutionNo", qs, selectedInstitutionNo.value);
          }
          bQs = true;
        }

        if (selectedJob.value) {
          if (bQs) {
            qs = appendSubstringofFilter("Title", qs, selectedJob.value.toLowerCase());
          } else {
            qs = substringofFilter("Title", qs, selectedJob.value.toLowerCase());
          }
          bQs = true;
        }

        if (selectedProject.value) {
          if (bQs) {
            qs = appendSubstringofFilter(
              "ReasonRoleNo",
              qs,
              selectedProject.value.toLowerCase().replace(/\'/g, "''")
            );
          } else {
            qs = substringofFilter(
              "ReasonRoleNo",
              qs,
              selectedProject.value.toLowerCase().replace(/\'/g, "''")
            );
          }
          bQs = true;
        }

        if (bQs) {
          qs = qs + ` and (Status eq 2 or Status eq 3)`;
        } else {
          qs = qs + `&$filter= (Status eq 2 or Status eq 3)`;
        }

        //top:筆數、skip:跳過幾筆
        const res = await getAccountList(`${qs}`);

        let { Items, Count } = res.data;
        Items = Items.map((s) => {
          s.StatusName = statusOptions.value.find((k) => +k.Id == s.Status)
            ? statusOptions.value.find((k) => +k.Id == s.Status).Name
            : "";

          s.InstitutionNoName = institutionNoOptions.value.find(
            (k) => k.No == s.InstitutionNo
          )
            ? institutionNoOptions.value.find((k) => k.No == s.InstitutionNo)?.Name
            : s.OtherInstitution;

          s.AuthName = !!s.Authorizer ? `${s.Authorizer}`.split("▲")[0] : "";
          s.AuthInstitutionName = !!s.Authorizer
            ? institutionNoOptions.value.find(
                (k) => k.No == `${s.Authorizer}`.split("▲")[1]
              )?.Name
            : "";
          return s;
        });

        Items = Items.map((s) => {
          return s;
        });

        items.value = [...Items];
        totalItemsCount.value = Count;
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    //sort
    function sortData(item) {
      if (!item.key) {
        return;
      }
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      orderByArr.value = [];

      headers.value.forEach((s) => {
        if (s.sortDesc !== null) {
          orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      getData();
    }

    //for search

    const selectedNo = ref("");
    const selectedName = ref("");
    const selectedStatus = ref(3);
    const selectedJob = ref(null);

    const selectedInstitutionNo = ref(null);
    const selectedProject = ref("");
    const institutionNoOptions = ref([]);

    const statusOptions = ref([
      { text: "待審核中", value: 1 },
      { text: "拒絕", value: 2 },
    ]);

    const jobOptions = ref([
      { text: "醫生", value: "醫生" },
      { text: "護理人員", value: "護理人員" },
      { text: "行政人員", value: "行政人員" },

      { text: "其他", value: "其他" },
    ]);

    const projectOptions = ref([]);

    const roleOptions = ref([]);

    async function getAllOptions() {
      try {
        let { data } = await getInstitutionNos("");
        data = data.map((s) => {
          s.FullName = `${s.Name}【${s.No}】`;
          return s;
        });
        institutionNoOptions.value = [...data];
        institutionNoOptions.value.unshift({
          No: null,
          Name: "全部",
          FullName: "全部",
        });

        let { data: data2 } = await getReasonRoleList("");
        data2 = data2.map((s) => {
          s.text = s.Name;
          s.value = s.No;
          return s;
        });
        projectOptions.value = [...data2];

        let { data: data3 } = await getAccountStatusNos();

        data3 = data3.filter(
          (s) =>
            `${s.Name}`.includes("已拒絕") ||
            `${s.Name}`.includes("待審核") ||
            `${s.Name}`.includes("待開通")
        );
        statusOptions.value = [...data3];
        statusOptions.value.unshift({ Id: null, Name: "全部" });

        let { data: data4 } = await getRoleSelectNos("");
        data2 = data2.map((s) => {
          s.FullName = `${s.Name}【${s.No}】`;
          return s;
        });

        roleOptions.value = [...data4];
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    function clearSearch() {
      selectedNo.value = "";
      selectedName.value = "";
      selectedStatus.value = 3;
      selectedJob.value = null;

      selectedInstitutionNo.value = null;
      selectedProject.value = "";
      getData();
    }

    onMounted(async () => {
      await getAllOptions();
      await getData();
    });

    watch(offset, (v, pv) => {
      getData();
    });

    watch(rows, (v, pv) => {
      getData();
    });

    return {
      applyaccountauditRef,
      applyaccountscheduleRef,
      showAudit,
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,
      getAllOptions,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search

      selectedNo,
      selectedName,
      selectedStatus,
      selectedJob,
      selectedInstitutionNo,
      selectedProject,

      institutionNoOptions,
      statusOptions,
      jobOptions,
      projectOptions,
      roleOptions,

      clearSearch,

      isAdminAccount,
      hasAuditfunction,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-block {
  .big-title {
    background: #e1e8f6;
    padding: 5px;
    color: #333;
    border-radius: 0.15rem 0.15rem 0 0;
    font-size: 20px;
    font-weight: bold;
  }

  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem 0.25rem 0 0;

  .search-section {
    display: grid;
    grid-template-columns: 276px repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 108px;
  background: #f1f9e7;
  color: #1f2d56;
  font-weight: bold;
  border: 0px !important;
}

.special-addon {
  border-right: 0.5px solid #dbdcdd;
}

.dtc-grid {
  display: grid;
  grid-template-columns: 162px 300px 1fr 238px repeat(6, 1fr) 300px;
  grid-auto-flow: column;
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
</style>
