<template>
  <nav>
    <header>
      <span v-html="total">></span>
    </header>
    <section class="dtc-car12-grid" v-for="(item, i) in itemsArr" :key="i" :v-if="!showList">
      <b-input-group prepend="ID">
        <b-input v-model="item.id" />
      </b-input-group>

      <b-input-group prepend="Lesion" style="grid-column: 2/span 2">
        <b-input v-model="item.lesion" />
      </b-input-group>

      <b-input-group prepend="Site">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Pre-Stenosis">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Post-Stenosis">
        <b-input />
      </b-input-group>

      <b-input-group prepend="Guiding">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Wire">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Balloon">
        <b-input />
      </b-input-group>

      <b-input-group prepend="Ballon Bar">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Stent">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Success">
        <b-input />
      </b-input-group>
      <b-input-group :prepend="`${item.id} Comment`" style="grid-column: 1/-1" class="mb-2">
        <b-input />
      </b-input-group>
    </section>
  </nav>
</template>

<script>
const nums = ["<50%", "55%-100%"];
let preData, postData;
export default {
  data() {
    return {
      items: [],
      uid: 888,
      id: "",
      nums,
      preData,
      postData,
      heartPath: window.dtcHeartPath,
      segmentalWeightingFactors: window.segmentalWeightingFactors
    };
  },
  props: ["showList"],
  components: {},
  computed: {
    itemsArr() {
      const arr = [...this.items];
      arr.sort((a, b) => a.id.localeCompare(b.id));
      return arr;
    },
    total() {
      if (this.items.length) {
        const ids = this.itemsArr.map(s => s.id);
        const list = ids.join(" , ");
        const str = " ( " + list + " )";
        return `心臟電生理紀錄: 共${this.items.length}筆${str}`;
      } else {
        return "心臟電生理紀錄(暫無記錄)";
      }
    }
  },
  methods: {
    handleImgClick(msg) {
      alert(msg);
    },
    getLesion(id) {
      let value = "";
      let segmentId = id.substr(1);
      let sideCode = id.substr(0, 1) === "L";
      if (id) {
        const s = this.segmentalWeightingFactors.find(s => s.Segment === segmentId);
        value = `${sideCode ? "Left" : "Right"} - ${sideCode ? s.LeftFactor : s.RightFactor} - ${s.Name}`;
      }
      return value;
    },
    addRecord(id) {
      const obj = { id, lesion: this.getLesion(id) };
      this.items = [...this.items, obj];
    },
    removeRecord(id) {
      this.items = this.items.filter(s => s.id != id);
    }
  },
  beforeMount() {
    const obj = { id: "R1", lesion: "Right - 1 - RCA proximal" };
    const obj2 = { id: "R2", lesion: "Right - 1 - RCA mid" };
    const obj3 = { id: "R3", lesion: "Left - 0 - RCA distal" };
    this.items = [...this.items, obj, obj2, obj3];
    this.$root.$on("dtc-click-heart-img", msg => {
      const find = this.items.find(s => s.id == msg);
      if (!find) this.addRecord(msg);
      else this.removeRecord(msg);
    });
  }
};
</script>

<style lang="scss" scoped>
nav {
  overflow: auto;
  min-height: 483px;
}
.dtc-car12-grid {
  display: grid;
  background: var(--secondary);
  grid-template-columns: 43px 12px 210px repeat(6, 110px);
  grid-column-gap: 2px;
  padding-right: 2px;
  padding-left: 5px;
}
header {
  border-radius: 5px;
  margin-bottom: 5px;
  height: 24px;
  background: var(--primary);
  padding-left: 5px;
  font-size: 1rem;
  color: white;
  display: grid;
  line-height: 24px;
  grid-template-columns: 1fr;
}

.dtc-car12-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 12px;
  border: 1px solid white;
  border-radius: 5px;

  background: var(--gray-dark) !important;
  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 9px;
  }
}
</style>
