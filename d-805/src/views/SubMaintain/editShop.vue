<template>
  <div>
    <div class="d-flex justify-content-end mb-4">

    </div>

    <div class="d-flex mb-3 main-ipt">
      <b-input-group
        prepend="樣版名稱"
        class="mr-1"
      >
        <b-input v-model="localItems.reportTitle" />
      </b-input-group>
      <b-input-group
        prepend="樣版代號"
        class="ml-1"
      >
        <b-input
          ref="reportInput"
          v-model="localItems.reportId"
          :disabled="disableTemplateId"
        />
      </b-input-group>

      <b-input-group
        prepend="科別"
        class="ml-1"
      >
        <v-super-select
          placeholder="請選擇"
          v-model="localItems.institution"
          :items="institutions"
          noneFoundText="無此筆資料"
          style="z-index:1"
          class="w-100 bg-white"
        />
      </b-input-group>
    </div>

    <div class="d-flex">
      <div
        v-for="(row, rowIdx) in localItems.source"
        :key="'row' + rowIdx"
        class="sourceRow px-1 d-flex flex-wrap"
        :class="sizes.includes(row.width) ? row.width : ''"
        :style="!sizes.includes(row.width) ? `width: ${row.width}` : ''"
      >
        <!-- <div v-text="row" /> -->
        <div class="py-3 width-length d-flex justify-content-center align-items-center w-100">
          <b-form-input
            class="length-input mr-1"
            size="sm"
            autocomplete="on"
            :list="'list' + rowIdx"
            v-model="row.width"
          />
          <b-button
            style="padding: 1px 10px 2px;"
            variant="primary"
            size="sm"
            class="mr-1"
            @click="addItems(rowIdx)"
          >
            <font-awesome-icon icon="plus" />
          </b-button>
          <b-button
            style="padding: 1px 10px 2px;"
            variant="danger"
            size="sm"
            @click="removeRow(rowIdx)"
          >
            <font-awesome-icon icon="times" />
          </b-button>
        </div>
        <datalist :id="'list' + rowIdx">
          <option
            :key="size"
            v-for="size in sizes"
          >{{ size }}</option>
        </datalist>

        <tempGrid
          v-for="({ title, items, columns, tabs, createTime, secWdt = 100 }, idx) in row.itemRow"
          class="mb-2"
          :class="`w-${secWdt}`"
          :id="createTime"
          :key="rowIdx + '_' + idx + '_' + createTime"
          :cols="columns"
          :idx="idx"
          :rowIdx="rowIdx"
          :total="row.itemRow.length"
          :title="title"
          :tabs="tabs"
          :shouldPrinted="row.beingPrinted"
          v-on:updateColumns="updateCols"
          v-on:updateSectWidth="updateSecWdt"
          v-on:removeColumns="removeColumns"
          v-on:moveColumn="moveColumn"
          v-on:updateTitle="updateTitle"
          v-on:createTabs="createTabs"
          v-on:clearTabs="clearTabs"
          v-on:updateParentTabs="updateTabs"
          v-on:updatePrintedState="updatePrintedState"
          v-on:copySection="copySection(idx, row.itemRow)"
          v-on:completeSection="completeSection"
        >
          <template v-for="(item, j) in items">

            <tempItem
              :item="item"
              :spans="columns"
              :key="item.createTime + '' + item.isFinish"
              :pos="[rowIdx, idx, j]"
              :imageOptions="filterOptions"
              :usedKeys="usedKeys"
              v-if="!item.isFinish"
              v-on:updateSpecificItem="updateItem"
              v-on:removeColumn="removeColumn"
              v-on:changePosition="changePosition"
            />

            <finishItem
              :item="item"
              :spans="columns"
              :pos="[rowIdx, idx, j]"
              :key="item.createTime"
              :imageOptions="filterOptions"
              v-else
              v-on:updateSpecificItem="updateItem"
              v-on:removeColumn="removeColumn"
              v-on:copySpecificItem="copyItem"
            />
          </template>
          <div class="p-1">
            <b-button
              v-for="(opt, optIdx) in typeOpts"
              @click="addItem({ idx, rowIdx, type: opt.value })"
              size="sm"
              :key="optIdx"
              class="mr-1 mt-1"
            >
              {{ opt.text }}
            </b-button>

          </div>
        </tempGrid>
      </div>
    </div>
    <!-- <div v-text="localItems.source[0]" /> -->
    <!-- <div v-text="localItems.source.map(({itemRow})=>itemRow).flat().map(({items})=>items).flat().map(({key})=>key)" /> -->
    <b-modal
      v-model="isLeaving"
      title="離開編輯"
      cancel-title="取消"
      header-bg-variant="primary"
      header-text-variant="white"
      ok-title="確定"
      @ok="$emit('cancel')"
    >
      <p class="my-4">沒有儲存的部份可能會遺失</p>
    </b-modal>

    <b-modal
      v-model="showEnsureNewId"
      title="另存編輯"
      cancel-title="自訂ID"
      ok-title="確定"
      @ok="confirmSaveAnotherItems"
      @cancel="cancelSaveAnotherItems"
    >
      <p
        class="my-4"
        v-text='`使用"${this.newReportId}"嗎？`'
      />
    </b-modal>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import tempGrid from "./tempGrid";
