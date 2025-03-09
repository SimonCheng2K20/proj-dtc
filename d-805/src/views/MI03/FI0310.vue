<template>
  <div class="pageContent zhTW fix-light" style="min-height: 829px">
    <b-card no-body class="mx-1 border" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">不良片查詢</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters class="mt-2">
            <b-col sm="4" class="px-1">
              <b-input-group prepend="記錄時間">
                <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
                  <ejs-daterangepicker v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row no-gutters class="mt-2 mb-2">
            <b-col sm="2" class="px-1">
              <b-input-group prepend="病歷號碼">
                <b-input ref="AccessionNo" v-model="checkQuery.PatientId" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="檢查單號">
                <b-input v-model="checkQuery.AccessionNo" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="診別">
                <b-select v-model="checkQuery.PatientSourceTypeCode" :options="optionsPatientSource" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="放射師">
                <b-select v-model="checkQuery.selectedRadiographer" :options="optionsRadiographer" />
              </b-input-group>
            </b-col>
            <b-col sm="4" class="px-1 text-right">
              <b-button variant="primary" @click="getQueryBtn"> <font-awesome-icon icon="search" />進行查詢 </b-button>&nbsp;
              <b-button variant="success" @click="clear"> <font-awesome-icon icon="eraser" />清除條件 </b-button>&nbsp;
              <b-button variant="danger" @click="GetFailImageReport"> <font-awesome-icon icon="download" />下載Excel</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 px-1">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="rounded" style="border: 1px solid #ced4da; min-height: 690px">
            <twp ref="twp1" v-bind:FieldConfig="tableConfig4QueryResult" :DataFetch="getFliterData" :isBackEndPagination="true" :EnDBClick="true" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import twp from '@/components/TWPv5_1'
import { Dialog, AppBar } from 'muse-ui'
var moment = require('moment')
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import { dateFormatMixin } from '@/SupportLib_J.js'
import * as configs from '@/config'
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import setSearchQuery from '@/assets/setSearchQuery.js'
import { getEmployeeDataByType, getFailImageReasonList, getFailImageReasonReport, getRadiographerCodeName } from '../../assets/service/dataManager'

Vue.use(AppBar)
Vue.use(Dialog)
Vue.use(DateRangePickerPlugin)

