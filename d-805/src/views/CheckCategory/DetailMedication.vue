<template>
  <div style="max-width:100%;">
    <div class="dtc-save mb-1">
      <div></div>
      <b-input placeholder="搜尋藥品代碼" v-model="s1" />
      <div class="mt-2">或是</div>
      <b-input placeholder="搜尋藥品名稱" v-model="s2" />
      <b-button variant="warning" @click="s1 = s2 = ''">
        <font-awesome-icon icon="undo" class="mr-1" />重置搜尋
      </b-button>
      <div class="dtc-msg-ok" v-html="updateOk"></div>
      <toggle-button
        v-model="showOnlyOkRow"
        class="mt-2"
        color="#dc3545"
        :font-size="14"
        :height="24"
        :width="120"
        :labels="{ checked: '只顯示已設定', unchecked: '只顯示已設定' }"
      />
    </div>
    <header class="dtc-med-grid" style="background:var(--secondary)" v-if="!loadingApi">
      <!-- <div>{{ `共${itemsList.length}筆`}}</div> -->
      <div @click="dtcSort('No')">
        {{ `藥品代碼(共${itemsList.length}筆)` }}
        <font-awesome-icon class="ml-2" icon="sort-up" v-if="sortBy == 'No' && sortAsc" />
        <font-awesome-icon class="ml-2" icon="sort-down" v-if="sortBy == 'No'  && !sortAsc" />
      </div>
      <div @click="dtcSort('Name')">
        藥品名稱
        <font-awesome-icon class="ml-2" icon="sort-up" v-if="sortBy == 'Name'  && sortAsc" />
        <font-awesome-icon class="ml-2" icon="sort-down" v-if="sortBy == 'Name'  && !sortAsc" />
      </div>
      <div>健保</div>
      <div>自費</div>
      <div class="text-left" style="margin-left:-22px;">計量不計價</div>
      <div>失誤</div>
      <div style="margin-left:-22px;">藥品沿用</div>
    </header>
    <section class="detail-sec">
      <div v-if="loadingApi" class="no-data">
        <div>
          資料處理中請稍後。
          <b-spinner type="grow" label="Spinning"></b-spinner>
          <b-spinner type="grow" label="Spinning"></b-spinner>
          <b-spinner type="grow" label="Spinning"></b-spinner>
        </div>
      </div>
      <label
        v-if="!loadingApi"
        class="dtc-med-grid"
        v-for="(item, i) in itemsList"
        :key="i"
        :for="item.No"
      >
        <div>{{ item.No }}</div>
        <div>{{ item.Name }}</div>
        <div>
          <b-check size="lg" type="checkbox" v-model="item.notSelfPay" @change="itemChange(item)" />
        </div>
        <div>
          <b-check size="lg" type="checkbox" v-model="item.selfPay" @change="itemChange(item)" />
        </div>
        <div>
          <b-check size="lg" type="checkbox" v-model="item.okPay" @change="itemChange(item)" />
        </div>
        <div>
          <b-check size="lg" type="checkbox" v-model="item.errorPay" @change="itemChange(item)" />
        </div>
        <div>
          <b-check size="lg" type="checkbox" v-model="item.samePay" @change="itemChange(item)" />
        </div>
      </label>
    </section>
  </div>
</template>

