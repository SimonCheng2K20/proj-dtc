<!-- 
TWPv4
以TWPv3 為基礎改寫
主要變動: header的checkbox多加一層判斷function, 
使其在不同情況下顯示或隱藏header的checkbox
 -->
<template>
  <div id="twpv2">
    <b-row no-gutters class="mt-1">
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
          @row-clicked="OnRowClicked"
          @row-dblclicked="onRowdbClicked"
          @head-clicked="OnHeadClicked"
          :sticky-header="heightForScroll"
        >
          <!-- Table BUSY state -->
          <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>&nbsp;
            <strong>載入中, 請稍待 ...</strong>
          </div>
          <!-- 列編輯功能欄位.按鈕 -->

          <template v-for="(s, i) in specialColumn" v-slot:[`cell(specialColumn${s.pos})`]="{ item }">
            <b-btn
              v-if="s.type === 'button'"
              :key="'specialColumn' + i"
              size="sm"
              variant="success"
              class="no-wrap"
              :btnval="`${item.AccessionNo},${item.DxrVersion},${item.PatientId}`"
              @click="getReportData(row, item.AccessionNo, item.DxrVersion, item.PatientId)"
              >{{ s.text }}</b-btn
            >

            <b-form-checkbox :key="'specialColumn' + i" v-if="s.type === 'checkbox'" v-model="item.PrintCheck" @change="s.event(item)" />

            <b-btn v-if="s.type === 'button2'" :key="'specialColumn' + i" size="sm" variant="success" class="no-wrap" @click="s.event(item)">{{
              s.textObj[item[s.key]] || '報到'
            }}</b-btn>

            <b-btn v-if="s.type === 'button3'" :key="'specialColumn' + i" size="sm" variant="success" class="no-wrap" @click="s.event(item)">{{
              s.text
            }}</b-btn>

            <div
              :key="'specialColumn' + i"
              v-if="s.type === 'hoverText'"
              v-text="s.text"
              @mouseenter="s.event($event, item)"
              @mouseleave="s.event($event, item)"
            />

            <div :key="'specialColumn' + i" v-if="s.type === 'html'" v-html="s.format(item)" />
          </template>
          <template v-slot:cell(OpColumnType1)="{ item }">
            <b-btn size="sm" variant="success" class="no-wrap" @click="OnColumnButton1Click(item)">{{ Text4OpColButton1 }}</b-btn>
          </template>
          <template v-slot:cell(OpColumnType2)="{ item }">
            <b-btn size="sm" variant="success" class="no-wrap mr-1" @click="OnColumnButton1Click(item)">{{ Text4OpColButton1 }}</b-btn>
            <b-btn size="sm" variant="info" class="no-wrap" @click="OnColumnButton2Click(item)">{{ Text4OpColButton2 }}</b-btn>
          </template>
          <template v-slot:cell(OpColumnType3)="{ item }">
            <b-btn size="sm" variant="success" class="no-wrap mr-1" @click="OnColumnButton3Click(item)">{{ Text4OpColButton3 }}</b-btn>
          </template>
          <!--  @click="OnColumnButton4Click(item)" -->
          <template v-slot:cell(OpColumnType4)="props">
            <b-btn v-if="parseInt(props.item.ReleaseVersion) > 1" size="sm" variant="success" class="no-wrap mr-1" @click="fetchDex(props)">
              <font-awesome-icon :icon="`${props.detailsShowing ? 'minus' : 'plus'}`" />
            </b-btn>
          </template>
          <template v-slot:cell(Reason)="{ item }">
            <div v-b-tooltip.hover :title="item.Reason" style="width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ item.Reason }}</div>
          </template>
          <template v-slot:cell(ProcedureName)="{ item }">
            <div v-b-tooltip.hover :title="item.ProcedureName" style="width: 100%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ item.ProcedureName }}</div>
          </template>
          <template v-slot:row-details="props">
            <div style="max-height: calc(100vh - 450px); display: flex; flex-direction: column; flex-wrap: wrap; overflow: auto">
              <template v-if="props.item.List.length > 0">
                <div
                  style="width: 25%; display: flex; align-items: center; border: 1px solid #ccc; border-radius: 5px"
                  v-for="(x, index) in props.item.List"
                  v-bind:key="x.DxrVersion + '_' + x.isChecked + '_' + index"
                  class="mt-1 mx-1 py-1"
                >
                  <!-- add isChecked inchange -->
                  <!-- <b-form-checkbox
                    class="ml-1"
                    :id="x.DxrVersion"
                    :name="x.DxrVersion"
                    :disabled="index !== 0"
                    :style="index !== 0 ?'opacity: 0.5;':''"
                    v-model="x.isChecked"
                  ></b-form-checkbox> -->
                  <p class="m-0 ml-1" style="width: 210px">版本: {{ x.versionNo }} / {{ x.versionTime }}</p>
                  <b-btn
                    v-if="versionNo !== '805'"
                    class="ml-1"
                    variant="success"
                    size="sm"
                    @click="getReportData(props, x.AccessionNo, x.DxrVersion, props.item.PatientId)"
                    >審查</b-btn
                  >

                  <b-btn
                    class="ml-1"
                    variant="success"
                    size="sm"
                    @click="
                      $emit('contentDiffEvent', {
                        currentVersion: props.item.DxrVersion,
                        oldVersion: x.versionEntile,
                        accessionNo: props.item.AccessionNo,
                        patientId: props.item.PatientId,
                      })
                    "
                    >比對</b-btn
                  >
                </div>
              </template>

              <div v-else class="w-100 text-center">暫無資料</div>
            </div>

            <!-- <b-table :items="row.item.List" :fields="table4ReportSearch" head-variant="dark">
              <template v-slot:cell(row.Version)="VersionList">
                <b-form-checkbox size="lg" :value="true" :unchecked-value="false"></b-form-checkbox>
              </template>
            </b-table>-->
          </template>

          <!-- 列編輯功能欄位.CheckBox -->
          <template v-slot:cell(CheckBoxColumnType1)="row">
            <b-form-checkbox
              size="lg"
              v-model="row.item.TWPCheckBox1Value"
              v-if="IfShowCheckBox(row.item)"
              :value="true"
              :unchecked-value="false"
              style="pointer-events: none"
              @change="OnColumnCheckBox1Change(row.item)"
              >{{ Text4CBColCheckBox1 }}</b-form-checkbox
            >
          </template>
          <template v-slot:head(CheckBoxColumnType1)="head">
            <div class="text-center">
              <b-form-checkbox
                v-if="IfShowHeaderCheckBox()"
                size="lg"
                v-model="allChecked"
                :value="true"
                :unchecked-value="false"
                @change="OnAllCheckBoxChange"
                >{{ head.label }}</b-form-checkbox
              >
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row no-gutters class="mb-1" v-if="PagingEnabled">
      <b-col sm="4">
        <div class="my-1 px-1 w-100">
          <b-form-group class="mb-0">
            <b-input-group>
              <b-input v-model="SearchFilter" placeholder="搜尋資料" size="sm"></b-input>
              <b-input-group-append>
                <b-btn :disabled="!SearchFilter" @click="SearchFilter = ''" v-show="!superMenuOpen" size="sm">重置</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </b-col>
      <b-col sm="4">
        <b-pagination
          :key="PagingCurrentPage"
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
          <span slot="page" slot-scope="{ page, active }">
            <b v-if="active">{{ page }}</b>
            <i v-else>{{ page }}</i>
          </span>
        </b-pagination>
      </b-col>
      <b-col sm="4">
        <div class="float-right my-1 pr-1">
          <label id="twp5-1-label" for="pagingPerPageOption" class="float-left my-1" v-html="GetPageOptionLabel"></label>
          <b-form-select
            id="pagingPerPageOption"
            size="sm"
            plain
            v-if="PagingEnabled"
            v-model="PagingRowPerPage"
            @change="OnselectChange"
            :options="this.$DefaultPerPageOption"
          ></b-form-select>
        </div>
      </b-col>
      <b-col v-if="MultiSelectFunc && checkedItems.length > 0" sm="2" class="px-1 mt-1">
        <b-input-group>
          <b-input-group-prepend>
            <b-button class="bg-primary">勾選筆數</b-button>
          </b-input-group-prepend>
          <b-input :value="checkedItems.length" readonly />
          <b-input-group-append>
            <b-button variant="success" @click="OnMultiEdit"> <font-awesome-icon icon="pen-alt" />編輯 </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col v-if="MultiSelectFunc && checkedItems.length > 0" sm="2" class="px-1 mt-1 text-left">
        <b-button class="bg-danger" @click="OnCancelAllSelects">取消所有勾選</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// 載入組態設定模組
