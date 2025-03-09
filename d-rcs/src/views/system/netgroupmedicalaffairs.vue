<template>
  <section class="dtc-main-section px-3">
    <section class="search-block">
      <h5 class="big-title">{{ metaName }}</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">網絡</span>
          <InputText
            type="text"
            v-model.trim="selectedName"
            @keydown.enter="getData"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">急診醫療站</span>
          <Dropdown
            v-model="selectedHostipatal"
            :options="hostipatals"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedHostipatal) ? true : false"
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
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none"
          type="button"
          style="background: #fabf3e"
          @click="showEditModal(1)"
        >
          +新增網絡
        </button>
      </div>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">合作醫院</span>
          <Dropdown
            v-model="selectedPartnerHospital"
            :options="hostipatals"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedPartnerHospital) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">責任醫院</span>
          <Dropdown
            v-model="selectedResponsibilityHospital"
            :options="hostipatals"
            placeholder="全部"
            style="padding-top: 5px"
            optionLabel="Name"
            optionValue="No"
            :filter="true"
            @change="getData"
            :showClear="Boolean(selectedResponsibilityHospital) ? true : false"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">啟用狀態</span>
          <div
            v-for="item of activates"
            :key="item.text"
            class="p-field-radiobutton mr-3 mt-3"
          >
            <RadioButton
              :id="item.text"
              name="item"
              :value="item.value"
              v-model="selectedActivate"
              @change="getData"
            />
            <label :for="item.text">{{ item.text }}</label>
          </div>
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
      :style="
        idx % 2 == 0
          ? 'background-color:#ffffff ;'
          : 'background-color: #e7f2f3;'
      "
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #2196f3"
          @click="showEditModal(2, item)"
        >
          編輯
        </button>

        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #ff5a92"
          @click="showEditModal(3, item)"
        >
          刪除
        </button>
      </div>
      <div class="content" style="padding-top: 0px">
        <Checkbox
          :binary="true"
          v-model="item.IsActivated"
          @change="changeActivate(item)"
        />
      </div>
      <div class="content" :title="item.Name">
        {{ item.Name || "" }}
      </div>
      <div class="content" :title="item.StationsName">
        {{ item.StationsName || "" }}
      </div>
      <div class="content" :title="item.ResponsibilityHospitalsName">
        {{ item.ResponsibilityHospitalsName || "" }}
      </div>
      <div class="content" :title="item.PartnerHospitalsName">
        {{ item.PartnerHospitalsName || "" }}
      </div>
      <div class="content" :title="item.ManageInstitutions">
        {{ item.ManageInstitutions || "" }}
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

    <!-- //EditModal -->
    <Dialog
      class="custom-modal"
      v-model:visible="editModal"
      style="width: 1200px"
      :modal="true"
      :draggable="false"
    >
      <template #header>
        <h3>
          {{ nowType == 1 ? "新增" : nowType == 2 ? "編輯" : "刪除" }}網絡
        </h3>
      </template>
      <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">
        是否確定要刪除此網絡
      </h2>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon red-star">網絡</span>
        <InputText
          type="text"
          v-model.trim="modalItem.Name"
          maxlength="9"
          placeholder="最多9碼"
          :disabled="nowType == 3"
        />
      </div>
      <div class="p-inputgroup mt-2">
        <span class="p-inputgroup-addon">急診醫療站</span>
        <MultiSelect
          v-model="modalItem.StationsNos"
          :options="hostipatalsRedudent"
          placeholder="選擇醫院"
          style="padding-top: 5px"
          optionLabel="Name"
          optionValue="No"
          :filter="true"
          :disabled="nowType == 3"
        />
      </div>
      <div class="p-inputgroup mt-2">
        <span class="p-inputgroup-addon">重度急救責任醫院</span>
        <MultiSelect
          v-model="modalItem.ResponsibilityHospitalsNos"
          :options="hostipatals.slice(1)"
          placeholder="選擇醫院"
          style="padding-top: 5px"
          optionLabel="Name"
          optionValue="No"
          :filter="true"
          :disabled="nowType == 3"
        />
      </div>

      <div class="p-inputgroup mt-2">
        <span class="p-inputgroup-addon">合作醫院</span>
        <MultiSelect
          v-model="modalItem.PartnerHospitalsNos"
          :options="hostipatals.slice(1)"
          placeholder="選擇醫院"
          style="padding-top: 5px"
          optionLabel="Name"
          optionValue="No"
          :filter="true"
          :disabled="nowType == 3"
        />
      </div>

      <div class="p-inputgroup mt-2">
        <span class="p-inputgroup-addon special-addon">是否啟用</span>
        <Checkbox
          :binary="true"
          v-model="modalItem.IsActivated"
          style="margin-left: 8px !important; margin-top: 8px !important"
          :disabled="nowType == 3"
        />
      </div>
      <div
        class="p-inputgroup mt-2"
        style="align-items: center"
        v-if="nowType != 1"
      >
        <span class="p-inputgroup-addon special-addon" style="width: 145px"
          >此網絡群管理單位</span
        >
        <div class="ml-2">{{ modalItem.ManageInstitutions }}</div>
      </div>
      <template #footer>
        <Button label="確定" @click="saveEditModal" />
        <Button
          label="取消"
          class="p-button-success"
          @click="editModal = false"
        />
      </template>
    </Dialog>
  </section>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";
