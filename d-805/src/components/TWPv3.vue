<!-- 
TWPv3
以TWPv2 為基礎改寫
主要變動:	改寫checkbox功能, 增加header的全選checkbox, row click功能, 
			sticky header高度prop (固定table height 並啟用sticky header)
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
          hover
          responsive
          head-variant="dark"
          :dark="UsingThemeBlack"
          selectable
          select-mode="single"
          :items="CalcDataContent"
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
          @row-dblclicked="OnRowClicked"
          @head-clicked="OnHeadClicked"
          :sticky-header="heightForScroll"
        >
          <!-- Table BUSY state -->
          <div
            slot="table-busy"
            class="text-center text-danger my-2"
          >
            <b-spinner class="align-middle"></b-spinner>&nbsp;<strong>載入中, 請稍待 ...</strong>
          </div>
          <!-- 列編輯功能欄位.按鈕 -->
          <template v-slot:cell(OpColumnType1)="row">
            <b-btn
              size="sm"
              variant="success"
              class="no-wrap"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>
          </template>
          <template v-slot:cell(OpColumnType2)="row">
            <b-btn
              size="sm"
              variant="success"
              class="no-wrap mr-1"
              @click="OnColumnButton1Click(row.item)"
            >{{ Text4OpColButton1 }}</b-btn>
            <b-btn
              size="sm"
              variant="info"
              class="no-wrap"
              @click="OnColumnButton2Click(row.item)"
            >{{ Text4OpColButton2 }}</b-btn>
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
              size="lg"
              v-model="allChecked"
              :value="true"
              :unchecked-value="false"
              @change="OnAllCheckBoxChange()"
            >{{ head.label }}</b-form-checkbox>
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
                placeholder="搜尋資料1"
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
          <span slot="first-text"><i class="fas fa-fast-backward"></i></span>
          <span slot="prev-text"><i class="fas fa-step-backward"></i></span>
          <span slot="next-text"><i class="fas fa-step-forward"></i></span>
          <span slot="last-text"><i class="fas fa-fast-forward"></i></span>
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
          ></b-form-select>
        </div>
      </b-col>
      <b-col
        v-if="MultiSelectFunc && checkedItems.length > 0"
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
              variant="success"
              @click="OnMultiEdit"
            >
              <font-awesome-icon icon="pen-alt" /> 編輯</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col
        v-if="MultiSelectFunc && checkedItems.length > 0"
        sm="2"
        class="px-1 mt-1 text-left"
      >
        <b-button
          class="bg-danger"
          @click="OnCancelAllSelects"
        >取消所有勾選</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// 載入組態設定模組
import * as configs from '@/config'

