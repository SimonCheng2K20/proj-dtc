<template>
  <div class="class-report-demo text-white">

    <div class="px-2 pt-4 pb-4">
      <h3
        class="text-center mb-3 py-2 px-4 bg-primary rounded d-table"
        v-text="reportTitle"
      />

      <patient-base
        v-if="patient"
        :patient="patient"
      />

      <template v-for="(secss, idx) in newSecs">
        <template v-if="secss.type==='nor'">
          <div
            class="bg-black rounded p-2 mb-4"
            v-for="sec in secss.items"
            :key="sec.createTime"
          >
            <sections :section="sec" />
          </div>
        </template>

        <b-tabs
          v-if="secss.type==='tab'"
          :key="idx"
          class="mb-3 bg-black p-2"
        >
          <b-tab
            :title="sec.tabs.key"
            v-for="sec in secss.items"
            :key="sec.createTime"
          >
            <sections :section="sec" />
          </b-tab>
        </b-tabs>

      </template>
      <div class="d-flex justify-content-center">
        <b-button
          class="mx-auto d-table px-5 mx-2 mt-1"
          pill
          variant="warning"
          @click="assembleData(false)"
        >確認</b-button>

        <b-button
          v-if="reportData"
          class="mx-auto d-table px-5 mx-2 mt-1"
          pill
          variant="info"
          @click="assembleData(true)"
        >另存</b-button>

        <b-button
          v-if="reportData"
          class="mx-auto d-table px-5 mx-2 mt-1"
          pill
          variant="primary"
          @click="$router.push('/sub/doc9')"
        >取消</b-button>
      </div>

    </div>
    <!-- <div v-text="secs" /> -->
    <div v-text="saveData" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import sections from './sections';
import bus from '@/assets/service/bus.js';
import patientBase from './patientBase.vue';
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
      patient: null
    }
  },
  computed: {
    ...mapState(['tempItemList', 'reportItemList']),
  },
  created () {

    if (this.$route.query.repotId != null) {
      this.reportData = this.reportItemList[this.$route.query.repotId]
      this.reportId = this.$route.query.repotId;
    }

    if (this.$store.state.patientData) {
      this.patient = this.$store.state.patientData;
      this.$store.unregisterModule('patientData');
    } else if (this.reportData) {
      this.patient = this.reportData.data.patient;
    }

    this.arrayIndex = this.$route.params.index;

    let { reportTitle, source } = this.arrayIndex === null || this.tempItemList.length === 0
      ? { reportTitle: '', source: [] }
      : Object.assign({}, this.tempItemList[this.arrayIndex]);


    this.reportTitle = reportTitle;
    source = JSON.parse(JSON.stringify(source));

    let reduceIdx = 0;
    this.newSecs = source.reduce((a, sec) => {
      sec.items.forEach(item => {

        if (this.reportData) {
          if (typeof this.reportData.data[item.key] === 'object') {
            item.value = { ...this.reportData.data[item.key] };
          } else {
            item.value = this.reportData.data[item.key];
          }
        } else {
          if (item.multiple) {
            item.value = new Array(item.multiple.cls).fill(1).reduce((a, c, i) => ({ ...a, ['' + (i + c)]: '' }), {});
          }
        }


      });

      if (a.length === 0) {
        a.push({ type: sec.tabs && sec.tabs.name ? 'tab' : 'nor', items: [sec] });
      } else {
        if (sec.tabs && sec.tabs.name && sec.tabs.name === a[reduceIdx].items[0].tabs.name) {
          a[reduceIdx].items.push(sec);
        } else if (sec.tabs && sec.tabs.name && sec.tabs.name != a[reduceIdx].items[0].tabs.name) { // sec 是tab 而上一個不是TAB
          reduceIdx++;
          a.push({ type: 'tab', items: [sec] });
        } else if ((!sec.tabs || !sec.tabs.name) && a[reduceIdx].items[0].tabs.name) {                  // SEC 不是tab 而上一個是tab
          reduceIdx++;
          a.push({ type: 'nor', items: [sec] });
        } else {
          a[reduceIdx].items.push(sec);
        }
      }
      return a;
    }, []);
    this.secs = source;
    bus.$on('updateItem', this.updateSpecificItem);
  },
  components: {
    sections, patientBase
  },
  methods: {
    ...mapMutations(['ADD_REPORTITEMS', 'UPDATE_REPORTITEMS']),
    updateSpecificItem ({ key, value, secTime }) {
      console.log(key, value, secTime);
      const sec = this.secs.find(({ createTime }) => createTime === secTime);
      sec.items.forEach(item => {
        if (item.key === key) item.value = value;
      });
    },
    assembleData (isAdd = false) {
      this.saveData = this.secs.map(({ items }) => items.reduce((a, item) => ({ ...a, [item.key]: item.value }), {}));
      this.saveData = this.saveData.reduce((a, c) => ({ ...a, ...c }), { patient: this.patient });
      if (!this.reportData || isAdd) { // update
        this.ADD_REPORTITEMS({ tempId: this.arrayIndex, tempName: this.reportTitle, createTime: new Date().getTime(), data: this.saveData });
      } else {              // add
        this.UPDATE_REPORTITEMS({ index: this.reportId, report: { tempId: this.arrayIndex, tempName: this.reportTitle, createTime: new Date().getTime(), data: this.saveData } });
      }
      this.$router.push({ path: '/sub/doc9' });
    }
  }
}
</script>

<style lang="scss">
.class-report-demo {
  padding-top: 56px;
  min-height: 100vh;
  background-color: #222;
}
</style>
