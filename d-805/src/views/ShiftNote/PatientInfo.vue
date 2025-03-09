<template>
  <div>
    <div class="patient-grid grid-col-7">
      <b-input-group
        class="gray-theme"
        size="sm"
        v-for="col in infoColumns"
        :key="col.key"
        :prepend="col.label"
      >
        <b-input
          readonly="true"
          v-model="patient[col.key]"
        />
      </b-input-group>
    </div>
    <b-row class="mx-0">
      <b-col cols="4" class="px-1">
        <card-frame title="主訴" style="border: none; background-color: #fff !important;" :theme="{bg: 'secondary', color: 'black'}">
          {{patient.Subjective}}
        </card-frame>
      </b-col>
      <b-col cols="4" class="px-1">
        <card-frame title="客訴" style="border: none; background-color: #fff !important;" :theme="{bg: 'secondary', color: 'black'}">
          {{patient.Objective}}
        </card-frame>
      </b-col>
      <b-col cols="4">
        <card-frame title="ICD-10" style="border: none; background-color: #fff !important;" :theme="{bg: 'secondary', color: 'black'}">
          {{icdTen}}
        </card-frame>
        
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { tableConfig4QueryResult } from "./TableFields.js";

export default {
  data () {
    return {
      tableConfigs: tableConfig4QueryResult
    }
  },
  props: {
    patient: {
      type: Object,
      required: true
    },
    icdTen: {
      type: String,
      default: ''
    }
  },
  computed: {
    infoColumns () {
      return this.tableConfigs.filter(({ label }) => label !== '操作');
    }
  }
}
</script>

<style lang="scss" scoped>
.patient-grid {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 3px;
}

/deep/.card .card-body {
  height: 100px;
  overflow-y: auto;
  text-align: left;
}
</style>