import finishItem from "./finishItem";
import tempItem from "./tempItem";
import { saveCstData } from "@/assets/service/dataManager.js";
import scrollTo from "@/assets/js/scrollTo.js";
import VSuperSelect from "v-super-select";
import { sizes, typeOpts } from "@/assets/js/common.js";
export default {
  data () {
    return {
      typeOpts,
      localItems: null,
      disableTemplateId: true,
      defaultColumn: (type) => ({
        label: null,
        append: null,
        span: 1,
        key: null,
        type,
        value: "",
        isFinish: false,
        isReadOnly: false,
        createTime: new Date().getTime(),
      }),
      defaultRow: (row = []) => ({
        itemRow: row,
        width: "flex-1",
        beingPrinted: true,
        createTime: new Date().getTime(),
      }),
      tempList: [],
      isPreview: false,
      institutions: [],
      currentRow: 0,
      isLeaving: false,
      showEnsureNewId: false,
      newReportId: 0,
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
    usedTemps: {
      type: Array,
    }
  },
  methods: {
    completeSection ({ idx, rowIdx }) {
      this.localItems.source[rowIdx]["itemRow"][idx]['items'].forEach(item => {
        if (!item.isFinish) item.isFinish = true;
      });
    },
    changePosition ({ pos, newPos }) {
      const [rowIdx, secIdx, itemIdx] = pos;
      const _items = this.localItems.source[rowIdx]["itemRow"][secIdx]['items'];
      const newTime = new Date().getTime();
      _items[itemIdx].createTime = newTime;
      _items[newPos].createTime = newTime + 13;
      [_items[itemIdx], _items[newPos]] = [_items[newPos], _items[itemIdx]];
      this.localItems = { ...this.localItems };
    },
    copySection (index, itemRow) {
      const copiedRow = JSON.parse(JSON.stringify(itemRow[index]));
      copiedRow.createTime = new Date().getTime();
      copiedRow.items.forEach(item => {
        item.isFinish = false;
        if (item.key) {

          let newNum = ((parseInt(item.key.replace(/[^0-9]/g, '')) || 0) + 1) + '';
          let ori = item.key.replace(parseInt(newNum) - 1, '');
          item.key = ori + newNum;
        }
      });
      itemRow.splice(index + 1, 0, copiedRow);

      setTimeout(() => {
        scrollTo(document.getElementById(copiedRow.createTime));
      }, 200);

    },
    updatePrintedState ({ rowIdx, status }) {
      this.localItems.source[rowIdx]["beingPrinted"] = status;
    },
    removeRow (idx) {
      this.localItems.source.splice(idx, 1);
    },
    clearValue () {
      this.localItems.source.forEach(({ itemRow }) => {
        itemRow.forEach(({ items }) => {
          items.forEach((item) => {
            if (item.type === "multiple") {
              item.value = new Array(item.multiple.cls).fill(1).reduce((a, c, i) => ({ ...a, ["" + (i + c)]: "" }), {});
            } else if (item.type === "table") {
              item.value = {};
            } else {
              item.value = "";
            }
          });
        });
      });
    },
    addRow () {
      this.localItems.source.push(this.defaultRow());
    },
    addItems (idx) {
      // 新增大項
      if (this.localItems.source.length === 0) this.addRow();
      this.localItems.source[idx]["itemRow"].push({
        title: "",
        columns: 2,
        tabs: { key: "", name: "" },
        items: [],
        // createTime: new Date().getTime(),
        // this.defaultColumn(null)
      });
    },
    addItem ({ idx, rowIdx, type }) {
      this.localItems.source[rowIdx]["itemRow"][idx]["items"].push(this.defaultColumn(type));
    },
    copyItem ({ k0, k1, k2, item }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[k0]["itemRow"][k1]["items"].splice(k2, 0, item);
      this.localItems.source = tmpItems;
    },
    updateItem ({ k0, k1, k2, item }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[k0]["itemRow"][k1]["items"][k2] = item;
      this.localItems.source = tmpItems;
    },
    updateTitle ({ rowIdx, idx, title }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[rowIdx]["itemRow"][idx]["title"] = title;
      this.localItems.source = tmpItems;
    },
    updateSecWdt ({ rowIdx, idx, number }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[rowIdx]["itemRow"][idx]["secWdt"] = number;
      this.localItems.source = tmpItems;
    },
    updateCols ({ rowIdx, idx, number }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[rowIdx]["itemRow"][idx]["columns"] = number;
      this.localItems.source = tmpItems;
    },
    removeColumn ({ k0, k1, k2 }) {
      this.localItems.source[k0]["itemRow"][k1]["items"].splice(k2, 1);
    },
    removeColumns ({ current, rowIdx }) {
      this.localItems.source[rowIdx]["itemRow"].splice(current, 1);
    },
    moveColumn ({ swap, current, rowIdx }) {
      this.localItems.source[rowIdx]["itemRow"].splice(swap, 0, this.localItems.source[rowIdx]["itemRow"].splice(current, 1)[0]);
    },

    saveAnotherItems () {
      if (!this.checkColumnIsNotEmpty(this.localItems)) return;
      this.newReportId = parseInt(this.localItems.reportId) + 1;
      while (this.usedTemps.some(temp => parseInt(temp.reportId) === this.newReportId)) {
        this.newReportId += 1;
      }
      this.showEnsureNewId = true;
    },
    confirmSaveAnotherItems () {
      this.showEnsureNewId = false;
      this.localItems.reportId = this.newReportId;
      this.saveItems(true, true);
    },
    cancelSaveAnotherItems () {
      this.showEnsureNewId = false;
      this.disableTemplateId = false;
      setTimeout(() => {
        this.$refs.reportInput.$el.focus();
        this.$refs.reportInput.$el.select();
      }, 300);
    },
    saveItems (close = true, saveAnother = false) {

      if (!this.IsVersionsValid(saveAnother)) return;

      this.localItems.source.forEach((row) => {
        if (row["tabs"]) {
          delete row["tabs"];
        }
        if (!row.hasOwnProperty("beingPrinted")) {
          row["beingPrinted"] = true;
        }
        row.itemRow.forEach(row => delete row.createTime);
        row.itemRow.map(({ items }) => items).flat().forEach(item => delete item.createTime);   // 清除createTime 因為client不需要 移除讓code更少
      });
      saveCstData({
        CSTId: this.localItems.reportId,
        CSTName: this.localItems.reportTitle,
        InstitutionId: parseInt(this.localItems.institution),
        CSTVersion: this.$moment().format("YYYYMMDD.hhmmss"),
        StructureContent: JSON.stringify({ source: this.localItems.source }),
      }).then(() => {
        if (close) this.$emit("cancel");
        this.$emit("refresh");
      });
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
    clearTabs ({ idx, rowIdx }) {
      delete this.localItems.source[rowIdx]["itemRow"][idx]["tabs"];
    },
    createTabs ({ idx, rowIdx }) {
      this.localItems.source[rowIdx]["itemRow"][idx]["tabs"] = { key: "", name: "" };
      // this.saveItems(false);
    },
    updateTabs ({ tabs, idx, rowIdx }) {
      const tmpItems = [...this.localItems.source];
      tmpItems[rowIdx]["itemRow"][idx]["tabs"] = tabs;
      this.localItems.source = tmpItems;
      // this.localItems.source[idx]['tabs'] = tabs;
      // this.saveItems(false);
    },
    IsVersionsValid (saveAnother = false) {
      let flag = this.checkColumnIsNotEmpty(this.localItems);
      if (flag && saveAnother) {
        const { reportId, reportTitle, institution } = this.localItems;
        flag = !this.usedTemps.some((temp) => temp.reportId == reportId && temp.InstitutionId == institution);
        if (!flag) Swal.fire({
          position: "center",
          type: "error",
          title: "重覆的樣代號",
          showConfirmButton: false,
          timer: 1000
        });
      }
      return flag;
    },
    checkColumnIsNotEmpty ({ reportId, reportTitle, institution }) {
      const errors = [];
      if (!reportTitle) errors.push('名稱');
      if (!reportId) errors.push('代號');
      if (!institution) errors.push('科別');
      if (errors.length > 0) {
        Swal.fire({
          position: "center",
          type: "error",
          title: `未輸入樣版${errors.join(',')}`,
          showConfirmButton: false,
          timer: 1000
        });
        flag = false;
      }
      return errors.length === 0;
    }
  },
  components: { VSuperSelect, finishItem, tempGrid, tempItem },
  created () {
    this.institutions = this.insts;
    let markTime = new Date().getTime();
    this.items.source.map(({ itemRow }) => itemRow).flat().forEach(row => {
      row['createTime'] = (markTime += 1);
      row.items.forEach(item => item['createTime'] = (markTime += 1));
    });
    this.localItems = this.items;
    this.disableTemplateId = this.localItems.isOld;

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
    usedKeys () {
      return this.localItems.source.map(({ itemRow }) => itemRow).flat().map(({ items }) => items).flat().map(({ key }) => key);
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/ fieldset {
  border: none;
}
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
.width-length {
  position: relative;
  background: transparent
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAABAQMAAADHB02zAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFjIyMAAAAH4w5fAAAAAJ0Uk5T/wDltzBKAAAACklEQVR4nGPgAQAADgANC0koaQAAAABJRU5ErkJggg==")
    repeat-x left center;
  &::before,
  &::after {
    position: absolute;
    top: calc(50% + -7px);
    width: 0;
    height: 0;
    border-style: solid;

    content: "";
  }

  &::before {
    left: -1px;
    border-width: 7.5px 10px 7.5px 0;
    border-color: transparent #8c8c8c transparent transparent;
  }

  &::after {
    border-width: 7.5px 0 7.5px 10px;
    border-color: transparent transparent transparent #8c8c8c;
    right: -1px;
  }

  .length-input {
    width: 100px;
    z-index: 2;
  }
}
</style>
