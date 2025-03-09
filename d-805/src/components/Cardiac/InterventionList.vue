<template>
  <nav>
    <header>
      <div>ID</div>
      <div></div>
      <div>Lesion</div>
      <div>Site</div>
      <div>Pre-Stenosis</div>
      <div>Post-Stenosis</div>
      <div>Guiding</div>
      <div>Wire</div>
      <div>Ballon</div>
      <div>Ballon Bar</div>
      <div>Stent</div>
      <div>Success</div>
      <div>Comment</div>
    </header>

    <section class="dtc-car14-grid" v-for="(item, i) in itemsArr" :key="i"></section>
  </nav>
</template>

<script>
import DtcHeartImg from "./DtcImgClick";
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
        return `共${this.items.length}筆${str}`;
      } else {
        return "";
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
      const find = this.items.find(s => s.id == id);
      if (!find) {
        const obj = { id, lesion: this.getLesion(id) };
        this.items = [...this.items, obj];
      }
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
    //this.$root.$on("dtc-click-heart-img", msg => this.addRecord(msg));
  }
};
</script>

<style lang="scss" scoped>
nav {
  overflow: auto;
  min-height: 483px;
}
header,
.dtc-car12-grid {
  display: grid;
  background: var(--secondary);
  grid-template-columns: 90px 43px 12px 210px repeat(6, 110px);
  grid-column-gap: 2px;
  padding-right: 2px;
  padding-left: 5px;
}
header {
  margin-bottom: 5px;
}
.header {
  background: var(--secondary);
  border: none;
}
.dtc-car13-grid {
  //grid-column-templete: 30px 12px repeat(10, 120px) 1fr;
  margin-bottom: 12px;
  border: 1px solid white;
  border-radius: 5px;

  background: var(--pink) !important;
  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 9px;
  }
}
</style>
