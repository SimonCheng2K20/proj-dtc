<template>
  <Dialog
    class="custom-modal custom-scroll-bar"
    v-model:visible="modalShowGroupDatas"
    style="width: 77vw"
    :modal="true"
    :draggable="false"
    @show="getData"
  >
    <template #header>
      <h3>群組資訊</h3>
    </template>
    <div>
      <header class="dtc-grid my-dark main-header-inside">
        <div
          v-for="(item, i) in headers"
          :key="`headers${i}`"
          class="header"
          :title="item.name"
        >
          {{ item.name }}
        </div>
      </header>

      <main
        class="dtc-grid main-content"
        v-for="(item, idx) in itemsForShow"
        :key="`content${idx}`"
        style="color: #39312e"
        :style="
          idx % 2 == 0
            ? 'background-color:#ffffff ;'
            : 'background-color: #e7f2f3;'
        "
      >
        <div class="content" :title="item.categoryType">
          <div class="flex justify-center">
            <InputSwitch
              :id="`authmana${idx}`"
              v-model="item.viewDetail"
              class="mr-1"
              @change="openDetail(item, idx)"
            />
            <label class="cursor-pointer" :for="`authmana${idx}`"
              >檢視詳情</label
            >
          </div>
        </div>

        <div class="content" :title="item.No">
          {{ item.No || '' }}
        </div>
        <div class="content" :title="item.Name">
          {{ item.Name || '' }}
        </div>
        <div class="content" :title="item.Tel">
          {{ item.Tel || '' }}
        </div>
        <div class="modal-grid-search-2 full-content" v-if="item.viewDetail">
          <header>
            <div></div>
            <div>醫生</div>
            <InputText
              type="text"
              v-model.trim="item.searchDoctorName"
              placeholder="搜尋醫生"
              style="height: 33px"
              @keydown.enter="searchDetail(item, idx)"
            />
            <div></div>
            <div>科別</div>
            <InputText
              type="text"
              v-model.trim="item.searchSections"
              placeholder="搜尋科別"
              style="height: 33px"
              @keydown.enter="searchDetail(item, idx)"
            />
          </header>
        </div>
        <div class="view-details2 full-content" v-if="item.viewDetail">
          <header>
            <div></div>
            <div>姓名</div>
            <div></div>
            <div></div>
            <div>科別</div>
            <div>電話</div>
          </header>
        </div>
        <div class="view-details full-content" v-if="item.viewDetail">
          <section
            v-for="(row, rowId) in item.detailRowsShow"
            :key="`$detailRowsShow${rowId}`"
          >
            <div></div>
            <div :title="row.Name">{{ row.Name }}</div>
            <div></div>
            <div></div>
            <div :title="row.DepartmentName">
              {{ row.DepartmentName }}
            </div>
            <div :title="row.Phone">
              {{ row.Phone }}
            </div>
          </section>
        </div>
      </main>

      <main
        v-if="!items.length"
        class="mt-2 text-center text-md font-semibold col-span-full"
        style="font-family: Microsoft JhengHei, Helvetica"
      >
        No Data
      </main>
      <footer
        class="grid grid-flow-col auto-cols-max justify-center"
        style="background: #fcfcfc"
      >
        <Paginator
          @page="pageChange"
          v-model:first="offset"
          v-model:rows="rows"
          :totalRecords="totalItemsCount"
          :rowsPerPageOptions="[5, 10, 50]"
        ></Paginator>
        <div class="mt-4">共{{ totalItemsCount }}筆</div>
      </footer>
    </div>

    <template #footer>
      <Button class="p-button-success" @click.stop="modalShowGroupDatas = flase"
        >關閉</Button
      >
    </template>
  </Dialog>
</template>

