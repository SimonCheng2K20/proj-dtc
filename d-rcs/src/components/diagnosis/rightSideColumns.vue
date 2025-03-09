<template>
  <!-- 暫時沒用到了 -->
  <div class="riside overflow-auto">
    <h4 class="riside-title">
      {{ title }}
      <div class="ml-4">
        <Button
          class="p-button-white p-button-sm"
          style="padding: 0 15px; line-height: 2"
          @click.stop="showTableListAllEvent"
          >展開</Button
        >
      </div>
    </h4>
    <combocols
      ref="comboComps"
      :key="name"
      v-model="compReactive"
      :dataList="compDateList"
    />
    <modalCps width="80vw" v-model="modalData" :showButtons="false" :showFooter="false">
      <combocols
        :key="name + compReactive.display.length"
        v-model="compReactive"
        :dataList="compDateList"
        :showWholeColumn="true"
      />
    </modalCps>
  </div>
</template>

<script>
import { ref, reactive, nextTick } from "vue";
import {
  cloudNameObject,
  tableSourceObjList,
  hisNameObject,
  hisDisplayNameObject,
  tableSourceLongObjList,
  electronicNameObject,
  elecTableSourceObjList,
  elecTableSourceLongObjList,
  hisTableSourceObjList,
  hisTableSourceLongObjList,
} from "./diagnosisSource.js";
import tableField from "comps/datafields/tables.vue";
import modalCps from "comps/modal.vue";
import diagColCos from "./diagColCos.vue";
import combocols from "./combocols.vue";
export default {
  components: { tableField, modalCps, diagColCos, combocols },
  props: {
    itemData: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const comboComps = ref();
    const compReactive = reactive({
      key: null,
      time: null, // 選擇的category的key
      propsKey: props.name,
      get list() {
        // 左欄的清單
        const [normal, long] =
          this.propsKey === "electronic"
            ? [elecTableSourceObjList, elecTableSourceLongObjList]
            : this.propsKey === "his"
            ? [hisTableSourceObjList, hisTableSourceLongObjList]
            : [tableSourceObjList, tableSourceLongObjList];
        return { normal, long };
      },
      get keyName() {
        // 物件名稱
        return props.name === "his"
          ? hisDisplayNameObject
          : props.name === "electronic"
          ? electronicNameObject
          : props.name === "cloud"
          ? cloudNameObject
          : {};
      },
      get keys() {
        // 需要呈現的category
        return Object.keys(this.list.normal);
      },
      get display() {
        // 需要呈現的項目 需端藥醫
        return ["his", "electronic"].includes(props.name) || this.key === null // his 跟 電子病歷要全秀出來
          ? this.keys
          : this.keys.filter((key) => !this.key || this.key === key);
      },
    });
    const modalData = ref({ show: false });
    const compDateList = ref({});

    function emptyCompList() {
      compDateList.value = {};
    }

    function fetchCompList() {
      emptyCompList();
      compReactive.propsKey = props.name;
      compReactive.key = null;
      compReactive.time = null;
      if (["his", "cloud", "electronic"].includes(props.name)) {
        // 在formal index.vue 收集起來的資料
        compDateList.value = props.itemData.data[props.name] || {};
        nextTick(() => {
          if (props.name !== "cloud") comboComps.value.initialKeyAndTime();
        });
      }
    }

    function showTableListAllEvent() {
      modalData.value.title = "健保署雲端藥歷";
      modalData.value.show = true;
    }

    fetchCompList();
    return {
      compDateList,
      modalData,
      compReactive,
      tableSourceObjList,
      tableSourceLongObjList,
      comboComps,
      showTableListAllEvent,
      fetchCompList,
      emptyCompList,
    };
  },
};
</script>
<style lang="scss" scoped>
.riside {
  @apply flex flex-col;
  .riside-title {
    @apply flex items-center justify-between;
    margin-top: 0;
  }
}
</style>