export default {
  name: "TWPv2",
  props: {
    FieldConfig: { type: Array, required: true },
    RowData: { type: Array },
    DataFetch: { type: Function },
    NoPaging: { type: Boolean },
    Operatable: { type: Boolean },
    OpButton1Func: { type: Function },
    OpButton1Text: { type: String },
    OpButton2Func: { type: Function },
    OpButton2Text: { type: String },
    CheckBox1Head: { type: String },
    CheckBox1Text: { type: String },
    CheckBox1Func: { type: Function },
    CheckBox1Lead: { type: Boolean },
    ThemeBlack: { type: Boolean, default: false },
    //針對不同資料來源 為了判斷table使用哪個資料源而加的prop
    SrcParamId: { type: Number, default: -1 },
    MultiSelectFunc: { type: Function },
    CheckIfShowRowCheckBox: { type: Function },
    enableRowClick: { type: Boolean, default: false },
    heightForScroll: ,
    //是否要使用後端分業模式
    isBackEndPagination: { type: Boolean, default: true },
    //雙點兩下時 觸發動作
    onRowClick: { type: Function },
    EnDBClick: { type: Boolean, default: false },
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
      SlotId4OpColType1: 'OpColumnType1',
      SlotId4OpColType2: 'OpColumnType2',
      Text4OpColButton1: '',
      Text4OpColButton2: '',
      SlotId4CBColType1: 'CheckBoxColumnType1',
      Text4CBColCheckBox1: '',
      UsingThemeBlack: false,
      allChecked: false,
      checkBoxIndex: 0,
      checkedItems: [],
      toPage: 1,
    };
  },
  computed: {
    CalcFieldConfig () { return this.Columns },
    CalcDataContent () {
      if (this.RowData) {
        this.Rows = this.RowData
        this.RowCount = this.Rows.length
        return this.Rows
      } else if (this.DataFetch) {
        return this.Rows
      } else {
        console.log('> NONE')
        this.Rows = []
        this.RowCount = 0
      }
    },
    GetPageOptionLabel () { return "共計 <b>" + this.$FormatForceInteger(this.RowCount) + "</b> 筆, 每頁顯示&nbsp;" },
    HTML4EmptyContent () {
      return this.Wait4AsyncLoad
        ? '<b class="text-success"><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : '<b class="text-primary">很抱歉, 目前並無任何內容可供呈現.</b>'
    },
    HTML4EmptyResult () { return '<b class="text-danger">抱歉, 並無任何吻合條件的內容.</b>' },
    IsPagingCurrentPage () {
      if (this.isBackEndPagination) {
        return null
      }
      else {
        return this.PagingCurrentPage
      }
    }
  },
  methods: {
    Formatter4NTD (x) { return this.$FormatForceInteger(x) },
    GetCurrentItems () { return this.Rows },
    OnForceRefresh () {
      console.log(`${this.$logs()}`)
      if (this.DataFetch) {
        this.AsyncFetch().catch(e => { console.log(e) })
      }
      this.$refs.twpt1.refresh()
    },
    OnColumnButton1Click (x) { this.OpButton1Func(x) },
    OnColumnButton2Click (x) { this.OpButton2Func(x) },
    OnColumnCheckBox1Change (x) {
      //x.TWPCheckBox1Value = !x.TWPCheckBox1Value
      this.CheckBox1Func(x)

      this.$nextTick(() => {

        if (x.TWPCheckBox1Value)
          this.AppendItemToChecked(x)
        else
          this.RemoveItemFromChecked(x)

        this.Rows.forEach(c => console.log("TWPCheckBox1Value---" + c.TWPCheckBox1Value))
        if (this.Rows.some(c => c.TWPCheckBox1Value !== true)) {
          this.allChecked = false;
        }
        else {
          this.allChecked = true;
        }
        this.$refs.twpt1.refresh()
      })
      console.log(this.$logs(this.checkedItems))
    },

    async AsyncFetch () {
			/*if(this.SrcParam === -1){
				console.log(`${this.$logs('Failed Calling', 'AsyncFetch SrcParam=-1')}`)
				return null
			}*/
      console.log(`${this.$logs('Calling', 'AsyncFetch')}`)
      let dataSet = await this.DataFetch(this.SrcParamId, this.toPage, this.PagingRowPerPage)
      /*.then(r => {
        var tempVar = r
        this.RowCount = tempVar.length
        return tempVar
      })
      .then(items => items)
      .catch(e => { console.log(e) })*/
      this.Rows = dataSet.Items
      this.RowCount = dataSet.Count
      this.Wait4AsyncLoad = false
    },
    GetCheckBox1Text () { return this.CheckBox1Text ? this.CheckBox1Text : '' },
    GetCheckBox1Object () {
      let head = {
        key: this.SlotId4CBColType1,
        label: (this.CheckBox1Head ? this.CheckBox1Head : ''),
        thClass: "no-wrap",
        checked: false
      }
      return head
    },
    OnAllCheckBoxChange () {
      let newChecked = !this.allChecked
      this.Rows.forEach(element => {

        if (newChecked) {
          if (newChecked) {
            if (!element.TWPCheckBox1Value && (element.showCheckBox === undefined || element.showCheckBox))
              this.AppendItemToChecked(element)
          }
        }
        else {
          this.RemoveItemFromChecked(element)
        }
        element.TWPCheckBox1Value = newChecked
      });
      console.log(this.$logs(this.checkedItems))

      this.$refs.twpt1.refresh()
    },

    OnRowClicked (row, index, event) {
      if (!this.enableRowClick)
        return

      let columnIndex = (event.srcElement.cellIndex === undefined) ? event.srcElement.parentElement.cellIndex : event.srcElement.cellIndex

      if (this.CheckBox1Func && (columnIndex == this.checkBoxIndex)) {
        //this.Rows[index].TWPCheckBox1Value = !this.Rows[index].TWPCheckBox1Value
        //this.OnColumnCheckBox1Change(this.Rows[index])
        return
      }
      this.OnColumnButton1Click(row)
    },
    onRowdbClick (row) {
      if (!this.onRowClick)
        return

      this.onRowClick(row)
    },
    OnHeadClicked (key, field, event) {
      if (key === this.SlotId4CBColType1) {
        //this.OnAllCheckBoxChange()
        //this.allChecked = !this.allChecked
      }
    },
    RemoveItemFromChecked (item) {
      this.checkedItems = this.checkedItems.filter(i => i.Id !== item.Id)
    },
    AppendItemToChecked (item) {
      this.checkedItems.push(item)
    },
    OnMultiEdit () {
      if (this.MultiSelectFunc)
        this.MultiSelectFunc(this.checkedItems)
    },
    OnCancelAllSelects () {
      this.checkedItems = []
      this.Rows.forEach(element => {

        element.TWPCheckBox1Value = false
      });
      this.allChecked = false
      this.$refs.twpt1.refresh()
    },
    IfShowCheckBox (item) {
      if (this.CheckIfShowRowCheckBox) {
        let show = this.CheckIfShowRowCheckBox(item)
        if (show)
          item.showCheckBox = true
        else
          item.showCheckBox = false
        return show
      }
      return true
    },
    OnPageChange (page) {
      this.toPage = page
      this.OnForceRefresh()
    },

  },
  created () {
    console.log(this.$logs())
    //
    if (this.DataFetch) {
      this.Wait4AsyncLoad = true
    }
  },
  mounted () {
    console.log(this.$logs())
    //
    this.UsingThemeBlack = this.$IsThemeBlack()
    //
    if (this.NoPaging) {
      this.PagingEnabled = false
      this.PagingRowPerPage = 65536
    }
    //
    var fields = []
    //
    if (this.CheckBox1Func && this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text()
      fields.push(this.GetCheckBox1Object())
      this.checkBoxIndex = 0
    }
    //
    if (this.Operatable || this.OpButton1Func) {
      this.FieldConfig.push({ key: this.OpButton2Func ? this.SlotId4OpColType2 : this.SlotId4OpColType1, label: '操作', thClass: "no-wrap", tdClass: "no-wrap" })
      this.Text4OpColButton1 = !this.OpButton1Text ? '編輯' : this.OpButton1Text
      if (this.OpButton2Func) {
        this.Text4OpColButton2 = !this.OpButton2Text ? '管理' : this.OpButton2Text
      }
    }
    //
    if (this.CheckBox1Func && !this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text()
      this.FieldConfig.push(this.GetCheckBox1Object())
    }
    //
    for (var i = 0; i < this.FieldConfig.length; i++) { fields.push(this.FieldConfig[i]) }
    this.Columns = fields

    //
    if (this.DataFetch) {
      this.AsyncFetch().catch(e => { console.log(e) })
    } else if (!this.RowData) {
      console.log('> NONE')
      this.Rows = []
      this.RowCount = 0
    }
  },
}
</script>

<style scope>
#pagingPerPageOption {
  width: 5.5rem;
}
ul.pagination {
  margin-bottom: 0;
}

.themeBlack label {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
