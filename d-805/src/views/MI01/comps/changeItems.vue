<template>
  <div>
    <changeItem
      v-for="(checkItem, idx) in localItems"
      :key="checkItem.value + '_' + idx"
      :item="checkItem"
      :itemIdx="idx"
      :modality="modality"
      v-on:removeItem="removeLocalItem"
    />
    <!-- <div v-text="otherProcedureCode" /> -->
    <!-- <div v-text="otherProcedure.map((p) => p.ProcedureCodeList)" /> -->
    <div class="mt-2 d-flex justify-content-between">
      <div class="my-2">
        <b-button
          class="ml-1"
          @click="changeCheckItems()"
          variant="primary"
        >確定變更</b-button>
        <b-button
          class="ml-1"
          @click="closeChangeWork"
        >取消</b-button>
      </div>
      <div class="mt-2">
        <b-button
          variant="primary"
          v-if="modality === 'CR'"
          class="ml-auto"
          @click="addItem"
        >新增</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import changeItem from "./changeItem.vue";
import { changeExamItem } from "@/assets/service/dataManager.js";
import Swal from "sweetalert2";
import { mapState } from "vuex";
export default {
  data () {
    return {
      localItems: [],
    };
  },
  props: {
    items: {
      type: Array,
    },
    modality: {
      type: String,
    },
    accessionNo: {
      type: Array,
    },
    otherProcedure: {
      type: Array,
    },
  },
  computed: {
    ...mapState(["procedureData"]),
    uniqleAccessionNo () {
      return Array.from(new Set(this.accessionNo));
    },
    optionsCheckItemList () {
      return localStorage["dtcOptionsCheckItem"] ? JSON.parse(localStorage["dtcOptionsCheckItem"]) : [];
    },
    otherProcedureCode () {
      const orderNos = Array.from(new Set(this.accessionNo.map(no => no.slice(0, -5))));
      const newProducs = this.otherProcedure && this.otherProcedure.length > 0
        ? this.otherProcedure.map((p) => {
          const procedureNoObj = p.ProcedureAccession.reduce((acc, cur) => ({ ...acc, [cur.text]: cur.value }), {});
          return p.ProcedureCodeList.map(({ text, value }) => ({ value, no: procedureNoObj[text] }));
        }).flat()
        : [];
      return newProducs.length > 0
        ? newProducs.filter(np => orderNos.some(no => no === np.no.slice(0, -5))).map(({ value }) => value)
        : [];

    },
  },
  components: {
    changeItem,
  },
  created () {
    this.localItems = [...this.items];
  },
  methods: {
    findKey (text) {
      let itemValue = '';
      if (this.procedureData) Object.values(this.procedureData.list).some((items) => items.some(item => {
        if (item.text === text) {
          itemValue = item.value
          return true;
        } else {
          return false;
        }
      }
      ))
      return itemValue;
    },
    removeLocalItem ({ item, itemIdx }) {
      // this.localItems = this.localItems.filter(({ text, value }) => item.text != text && item.value != value);

      // this.localItems = this.localItems.filter(({ text, value }, index) => item.text != text && item.value != value && index != itemIdx);

      this.localItems = this.localItems.filter((item, index) => index != itemIdx);

    },
    changeCheckItems () {
      const chosenItem = this.$children.map((child) => child.chosenItem).filter((val) => val);
      let ProcedureCodeList = Array.from(new Set(chosenItem));


      if (chosenItem.length !== ProcedureCodeList.length) {
        Swal.fire({
          title: "變更項目不得重覆:",
          text: "請替換其他項目",
          icon: "warning",
          confirmButtonText: "確定",
        }).then((result) => {
          console.log(result);
        });
        return;
      }

      if (ProcedureCodeList.length === 0 || !this.uniqleAccessionNo) return;
      if (this.otherProcedureCode.length > 0) {
        ProcedureCodeList = ProcedureCodeList.concat(this.otherProcedureCode);
        ProcedureCodeList = Array.from(new Set(ProcedureCodeList));
      }



      if (this.uniqleAccessionNo.length > 1 && !(ProcedureCodeList.length > this.uniqleAccessionNo.lengt)) {
        ProcedureCodeList.forEach((code, index) => {
          changeExamItem({ AccessionNo: this.uniqleAccessionNo[index], ProcedureCodeList: [code] }).then(() => {
            if (index === ProcedureCodeList.length - 1) this.$emit("completeChangeEvent", this.uniqleAccessionNo[index]);
            this.$children.forEach((ch) => ch.clearParams());
          });
        });
      } else {

        const AccessionNo = this.uniqleAccessionNo[0];
        // console.log({ AccessionNo, ProcedureCodeList });


        changeExamItem({ AccessionNo, ProcedureCodeList }).then(() => {
          this.$emit("completeChangeEvent", AccessionNo);
          this.$children.forEach((ch) => ch.clearParams());
        });
      }
    },
    closeChangeWork () {
      this.localItems = [...this.items];
      this.$emit("closeChangeEvent");
    },
    addItem () {
      this.localItems.push({ text: null, value: null, allowRemove: true });
    },
    filterCheckItem (key) {
      if (!key || !this.optionsCheckItemList) return false;
      let filterItem = {};
      this.optionsCheckItemList.some((item) => {
        if (item.text === key || item.value === key) {
          filterItem = { ...item };
          return true;
        } else {
          return false;
        }
      });
      return filterItem;
    },
  },
};
</script>