<script>
import { Sort, Toolbar, Page } from "@syncfusion/ej2-vue-grids";
import Common from "../../library/Common";
export default {
  data() {
    return {
      sortBy: "No",
      sortAsc: true,
      updateOk: "",
      sortedArr: [],
      loadingApi: false,
      s1: "",
      s2: "",
      data: {},
      selectMedications: [],
      // detailChanged: false,
      dsMedication: [],
      showOnlyOkRow: false,
      prevSaved: []
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar]
  },
  computed: {
    itemsList() {
      let arr = [];
      let arr2 = [];
      if (this.s1) {
        arr = this.dsMedication.filter(s => {
          return (
            ("" + s.No).toLowerCase().indexOf("" + this.s1.toLowerCase()) > -1
          );
        });
      }
      if (this.s2) {
        arr2 = this.dsMedication.filter(s => {
          return s.Name.toLowerCase().indexOf(this.s2.toLowerCase()) > -1;
          //return this.s2.startsWith("" + s.Name);
        });
      }
      arr = [...arr, ...arr2];
      if (!this.s1 && !this.s2) arr = this.dsMedication;
      if (this.showOnlyOkRow) {
        arr = arr.filter(s => s.PriceTypes.length);
      }
      return arr;
    }
  },
  methods: {
    actionComplete: function() {
      this.$refs.grdMedication.ej2Instances.toolbarModule.enableItems(
        ["btnSave"],
        false
      ); //Disable toolbar items.
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    checkBoxChange: function() {
      this.$refs.grdMedication.ej2Instances.toolbarModule.enableItems(
        ["btnSave"],
        true
      ); //Enable toolbar items.
    },
    async fetchItem() {
      this.loadingApi = true;
      // get all item
      let { Items: items } = await window.axios.get(
        "/checkCategory/MedicationList?id=" +
          this.data.Id +
          "&$inlinecount=allpages"
      );

      const arr = [];

      items.forEach(s => {
        if (s.PriceTypes.length) {
          s.notSelfPay = s.PriceTypes.indexOf("001") > -1 ? true : false;
          s.selfPay = s.PriceTypes.indexOf("002") > -1 ? true : false;
          s.okPay = s.PriceTypes.indexOf("003") > -1 ? true : false;
          s.errorPay = s.PriceTypes.indexOf("004") > -1 ? true : false;
          s.samePay = s.PriceTypes.indexOf("005") > -1 ? true : false;
          arr.push(s);
        } else {
          arr.push(s);
        }
      });

      const myArr = arr.sort((a, b) => a.No.localeCompare(b.No));
      this.dsMedication = myArr;
      this.sortedArr = [...myArr];
      this.loadingApi = false;
    },

    dtcSort(col) {
      this.loadingApi = true;
      this.sortBy = col;
      this.sortAsc = !this.sortAsc;
      if (this.sortAsc) {
        this.sortedArr.sort((a, b) => a[col].localeCompare(b[col]));
      } else {
        this.sortedArr.sort((a, b) => -a[col].localeCompare(b[col]));
        //this.sortedArr.reverse();
      }
      this.dsMedication = [...this.sortedArr];
      setTimeout(() => (this.loadingApi = false), 500);
    },
    async updateItem(item) {
      const holdArr = this.dsMedication.filter(s => {
        // const full = s.No + s.Name;
        // const my = item.No + s.Name;
        return s.Id != item.Id && s.PriceTypes.length;
      });

      item.PriceTypes = [];
      item.notSelfPay ? item.PriceTypes.push("001") : "";
      item.selfPay ? item.PriceTypes.push("002") : "";
      item.okPay ? item.PriceTypes.push("003") : "";
      item.errorPay ? item.PriceTypes.push("004") : "";
      item.samePay ? item.PriceTypes.push("005") : "";
      try {
        const obj = Object.assign({}, item);
        delete obj.notSelfPay;
        delete obj.selfPay;
        delete obj.okPay;
        delete obj.errorPay;
        delete obj.samePay;
        await window.axios.put("/checkCategory/UpdateMedicationList", {
          Id: this.data.Id,
          Items: [...holdArr, obj]
        });
        //this.updateItem = "OK";
      } catch (e) {
        alert(e);
      }
    },

    async itemChange(item) {
      requestAnimationFrame(() => this.updateItem(item));
    }
  },
  mounted: async function() {
    this.fetchItem();
  }
};
</script>
<style lang="scss" scoped>
.dtc-save {
  display: grid;
  grid-template-columns: max-content 200px 32px 200px max-content 1fr max-content;
  grid-gap: 1rem;
  //background: var(--dark);
}
.dtc-med-grid {
  display: grid;
  grid-template-columns: 220px 1fr 120px 120px 120px 120px 120px;
  //grid-gap: 3px;
  font-size: 1rem;
  color: var(--light);
  background: var(--dark);
  line-height: 30px;
  padding-left: 9px;
  background: black;
  > * {
    border-bottom: 1px solid white;
  }
}
header {
  height: 30px;
  background: #ccc;
}
section {
  overflow: auto;
  max-height: 300px;
  height: 300px;
  background: black;
  position: relative;
  &.detail-sec {
    color: #fff;
  }
}
.no-data {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 560px;
  height: 40px;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 20px;
  display: block;
  z-index: 999999;
  margin-left: 100px;
  background: black;
}
/deep/ .e-table {
  .e-detailcell {
    section {
      color: #fff;
    }
  }
}
</style>
