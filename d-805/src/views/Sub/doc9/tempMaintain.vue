<template>
  <div
    class="class-report"
    style="background-color: #111;"
  >
    <div class="p-2">
      <h3 class="text-white">TEMPLATE REPORT</h3>
      <template v-if="wholeItems">
        <div class="d-flex mb-3">
          <b-input-group
            prepend="TITLE"
            class="mr-1"
          >
            <b-input v-model="wholeItems.reportTitle" />
          </b-input-group>
          <b-input-group
            prepend="ID"
            class="ml-1"
          >
            <b-input v-model="wholeItems.reportId" />
          </b-input-group>
        </div>

        <tempGrid
          class="p-2 mb-3 rounded bg-black"
          v-for="({ title, items, columns, createTime, tabs }, idx) in wholeItems.source"
          :key="createTime"
          :cols="columns"
          :idx="idx"
          :total="wholeItems.length"
          :title="title"
          :tabs="tabs"
          v-on:updateColumns="updateCols"
          v-on:removeColumns="removeColumns"
          v-on:moveColumn="moveColumn"
          v-on:updateTitle="updateTitle"
          v-on:createTabs="createTabs"
          v-on:updateParentTabs="updateTabs"
        >
          <template v-for="(item, j) in items">
            <tempItem
              :item="item"
              :spans="columns"
              :key="'item' + idx + '_' + j + '_' + item.createTime"
              :pos="[idx, j]"
              v-if="!item.isFinish"
              v-on:updateSpecificItem="updateItem"
              v-on:removeColumn="removeColumn"
            />
            <finishItem
              :item="item"
              :pos="[idx, j]"
              :key="'item' + idx + '_' + j + '_' + item.createTime"
              v-else
              v-on:updateSpecificItem="updateItem"
              v-on:removeColumn="removeColumn"
            />
          </template>
          <div class="p-1">
            <b-button @click="addItem(idx)">
              <font-awesome-icon icon="plus" />
            </b-button>
          </div>
        </tempGrid>
      </template>

      <div
        v-if="wholeItems"
        class="d-flex justify-content-center mt-3 pb-5 mb-5"
      >

        <b-button
          class="mx-auto d-table px-5 mx-2"
          pill
          variant="info"
          @click="clearValue"
        >清除資料</b-button>

        <b-button
          class="mx-auto d-table px-5 mx-2"
          pill
          variant="info"
          @click="addItems"
        >新增欄位</b-button>

        <b-button
          v-if="wholeItems.source.length > 0"
          class="mx-auto d-table px-5 mx-2"
          pill
          variant="info"
          @click="saveItems(false)"
        >保存編輯</b-button>

        <b-button
          v-if="wholeItems.source.length > 0 && oldIdx!= null"
          class="mx-auto d-table px-5 mx-2"
          pill
          variant="info"
          @click="saveAnotherItems"
        >另存編輯</b-button>

        <b-button
          class="mx-auto d-table px-5 mx-2"
          pill
          variant="info"
          @click="() => {wholeItems=oldIdx=null;}"
        >取消</b-button>

      </div>
      <!-- <div
        style="color: #eee;"
        v-text="wholeItems"
      /> -->

      <template v-if="!wholeItems">
        <h4 class="text-center">範本</h4>
        <div class="border border-dark my-2 rounded px-1 temp-list">
          <div
            class="d-flex align-items-center"
            v-for="(store, idx) in tempList"
            :key="'store' + idx"
          >
            <div
              class="text-white px-2"
              style="flex: 1 0 0;"
              v-text="store.reportTitle || 'none'"
            />
            <!-- <b-button
              class="my-1 mr-1"
              variant="primary"
              @click="$router.push({path: '/sub/doc/demo/' + idx})"
            >操作</b-button> -->
            <b-button
              @click="editSecs(store, idx)"
              class="my-1 mr-1"
            >編輯</b-button>
            <b-button
              variant="danger"
              @click="deleteSecs(idx)"
              class="my-1"
            >刪除</b-button>
          </div>

          <div
            class="d-flex align-items-center"
            v-if="!wholeItems"
          >
            <div
              class="text-white px-2"
              style="flex: 1 0 0;"
              v-text="'新項目'"
            />
            <b-button
              @click="wholeItems = {reportTitle: '', source: []}"
              class="my-1"
            >新增</b-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import tempGrid from "./tempGrid";
