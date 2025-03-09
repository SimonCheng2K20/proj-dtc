<!-- 
TWPv5
以TWPv3 為基礎改寫
主要變動: header的checkbox多加一層判斷function, 
使其在不同情況下顯示或隱藏header的checkbox
 -->
<template>
  <div id="twpv2">
    <b-row
      no-gutters
      class="mt-1"
    >
      <b-col xl="12">

        <b-table
          ref="twpt1"
          id="dataTable1"
          bordered
          striped
          small
          responsive
          selectable
          select-mode="single"
          :items="rows"
          :fields="CalcFieldConfig"
          :sort-by.sync="TableSortBy"
          :sort-desc.sync="TableSortDesc"
          :per-page="PagingRowPerPage"
          :current-page="IsPagingCurrentPage"
          show-empty
          :empty-html="HTML4EmptyContent"
          :filter="SearchFilter"
          :empty-filtered-html="HTML4EmptyResult"
          class="px-1"
          @row-dblclicked="OnColumnButton1Click"
          @head-clicked="OnHeadClicked"
          :sticky-header="heightForScroll"
        >
          <!-- Table BUSY state -->
          <div
            slot="table-busy"
            class="text-center text-danger my-2"
          >
            <b-spinner class="align-middle"></b-spinner>&nbsp;
            <strong>載入中, 請稍待 ...</strong>
          </div>
          <!-- 列編輯功能欄位.按鈕 -->
          <!-- <template v-slot:cell(OpColumnType1)="row">
            <b-btn
              size="sm"
              variant="success"
              class="no-wrap"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>
          </template>-->
          <template v-slot:cell(OpColumnType1)="row">
            <b-btn
              v-show="OpButton1Func"
              size="sm"
              variant="success"
              class="no-wrap mr-1"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>

            <b-btn
              v-show="OpButton2Func"
              v-if="checkIfDisableOpButton2Func"
              :disabled="checkIfDisableOpButton2Func ? checkIfDisableOpButton2Func(row.item) : true"
              size="sm"
              variant="info"
              class="no-wrap mr-1"
              @click="OnColumnButton2Click(row.item)"
            >{{ Text4OpColButton2 }}</b-btn>

            <b-btn
              v-show="OpButton3Func"
              size="sm"
              variant="warning"
              class="no-wrap"
              @click="OnColumnButton3Click(row.item)"
            >{{ Text4OpColButton3 }}</b-btn>
          </template>
          <!-- 需要tooltip 目前只針對幾個欄位做處理-->
          <template v-slot:cell(ProcedureNameList)="row">
            <span
              v-b-tooltip.hover
              :title="row.item.ProcedureNameList"
            >{{ trunCatedString(row.item.ProcedureNameList, 26) }}</span>
          </template>
          <!-- <template v-slot:cell(AccessionNo)="row">
            <span
              v-b-tooltip.hover
              :title="row.item.AccessionNo"
            >{{ trunCatedString(row.item.AccessionNo, 26) }}</span>
          </template>-->
          <!-- 特殊顯示: 逾期時間 依照是否逾期 字體顏色轉變-->
          <template v-slot:cell(DueTimeStr)="row">
            <span :style="{ color: row.item.FontColor }">{{ row.item.DueTimeStr }}</span>
          </template>

          <!-- 列編輯功能欄位.CheckBox -->
          <template v-slot:cell(CheckBoxColumnType1)="row">
            <b-form-checkbox
              v-if="IfShowCheckBox(row.item)"
              size="lg"
              v-model="row.item.TWPCheckBox1Value"
              :value="true"
              :unchecked-value="false"
              @change="OnColumnCheckBox1Change(row.item)"
            >{{ Text4CBColCheckBox1 }}</b-form-checkbox>
          </template>
          <template v-slot:head(CheckBoxColumnType1)="head">
            <b-form-checkbox
              v-if="IfShowHeaderCheckBox"
              size="lg"
              v-model="allChecked"
              :value="true"
              :unchecked-value="false"
              @change="OnAllCheckBoxChange()"
            >
              {{ head.label }}
            </b-form-checkbox>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row
      no-gutters
      class="mb-1"
      v-if="PagingEnabled"
    >
      <b-col sm="4">
        <div class="float-left my-1 px-1 w-100">
          <b-form-group class="mb-0">
            <b-input-group>
              <b-input
                v-model="SearchFilter"
                placeholder="搜尋資料"
                size="sm"
              ></b-input>
              <b-input-group-append>
                <b-btn
                  :disabled="!SearchFilter"
                  @click="SearchFilter = ''"
                  size="sm"
                >重置</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </b-col>
      <b-col sm="4">
        <b-pagination
          v-model="PagingCurrentPage"
          @change="OnPageChange"
          :total-rows="RowCount"
          :per-page="PagingRowPerPage"
          aria-controls="dataTable1"
          align="center"
        >
          <span slot="first-text">
            <i class="fas fa-fast-backward"></i>
          </span>
          <span slot="prev-text">
            <i class="fas fa-step-backward"></i>
          </span>
          <span slot="next-text">
            <i class="fas fa-step-forward"></i>
          </span>
          <span slot="last-text">
            <i class="fas fa-fast-forward"></i>
          </span>
          <span
            slot="page"
            slot-scope="{ page, active }"
          >
            <b v-if="active">{{ page }}</b>
            <i v-else>{{ page }}</i>
          </span>
        </b-pagination>
      </b-col>
      <b-col sm="4">
        <div class="float-right my-1 pr-1">
          <label
            id="twp5-label"
            for="pagingPerPageOption"
            class="float-left my-1"
            v-html="GetPageOptionLabel"
          ></label>
          <b-form-select
            id="pagingPerPageOption"
            size="sm"
            plain
            v-if="PagingEnabled"
            v-model="PagingRowPerPage"
            :options="this.$DefaultPerPageOption"
            @change="ChangePerPage"
          ></b-form-select>
        </div>
      </b-col>
      <b-col
        v-if="ifShowMultiFuncs"
        sm="2"
        class="px-1 mt-1"
      >
        <b-input-group>
          <b-input-group-prepend>
            <b-button class="bg-primary">勾選筆數</b-button>
          </b-input-group-prepend>
          <b-input
            :value="checkedItems.length"
            readonly
          />
          <b-input-group-append>
            <b-button
              v-show="MultiSelectFunc1"
              variant="success"
              @click="OnFunc1"
            >
              <font-awesome-icon icon="pen-alt" />
              {{ selectFunc1String }}
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>

      <b-col
        :sm="multiFuncBarSm"
        class="px-1 mt-1 text-right"
      >
        <b-button
          v-show="ifShowMultiFuncs && MultiSelectFunc2"
          variant="warning"
          @click="OnFunc2"
        >
          <font-awesome-icon icon="check" />
          {{ selectFunc2String }}
        </b-button>
        <b-button
          v-show="ifShowMultiFuncs && MultiSelectFunc3"
          variant="info"
          class="ml-2"
          @click="OnFunc3"
        >
          <font-awesome-icon icon="check-double" />
          {{ selectFunc3String }}
        </b-button>
        <b-button
          v-show="ifShowMultiFuncs"
          class="bg-danger ml-2"
          @click="OnCancelAllSelects"
        >取消所有勾選</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// 載入組態設定模組
