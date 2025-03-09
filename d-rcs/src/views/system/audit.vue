<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">{{ metaName }}</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">使用者帳號</span>
          <InputText type="text" v-model.trim="selectedNo" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">帳號姓名</span>
          <InputText type="text" v-model.trim="selectedName" @keydown.enter="getData" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">建立時間</span>
          <Calendar
            v-model="selectedStartDate"
            :showIcon="true"
            dateFormat="yy/mm/dd"
            :manualInput="true"
            v-date-input
          /><span class="mt-2">~</span>
          <Calendar
            v-model="selectedEndDate"
            :showIcon="true"
            dateFormat="yy/mm/dd"
            :manualInput="true"
            v-date-input
          />
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
      </div>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">記錄類型</span>
          <Dropdown
            v-model="selectedType"
            :options="auditOptions"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="Id"
            @change="getData"
            :showClear="Boolean(selectedType) ? true : false"
            :filter="true"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">用戶端IP</span>
          <InputText
            type="text"
            v-model.trim="selectedHostAddress"
            @keydown.enter="getData"
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
        class="content viewmore"
        style="display: flex; align-items: center; justify-content: center"
        :title="item.Data"
      >
        <InputSwitch :id="`authmana${idx}`" v-model="item.viewDetail" class="mr-1" />
        <label :for="`authmana${idx}`" class="cursor-pointer ml-1">檢視 </label>
      </div>
      <div class="content" :title="item.CreateTime">
        {{ item.creattime || "" }}
      </div>

      <div class="content" :title="item.AccountNo">
        {{ item.AccountNo || "" }}
      </div>
      <div class="content" :title="item.AccountName">
        {{ item.AccountName || "" }}
      </div>
      <div class="content" :title="item.Type">
        {{ item.TypeName || "" }}
      </div>

      <div class="content" :title="item.DataType">
        {{ item.DataType || "" }}
      </div>
      <div class="content" :title="item.HostAddress">
        {{ item.HostAddress || "" }}
      </div>
      <div class="content" :title="item.ProcessStack">
        {{ item.ProcessStack || "" }}
      </div>

      <div class="view-details full-content custom-scroll-bar" v-if="item.viewDetail">
        <!-- <json-viewer :value="item.Data"></json-viewer> -->
        <json-viewer
          :value="item.objectData"
          style="background: rgb(114 113 113 / 14%); font-size: 16px"
        ></json-viewer>
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
import { getAuditList, getAuditType } from "Service/apis.js";
import buildQuery, { json } from "odata-query";
import dayjs from "dayjs";

import {
  arrFilter,
  appendArrFilter,
  substringofFilter,
  appendSubstringofFilter,
  equalFilter,
  appendEqualFilter,
  equalNumFilter,
  appendEqualNumFilter,
  timeFilterGe,
  appendTimeFilterGe,
  timeFilterLe,
  appendTimeFilterLe,
} from "Service/searchFunction.js";