<script>
import { computed, ref, reactive } from 'vue';
import { getAccountListAll } from 'Service/apis.js';
import { useToast } from 'vue-toastification';
import tablecomponet from '@/components/tablecomponent/table.vue';
import { useStore } from 'vuex';
export default {
  components: { tablecomponet },
  props: {},
  setup(props, { emit }) {
    const offset = ref(0);
    const rows = ref(10);
    const store = useStore();

    const modalShowGroupDatas = ref(false);

    const item = ref({ ...props.modalItemHistory });
    const totalItemsCount = ref(1);
    const orderByArr = ref([]);

    const toast = useToast();

    //for list
    const headers = ref([
      { name: '機構詳情', key: '' },
      // { name: "類別", key: "categoryType" },
      { name: '機構代碼', key: 'No' },
      { name: '機構名稱', key: 'Name' },
      { name: '機構電話', key: 'Tel' },
    ]);

    const items = ref([]);
    const itemsForShow = ref([]);

    //sort
    const getData = async () => {
      // console.log("SHOW");
      const allPartnerHospitalsData =
        store.state?.dakar && store.state?.dakar.PartnerHospitals
          ? store.state?.dakar.PartnerHospitals.map((s) => {
              s.categoryType = '合作醫院';
              return s;
            })
          : [];

      const responsibilityHospitalsData =
        store.state?.dakar && store.state?.dakar.ResponsibilityHospitals
          ? store.state?.dakar.ResponsibilityHospitals.map((s) => {
              s.categoryType = '重度急救責任醫院';
              return s;
            })
          : [];
      let allArr = [...allPartnerHospitalsData, ...responsibilityHospitalsData];
      allArr = allArr.map((s) => {
        s.viewDetail = false;
        s.detailRows = [];
        s.detailRowsShow = [];
        s.searchDoctorName = '';
        s.searchDetailSection = '';
        s.searchDetailTel = '';
        return s;
      });
      items.value = [...allArr];
      pageChange();
    };
    const pageChange = () => {
      const page = +offset.value / +rows.value + +1;
      const skip = (page - 1) * rows.value;
      const top = rows.value;
      itemsForShow.value = items.value.slice(+skip, +skip + +top);
      // console.log("items", items.value);
    };

    const openDetail = async (item, key) => {
      if (!item.viewDetail) return;
      const res = await getAccountListAll(
        `?$filter=InstitutionNo eq '${item.No}'`
      );

      let { Items, Count } = res.data;

      const arr = Items.map((s) => {
        return s;
      });

      items.value[key].detailRows = JSON.parse(JSON.stringify(arr));
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr));
      items.value[key].searchDoctorName = '';
      items.value[key].searchSections = '';
    };

    const searchDetail = async (item, key) => {
      // console.log("searchDetail");
      let arr = [];
      let allData = JSON.parse(JSON.stringify(item.detailRows));
      if (Boolean(item.searchSections)) {
        arr = allData.filter((s) =>
          `${s.DepartmentName}`.includes(item.searchSections)
        );
      }
      if (Boolean(item.searchDoctorName)) {
        arr = allData.filter((s) =>
          `${s.Name}`.includes(item.searchDoctorName)
        );
      }

      if (!Boolean(item.searchSections) && !Boolean(item.searchDoctorName)) {
        arr = JSON.parse(JSON.stringify(item.detailRows));
      }
      items.value[key].detailRowsShow = JSON.parse(JSON.stringify(arr));
    };

    return {
      item,

      getData, //for list data variable
      headers,
      items,
      itemsForShow,
      toast,

      //paginator
      pageChange,

      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      modalShowGroupDatas,
      openDetail,
      searchDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.view-details {
  grid-column: 1 / -1;
  display: grid;
  background: #e6e6e6;
  color: white;

  font-size: 16px;
  margin: 8px;
  border-radius: 0px;
  text-align: left;
  margin-top: 0px;
  padding: 4px !important;
  height: fit-content !important;

  section {
    all: unset;
  }

  section {
    display: grid;
    grid-template-columns: 86px 318px 1px 1px 180px 1fr;
    background: #4e5357;
    border: none;
    border-bottom: 1px solid white;
    background: #e6e6e6;
    // cursor: pointer;
    padding-left: 23px;
  }
}

.view-details2 {
  grid-column: 1 / -1;
  display: grid;
  background: #e6e6e6;
  color: white;

  font-size: 16px;
  margin: 8px;
  margin-bottom: 0;
  border-radius: 0px;
  text-align: left;
  margin-top: 2px;
  padding: 4px !important;
  padding-bottom: 2px !important;
  height: fit-content !important;

  header {
    all: unset;
  }

  header {
    display: grid;
    grid-template-columns: 86px 318px 1px 1px 180px 1fr;

    border: none;
    border-bottom: 1px solid white;
    background: #1d338a;
    color: #fff;
    // cursor: pointer;
    padding-left: 23px;
  }
}

.modal-grid-search-2 {
  grid-column: 1/-1;
  background: #b5b7be;
  color: white;
  font-size: 16px;
  margin: 8px;
  margin-bottom: 0;
  border-radius: 0px;
  text-align: left;
  line-height: 30px;
  overflow: hidden;

  header {
    display: grid;
    border: 1px solid white;
    border-top: none;
    border-bottom: none;
    grid-template-columns: 90px 91px 210px 18px 90px 185px;
    background: #747474;
    padding-left: 23px;
    color: #fcfdff;
  }
}
</style>