import * as configs from '@/config'
import { DataManager, WebApiAdaptor, Predicate, Query } from '@syncfusion/ej2-data'
import twp from '@/components/TWPv5'
import { dateFormatMixin } from '@/SupportLib_J.js'
export default {
  name: 'TWPv2',
  components: { twp },
  mixins: [dateFormatMixin],
  props: {
    superMenuOpen: { type: Boolean },
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
    OpButton4Func: { type: Function },
    specialColumn: { type: Array },
    CheckBox1Head: { type: String },
    CheckBox1Text: { type: String },
    CheckBox1Func: { type: Function },
    CheckBox1Lead: { type: Boolean },
    ThemeBlack: { type: Boolean, default: false },
    mountedSearch: { type: Boolean, default: true },
    //針對不同資料來源 為了判斷table使用哪個資料源而加的prop
    SrcParamId: { type: Number, default: -1 },
    //勾選多項後 確定觸發
    MultiSelectFunc: { type: Function },
    //判斷是否顯示row的checkbox
    CheckIfShowRowCheckBox: { type: Function },
    //判斷是否顯示header的checkbox
    CheckIfShowHeaderCheckBox: { type: Function },
    enableRowClick: { type: Boolean, default: false },
    heightForScroll: { type: String, default: null },
    //是否要使用後端分業模式
    isBackEndPagination: { type: Boolean, default: true },
    //雙點一下, 觸發動作
    onRowClick: { type: Function },
    //雙點兩下, 觸發動作
    onRowdbClick: { type: Function },
    //是否啟用DoubleClick
    EnDBClick: { type: Boolean, default: false },
    //header checkbox 點擊觸發
    OnHeaderCheckBoxChange: { type: Function, default: null },
    //專屬給報告搜尋用的獨立按鈕
    FI0307BtnEnable: { type: Boolean, default: false },
    SearchCondition: { type: Object, default: () => ({}) },
    EnRowClickEvent: { type: Boolean, default: false }
  },
  data() {
    return {
      versionNo: process.env.VUE_APP_VERSION_NO,
      Wait4AsyncLoad: false,
      PagingEnabled: true,
      PagingRowPerPage: 10,
      PagingCurrentPage: 1,
      TableSortBy: '',
      TableSortDesc: false,
      Columns: [],
      Rows: [],
      RowCount: 0,
      SearchFilter: null,
      SlotId4OpColType1: 'OpColumnType1',
      SlotId4OpColType2: 'OpColumnType2',
      SlotId4OpColType3: 'OpColumnType3',
      SlotId4OpColType4: 'OpColumnType4',
      Text4OpColButton1: '',
      Text4OpColButton2: '',
      SlotId4CBColType1: 'CheckBoxColumnType1',
      Text4CBColCheckBox1: '',
      UsingThemeBlack: false,
      allChecked: false,
      checkBoxIndex: 0,
      checkedItems: [],
      toPage: 1,
      table4ReportSearch: [
        {
          key: 'DxrVersion',
          label: '報告版次',
          sortable: true,
          thClass: 'text-nowrap',
          tdClass: 'no-wrap font-weight-bold',
        },
      ],
      table4ReportSearchDxVersion: [],
    }
  },
  computed: {
    CalcFieldConfig() {
      return this.Columns
    },
    CalcDataContent() {
      if (this.RowData) {
        this.Rows = this.RowData
        this.RowCount = this.Rows.length
        return this.Rows
      } else if (this.DataFetch) {
        return this.Rows
      } else {
        // console.log("> NONE");
        this.Rows = []
        this.RowCount = 0
      }
    },
    GetPageOptionLabel() {
      return '共計 <b>' + this.$FormatForceInteger(this.RowCount) + '</b> 筆, 每頁顯示&nbsp;'
    },
    HTML4EmptyContent() {
      return this.Wait4AsyncLoad
        ? '<b class="text-success"><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : '<b>很抱歉, 目前並無任何內容可供呈現.</b>'
    },
    HTML4EmptyResult() {
      return '<b class="text-danger">抱歉, 並無任何吻合條件的內容.</b>'
    },
    IsPagingCurrentPage() {
      if (this.isBackEndPagination) {
        return null
      } else {
        return this.PagingCurrentPage
      }
    },
  },
  methods: {
    async fetchDex(x, cb) {
      if (x.detailsShowing) {
        x.toggleDetails()
        return
      }
      let subPath = '../report/GetVersionList?accessionNo=' + x.item.AccessionNo
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          x.rowSelected = true
          x.item['List'] = r.actual
            .map((DxrVersion) => {
              let [versionEntile, versionNo] = DxrVersion.split('/')
              const versionTime = versionEntile.split('.').slice(0, 2).join('.')

              return {
                AccessionNo: x.item.AccessionNo,
                versionNo,
                versionTime,
                versionEntile,
                DxrVersion,
                isChecked: false,
              }
            })
            .filter(({ versionTime }) => !x.item.DxrVersion.includes(versionTime))
        })
      x.toggleDetails()
    },
    Formatter4NTD(x) {
      return this.$FormatForceInteger(x)
    },
    GetCurrentItems() {
      return this.Rows
    },
    OnForceRefresh() {
      return new Promise((resolve, reject) => {
        if (this.DataFetch) {
          this.AsyncFetch()
            .catch((e) => {
              reject(e)
            })
            .finally(() => {
              this.$refs.twpt1.refresh()
              this.$nextTick(() => {
                resolve(true)
              })
            })
        } else {
          this.$refs.twpt1.refresh()
          this.$nextTick(() => {
            resolve(true)
          })
        }
      }).then((res) => res)
    },
    OnColumnButton1Click(x) {
      this.OpButton1Func(x)
    },
    OnColumnButton2Click(x) {
      this.OpButton2Func(x)
    },
    OnColumnButton3Click(x) {
      this.OpButton3Func(x)
    },
    OnColumnButton4Click(x) {
      this.OpButton4Func(x)
    },
    OnColumnCheckBox1Change(x) {
      //x.TWPCheckBox1Value = !x.TWPCheckBox1Value
      this.$nextTick(() => {
        this.CheckBox1Func(x)
        if (x.TWPCheckBox1Value) this.AppendItemToChecked(x)
        else this.RemoveItemFromChecked(x)

        if (this.Rows.some((c) => c.showCheckBox === true && c.TWPCheckBox1Value !== true)) {
          this.allChecked = false
        } else {
          this.allChecked = true
        }

        if (this.checkedItems.length == 0) {
          //發送至parent
          this.$emit('allUnSelected')
        }
        this.$refs.twpt1.refresh()
        this.$emit(
          'afterRefresh',
          this.Rows.reduce((a, c) => (c.TWPCheckBox1Value ? a.concat(c.Status) : a), [])
        )
      })
    },

    async AsyncFetch() {
      let dataSet = await this.DataFetch(this.SrcParamId, this.toPage, this.PagingRowPerPage)
      if (!dataSet) return
      this.Rows = dataSet.Items
      this.RowCount = dataSet.Count
      if (this.CheckBox1Func) {
        // 切換資料保留原先勾選
        this.Rows.forEach((i) => {
          i.showCheckBox = true
          i.TWPCheckBox1Value = this.checkedItems.some(({ AccessionNo }) => i.AccessionNo === AccessionNo)
        })
      }

      this.Wait4AsyncLoad = false
      let allPagesNum = Math.ceil(this.RowCount / this.PagingRowPerPage)

      if (allPagesNum > 0 && this.toPage > allPagesNum) {
        this.toPage = 1
        this.OnForceRefresh()
      }
    },
    GetCheckBox1Text() {
      return this.CheckBox1Text ? this.CheckBox1Text : ''
    },
    GetCheckBox1Object() {
      let head = {
        key: this.SlotId4CBColType1,
        label: this.CheckBox1Head ? this.CheckBox1Head : '',
        thClass: 'no-wrap',
        checked: false,
      }
      return head
    },
    OnAllCheckBoxChange() {
      this.$nextTick(() => {
        let newChecked = this.allChecked
        this.OnHeaderCheckBoxChange(newChecked)
        this.Rows.forEach((element) => {
          if (newChecked) {
            if (!element.TWPCheckBox1Value && (element.showCheckBox === undefined || element.showCheckBox)) this.AppendItemToChecked(element)
          } else {
            this.RemoveItemFromChecked(element)
          }
          element.TWPCheckBox1Value = newChecked
        })
        // console.log(this.$logs(this.checkedItems));
        this.$refs.twpt1.refresh()

        this.$emit(
          'afterRefresh',
          this.Rows.reduce((a, c) => (c.TWPCheckBox1Value ? a.concat(c.Status) : a), [])
        )
      })
    },

    switchThemeBlack(themeBlack) {
      this.UsingThemeBlack = themeBlack
    },
    OnRowClicked(x) {

      if(this.EnRowClickEvent){
        this.$emit('ExecRowClickEvent', x)
      }

      //x.TWPCheckBox1Value = !x.TWPCheckBox1Value
      if (!this.CheckBox1Func || !x.showCheckBox) return
      this.CheckBox1Func(x)
      this.$nextTick(() => {
        if (x.showCheckBox) {
          if (x.TWPCheckBox1Value) this.AppendItemToChecked(x)
          else this.RemoveItemFromChecked(x)

          // this.Rows.forEach(c => console.log("TWPCheckBox1Value---" + c.TWPCheckBox1Value));
          if (this.Rows.some((c) => c.showCheckBox === true && c.TWPCheckBox1Value !== true)) {
            this.allChecked = false
          } else {
            this.allChecked = true
          }

          if (this.checkedItems.length == 0) {
            //發送至parent
            this.$emit('allUnSelected')
          }
          this.$refs.twpt1.refresh()
          this.$emit(
            'afterRefresh',
            this.Rows.reduce((a, c) => (c.TWPCheckBox1Value ? a.concat(c.Status) : a), [])
          )
        }
      })
      // console.log(this.$logs(this.checkedItems));
    },

    onRowdbClicked(row) {
      if (!this.EnDBClick) return
      this.onRowdbClick(row)
    },
    OnHeadClicked(key, field, event) {
      if (key === this.SlotId4CBColType1) {
        //this.OnAllCheckBoxChange()
        //this.allChecked = !this.allChecked
      }
    },
    RemoveItemFromChecked(item) {
      this.checkedItems = this.checkedItems.filter((i) => i.Id !== item.Id)
    },
    AppendItemToChecked(item) {
      this.checkedItems.push(item)
    },
    OnMultiEdit() {
      if (this.MultiSelectFunc) this.MultiSelectFunc(this.checkedItems)
    },
    OnCancelAllSelects() {
      this.checkedItems = []
      if (this.Rows && this.Rows.length) {
        this.Rows.forEach((element) => {
          element.TWPCheckBox1Value = false
          element.showCheckBox = true
        })
      }
      this.$refs.twpt1.refresh()
      this.allChecked = false
    },
    IfShowCheckBox(item) {
      if (this.CheckIfShowRowCheckBox) {
        let show = this.CheckIfShowRowCheckBox(item)
        if (show) item.showCheckBox = true
        else item.showCheckBox = false
        return show
      }

      return true
    },
    async IfShowHeaderCheckBox() {
      if (this.CheckIfShowHeaderCheckBox) {
        return this.CheckIfShowHeaderCheckBox(this.Rows)
      }
      return true
    },
    OnPageChange(page) {
      this.toPage = page
      this.OnForceRefresh()
    },
    OnselectChange(page) {
      this.toPage = 1
      this.OnForceRefresh()
    },
    async getReportData(Data, Accession, Version, PatientId) {
      //利用AccessionNo反查報告相關內容
      // console.log(Accession + "-" + Version);
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url: configs.publicPath + '../exam/List',
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        //
        .executeQuery(new Query().where('AccessionNo', 'contains', Accession).where('PatientId', 'contains', PatientId))
        .then((r) => {
          let dataList = r.actual.Items[0]
          dataList.isFromFI0307 = true
          dataList.ProcedureCompleted = this.DateToString(dataList.ProcedureCompleted, true)
          dataList.PatientBirthday = this.DateToString(dataList.PatientBirthday, false)
          dataList.StudyTime = dataList.StudyTime == null ? '無影像' : this.DateToString(dataList.StudyTime, true)
          //偷塞DxrVersion給
          dataList.DxrVersion = Version
          window.dtcEvaluationDataList = dataList ? dataList : []
          this.$router.replace({
            name: 'FI0306-1',
            params: {
              FI0307TempData: this.CalcDataContent,
              FI0307TempCount: this.RowCount,
              FI0307TempQuery: this.SearchCondition,
              FI0307TempCurrentPage: this.PagingCurrentPage,
            },
          })
        })
    },
  },
  mounted() {
    this.UsingThemeBlack = this.$IsThemeBlack()
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
      this.FieldConfig.push({
        key: this.OpButton2Func ? this.SlotId4OpColType2 : this.SlotId4OpColType1,
        label: '操作',
        thClass: 'no-wrap',
        tdClass: 'no-wrap',
      })
      this.Text4OpColButton1 = !this.OpButton1Text ? '編輯' : this.OpButton1Text
      if (this.OpButton2Func) {
        this.Text4OpColButton2 = !this.OpButton2Text ? '管理' : this.OpButton2Text
      }
    }
    if (this.Operatable || this.OpButton3Func) {
      this.FieldConfig.push({
        key: this.SlotId4OpColType3,
        label: '刪除',
        thClass: 'no-wrap',
        tdClass: 'no-wrap',
      })
      this.Text4OpColButton3 = !this.OpButton3Text ? '編輯' : this.OpButton3Text
    }

    //
    // if (this.CheckBox1Func && !this.CheckBox1Lead) {
    //   this.Text4CBColCheckBox1 = this.GetCheckBox1Text();
    //   this.FieldConfig.push(this.GetCheckBox1Object());
    // }
    //
    for (var i = 0; i < this.FieldConfig.length; i++) {
      if (this.FieldConfig[i].label == '報告版次') {
        fields.push({
          key: this.SlotId4OpColType4,
          label: '歷史資料',
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        })
      }
      fields.push(this.FieldConfig[i])
    }

    if (this.specialColumn)
      this.specialColumn.forEach(({ pos, label, text, event, name }) => {
        fields.splice(pos, 0, {
          key: 'specialColumn' + pos,
          label,
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        })
      })

    this.Columns = fields
    if (this.DataFetch && this.mountedSearch) {
      this.AsyncFetch().catch((e) => {
        console.log(e)
      })
    } else if (!this.RowData) {
      this.Rows = []
      this.RowCount = 0
    }
  },
}
</script>

<style scoped>
#pagingPerPageOption {
  width: 5.5rem;
}
ul.pagination {
  margin-bottom: 0;
}

#twp5-1-label.themeBlack label {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
* {
  /* border: 1px solid; */
}
</style>

<style lang="scss" scoped>
#twpv2 {
  .table {
    td,
    th {
      height: 40px;
      vertical-align: middle;
    }
  }
}

</style>
