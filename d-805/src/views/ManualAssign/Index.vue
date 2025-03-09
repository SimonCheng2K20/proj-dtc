<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdLab_filter"
      @filterClear="grdLab_filterClear"
      :employeeNos="employeeNos"
      :totalRows="rows"
      :patientSourceTypeCodeList="patientSourceTypeCodeList"
      :modalityList="modalityList"
      :gridRef="$refs.grdLab"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdLab"
        v-on:click.native="clickedGrid"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :dataSource="dsLab"
        :pageSettings="pageSettings"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
      >
        <e-columns>
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            :visible="false"
          ></e-column>
          <e-column
            field="DxreportPhysicianId"
            :visible="false"
          ></e-column>
          <e-column
            type="checkbox"
            field="IsChecked"
            width="50"
            textAlign="Center"
            :allowFiltering="false"
            :allowResizing="false"
          ></e-column>
          <e-column
            field="StatusName"
            headerText="作業階段"
            width="78"
            :allowSorting="false"
          ></e-column>
          <e-column
            field="AccessionNo"
            headerText="申請單號"
            width="180"
          ></e-column>
          <e-column
            field="PatientName"
            headerText="病患姓名"
            width="100"
            :allowSorting="false"
          ></e-column>
          <e-column
            field="OtherPatientId"
            headerText="身分證字號"
            width="120"
          ></e-column>
          <e-column
            field="PatientId"
            headerText="病歷號"
            width="120"
          ></e-column>

          <e-column
            field="ProcedureCode"
            :isPrimaryKey="true"
            headerText="檢查項目院內代碼"
            width="180"
          ></e-column>
          <e-column
            field="ProcedureName"
            headerText="檢查項目名稱"
            :allowSorting="false"
          ></e-column>
          <e-column
            field="PatientSourceTypeCode"
            :visible="false"
          ></e-column>
          <e-column
            field="StudyTime"
            headerText="影像到位時間"
            :allowSearching="false"
            :format="{ type: 'dateTime', format: 'yyyy/MM/dd HH:mm' }"
            width="150"
          ></e-column>
          <e-column
            field="PatientSourceTypeName"
            headerText="病患來源"
            :allowSorting="false"
            width="100"
          ></e-column>
          <e-column
            field="Modality"
            headerText="儀器類別"
            width="100"
          ></e-column>
          <e-column
            field="DxreportPhysicianName"
            headerText="分派醫師"
            width="100"
            :allowSorting="false"
          ></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { hideSpinner } from '@syncfusion/ej2-popups';
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, ForeignKey, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";
import { getOptionsDispatchDoctors, getEmployeeDataByType } from "@/assets/service/dataManager.js";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      rows: 0,
      approvalList: [],
      checkCategories: [],
      employeeNos: [],
      dsLab: new DataManager({
        url: configs.publicPath + "../exam/List?status=36,51,56",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      modalityList: [],
      patientSourceTypeCodeList: [],
      pageSettings: {
        pageSizes: [10, 20, 50, 100, 200, 500],
        pageSize: 10,
      },
      numericParams: {
        params: {
          validateDecimalOnType: true,
          decimals: 0,
          format: "N",
        },
      },
      sortSettings: {
        columns: [{ field: "No" }],
      },
    };
  },
  computed: {
    ...mapGetters(["getThemeColors", "getDxDrs"]),
  },
  provide: {
    grid: [Page, Sort, Filter, Resize, CommandColumn, DetailRow, ForeignKey],
  },
  components: {
    searchBar,
  },
  methods: {
    clickedGrid () {
      requestAnimationFrame(() => {
        this.rows = this.$refs.grdLab.getSelectedRecords().length;
      });
    },
    grdLab_filter (e) {
      var urlParam = "?status=36,51,56";
      if(e.IncludeRelease)
        urlParam += ",71"

      if (e.PatientName != "") urlParam += "&patientName=" + e.PatientName;
      if (e.StartTime != null) urlParam += "&studyTimeStart=" + e.StartTime.toJSON();
      if (e.EndTime != null) urlParam += "&studyTimeEnd=" + e.EndTime.toJSON();

      let grdLab = this.$refs.grdLab.ej2Instances;
      grdLab.dataSource.dataSource.url = configs.publicPath + "../exam/List" + urlParam;
      grdLab.filterSettings.columns = [];
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.OtherPatientId != "") this.$refs.grdLab.filterByColumn("OtherPatientId", "contains", e.OtherPatientId);
      if (e.PatientId != "") this.$refs.grdLab.filterByColumn("PatientId", "contains", e.PatientId);
      if (e.AccessionNo != "") this.$refs.grdLab.filterByColumn("AccessionNo", "contains", e.AccessionNo);
      if (e.ProcedureCode != "") this.$refs.grdLab.filterByColumn("ProcedureCode", "contains", e.ProcedureCode);
      // if (e.DxreportPhysicianId != null) this.$refs.grdLab.filterByColumn("DxreportPhysicianId", "equal", e.DxreportPhysicianId);
      if (e.DxreportPhysicianId != null)
        this.$refs.grdLab.filterByColumn("DxreportPhysicianId", "equal", e.DxreportPhysicianId !== "none" ? e.DxreportPhysicianId : null);
      if (e.Modality != null) this.$refs.grdLab.filterByColumn("Modality", "equal", e.Modality);
      if (e.PatientSourceTypeCode != null) this.$refs.grdLab.filterByColumn("PatientSourceTypeCode", "equal", e.PatientSourceTypeCode);
    },
    grdLab_filterClear () {
      this.grdLab_filter({
        OtherPatientId: "",
        PatientId: "",
        PatientName: "",
        AccessionNo: "",
        ProcedureCode: "",
        DateRange: null,
        DxreportPhysicianId: null,
      });
    },
    actionFailure (args) {
      Common.actionFailure(args);
    },
    actionComplete() {
      hideSpinner(document.getElementById('searchBar'));
    }
  },

  created () {
    let _this = this;
    getOptionsDispatchDoctors().then(({ result }) => {
      _this.employeeNos = [{ Name: "未指派", No: "none" }].concat(result);
    });

    if (this.getDxDrs.length === 0) {  // 
      getEmployeeDataByType("21,23,25,27,28,29").then(({ result }) => {
        this.SET_DX_DR(result);
        this.employeeNos = [{ Name: "未指派", No: "none" }].concat(result);
      });
    } else {
      this.employeeNos = [{ Name: "未指派", No: "none" }].concat(this.getDxDrs);
    }

    window.axios.get("/checkCategory/SelectList?isAll=true").then((e) => {
      _this.checkCategories = e.Items;
    });
    window.axios.get("/exam/GetModalityNoList").then((e) => {
      _this.modalityList = e;
    });
    window.axios.get("/GeneralData/SelectNoList?groupNo=PatientSource").then((e) => {
      if (e != null) {
        _this.patientSourceTypeCodeList = e.Items;
      }
    });
  },
  mounted () {
    this.grdLab_filter({
      OtherPatientId: "",
      PatientId: "",
      PatientName: "",
      AccessionNo: "",
      ProcedureCode: "",
      DateRange: null,
      DxreportPhysicianId: null,
    });
  },
};
</script>
