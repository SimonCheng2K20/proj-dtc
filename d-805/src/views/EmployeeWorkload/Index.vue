<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdEmployee_filter"
      @filterClear="grdEmployee_filterClear"
      @export="grdEmployee_export"
      class="mb-1"
    ></searchBar>
    <ejs-grid
      ref="grdEmployee"
      :dataSource="dsEmployee"
      allowPaging="true"
      allowSorting="true"
      :allowTextWrap="true"
      :pageSettings="pageSettings"
      :allowFiltering="true"
      :allowResizing="true"
      :filterSettings="{ type: 'CheckBox' }"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column
          field="Id"
          :isPrimaryKey="true"
          headerText="ID"
          width="160"
          :visible="false"
          :allowSearching="false"
        ></e-column>
        <e-column
          field="No"
          type="string"
          :isPrimaryKey="true"
          headerText="員工編號"
          width="120"
          :validationRules="{ required: true }"
        ></e-column>
        <e-column
          field="Name"
          headerText="員工姓名"
          width="120"
          type="string"
          :validationRules="{ required: true }"
        ></e-column>
        <!-- <e-column field="StaffType" headerText="職務" width="120" foreignKeyValue="Name" foreignKeyField="No" :dataSource="staffTypes"></e-column> -->
        <e-column
          field="CR"
          headerText="CR"
          width="60"
        ></e-column>
        <e-column
          field="CT"
          headerText="CT"
          width="60"
        ></e-column>
        <e-column
          field="ES"
          headerText="ES"
          width="60"
        ></e-column>
        <e-column
          field="MG"
          headerText="MG"
          width="60"
        ></e-column>
        <e-column
          field="MR"
          headerText="MR"
          width="60"
        ></e-column>
        <e-column
          field="OT"
          headerText="OT"
          width="60"
        ></e-column>
        <e-column
          field="RF"
          headerText="RF"
          width="60"
        ></e-column>
        <e-column
          field="US"
          headerText="US"
          width="60"
        ></e-column>
        <e-column
          field="XA"
          headerText="XA"
          width="60"
        ></e-column>
        <e-column
          field="TotalCount"
          headerText="處理件數"
          width="120"
        ></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
//CR	CT	ES	MG	MR	OT	RF	US	XA

import Vue from "vue";
import { mapGetters } from "vuex";
import { GridPlugin, Page, Sort, Filter, Resize, ForeignKey } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";
import DateHelper from "../../library/DateHelper";
import FormHelper from "@/library/FormHelper";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsEmployee: [],
      staffTypes: [],
      staffStatusType: [],
      pageSettings: { pageSizes: true, pageSize: 10 }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
  ,
  provide: {
    grid: [Page, Sort, Filter, Resize, ForeignKey]
  },
  components: {
    searchBar
  },
  methods: {
    grdEmployee_export: function (e) {
      this.grdEmployee_filter(e);
      new DataManager({
        url: configs.publicPath + "../employee/RadiologistWorkloadReport" + this.getUrlParams(e),
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(this.getQuery(e))
        .then(r => {
          FormHelper.downloadFile(r.result.Url);
        });
    },
    getQuery: function (e) {
      let query = new Query();
      if (e.No != "") query = query.where("No", "contains", e.No);
      if (e.Name != "") query = query.where("Name", "contains", e.Name);

      // if (e.StaffType != null) query = query.where("StaffType", "equal", e.StaffType);

      // if (e.StaffStatus != null) query = query.where("StaffStatus", "equal", e.StaffStatus);

      return query;
    },
    getUrlParams: function (e) {
      let stassWorkloadUrl;
      if (e.Tab === "day") {
        if (e.DateRange != null && e.DateRange.length == 2) {
          stassWorkloadUrl = "?startDate=" + e.DateRange[0].toJSON() + "&endDate=" + e.DateRange[1].toJSON();
        }
      } else {
        let startDate = new Date(e.Year, 0, 1);
        stassWorkloadUrl = "?startDate=" + startDate.toJSON() + "&endDate=" + DateHelper.getYearLast(startDate).toJSON();
      }
      return stassWorkloadUrl;
    },
    grdEmployee_filter: function (e) {
      this.dsEmployee = new DataManager({
        url: configs.publicPath + "../employee/RadiologistWorkload" + this.getUrlParams(e),
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      });

      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdEmployee.filterByColumn("No", "contains", e.No);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("No");

      if (e.Name != "") this.$refs.grdEmployee.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("Name");

      if (e.StaffType != null) this.$refs.grdEmployee.filterByColumn("StaffType", "equal", e.StaffType);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffType");

      if (e.StaffStatus != null) this.$refs.grdEmployee.filterByColumn("StaffStatus", "equal", e.StaffStatus);
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField("StaffStatus");
    },
    grdEmployee_filterClear: function (e) {
      this.$refs.grdEmployee.clearFiltering();
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  }
};
</script>
