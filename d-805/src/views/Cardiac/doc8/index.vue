<template>
  <div class="base-top cardiac" :style="`--mainColor: ${color.main}; --secColor: ${color.sec}; --thirColor: ${color.thir}`">

    <color-title title="病患基本資料與術前評估 Patient profile and pre-operative evaluation" :bgc="color.main" />
    <profile ref="profileComp" />
    <!-- <div v-text="profileValue" /> -->

    <color-title title="報告撰寫 Report" :bgc="color.main" />
    <report ref="reportComp" @savingEvent="saveCompsData" />
    <!-- <div v-text="reportValue" /> -->

    <color-title title="⾎⾏動⼒學評估 Hemodynamic Measurement" :bgc="color.main" class="w-40" />
    <hemodynamic ref="hemodynamicComp" :procedure="procedureValue" />
    <!-- <div v-text="hemodynamicValue" /> -->

    <color-title title="冠狀動⾎管造影 Coronary angiography (CAG) result" :bgc="color.main" class="w-40" />
    <coronary ref="coronaryComp" />
    <!-- <div v-text="coronaryValue" /> -->

    <template v-if="coronaryValue && coronaryValue.intervention">
      <color-title title="冠狀動脈⾎管整形術報告 Percutaneous coronary intervention (PCI) report" :bgc="color.main" class="w-50" />
      <percutaneous ref="percutaneousComp" />
      <!-- <div v-text="percutaneousValue" /> -->
    </template>
    
    <funcBtns ref="btns" @savingEvent="saveCompsData" class="d-flex align-items-center justify-content-end px-1 py-2 flex-1" />
  </div>
</template>

<script>
import profile from "./comps/profile.vue";
import report from "./comps/report.vue";
import hemodynamic from "./comps/hemodynamic.vue";
import coronary from "./comps/coronary";
import percutaneous from "./comps/percutaneous.vue";
import funcBtns from "./comps/funcBtns.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      color: {
        main: '#C9E6FF',
        sec: '#D6EFF9',
        thir: '#78BCFF'
      },
      isMounted: false,
      windowWidth: window.innerWidth,
    };
  },
  components: { profile, report, hemodynamic, coronary, percutaneous, funcBtns },
  methods: {
    ...mapActions(["action_getPhrase"]),
    saveCompsData() {
      console.log({
        profile: this.profileValue,
        report: this.reportValue,
        hemodynamic: this.hemodynamicValue,
        coronary: this.coronaryValue,
        percutaneous: this.percutaneousValue
      });
    },
    onResize() {
      this.windowWidth = window.innerWidth
    }
  },
  created() {
    if(!this.gPrivatePhrase.length) this.action_getPhrase();
  },
  mounted() {
    this.isMounted = true;
    // Array.from(document.querySelectorAll("select")).
    //   forEach(el=>{
    //     el.addEventListener("keydown", (e)=>{
    //       e.click()
    //     })
    //   })
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize); 
  },
  computed: {
    ...mapGetters(['gPrivatePhrase', 'gPublicPhrase']),
    procedureValue() {
      return !this.isMounted
        ? null
        : this.$refs.reportComp.report.cagPci.procedure.value;
    },
    profileValue() {
      return !this.isMounted
        ? null
        : this.$refs.profileComp.profileData;
    },
    reportValue() {
      return !this.isMounted
        ? null
        : this.$refs.reportComp.report;
    },
    hemodynamicValue() {
      return !this.isMounted
        ? null
        : this.$refs.hemodynamicComp.hemodynamicData;
    },
    coronaryValue() {
      return !this.isMounted
        ? null
        : this.$refs.coronaryComp.coronaryData;
    },
    percutaneousValue() {
      return !this.isMounted
        ? null
        : this.$refs.percutaneousComp
          ? this.$refs.percutaneousComp.percutaneousData
          : null;
    },
    isMiner1280 () {
      return this.windowWidth <= 1280;
    }
  }
};
</script>

<style lang="scss" scoped>
div.lightTheme, div.darkTheme {
   div.cardiac {
    background-color: #fff;
    color: #111;
    /deep/ label.custom-control-label {
      color: #111 !important;
    }
    /deep/ .input-group-text { 
      background-color: var(--secColor); 
      color: #111;
    }
  }
} 

/deep/ div.textarea-title {
  background-color: var(--mainColor);
  color: #111;
  border: 1px solid #ccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  line-height: 2;
  padding: 0 10px;
}

</style>

<style>
.half-transparent {
  opacity: 0.5;
}
.unit-text {
  font-size: 12px;
  color: #999;
}
</style>