import * as configs from "@/config";

export default {
  name: "TWPv2",
  props: {
    TableId: { Type: String, default: "table_01" },
    FieldConfig: { type: Array, required: true },
    RowData: { type: Array },
    DataFetch: { type: Function },
    NoPaging: { type: Boolean },
    Operatable: { type: Boolean },
    OpButton1Func: { type: Function },
    OpButton1Text: { type: String },
    OpButton2Func: { type: Function },
    OpButton2Text: { type: String },
    OpButton3Func: { type: Function },
    OpButton3Text: { type: String },
    CheckBox1Head: { type: String },
    CheckBox1Text: { type: String },
    CheckBox1Func: { type: Function },
    CheckBox1Lead: { type: Boolean },
    ThemeBlack: { type: Boolean, default: false },
    //針對不同資料來源 為了判斷table使用哪個資料源而加的prop
    // SrcParamId: { type: String, default: null },
    //勾選多項後 確定觸發
    MultiSelectFunc1: { type: Function },
    MultiSelectFunc2: { type: Function },
    MultiSelectFunc3: { type: Function },
    selectFunc1String: { type: String, default: "編輯" },
    selectFunc2String: { type: String, default: "其他功能鍵2" },
    selectFunc3String: { type: String, default: "其他功能鍵3" },

    //判斷是否顯示row的checkbox
    CheckIfShowRowCheckBox: { type: Function },
    //判斷是否顯示header的checkbox
    CheckIfShowHeaderCheckBox: { type: Function },
    enableRowClick: { type: Boolean, default: false },
    heightForScroll: { type: String, default: null },
    //是否要使用後端分業模式
    isBackEndPagination: { type: Boolean, default: true },
    //雙點一下, 兩下時 觸發動作
    onRowClick: { type: Function },
    EnDBClick: { type: Boolean, default: false },
    //header checkbox 點擊觸發
    OnHeaderCheckBoxChange: { type: Function, default: null },
    //是否點擊後 傳回整個list
    ifSendBackTheList: { type: Boolean, default: false },

    //判斷是否enable OpButton2Func
    checkIfDisableOpButton2Func: { type: Function },
    // 資料
    rows: {
      type: Array,
      default: new Array()
    }
  },
  data () {
    return {
      Wait4AsyncLoad: false,
      PagingEnabled: true,
      PagingRowPerPage: 10,
      PagingCurrentPage: 1,
      TableSortBy: "",
      TableSortDesc: false,
      Columns: [],
      Rows: [],
      RowCount: 0,
      SearchFilter: null,
      SlotId4OpColType1: "OpColumnType1",
      SlotId4OpColType2: "OpColumnType2",
      Text4OpColButton1: "",
      Text4OpColButton2: "",
      Text4OpColButton3: "",
      SlotId4CBColType1: "CheckBoxColumnType1",
      Text4CBColCheckBox1: "",
      UsingThemeBlack: false,
      allChecked: false,
      checkBoxIndex: 0,
      checkedItems: [],
      toPage: 1
    };
  },
  computed: {
    IfShowHeaderCheckBox () {
      if (this.CheckIfShowHeaderCheckBox) {
        let result = this.CheckIfShowHeaderCheckBox(this.Rows);
        return result;
      }

      return true;
    },
    multiFuncBarSm () {
      let sm = 1;
      if (this.MultiSelectFunc2) sm++;
      if (this.MultiSelectFunc3) sm++;

      return "" + sm;
    },
    ifShowMultiFuncs () {
      return (this.MultiSelectFunc1 || this.MultiSelectFunc2 || this.MultiSelectFunc3) && this.checkedItems.length > 0;
    },
    CalcFieldConfig () {
      return this.Columns;
    },
    CalcDataContent () {

      if (this.RowData) {
        this.Rows = this.RowData;
        this.RowCount = this.Rows.length;
        return this.Rows;
      } else if (this.DataFetch) {
        return this.Rows;
      } else {
        console.log("> NONE");
        this.Rows = [];
        this.RowCount = 0;
        return 0;
      }
    },
    GetPageOptionLabel () {
      return "共計 <b>" + this.$FormatForceInteger(this.RowCount) + "</b> 筆, 每頁顯示&nbsp;";
    },
    HTML4EmptyContent () {
      return this.Wait4AsyncLoad
        ? '<b class="text-success"><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : '<b class="text-primary">很抱歉, 目前並無任何內容可供呈現.</b>';
    },
    HTML4EmptyResult () {
      return '<b class="text-danger">抱歉, 並無任何吻合條件的內容.</b>';
    },
    IsPagingCurrentPage () {
      if (this.isBackEndPagination) {
        return null;
      } else {
        return this.PagingCurrentPage;
      }
    }
  },
  methods: {
    trunCatedString (str, length) {
      if (str != null) {
        if (str.length <= length) return str;
        let truncated = str.substring(0, length);
        return truncated + "...";
      }
    },
    //
    //
    OnMouseOver (item, index, event) {
      let d = 0;
    },
    //初始 紀錄UI參數
    InitUiParams () {
      let strPerPage = localStorage.getItem(this.TableId + "_perPage");
      if (strPerPage) {
        this.PagingRowPerPage = parseInt(strPerPage);
      }
    },
    //
    //變更每頁筆數
    ChangePerPage () {
      localStorage.setItem(this.TableId + "_perPage", this.PagingRowPerPage);

      this.PagingCurrentPage = 1;
      this.OnForceRefresh();
    },
    Formatter4NTD (x) {
      return this.$FormatForceInteger(x);
    },
    GetCurrentItems () {
      return this.Rows;
    },
    AddSelectedItemFromParent (x) {
      this.checkedItems.pushIfNotExist(e => {
        return x.AccessionNo == e.AccessionNo;
      });
    },

    //rerender table
    tableRefresh () {
      this.$refs.twpt1.refresh();
    },

    //re-fetch data and render
    OnForceRefresh () {
      // console.log(`${this.$logs()}`);
      if (this.DataFetch) {
        this.AsyncFetch().catch(e => {
          // console.log(e);
        });
      }
      this.$refs.twpt1.refresh();
    },
    OnColumnButton1Click (x) {
      //針對待打清單 若設定iFSendBackTheList為true, 傳回整個data list
      // 為什麼要傳回整個data list
      if (this.ifSendBackTheList) {
        let copy = JSON.parse(JSON.stringify(this.Rows));
        copy.sort((m, n) => {
          return m.AccessionNo == x.AccessionNo ? -1 : n.AccessionNo == x.AccessionNo ? 1 : 0;
        });
        this.OpButton1Func(copy, this.TableId);
      } else {
        this.OpButton1Func(x, this.TableId);
      }
    },
    OnColumnButton2Click (x) {
      this.OpButton2Func(x);
    },
    OnColumnButton3Click (x) {
      this.OpButton3Func(x);
    },
    OnColumnCheckBox1Change (x) {
      //x.TWPCheckBox1Value = !x.TWPCheckBox1Value
      // this.CheckBox1Func(x);

      this.$nextTick(() => {
        this.CheckBox1Func(x);
        if (x.TWPCheckBox1Value) this.AppendItemToChecked(x);
        else this.RemoveItemFromChecked(x);

        this.Rows.forEach(c => console.log("TWPCheckBox1Value---" + c.TWPCheckBox1Value));
        if (this.Rows.some(c => c.showCheckBox === true && c.TWPCheckBox1Value !== true)) {
          this.allChecked = false;
        } else {
          this.allChecked = true;
        }

        if (this.checkedItems.length == 0) {
          //發送至parent
          this.$emit("allUnSelected");
        }

        this.$refs.twpt1.refresh();
      });
      // console.log(this.$logs(this.checkedItems));
    },

    async AsyncFetch () {
      /*if(this.SrcParam === -1){
				console.log(`${this.$logs('Failed Calling', 'AsyncFetch SrcParam=-1')}`)
				return null
			}*/
      // console.log(`${this.$logs("Calling", "AsyncFetch")}`);
      //

      let dataSet = await this.DataFetch(this.TableId, this.toPage, this.PagingRowPerPage);
      // console.log(this.DataFetch);
      // console.log(dataSet);
      /*.then(r => {
					var tempVar = r
					this.RowCount = tempVar.length
					return tempVar
				})
				.then(items => items)
				.catch(e => { console.log(e) })*/
      this.Rows = dataSet.Items;
      this.RowCount = dataSet.Count;
      //
      //是否顯示checkbox
      if (this.CheckBox1Func) {
        this.Rows.forEach(i => {
          i.showCheckBox = true;
          i.TWPCheckBox1Value = false;

          this.checkedItems.forEach(j => {
            if (i.OrderNo && j.OrderNo && i.OrderNo === j.OrderNo) i.TWPCheckBox1Value = true;
          });
        });
      }

      this.Wait4AsyncLoad = false;

      //
      //判斷是否頁碼超過資料筆數應有頁數
      let allPagesNum = Math.ceil(this.RowCount / this.PagingRowPerPage);
      if (allPagesNum > 0 && this.toPage > allPagesNum) {
        this.toPage = 1;
        this.OnForceRefresh();
      }
    },
    GetCheckBox1Text () {
      return this.CheckBox1Text ? this.CheckBox1Text : "";
    },
    GetCheckBox1Object () {
      let head = {
        key: this.SlotId4CBColType1,
        label: this.CheckBox1Head ? this.CheckBox1Head : "",
        thClass: "no-wrap",
        checked: false
      };
      return head;
    },
    OnAllCheckBoxChange () {
      let newChecked = !this.allChecked;
      if (this.OnHeaderCheckBoxChange) this.OnHeaderCheckBoxChange(newChecked);
      this.Rows.forEach(element => {
        if (newChecked) {
          if (!element.TWPCheckBox1Value && (element.showCheckBox === undefined || element.showCheckBox)) this.AppendItemToChecked(element);
        } else {
          this.RemoveItemFromChecked(element);
        }
        element.TWPCheckBox1Value = newChecked;
      });
      console.log(this.$logs(this.checkedItems));

      this.$refs.twpt1.refresh();
    },

    switchThemeBlack (themeBlack) {
      this.UsingThemeBlack = themeBlack;
    },
    OnRowClicked (row, index, event) {
      if (!this.enableRowClick) return;

      let columnIndex = event.srcElement.cellIndex === undefined ? event.srcElement.parentElement.cellIndex : event.srcElement.cellIndex;

      if (this.CheckBox1Func && columnIndex == this.checkBoxIndex) {
        //this.Rows[index].TWPCheckBox1Value = !this.Rows[index].TWPCheckBox1Value
        //this.OnColumnCheckBox1Change(this.Rows[index])
        return;
      }
      this.OnColumnButton1Click(row);
    },
    onRowdbClick (row) {
      if (!this.onRowClick) return;

      this.onRowClick(row);
    },
    OnHeadClicked (key, field, event) {
      if (key === this.SlotId4CBColType1) {
        //this.OnAllCheckBoxChange()
        //this.allChecked = !this.allChecked
      }
    },
    RemoveItemFromChecked (item) {
      this.checkedItems = this.checkedItems.filter(i => i.AccessionNo !== item.AccessionNo);
    },
    AppendItemToChecked (item) {
      if (
        this.checkedItems.some(i => {
          if (i.AccessionNo == item.AccessionNo) return true;
        })
      )
        return;
      this.checkedItems.push(item);
    },
    //
    OnFunc3 () {
      if (this.MultiSelectFunc3) {
        console.log(this.$logs("func3"));
        this.MultiSelectFunc3(this.checkedItems);
      }
    },
    //
    OnFunc2 () {
      if (this.MultiSelectFunc2) {
        console.log(this.$logs("func2"));
        this.MultiSelectFunc2(this.checkedItems);
      }
    },
    //
    OnFunc1 () {
      if (this.MultiSelectFunc1) this.MultiSelectFunc1(this.checkedItems);
    },
    OnCancelAllSelects () {
      this.checkedItems = [];
      this.Rows.forEach(element => {
        element.showCheckBox = true;
        element.TWPCheckBox1Value = false;
      });
      this.allChecked = false;
      this.$emit("allUnSelected");
      this.$refs.twpt1.refresh();
    },
    IfShowCheckBox (item) {
      if (this.CheckIfShowRowCheckBox) {
        let show = this.CheckIfShowRowCheckBox(item);
        if (show) item.showCheckBox = true;
        else item.showCheckBox = false;
        return show;
      }

      return true;
    },
    // IfShowHeaderCheckBox() {
    //   if (this.CheckIfShowHeaderCheckBox) {
    //     let result = this.CheckIfShowHeaderCheckBox(this.Rows);
    //     return result;
    //   }

    //   return true;
    // },
    OnPageChange (page) {
      this.toPage = page;
      if (this.isBackEndPagination) {
        this.OnForceRefresh();
      }
    }
  },
  created () {
    //
    //
    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    Array.prototype.inArray = function (comparer) {
      for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
      }
      return false;
    };

    // adds an element to the array if it does not already exist using a comparer
    // function
    Array.prototype.pushIfNotExist = function (element, comparer) {
      if (!this.inArray(comparer)) {
        this.push(element);
      }
    };
    //
    this.InitUiParams();
    // console.log(this.$logs());
    //
    if (this.DataFetch) {
      this.Wait4AsyncLoad = true;
    }
  },
  mounted () {
    // console.log(this.$logs());
    //
    this.UsingThemeBlack = this.$IsThemeBlack();
    //
    if (this.NoPaging) {
      this.PagingEnabled = false;
      this.PagingRowPerPage = 65536;
    }
    //
    var fields = [];
    //
    if (this.CheckBox1Func && this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text();
      fields.push(this.GetCheckBox1Object());
      this.checkBoxIndex = 0;
    }
    //
    if (this.Operatable || this.OpButton1Func) {
      this.FieldConfig.push({
        key: this.SlotId4OpColType1,
        label: "操作",
        thClass: "no-wrap",
        tdClass: "no-wrap"
      });
      this.Text4OpColButton1 = !this.OpButton1Text ? "編輯" : this.OpButton1Text;
      if (this.OpButton2Func) {
        this.Text4OpColButton2 = !this.OpButton2Text ? "管理" : this.OpButton2Text;
      }
      if (this.OpButton3Func) {
        this.Text4OpColButton3 = !this.OpButton3Text ? "管理" : this.OpButton3Text;
      }
    }
    //
    if (this.CheckBox1Func && !this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text();
      this.FieldConfig.push(this.GetCheckBox1Object());
    }
    //
    for (var i = 0; i < this.FieldConfig.length; i++) {
      fields.push(this.FieldConfig[i]);
    }
    // console.log({ fields });
    this.Columns = fields;
    //
    if (this.DataFetch) {
      this.AsyncFetch().catch(e => {
        console.log(e);
      });
    } else if (!this.RowData) {
      console.log("> NONE");
      this.Rows = [];
      this.RowCount = 0;
    }
  }
};
</script>

<style scope>
#pagingPerPageOption {
  width: 5.5rem;
}
ul.pagination {
  margin-bottom: 0;
}

#twp5-label.themeBlack label {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
