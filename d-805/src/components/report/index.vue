<template>
  <div class="class-report-demo">
    <div class="d-flex">
      <div
        v-for="(row, rowIdx) in newSecs"
        :key="'row' + rowIdx"
        class="sourceRow px-1 d-flex flex-wrap"
        :class="sizes.includes(row.width) ? row.width : '' + (!row.beingPrinted ? ' noPrint' : '')"
        :style="!sizes.includes(row.width) ? `width: ${row.width}` : ''"
      >
        <template v-for="(secss, idx) in row.itemRow">
          <template v-if="secss.type === 'nor'">
            <div
              v-for="(sec,secIdx) in secss.items"
              class="rounded p-1 mb-1"
              :class="`w-${sec.secWdt ? sec.secWdt:100}`"
              :key="sec.createTime"
            >
              <sections
                :section="sec"
                :pos="[rowIdx, secIdx]"
                :imageOptions="filterOptions"
              />
            </div>
          </template>
          <b-tabs
            v-if="secss.type === 'tab'"
            v-model="secss.active"
            :key="idx"
            class="mb-3 p-2"
          >
            <b-tab
              :title="sec.tabs.key"
              v-for="sec in secss.items"
              :key="sec.createTime"
              @click="tabChange({ rowIdx, key: sec.tabs.key, name: sec.tabs.name, secss})"
            >
              <sections
                :section="sec"
                :pos="[rowIdx, idx]"
                :imageOptions="filterOptions"
              />
            </b-tab>
          </b-tabs>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import sections from "./sections";
// import bus from "@/assets/service/bus.js";
import BusFactory from "@/assets/js/busFactory.js";
import { sizes } from "@/assets/js/common.js";
import { typeOpts } from "@/assets/js/common.js";
export default {
  data () {
    return {
      arrayIndex: null,
      secs: null,
      newSecs: null,
      reportTitle: null,
      saveData: null,
      reportData: null,
      reportId: null,
      patient: null,
      isNewVersion: false,
      sizes,
      busFactory: BusFactory(this)
    };
  },
  props: {
    cstContent: {
      type: String,
    },
    cstData: {
      type: String,
    },
    cstObject: {
      type: Array,
    },
    title: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  computed: {
    ...mapState(["tempItemList", "reportItemList"]),
    filterOptions () {
      return !this.secs || this.secs.length === 0
        ? []
        : this.secs.reduce(
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
  created () {
    if (this.cstContent) {
      this.convert2Parse();
    }
    if (this.cstObject) this.collectSections(this.cstObject);
    this.busFactory.$on("updateItem", this.updateSpecificItem);
  },
  components: { sections },
  methods: {
    ...mapMutations(["ADD_REPORTITEMS", "UPDATE_REPORTITEMS"]),
    tabChange ({ rowIdx, key, name }) {

      this.$emit('updateCstSecTab', { rowIdx, key, name });
      // setTimeout(() => {
      // this.secs[rowIdx]['itemRow'].filter(row => row.tabs && row.tabs['name'] === name).forEach((item) => {
      //   if (item.tabs['show'] && item.tabs[key] !== key) {
      //     delete item.tabs['show'];
      //   } else if (item.tabs['key'] === key) {
      //     item.tabs['show'] = true;
      //   }
      // });

      // }, 100);
    },
    updateSpecificItem ({ item: { key, value }, pos }) {

      this.secs[pos[0]]['itemRow'].map(({ items }) => items).flat().forEach((item) => {
        if (key === item.key) item.value = value;
      });
    },
    assembleData (isAdd = false) {
      this.saveData = this.secs.map(({ items }) => items.reduce((a, item) => ({ ...a, [item.key]: item.value }), {}));
      this.saveData = this.saveData.reduce((a, c) => ({ ...a, ...c }), { patient: this.patient });
      if (!this.reportData || isAdd) {
        // update
        this.ADD_REPORTITEMS({ tempId: this.arrayIndex, tempName: this.reportTitle, createTime: new Date().getTime(), data: this.saveData });
      } else {
        // add
        this.UPDATE_REPORTITEMS({
          index: this.reportId,
          report: { tempId: this.arrayIndex, tempName: this.reportTitle, createTime: new Date().getTime(), data: this.saveData },
        });
      }
      this.$router.push({ path: "/sub/doc9" });
    },
    collectSections (source) {
      this.newSecs = [];
      source.forEach((secs) => {
        let reduceIdx = 0;
        let newIdx = 0;
        const newSec = secs["itemRow"].reduce((a, sec, idx) => {
          if (a.length === 0) {
            a.push({ type: sec.tabs && sec.tabs.name ? "tab" : "nor", items: [sec] });
          } else {
            if (sec.tabs && sec.tabs.name && a[reduceIdx].items[0].tabs && sec.tabs.name === a[reduceIdx].items[0].tabs.name) {
              newIdx += 1;
              a[reduceIdx].items.push(sec);
              if (sec.tabs['show']) a[reduceIdx].active = newIdx;
            } else if (sec.tabs && sec.tabs.name && (!a[reduceIdx].items[0].tabs || sec.tabs.name != a[reduceIdx].items[0].tabs.name)) {
              // sec 是tab 而上一個不是TAB
              reduceIdx++;
              newIdx = 0;
              a.push({ type: "tab", items: [sec], active: 0 });
            } else if ((!sec || !sec.tabs || !sec.tabs.name) && (a[reduceIdx].items[0].tabs && a[reduceIdx].items[0].tabs.name)) {
              // SEC 不是tab 而上一個是tab
              reduceIdx++;
              newIdx += 1;
              a.push({ type: "nor", items: [sec] });
            } else {
              a[reduceIdx].items.push(sec);
            }
          }
          return a;
        }, []);
        this.newSecs.push({ width: secs["width"], itemRow: newSec, beingPrinted: secs["beingPrinted"] });
      });
      this.secs = source;
    },
    convert2Parse () {
      this.reportTitle = this.title;
      this.reportId = this.id;
      let { source } = JSON.parse(this.cstContent);
      if (this.cstData && this.cstData != undefined) {
        const value = JSON.parse(this.cstData);
        if (Object.keys(value).length > 0) {
          source.forEach(({ itemRow }) => {
            itemRow
              .map((row) => row.items)
              .flat()
              .forEach((item) => {
                if (item.type === "multiple" && !value[item.key]) {
                  item.value = new Array(item.multiple.cls).fill().reduce((a, c, i) => ({ ...a, [i + 1]: "" }), {});
                } else {
                  if (typeOpts.some(({ value }) => item.type === value)) item.value = value[item.key];
                }
              });
          });
        }
      }
      this.collectSections(source);
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ .input-group-prepend .input-group-text {
  min-width: 45px;
}
</style>
