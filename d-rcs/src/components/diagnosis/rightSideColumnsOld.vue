<template>
  <!-- 暫時沒用到了 -->
  <div class="riside">
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
    <diagColCos
      :dataList="compDateList"
      v-model="compReactive"
      :sourceList="compSourceObjList.list"
      :nameObject="compSourceObjList.name"
    />
    <modalCps width="80vw" v-model="modalData" :showButtons="false" :showFooter="false">
      <diagColCos
        :dataList="compDateList"
        v-model="compReactive"
        :sourceList="compSourceObjList.long"
        :nameObject="compSourceObjList.name"
      />
    </modalCps>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import {
  cloudNameObject,
  tableSourceObjList,
  tableSourceLongObjList,
  electronicNameObject,
  elecTableSourceObjList,
  elecTableSourceLongObjList,
} from "./diagnosisSource.js";
import tableField from "comps/datafields/tables.vue";
import modalCps from "comps/modal.vue";
import diagColCos from "./diagColCos.vue";
export default {
  components: { tableField, modalCps, diagColCos },
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
    const compSourceObjList = computed(() => ({
      key: props.name,
      name: props.name === "electronic" ? electronicNameObject : cloudNameObject, // 物件名稱
      list: props.name === "electronic" ? elecTableSourceObjList : tableSourceObjList, // 右側的表格
      long:
        props.name === "electronic" ? elecTableSourceLongObjList : tableSourceLongObjList, // 展開的表格
    }));
    const compReactive = reactive({
      key: null,
      time: null,
      get keys() {
        return Object.keys(compSourceObjList.value.name);
      },
      get display() {
        return this.keys.filter((key) => !this.key || this.key === key);
      },
    });
    const modalData = ref({ show: false });
    const compDateList = ref([]);
    function emptyCompList() {
      compDateList.value = [];
    }
    function fetchCompList() {
      // compDateList.value = [];
      if (compSourceObjList.value.key === "electronic") {
      } else if (compSourceObjList.value.key === "cloud") {
        // console.log(props.itemData.data.cloud)
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
      compSourceObjList,
      tableSourceLongObjList,
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
