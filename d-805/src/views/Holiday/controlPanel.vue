<template>
  <div class="divide-func d-flex py-2">
    <!-- <treeselect
      :style="`width: ${treeWidth}px;`"
      id="employee-type-selection"
      v-model="chosenTypes"
      :multiple="true"
      :searchable="true"
      :options="employeeTypeList"
      @close="search"
    /> -->
    <!-- <b-button
      class="ml-1"
      variant="primary"
      @click.stop="search"
    >搜尋</b-button> -->
    <div class="datetime-func flex-1 d-flex justify-content-between align-items-center px-2">
      <div
        class="datetime-arrow left"
        @click.stop="dateTime.position--"
      />

      <b-form-group class="mb-0 text-white">
        <b-form-radio-group
          id="time-type"
          v-model="dateTime.type"
          :options="datetimeList"
          buttons
          name="time-type"
        />
      </b-form-group>

      <div
        class="datetime-arrow right"
        @click.stop="dateTime.position++"
      />
    </div>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getEmployeeTypeList, getEmployees } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
export default {
  data () {
    return {
      chosenTypes: [],
      employeeTypeList: [],
      datetimeList: [{ text: '日', value: 'day' }, { text: '週', value: 'week' }, { text: '月', value: 'month' }],
    }
  },
  props: {
    dateTime: {
      type: Object,
      required: true
    },
    treeWidth: {
      type: Number,
      default: 200
    }
  },
  created () {
    this.fetchEmployeeTypeList();
  },
  methods: {
    ...mapMutations(['SET_SIDE_MESSAGE', 'SHOW_LOADING', 'HIDE_LOADING']),
    fetchEmployeeTypeList () {
      getEmployeeTypeList().then(({ Items }) => {
        this.employeeTypeList = Items.map(({ No, Name }) => ({ id: No, label: Name }));
      })
    },
    async search () {
      if (!this.chosenTypes.length) {
        alert("NONE");
        return;
      }

      this.SHOW_LOADING();
      const params = [
        `$filter=(${this.chosenTypes.reduce((ac, cu) => ac.concat(`tolower(StaffType) eq '${cu}'`), []).join(' or ')})`,
        '$inlinecount=allpages',
      ];
      this.$emit('searchParams', params);
    }
  },
  components: {
    Treeselect
  }
}
</script>

<style lang="scss" scoped>
$arrowWdt: 10px;
$arrowHgt: 16px;
.datetime-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  cursor: pointer;
  &.left {
    border-width: $arrowWdt $arrowHgt $arrowWdt 0;
    border-color: transparent var(--themeTextColor) transparent transparent;
  }
  &.right {
    border-width: $arrowWdt 0 $arrowWdt $arrowHgt;
    border-color: transparent transparent transparent var(--themeTextColor);
  }
}
</style>

