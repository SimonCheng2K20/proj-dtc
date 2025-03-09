<template>
  <div class="mb-2">
    <img
      class="mr-2"
      style="width: 23px; display: inline-block; margin-bottom: 5px"
      src="/assets/members-icon.png"
    />
    <span class="mr-3 font-bold mt-2" style="font-size: 17px"
      ><span class="mr-1">姓名:</span>{{ modalItemHistory.Patient.Name || "" }}</span
    >
    <span class="font-bold" style="font-size: 17px"
      ><span class="mr-1">身分證字號:</span>{{ modalItemHistory.Patient.Identifier || "" }}</span
    >
  </div>
  <tablecomponet
    :headers="headers"
    :items="items"
    :headerSize="16"
    columnstyle="grid-template-columns:  repeat(4, 1fr);"
    :rowsNum="10"
  ></tablecomponet>
</template>

<script>
import { computed, ref, reactive } from "vue";
import { getSheetLog } from "Service/apis.js";
import { useToast } from "vue-toastification";
import buildQuery from "odata-query";
import tablecomponet from "@/components/tablecomponent/table.vue";
export default {
  components: { tablecomponet },
  props: {
    modalItemHistory: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const item = ref({ ...props.modalItemHistory });
    const offset = ref(0);
    const rows = ref(1000);
    const totalItemsCount = ref(1);
    const orderByArr = ref([]);

    const toast = useToast();

    //for list
    const headers = ref([
      { name: "使用者", key: "AccountName" },
      { name: "事件名稱", key: "Action" },
      { name: "事件細項", key: "Detail" },
      { name: "事件時間", key: "time" },
    ]);

    const items = ref([]);

    //sort
    const getData = async () => {
      //odata3 qs
      const page = +offset.value / +rows.value + +1;
      const skip = (page - 1) * rows.value;
      const top = rows.value;
      const orderBy = orderByArr.value;
      const obj = { top, skip, orderBy };
      let qs = buildQuery(obj);
      let res = [];
      res = await getSheetLog(qs + "&" + "id=" + item.value.Id);
      res.data = res.data.map((s) => {
        s.time = s.CreateTime
          ? s.CreateTime.split("T")[0] + " " + s.CreateTime.split("T")[1]
          : "";
        return s;
      });

      res.data.sort((a, b) => {
        if (a.CreateTime < b.CreateTime) return 1;
        if (a.CreateTime > b.CreateTime) return -1;
      });

      items.value = res.data;
    };

    function sortData(item) {
      if (!item.key) {
        return;
      }
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      orderByArr.value = [];

      headers.value.forEach((s) => {
        if (s.sortDesc !== null) {
          orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      getData();
    }

    getData();
    return {
      item,

      getData, //for list data variable
      headers,
      items,
      toast,

      //list data Function
      sortData,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,
    };
  },
};
</script>

<style lang="scss" scoped>
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: column;
  text-align: center;
  // border-right: 0px;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 15px;
    padding: 4px 0;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    display: -webkit-box;
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: rgb(46, 45, 45);
  }
  > div:first-child {
    border-left: 2px solid #ffffff;
  }
  > .header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }
  > .content {
    padding: 6px;
    padding-top: 4px;
    height: 43px;
  }
}

.my-dark {
  > div {
    background: #e9e9e9;
    color: #2f3c62;
    font-weight: bolder;
  }
}
</style>