export default {
  name: 'home',
  components: { twp },
  mixins: [dateFormatMixin],
  data() {
    return {
      selectCheckItems: [],
      dialogOpened: false,
      viewDate: new Date(),
      patientInfo: {
        orderNo: '',
        name: '',
        id: '',
        gender: '',
        hrNum: '',
        birthDay: null,
      },
      checkItemNos: '',
      tableConfig4QueryResult: [
        this.tOptions(['AccessionNo', '檢查單號']),
        this.tOptions(['PatientId', '病歷號碼']), // *
        // this.tOptions(["PatientSourceTypeName", "病患來源"]),
        this.tOptions(['PatientSourceTypeCode', '診別']),
        this.tOptions(['DxreportPhysicianName', '報告醫師']),
        this.tOptions(['ProcedureCode', '檢查碼']), // *
        this.tOptions(['ProcedureName', '檢查項目名稱']),
        // this.tOptions(["Modality", "檢查儀器類別碼"]),
        this.tOptions(['StudyTime', '進影時間']), // *
        this.tOptions(['EmployeeCodeName', '放射師']),
        this.tOptions(['Reason', '醫師備註', null, null, 'nowrap text-left MX-W-350']),
        // this.tOptions(["Step", "發現階段"]), // *
        // this.tOptions(["ReasonType", "原因類型"]), // *
        // this.tOptions(["EmployeeNo", "放射師代碼"]),
        // this.tOptions(["DxreportPhysicianId", "報告醫師(員工)代碼"]),
        this.tOptions(['IssueTime', '報告發送時間']),
        this.tOptions(['Type', '註記']), // *
        this.tOptions(['CreateTime', '記錄時間', true]),
      ],
      MedicationContent: [],
      optionsPatientSource: [],
      TotalStatusSource: [],
      ObjApp: null,
      firstCheckedItem: null,
      checkinCount: 0,
      UncheckinCount: 1,
      BtnNo: 0,
      checkQuery: {
        AccessionNo: '',
        PatientId: '',
        PatientSourceTypeCode: null,
        selectedRadiographer: null,
      },
      CheckDateRange: ['', ''],
      checkinBtn: false,
      CancelBtn: false,
      changeBtn: false,
      PatientcheckItem_List: [],
      dataStore: {},
      optionsRadiographer: [],
      pageI: 0,
      pageP: 10,
    }
  },
  computed: {
    ...mapGetters(['getThemeColors']),
  },
  methods: {
    tOptions(options = []) {
      return {
        key: options[0] ? options[0] : '',
        label: options[1] ? options[1] : '',
        sortable: options[2] ? options[2] : false,
        thClass: options[3] ? options[3] : 'no-wrap',
        tdClass: options[4] ? options[4] : 'no-wrap',
      }
    },
    oDataQuery(pageIndex, pageCount) {
      let filter = []
      // let timeFilter = [];
      if (this.CheckDateRange != null) {
        if (this.CheckDateRange[0] != '' && this.CheckDateRange.length == 2) {
          filter.push(`CreateTime ge DateTime'${moment(this.CheckDateRange[0]).format('YYYY-MM-DD')}'`)
          filter.push(`CreateTime le DateTime'${moment(this.CheckDateRange[1]).add(1, 'day').format('YYYY-MM-DD')}'`)
          // timeFilter.push(
          //   `${moment(this.CheckDateRange[0]).format(
          //     "YYYY-MM-DDThh:mm:sss[Z]"
          //   )}`
          // );
          // timeFilter.push(
          //   `${moment(this.CheckDateRange[1]).format(
          //     "YYYY-MM-DDThh:mm:sss[Z]"
          //   )}`
          // );
        }
      }
      if (this.checkQuery.AccessionNo)
        filter.push(`(AccessionNo eq '${this.checkQuery.AccessionNo}') or startswith(AccessionNo,'${this.checkQuery.AccessionNo}')`)
      if (this.checkQuery.PatientId) filter.push(`(PatientId eq '${this.checkQuery.PatientId}') or startswith(PatientId,'${this.checkQuery.PatientId}')`)
      if (this.checkQuery.PatientSourceTypeCode)
        filter.push(
          `(PatientSourceTypeCode eq '${this.checkQuery.PatientSourceTypeCode}') or startswith(PatientSourceTypeCode,'${this.checkQuery.PatientSourceTypeCode}')`
        )
      if (this.checkQuery.selectedRadiographer)
        filter.push(
          `EmployeeNo eq '${this.checkQuery.selectedRadiographer}' or startswith(EmployeeNo,'${this.checkQuery.selectedRadiographer}')`
          // `(substringof('${this.checkQuery.selectedRadiographer}',tolower(EmployeeName)))`
          // `EmployeeName eq '${this.checkQuery.selectedRadiographer}'`,
          // `contains(EmployeeName,'${this.checkQuery.selectedRadiographer}')`
        )

      let $skip = pageIndex ? (pageIndex - 1) * pageCount : undefined

      let filterData = {
        // createTimeStart: timeFilter[0],
        // createTimeEnd: timeFilter[1],
        $skip,
        $top: pageCount,
        $filter: filter.join(' and '),
        $orderby: 'CreateTime desc',
      }

      let searchQuery = setSearchQuery(filterData)
      console.log(`searchQuery: `, searchQuery)

      return searchQuery
    },
    EditFailImageItem() {
      this.$refs['EditFailImageConetnt'].show()
    },
    HKWatch(event) {
      if (event.key === 'Enter') {
        this.getQueryBtn()
      }
    },
    clear() {
      this.ObjApp.WaitingShow()
      ;(this.checkQuery.AccessionNo = ''),
        (this.checkQuery.PatientId = ''),
        (this.CheckDateRange = ['', '']),
        (this.checkQuery.PatientSourceTypeCode = null),
        (this.checkQuery.selectedRadiographer = null),
        (this.BtnNo = 0)
      this.$refs['twp1'].OnForceRefresh()
      this.ObjApp.WaitingHide()
    },
    async getQueryBtn() {
      this.ObjApp.WaitingShow()
      this.BtnNo = 1
      this.$refs['twp1'].OnCancelAllSelects()
      this.$refs['twp1'].OnForceRefresh()
      this.ObjApp.WaitingHide()
    },
    async getFliterData(test, pageIndex, perpage) {
      //分類(0:不良, 1:重照)
      const typeDisplay = (data) => {
        switch (data) {
          case 0:
            return '不良'
          case 1:
            return '重照'
          default:
            return '不良'
        }
      }

      // 病患來源代碼 O-門診/I-住院/E-急診/H-健檢
      const patientSourceTypeCodeDisplay = (data) => {
        switch (data) {
          case 0:
            return '門診'
          case 'I':
            return '住院'
          case 'E':
            return '急診'
          case 'H':
            return '健檢'
          default:
            return '門診'
        }
      }

      this.ObjApp.WaitingShow()

      if (!pageIndex) {
        pageIndex = 0
        perpage = 10
      }

      this.pageI = pageIndex
      this.pageP = perpage

      try {
        let tempQuery = this.oDataQuery(pageIndex, perpage)
        const res = await getFailImageReasonList(tempQuery)

        if (res) {
          res.Items.forEach((x) => {
            x.CreateTime = x.CreateTime ? moment(x.CreateTime).format('YYYY/MM/DD-HH:mm:ss') : ''
            x.StudyTime = x.StudyTime ? moment(x.StudyTime).format('YYYY/MM/DD-HH:mm:ss') : ''
            x.IssueTime = x.IssueTime ? moment(x.IssueTime).format('YYYY/MM/DD-HH:mm:ss') : ''
            x.Type = x.Type !== null || x.Type !== undefined ? typeDisplay(x.Type) : ''
            x.PatientSourceTypeCode = x.PatientSourceTypeCode !== null || x.Type !== undefined ? patientSourceTypeCodeDisplay(x.PatientSourceTypeCode) : ''
            x.EmployeeCodeName = x.EmployeeCodeName ? `${x.EmployeeCodeName}${x.EmployeeName ? '-' + x.EmployeeName : ''}` : ''
          })
        }
        return res
      } catch (err) {
        return err
      } finally {
        this.ObjApp.WaitingHide()
      }
    },
    async GetOptionsPatientSource() {
      console.log(this.$logs())

      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]

      let subPath = '../GeneralData/SelectNoList?groupNo=PatientSource'

      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual
        })

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name }
        let excludeArr = ['T', 'U', 'Z']
        if (!excludeArr.includes(i.No)) {
          convertedCollections.push(collection)
        }
      })
      this.optionsPatientSource = convertedCollections
    },
    async GetOptionsRadiographer() {
      // const {
      //   actual: { Items },
      // } = await getEmployeeDataByType(35, false);
      // this.optionsRadiographer = Items.map(({ No, Name }) => ({
      //   text: `${No}-${Name}`,
      //   value: No,
      // }));
      // this.optionsRadiographer.unshift({ text: "請選擇", value: null });
      // // this.ChangeRadiographer();

      try {
        const { Items } = await getRadiographerCodeName()
        if (Items && Items.length) {
          Items.sort((a, b) => {
            return Number(a.CodeName) - Number(b.CodeName)
          })

          this.optionsRadiographer = Items.map(({ CodeName, EmployeeId, EmployeeName }) => ({
            text: `${CodeName}-${EmployeeName}`,
            value: EmployeeId,
          }))

          this.optionsRadiographer.unshift({ text: '請選擇', value: null })
        }
      } catch (err) {
        console.log(`error: `, err)
      }
    },
    async GetFailImageReport() {
      try {
        this.ObjApp.WaitingShow()

        let tempQuery = this.oDataQuery()

        const res = await getFailImageReasonReport(tempQuery)

        if (res && res.Url) {
          console.log(`res: `, res)
          this.toDownload(res.Url)
        }
      } catch (err) {
        console.log(`err: `, err)
      } finally {
        this.ObjApp.WaitingHide()
      }
    },
    toDownload(url) {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    // ChangeRadiographer() {
    //   this.SaveLocalStorage(0);
    //   this.dataStore.PerformRadiographerId =
    //     this.checkQuery.selectedRadiographer;
    // },
    // SaveLocalStorage(type) {
    //   let params = this.GetLocalStorage();
    //   if (type == 0) {
    //     params.PerformRadiographerId = this.checkQuery.selectedRadiographer
    //       ? this.checkQuery.selectedRadiographer
    //       : "";
    //   }
    //   localStorage.setItem("FI0310", JSON.stringify(params));
    // },
    // GetLocalStorage() {
    //   let params = JSON.parse(localStorage.getItem("FI0310"));
    //   if (params) {
    //     params.PerformRadiographerId =
    //       params.PerformRadiographerId && params.PerformRadiographerId != ""
    //         ? params.PerformRadiographerId
    //         : null;
    //   } else {
    //     params = {
    //       PerformRadiographerId: null,
    //     };
    //   }
    //   return params;
    // },
  },
  created() {
    let methodName = 'created'
    console.log(this.$logs(null, methodName))

    let obj = this.$GetApp(this)
    if (obj) {
      this.ObjApp = obj[0]
      this.VueNestLevel = obj[1]
    } else {
      console.log(this.$logs('Fail to get App.vue ref.', methodName))
    }

    window.addEventListener('keydown', this.HKWatch)

    this.GetOptionsPatientSource()
    this.GetOptionsRadiographer()

    setTimeout(() => {
      this.$nextTick(() => this.$refs['AccessionNo'].focus())
    }, 500)
  },
  destroyed() {
    console.log(`${this.$logs()}`)
    window.removeEventListener('keydown', this.HKWatch)
  },
  mounted() {
    console.log(this.$logs())

    this.$logs(`this.theProcedure: `, this.theProcedure)
  },
}
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
</style>
<style>
#OpenDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#OpenDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
#CheckDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#CheckDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
</style>
-

<style>
.fix-light .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>
