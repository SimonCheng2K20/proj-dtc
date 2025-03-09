<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdDevice_filter"
      @filterClear="grdDevice_filterClear"
      @export="grdDevice_export"
      :locations="locations"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdDevice"
        :dataSource="dsDevice"
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
            field="No"
            :isPrimaryKey="true"
            headerText="檢查儀器代碼"
            width="160"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Name"
            headerText="檢查儀器名稱"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="RoomId"
            headerText="放置檢查室"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :dataSource="locations"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="TotalCount"
            headerText="檢查次數"
            width="120"
          ></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { GridPlugin, Page, Sort, Toolbar, Filter, Resize, ForeignKey, CommandColumn } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "@/library/Common";
import DateHelper from "@/library/DateHelper";
import FormHelper from "@/library/FormHelper";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsDevice: [],
      locations: [],
      pageSettings: { pageSizes: true, pageSize: 10 }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    grid: [Page, Sort, Toolbar, Filter, Resize, ForeignKey, CommandColumn]
  },
  components: {
    searchBar
  },
  methods: {
    grdDevice_export: function (e) {
      this.grdDevice_filter(e);
      new DataManager({
        url: configs.publicPath + "../device/WorkloadReport" + this.getUrlParams(e),
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
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") query = query.where("Name", "contains", e.Name);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("Name");
      if (e.Location != null) query = query.where("RoomId", "equal", e.Location);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("RoomId");

      return query;
    },
    getUrlParams: function (e) {
      let deviceWorkloadUrl = "";
      if (e.Tab === "day") {
        if (e.DateRange != null && e.DateRange.length == 2) {
          deviceWorkloadUrl = "?startDate=" + e.DateRange[0].toJSON() + "&endDate=" + e.DateRange[1].toJSON();
        }
      } else {
        let startDate = new Date(e.Year, 0, 1);
        deviceWorkloadUrl = "?isYear=true" + "&startDate=" + startDate.toJSON() + "&endDate=" + DateHelper.getYearLast(startDate).toJSON();
      }
      return deviceWorkloadUrl;
    },
    grdDevice_filter: function (e) {
      this.dsDevice = new DataManager({
        url: configs.publicPath + "../device/Workload" + this.getUrlParams(e),
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      });

      // //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdDevice.filterByColumn("No", "contains", e.No);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdDevice.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("Name");
      if (e.Location != null) this.$refs.grdDevice.filterByColumn("RoomId", "equal", e.Location);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("RoomId");
    },
    grdDevice_filterClear: function () {
      this.$refs.grdDevice.clearFiltering();
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  },
  created: function () {
    window.axios.get("/room/SelectList").then(e => {
      this.locations = e.Items;
    });
  }
};
</script>
