<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdAuditEvent_filter"
      @filterClear="grdAuditEvent_filterClear"
      :auditEventTypes="auditEventTypes"
      class="mb-1"
    />
    <ejs-grid
      ref="grdAuditEvent"
      :dataSource="dsAuditEvent"
      allowPaging="true"
      allowSorting="true"
      :sortSettings="sortSettings"
      :allowTextWrap="true"
      :pageSettings="pageSettings"
      :allowFiltering="true"
      :allowResizing="true"
        :detailTemplate="DetailLog"
      :filterSettings="{ type: 'CheckBox' }"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column
          field="Id"
          :isPrimaryKey="true"
          :visible="false"
        ></e-column>
        <e-column
          field="CreateTime"
          headerText="記錄時間"
          headerTextAlign="center"
          :allowSearching="false"
          :format="{ type: 'dateTime', format: 'yyyy/MM/dd HH:mm:ss' }"
          width="180"
        ></e-column>
        <e-column
          field="EventType"
          headerText="記錄類型"
          width="110"
          type="number"
          foreignKeyValue="Name"
          foreignKeyField="Id"
          :dataSource="auditEventTypes"
        ></e-column>
        <e-column
          field="Account"
          type="string"
          headerText="使用者"
          width="120"
        ></e-column>
        <e-column
          field="AccountName"
          type="string"
          headerText="使用者姓名"
          width="120"
        ></e-column>
        <e-column
          field="HostAddress"
          headerText="用戶端IP"
          width="140"
          type="string"
        ></e-column>
        <e-column
          field="ProcessStack"
          headerText="執行動作"
          width="200"
          type="string"
        ></e-column>
        <e-column
          field="Data"
          :visible="false"
          width="200"
          type="string"
        ></e-column>
        <e-column
          field="Key"
          headerText="資料主代碼"
          width="160"
          type="string"
        ></e-column>
        <!-- <e-column field="DataType" headerText="資料類別" type="string"></e-column> -->
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { GridPlugin, Page, ForeignKey, Sort, Filter, Resize, DetailRow } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { Tooltip } from "@syncfusion/ej2-popups";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "@/library/Common";
import DetailLog from "./DetailLog";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsAuditEvent: new DataManager({
        url: configs.publicPath + "../AuditEvent/List",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      auditEventTypes: [],
      sortSettings: { columns: [{ field: "CreateTime", direction: "Descending" }] },
      pageSettings: { pageSizes: true, pageSize: 10 },
      DetailLog: function() {
        return { template: DetailLog };
      }
    };
  },
  provide: {
    grid: [Page, Sort, ForeignKey, Filter, Resize, DetailRow]
  },
  components: {
    searchBar
  },
  methods: {
    grdAuditEvent_filter(e) {
      var url = "";
      if (e.CreateTime) {
        url += "?startTime=" + e.CreateTime[0].toJSON() + "&endTime=" + e.CreateTime[1].toJSON();
      }
      if (e.Data != ""){
        url += (url == "" ? "?" : "&") + "data=";
        url += e.Data;
      }

      this.dsAuditEvent = new DataManager({
        url: configs.publicPath + "../AuditEvent/List" + url,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      });
      if (e.EventType) this.$refs.grdAuditEvent.filterByColumn("EventType", "equal", e.EventType);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("EventType");
      if (e.Account != "") this.$refs.grdAuditEvent.filterByColumn("Account", "contains", e.Account);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("Account");
      if (e.AccountName != "") this.$refs.grdAuditEvent.filterByColumn("AccountName", "contains", e.AccountName);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("AccountName");
      if (e.HostAddress != "") this.$refs.grdAuditEvent.filterByColumn("HostAddress", "contains", e.HostAddress);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("HostAddress");
      if (e.ProcessStack != "") this.$refs.grdAuditEvent.filterByColumn("ProcessStack", "contains", e.ProcessStack);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("ProcessStack");
      if (e.Key != "") this.$refs.grdAuditEvent.filterByColumn("Key", "contains", e.Key);
      else this.$refs.grdAuditEvent.ej2Instances.removeFilteredColsByField("Key");
    },
    grdAuditEvent_filterClear() {
      this.$refs.grdAuditEvent.clearFiltering();
    },
    actionFailure(args) {
      Common.actionFailure(args);
    }
  },
  created() {
    let _this = this;
    window.axios.get("/AuditEvent/AuditEventTypes").then(e => {
      if (e != null) {
        _this.auditEventTypes = e;
      }
    });
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
};
</script>