import {
  getInstitutionNos,
  getNetGroup,
  putNetGroup,
  postNetGroup,
  deleteNetGroup,
  getSingleNetGroup,
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
} from "Service/searchFunction.js";

export default defineComponent({
  name: "netgroup",
  components: {},
  props: {
    metaName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },
      { name: "啟用", key: "IsActivated", sortDesc: null },
      { name: "網絡", key: "Name", sortDesc: null },

      { name: "急診醫療站", key: "", sortDesc: null },
      {
        name: "重度急救責任醫院",
        key: "",
        sortDesc: null,
      },
      { name: "合作醫院", key: "", sortDesc: null },
      { name: "此網絡群的管理單位", key: "", sortDesc: null },
    ]);

    const items = ref([
      // {
      //   IsActivated: true,
      //   Name: "",
      //   PartnerHospitals: "",
      //   ResponsibilityHospitals: "",
      //   No: "",
      // },
    ]);

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

        if (
          !(
            orderByArr.value.includes("Name") ||
            orderByArr.value.includes("Name desc")
          )
        ) {
          orderBy.push("Name desc");
        }

        const obj = { top, skip, orderBy };
        let qs = buildQuery(obj);
        let bQs = false;

        if (selectedName.value) {
          qs = substringofFilter("Name", qs, selectedName.value);
          bQs = true;
        }

        if (selectedHostipatal.value) {
          if (bQs) {
            qs = appendArrFilter(
              "Stations",
              "No",
              qs,
              selectedHostipatal.value
            );
          } else {
            qs = arrFilter("Stations", "No", qs, selectedHostipatal.value);
          }
          bQs = true;
        }

        if (selectedPartnerHospital.value) {
          if (bQs) {
            qs = appendArrFilter(
              "PartnerHospitals",
              "No",
              qs,
              selectedPartnerHospital.value
            );
          } else {
            qs = arrFilter(
              "PartnerHospitals",
              "No",
              qs,
              selectedPartnerHospital.value
            );
          }
          bQs = true;
        }

        if (selectedResponsibilityHospital.value) {
          if (bQs) {
            qs = appendArrFilter(
              "ResponsibilityHospitals",
              "No",
              qs,
              selectedResponsibilityHospital.value
            );
          } else {
            qs = arrFilter(
              "ResponsibilityHospitals",
              "No",
              qs,
              selectedResponsibilityHospital.value
            );
          }
          bQs = true;
        }

        if (typeof selectedActivate.value === "boolean") {
          if (bQs) {
            qs = appendEqualNumFilter(
              "IsActivated",
              qs,
              selectedActivate.value
            );
          } else {
            qs = equalNumFilter("IsActivated", qs, selectedActivate.value);
          }
          bQs = true;
        }

        if (bQs) {
          qs = appendEqualNumFilter("Type", qs, 1);
        } else {
          qs = equalNumFilter("Type", qs, 1);
        }

        //top:筆數、skip:跳過幾筆
        const res = await getNetGroup(`${qs}`);
        // const res = await getNetGroup("");

        let { Items, Count } = res.data;
        Items = Items.map((s) => {
          s.StationsName = s.Stations.map((k) => `${k.Name}`).join("、");

          s.StationsNos = s.Stations.map((k) => `${k.No}`);

          s.ResponsibilityHospitalsName = s.ResponsibilityHospitals.map(
            (k) => `${k.Name}`
          ).join("、");

          s.ResponsibilityHospitalsNos = s.ResponsibilityHospitals.map(
            (k) => `${k.No}`
          );

          s.PartnerHospitalsName = s.PartnerHospitals.map(
            (k) => `${k.Name}`
          ).join("、");

          s.PartnerHospitalsNos = s.PartnerHospitals.map((k) => `${k.No}`);

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
    const selectedName = ref("");
    const selectedHostipatal = ref("");
    const selectedPartnerHospital = ref("");
    const selectedResponsibilityHospital = ref("");
    const selectedActivate = ref("");

    const hostipatals = ref([{ Name: "醫院1", No: "1" }]);
    const hostipatalsRedudent = ref([{ Name: "醫院1", No: "1" }]);

    const activates = ref([
      { value: true, text: "啟用" },
      { value: false, text: "已停用" },
    ]);

    async function getHostipatals() {
      try {
        const { data } = await getInstitutionNos("");

        hostipatals.value = [...data];
        hostipatals.value.unshift({ No: null, Name: "全部" });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    function clearSearch() {
      selectedName.value = "";
      selectedHostipatal.value = "";
      selectedPartnerHospital.value = "";
      selectedResponsibilityHospital.value = "";
      selectedActivate.value = "";
      getData();
    }

    onMounted(async () => {
      await getHostipatals();
      await getData();
    });

    watch(offset, (v, pv) => {
      getData();
    });

    watch(rows, (v, pv) => {
      getData();
    });

    //-----------editModal----------------
    const editModal = ref(false);
    const nowType = ref(1);
    const modalItem = ref({
      Stations: [],
      PartnerHospitals: [
        {
          No: "",
          Name: "",
          IsActivated: true,
        },
      ],
      ResponsibilityHospitals: [
        {
          No: "",
          Name: "",
          IsActivated: true,
        },
      ],
      No: "",
      Name: "",
      IsActivated: true,
    });

    async function changeActivate(item) {
      const obj = {
        Id: item.Id,
        Name: item.Name,
        Type: item.Type,
        StationNos: item.StationsNos,
        PartnerHospitalNos: item.PartnerHospitalsNos,
        ResponsibilityHospitalNos: item.ResponsibilityHospitalsNos,
        IsActivated: item.IsActivated,
      };
      try {
        await putNetGroup(obj);
        toast.success("狀態調整成功", {
          timeout: 2000,
          hideProgressBar: true,
        });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
    }

    async function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除

      const res =
        type == 1
          ? await getSingleNetGroup(0)
          : await getSingleNetGroup(item.Id);

      hostipatalsRedudent.value = [
        ...res.data.StationList,
        ...res.data.Stations,
      ];

      if (type == 2 || type == 3) {
        modalItem.value = { ...item };
      } else {
        modalItem.value = {
          Name: "",
          Stations: [],
          StationsNos: [],
          PartnerHospitals: [],
          ResponsibilityHospitals: [],
          PartnerHospitalsNos: [],
          ResponsibilityHospitalsNos: [],
          IsActivated: true,
          ManageInstitutions: "",
          Type: 1,
        };
      }
      nowType.value = type;
      editModal.value = true;
    }

    async function saveEditModal() {
      if (!Boolean(modalItem.value.Name)) {
        toast.error(`網絡為必填欄位`, {
          timeout: 5000,
          hideProgressBar: true,
        });
        return;
      }

      const objPost = {
        Name: modalItem.value.Name,
        StationNos: modalItem.value.StationsNos,
        PartnerHospitalNos: modalItem.value.PartnerHospitalsNos,
        ResponsibilityHospitalNos: modalItem.value.ResponsibilityHospitalsNos,
        IsActivated: modalItem.value.IsActivated,
        Type: 1,
      };

      const objPut = {
        Id: modalItem.value.Id,
        Name: modalItem.value.Name,
        StationNos: modalItem.value.StationsNos,
        PartnerHospitalNos: modalItem.value.PartnerHospitalsNos,
        ResponsibilityHospitalNos: modalItem.value.ResponsibilityHospitalsNos,
        IsActivated: modalItem.value.IsActivated,
        Type: modalItem.value.Type,
      };

      try {
        if (nowType.value == 1) {
          const res1 = await postNetGroup(objPost);
        }
        if (nowType.value == 2) {
          const res2 = await putNetGroup(objPut);
        }
        if (nowType.value == 3) {
          const res3 = await deleteNetGroup(modalItem.value.Id);
        }

        toast.success(
          `${
            nowType.value == 1 ? "新增" : nowType.value == 2 ? "編輯" : "刪除"
          }成功`,
          {
            timeout: 2000,
            hideProgressBar: true,
          }
        );
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        });
      }
      getData();
      if (nowType.value == 1 || nowType.value == 3) {
        getHostipatals();
      }
      editModal.value = false;
    }

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
      selectedName,
      selectedHostipatal,
      selectedPartnerHospital,
      selectedResponsibilityHospital,
      selectedActivate,

      hostipatals,
      hostipatalsRedudent,
      activates,

      getHostipatals,

      //   hostipatalsRedudent,

      clearSearch,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      showEditModal,
      saveEditModal,

      changeActivate,
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
    grid-template-columns: repeat(2, 400px) repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  min-width: 145px;
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
  grid-template-columns: 168px 97px 180px 1fr 1fr 1fr 200px;
  grid-auto-flow: column;
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
</style>
