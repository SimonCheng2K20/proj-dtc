<template>
  <div class="mb-2 py-1 change-item border rounded position-relative">
    <!-- v-if="item['allowRemove']" -->
    <div
      class="position-absolute cursor-pointer"
      style="right: 5px; top: 0; font-size: 21px;"
      @click.stop="$emit('removeItem', {item, itemIdx})"
    >
      <font-awesome-icon icon="times-circle" />
    </div>
    <b-form-group label="選擇類別">
      <b-form-radio-group
        v-model="chosen"
        :options="mainOptions"
      />
    </b-form-group>

    <b-form-group
      label="更換項目"
      v-if="filterItems.length > 0"
    >
      <b-form-radio-group
        v-model="chosenItem"
        :options="filterItems"
      />
    </b-form-group>
    <div
      class="text-center py-1"
      v-else
    >暫無項目可供更換，請重新選擇類別</div>
  </div>
</template>

<script>
// import bus from '@/assets/service/bus.js';
import { getModalityProcedureListById, getModalityGategoryByType } from "@/assets/service/dataManager.js";
import { mapState, mapMutations } from "vuex";
export default {
  data () {
    return {
      chosenClass: 0,
      chosenItem: "",
      mainOptions: {},
    };
  },
  props: {
    item: {
      type: Object,
    },
    itemIdx: {
      type: Number,
    },
    modality: {
      type: String,
    },
  },
  created () {
    this.kind = this.modality;
  },
  methods: {
    ...mapMutations(["updateProcedureData"]),
    findTypeList () {
      const allPromise = [];
      this.mainOptions.forEach((option) => {
        if (!this.procedureData.list[option.value] && option.value) {
          allPromise.push(
            new Promise((resolve, reject) => {
              getModalityProcedureListById(option.value).then(({ Items }) => {
                const sortedItem = Items.sort((a, b) => (a.No > b.No ? 1 : a.No < b.No ? -1 : 0));
                this.updateProcedureData({ type: "list", key: option.value, list: sortedItem.map(({ No, Name }) => ({ text: Name, value: No })) });
                resolve(true);
              });
            })
          );
        }
      });
      return allPromise;
    },
    pickupItem () {
      Promise.all(this.findTypeList()).then(() => {
        let rightItem = "";
        setTimeout(() => {
          Object.keys(this.procedureData.list).some((index) => {
            const isFound = this.procedureData.list[index].some(({ text, value }) => {
              //  && this.item.value === value
              const citem = this.item.text === text;
              if (citem) {
                rightItem = value;
              }
              return citem;
            });

            if (isFound) {
              this.chosenClass = index;
              setTimeout(() => {
                this.chosenItem = rightItem;
              }, 100);
            }
            return isFound;
          });
        }, 1000);
      });
    },
    clearParams () {
      this.chosenClass = 0;
      this.chosenItem = null;
    },
  },
  computed: {
    ...mapState(["procedureData"]),
    filterItems () {
      return !this.chosenClass || !this.procedureData.list[this.chosenClass]
        ? []
        : this.chosenClass && this.procedureData.list[this.chosenClass].length > 0
          ? [...this.procedureData.list[this.chosenClass]]
          : [];
    },
    chosen: {
      set (value) {
        if (!this.procedureData.list[value]) {
          if (value) {
            getModalityProcedureListById(value).then(({ Items }) => {
              const sortedItem = Items.sort((a, b) => (a.No > b.No ? 1 : a.No < b.No ? -1 : 0));
              this.updateProcedureData({
                type: "list",
                key: value,
                list: sortedItem.map(({ No, Name }) => ({ text: Name + No, value: No })),
              });
              this.chosenClass = value;
            });
          }
        } else {
          this.chosenClass = value;
        }
        this.chosenItem = null;
      },
      get () {
        return this.chosenClass;
      },
    },
    kind: {
      get () {
        return this.mainOptions;
      },
      set (value) {
        if (!this.procedureData.class[value]) {
          getModalityGategoryByType(value).then(({ Items }) => {
            this.updateProcedureData({ type: "class", key: value, list: Items.map(({ Id, Name }) => ({ text: Name, value: Id })) });
            this.mainOptions = this.procedureData.class[value];
          });
        } else {
          this.mainOptions = this.procedureData.class[value];
        }
      },
    },
  },
  watch: {
    mainOptions (val) {
      if (Object.keys(val).length > 0) {
        // console.log("pickupItem");
        this.pickupItem();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.change-item {
  background-color: transparent;
  fieldset {
    padding-bottom: 0;
  }
}
</style>
