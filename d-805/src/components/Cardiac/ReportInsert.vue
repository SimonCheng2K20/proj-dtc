<template>
  <div>
    <div class="report-content bg-light px-2 pt-1 pb-2 d-flex flex-wrap">
      <div
        v-for="(p, i) in reportData"
        :key="i"
        class="report-list rounded bg-primary text-light px-2 d-flex justify-content-between align-items-center mr-1 mt-1"
      >
        <span
          class="mr-2"
          v-text="p"
        />
        <b-icon-x-circle-fill
          class="icon cursor-pointer"
          @click="removeReport(p)"
        />
      </div>

      <div class="insertArea mt-1">
        <b-form-input
          :list="`list-${reportKey}`"
          @keyup.enter="addReport"
          v-model="reportInput"
        />
        <datalist :id="`list-${reportKey}`">
          <template v-if="isSub">
            <option
              v-for="(report,idx) in reportList.reduce((a,c)=> a.concat(c.options.map(opt=> c.label + ' ' + opt)) ,[])"
              :key="report + idx"
            >{{ report }}</option>
          </template>
          <template v-else>
            <option
              v-for="(report,idx) in reportList"
              :key="report + idx"
            >{{ report }}</option>
          </template>
        </datalist>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      reportInput: null
    }
  },
  model: {
    prop: 'reportData', 
    event: 'update'
  },
  props: {
    reportList: {
      type: Array,
      required: true
    },
    reportData: {
      type: Array
    },
    reportKey: {
      type: String,
      required: true
    },
    isSub: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addReport () {
      if (this.reportInput != null) {
        this.reportData.push(this.reportInput);
        setTimeout(() => {
          this.reportInput = null;
        }, 50);
      }
    },
    removeReport (p) {
      const reportIdx = this.reportData.findIndex(v => v === p);
      this.reportData.splice(reportIdx, 1);
    }
  },
  watch: {
    reportInput (value) {
      if (value && this.reportList.some(r => r === value)) this.addReport()
    }
  }
}
</script>

<style lang='scss' scoped>
.icon {
  transition: ease 0.125s transform;
  &:hover {
    transform: scale(1.25);
  }
}
.report-content {
  min-height: 50px;
  border-radius: 0 0 5px 5px;
}
.report-list {
  min-height: 38px;
}
.insertArea {
  flex: 1 0 300px;
}
</style>