export default defineComponent({
  name: "DefaultLayout",
  components: {},
  props: {
    metaName: {
      type: String,
      default: "",
    },
  },
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "資料內容", key: "", sortDesc: null },
      { name: "建立時間", key: "CreateTime", sortDesc: null },
      { name: "使用者帳號", key: "AccountNo", sortDesc: null },
      { name: "帳號姓名", key: "AccountName", sortDesc: null },
      { name: "記錄類型", key: "Type", sortDesc: null },

      { name: "資料類別", key: "DataType", sortDesc: null },
      { name: "用戶端IP", key: "HostAddress", sortDesc: null },
      { name: "執行動作", key: "ProcessStack", sortDesc: null },
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
        let orderBy = orderByArr.value;

        if (!(orderBy.includes("CreateTime") || orderBy.includes("CreateTime desc"))) {
          orderBy.unshift("CreateTime desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedNo.value) {
          bQs = true;
          qs = substringofFilter("AccountNo", qs, selectedNo.value);
        }

        if (selectedName.value) {
          if (bQs) {
            qs = appendSubstringofFilter(
              "AccountName",
              qs,
              selectedName.value.toLowerCase()
            );
          } else {
            qs = substringofFilter("AccountName", qs, selectedName.value);
          }
          bQs = true;
        }

        if (selectedType.value) {
          if (bQs) {
            qs = appendEqualNumFilter("Type", qs, selectedType.value);
          } else {
            qs = equalNumFilter("Type", qs, selectedType.value);
          }
          bQs = true;
        }

        if (selectedHostAddress.value) {
          if (bQs) {
            qs = appendSubstringofFilter(
              "HostAddress",
              qs,
              selectedHostAddress.value.toLowerCase()
            );
          } else {
            qs = substringofFilter("HostAddress", qs, selectedHostAddress.value);
          }
          bQs = true;
        }

        if (Boolean(selectedStartDate.value)) {
          let time = dayjs(selectedStartDate.value).format("YYYY-MM-DD");
          if (bQs) {
            qs = appendTimeFilterGe("CreateTime", qs, time);
          } else {
            qs = timeFilterGe("CreateTime", qs, time);
          }
          bQs = true;
        }

        if (Boolean(selectedEndDate.value)) {
          let time = dayjs(selectedEndDate.value).format("YYYY-MM-DD");
          if (bQs) {
            qs = appendTimeFilterLe("CreateTime", qs, time);
          } else {
            qs = timeFilterLe("CreateTime", qs, time);
          }
          bQs = true;
        }

        //top:筆數、skip:跳過幾筆
        const res = await getAuditList(`${qs}`);

        let { Items, Count } = res.data;
        Items = Items.map((s) => {
          s.TypeName = auditOptions.value.find((k) => k.Id == s.Type)
            ? auditOptions.value.find((k) => k.Id == s.Type).Name
            : "";
          s.creattime = s.CreateTime
            ? `${s.CreateTime.split("T")[0]} ${s.CreateTime.split("T")[1]}`
            : "";
          s.jsonData = { ...s.Data };
          s.objectData = JSON.parse(s.Data);
          s.viewDetail = false;
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
    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);

    const selectedType = ref(null);
    const selectedHostAddress = ref(null);

    const auditOptions = ref([{ Name: "", No: "" }]);

    async function getAuditTypeOpt() {
      try {
        const { data } = await getAuditType("");

        auditOptions.value = [...data];
        auditOptions.value.unshift({ Id: null, Name: "全部" });
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
      selectedStartDate.value = null;
      selectedEndDate.value = null;
      selectedType.value = null;
      selectedHostAddress.value = "";
      getData();
    }

    onMounted(async () => {
      await getAuditTypeOpt();
      await getData();
    });

    watch(offset, (v, pv) => {
      getData();
    });

    watch(rows, (v, pv) => {
      getData();
    });

    return {
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedNo,
      selectedName,
      selectedStartDate,
      selectedEndDate,
      selectedType,
      selectedHostAddress,

      auditOptions,

      clearSearch,

      //optFunc
      getAuditTypeOpt,
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
    grid-template-columns: repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 97px;
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
  grid-template-columns: 136px 200px 1fr 1fr 148px 230px 136px 136px;
  // grid-auto-flow: column;
  text-align: center;
  // border-right: 0px;

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

.view-details {
  grid-column: 1 / -1;
  display: grid;
  background: #e6e6e6;
  color: white;

  font-size: 16px;
  margin: 8px;
  border-radius: 0px;
  text-align: left;
  margin-top: 2px;
  padding: 4px !important;
  height: fit-content !important;

  label {
    all: unset;
  }

  label {
    display: grid;
    grid-template-columns: 90px 311px 1fr;
    background: #4e5357;
    border: none;
    border-bottom: 1px solid white;
    background: #e6e6e6;
    cursor: pointer;
    padding-left: 23px;
  }
}

// .my-awesome-json-theme {
//   background: #7f7f7ffa;
//   white-space: nowrap;
//   // color: #ececec;
//   font-size: 16px;
//   font-family: Consolas, Menlo, Courier, monospace;

//   .jv-ellipsis {
//     color: #999;
//     background-color: #eee;
//     display: inline-block;
//     line-height: 0.9;
//     font-size: 0.9em;
//     padding: 0px 4px 2px 4px;
//     border-radius: 3px;
//     vertical-align: 2px;
//     cursor: pointer;
//     user-select: none;
//   }
//   .jv-button {
//     color: #49b3ff;
//   }
//   .jv-key {
//     color: #db2525;
//   }
//   .jv-item {
//     &.jv-array {
//       color: #111111;
//     }
//     &.jv-boolean {
//       color: #fc1e70;
//     }
//     &.jv-function {
//       color: #067bca;
//     }
//     &.jv-number {
//       color: #fc1e70;
//     }
//     &.jv-number-float {
//       color: #fc1e70;
//     }
//     &.jv-number-integer {
//       color: #fc1e70;
//     }
//     &.jv-object {
//       color: #111111;
//     }
//     &.jv-undefined {
//       color: #e08331;
//     }
//     &.jv-string {
//       color: #42b983;
//       word-break: break-word;
//       white-space: normal;
//     }
//   }
//   .jv-code {
//     .jv-toggle {
//       &:before {
//         padding: 0px 2px;
//         border-radius: 2px;
//       }
//       &:hover {
//         &:before {
//           background: #eee;
//         }
//       }
//     }
//   }
// }
::v-deep(.jv-container.jv-light) {
  background: #e6e6e6 !important;
}
::v-deep(.jv-code) {
  padding-top: 11px !important;
  padding-bottom: 11px !important;
}
</style>