import finishItem from "./finishItem";
import tempItem from "./tempItem";
import { mapMutations, mapState } from "vuex";
import { saveCstData, getCstList } from "@/assets/service/dataManager.js";
export default {
  data () {
    return {
      wholeItems: null,
      defaultColumn: () => ({ label: null, append: null, span: 1, key: null, type: null, value: "", isFinish: false, isReadOnly: false, createTime: new Date().getTime() }),
      tempList: []
    };
  },
  methods: {
    ...mapMutations(["ADD_TEMPITEMS", "CLEAR_TEMPITEMS", "DELETE_TEMPITEMS", "UPDATE_TEMPITEMS", "DELETE_REPORTITEMS"]),
    clearValue () {
      this.wholeItems.source.forEach(({ items }) => items.forEach(item => {     // 清除值以免上傳上去
        item.value = '';
      }));
    },
    addItems () {
      // 新增大項
      this.wholeItems.source.push({
        title: "",
        columns: 2,
        tabs: { key: '', name: '' },
        items: [this.defaultColumn()],
        createTime: new Date().getTime(),
        oldIdx: null
      });
    },
    addItem (idx) {
      this.wholeItems.source[idx]["items"].push(this.defaultColumn());
    },
    updateItem ({ k1, k2, item }) {
      const tmpItems = [...this.wholeItems.source];
      tmpItems[k1]["items"][k2] = item;
      this.wholeItems.source = tmpItems;
    },
    updateTitle ({ idx, title }) {
      const tmpItems = [...this.wholeItems.source];
      tmpItems[idx]["title"] = title;
      this.wholeItems.source = tmpItems;
    },
    updateCols ({ idx, number }) {
      const tmpItems = [...this.wholeItems.source];
      tmpItems[idx]['columns'] = number;
      this.wholeItems.source = tmpItems;
    },
    removeColumn ({ k1, k2 }) {
      this.wholeItems.source[k1]["items"].splice(k2, 1);
    },
    removeColumns (idx) {
      this.wholeItems.source.splice(idx, 1);
    },
    moveColumn ({ swap, current }) {
      this.wholeItems.source.splice(swap, 0, this.wholeItems.source.splice(current, 1)[0]);
    },
    saveAnotherItems () {
      saveCstData({
        CSTId: this.wholeItems.reportId,
        CSTName: this.wholeItems.reportTitle,
        CSTVersion: this.$moment().format("YYYYMMDD.hhmmss"),
        StructureContent: JSON.stringify(this.wholeItems)
      }).then(() => {
        this.wholeItems = this.oldIdx = null;
      })
    },
    saveItems (close = true) {
      if (this.oldIdx != null) {
        // this.wholeItems.source.forEach(({ items }) => items.forEach(item => {     // 清除值以免上傳上去
        //   item.value = '';
        // }));
        this.UPDATE_TEMPITEMS({ index: this.oldIdx, report: { ...this.wholeItems } });

        saveCstData({
          CSTId: this.wholeItems.reportId,
          CSTName: this.wholeItems.reportTitle,
          CSTVersion: this.$moment().format("YYYYMMDD.hhmmss"),
          StructureContent: JSON.stringify(this.wholeItems)
        }).then(e => {
          this.wholeItems = this.oldIdx = null;
        })

      } else {


        saveCstData({
          CSTId: this.wholeItems.reportId,
          CSTName: this.wholeItems.reportTitle,
          CSTVersion: this.$moment().format("YYYYMMDD.hhmmss"),
          StructureContent: JSON.stringify(this.wholeItems)
        }).then(e => {
          console.log(e);
          console.log("----access----");
          this.wholeItems = this.oldIdx = null;
        })
      }
      if (close) this.wholeItems = this.oldIdx = null;
    },
    editSecs (secs, idx) {
      this.oldIdx = idx;
      this.wholeItems = {
        reportTitle: secs['reportTitle'] || 'none',
        reportId: secs['reportId'] || '',
        source: JSON.parse(JSON.stringify(secs.source))
      };
      // this.wholeItems['reportTitle'] = 'new';
      // this.wholeItems['source'] = JSON.parse(JSON.stringify(secs));
      // this.wholeItems = secs;
    },
    deleteSecs (idx) {
      this.DELETE_TEMPITEMS(idx);
    },
    createTabs (idx) {
      this.wholeItems.source[idx]['tabs'] = { key: '', name: '' };
      this.saveItems(false);
    },
    updateTabs ({ tabs, idx }) {
      const tmpItems = [...this.wholeItems.source];
      tmpItems[idx]["tabs"] = tabs;
      this.wholeItems.source = tmpItems;
      // this.wholeItems.source[idx]['tabs'] = tabs;
      this.saveItems(false);
    }
  },
  computed: {
    ...mapState(["tempItemList", "reportItemList"])
  },
  components: { finishItem, tempGrid, tempItem },
  created () {
    getCstList().then(res => {
      this.tempList = res.filter(({ CSTId }) => CSTId.includes('3345')).map(item => JSON.parse(item.StructureContent));
    });
  }
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
</style>
