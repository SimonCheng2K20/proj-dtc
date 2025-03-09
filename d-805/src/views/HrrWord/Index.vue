<template>
  <div
    class="pageLeftContent pb-1"
    style="width: 100%;"
  >
    <searchBar
      :medicationTypes="medicationTypes"
      @filter="grdHrrWord_filter"
      @filterClear="grdHrrWord_filterClear"
      style="max-width: 700px; margin: 0 auto;"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdHrrWord"
        style="max-width: 700px; margin: 0 auto;"
        :dataSource="dsHrrWord"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :sortSettings="{ columns: [{ field: 'Word' }] }"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            width="160"
            :visible="false"
          ></e-column>
          <e-column
            field="Word"
            headerText="關鍵字"
            :validationRules="{ required: true }"
          ></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Swal from "sweetalert2";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsHrrWord: new DataManager({
        url: configs.publicPath + "../api/HrrWord",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      employees: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10,
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
      },
      toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
      filterSettings: { type: "Menu" },
      requiredRules: {
        required: true,
      },
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn],
  },
  components: {
    searchBar,
  },
  methods: {
    grdHrrWord_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.Word != "") this.$refs.grdHrrWord.filterByColumn("Word", "contains", e.Word);
      else this.$refs.grdHrrWord.ej2Instances.removeFilteredColsByField("Word");
    },
    grdHrrWord_filterClear: function () {
      this.$refs.grdHrrWord.clearFiltering();
    },
    actionComplete: function (args) {
      if (args.action == "edit" && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          showConfirmButton: false,
          timer: 400,
        });
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  },
};
</script>
<style></style>
