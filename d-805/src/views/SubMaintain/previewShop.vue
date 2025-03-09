<template>
  <div>
    <!-- <div class="d-flex justify-content-end mb-4">
      <b-button
        class="mr-1 d-table px-3"
        pill
        variant="primary"
        @click="$emit('editItem')"
      >取消預覽</b-button>
      <b-button
        class="mr-1 d-table px-3"
        pill
        variant="primary"
        @click="isLeaving = true"
      >關閉</b-button>
    </div> -->
    <div class="d-flex mb-3 main-ipt">
      <b-input-group
        prepend="樣版名稱"
        class="mr-1"
      >
        <b-input
          :disabled="true"
          v-model="localItems.reportTitle"
        />
      </b-input-group>
      <b-input-group
        prepend="樣版代號"
        class="ml-1"
      >
        <b-input
          :disabled="true"
          v-model="localItems.reportId"
        />
      </b-input-group>

      <b-input-group
        prepend="科別"
        class="ml-1"
      >
        <b-input
          :disabled="true"
          :value="localItems.institution && institutions ? institutions.find((ins) => ins.value === localItems.institution).text : ''"
        />
      </b-input-group>
    </div>

    <report :cstObject="localItems.source" />

    <!-- <div class="d-flex">
      <div
        v-for="(row, rowIdx) in localItems.source"
        :key="'row' + rowIdx"
        class="sourceRow px-1"
        :class="sizes.includes(row.width) ? row.width : ''"
        :style="!sizes.includes(row.width) ? `width: ${row.width}` : ''"
      >
        <tempGrid
          class="p-2 mb-3 rounded bg-black"
          v-for="({ title, items, columns, createTime, tabs }, idx) in row.itemRow"
          :key="createTime"
          :cols="columns"
          :title="title"
        >
          <template v-for="(item, j) in items">
            <finishItem
              :isPreview="true"
              :item="item"
              :pos="[idx, j]"
              :key="'item' + idx + '_' + j + '_' + item.createTime"
              :imageOptions="filterOptions"
              v-on:updateSpecificItem="updateItem"
              v-on:removeColumn="removeColumn"
            />
          </template>
        </tempGrid>
      </div>
    </div> -->

    <b-modal
      v-model="isLeaving"
      title="離開編輯"
      cancel-title="取消"
      ok-title="確定"
      header-bg-variant="primary"
      header-text-variant="white"
      @ok="$emit('cancel')"
    >
      <p class="my-4">沒有儲存的部份可能會遺失</p>
    </b-modal>
    <!-- <div v-text="localItems"></div> -->
  </div>
</template>
<script>
// import tempGrid from "./tempGrid";
import tempGrid from "@/components/template/tempGrid.vue";
import finishItem from "./finishItem";
import tempItem from "./tempItem";
import { saveCstData } from "@/assets/service/dataManager.js";
import VSuperSelect from "v-super-select";
import { sizes } from "@/assets/js/common.js";
import report from "@/components/report";
export default {
  data () {
    return {
      isLeaving: false,
      localItems: null,
      defaultColumn: () => ({
        label: null,
        append: null,
        span: 1,
        key: null,
        type: null,
        value: "",
        isFinish: false,
        isReadOnly: false,
        createTime: new Date().getTime(),
      }),
      tempList: [],
      isPreview: false,
      institutions: [],
      sizes,
    };
  },
  props: {
    items: {
      type: Object,
    },
    insts: {
      type: Array,
    },
  },
  methods: {
    addItem (idx) {
      this.localItems.source[idx]["items"].push(this.defaultColumn());
    },
    updateItem ({ k1, k2, item }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[k1]["items"][k2] = item;
      this.localItems.source = tmpItems;
    },
    updateTitle ({ idx, title }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[idx]["title"] = title;
      this.localItems.source = tmpItems;
    },
    updateCols ({ idx, number }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[idx]["columns"] = number;
      this.localItems.source = tmpItems;
    },
    removeColumn ({ k1, k2 }) {
      this.localItems.source[k1]["items"].splice(k2, 1);
    },
    removeColumns (idx) {
      this.localItems.source.splice(idx, 1);
    },
    moveColumn ({ swap, current }) {
      this.localItems.source.splice(swap, 0, this.localItems.source.splice(current, 1)[0]);
    },
    saveAnotherItems () {
      if (this.tempList.some(({ reportId }) => this.localItems.reportId.trim() === reportId)) {
        alert("重覆的版本代號");
        return;
      }
      this.saveItems(true);
    },
    saveItems (close = true) {
      saveCstData({
        CSTId: this.localItems.reportId,
        CSTName: this.localItems.reportTitle,
        InstitutionId: parseInt(this.localItems.institution),
        CSTVersion: this.$moment().format("YYYYMMDD.hhmmss"),
        StructureContent: JSON.stringify({ source: this.localItems.source }),
      }).then(() => {
        this.$emit("cancel");
        this.$emit("refresh");
      });
      if (close) this.localItems = this.oldIdx = null;
    },
    fillItems (secs) {
      this.localItems = {
        reportTitle: secs["reportTitle"] || "none",
        reportId: secs["reportId"] || "",
        institution: secs["InstitutionId"] || "",
        CSTVersion: secs["CSTVersion"],
        source: JSON.parse(JSON.stringify(secs.source)),
      };
    },
    createTabs (idx) {
      this.localItems.source[idx]["tabs"] = { key: "", name: "" };
      this.saveItems(false);
    },
    updateTabs ({ tabs, idx }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[idx]["tabs"] = tabs;
      this.localItems.source = tmpItems;
      // this.localItems.source[idx]['tabs'] = tabs;
      this.saveItems(false);
    }
  },
  components: { VSuperSelect, finishItem, tempGrid, report },
  created () {
    this.institutions = this.insts;
    this.localItems = this.items;
  },
  computed: {
    filterOptions () {
      return this.localItems.source.length === 0
        ? []
        : this.localItems.source.reduce(
          (a1, { itemRow }) =>
            a1.concat(
              itemRow
                .map(({ items }) => items)
                .flat()
                .filter(({ type }) => type === "imgcheckbox")
            ),
          []
        );
    },
  },
};
</script>
<style lang="scss" scoped>
.class-report {
  padding-top: 56px;
  min-height: 100vh;
}
.temp-list {
  > div {
    border-bottom: 1px solid var(--dark);
    &:nth-last-child(1) {
      border-bottom-width: 0;
    }
  }
}
.main-ipt {
  /deep/ .super-select-container {
    height: 38px;
  }
  /deep/ .super-select-input {
    padding: 5px 10px;
    height: 38px;
  }
}
</style>
