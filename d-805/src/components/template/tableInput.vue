<template>
  <div class="table-input w-100">
    <tempGrid :cols="valueItemList.length + 1">
      <div
        class="d-flex align-items-center justify-content-center input-group-text"
        :class="`gridRow-${thLevel}`"
        v-text="lead"
      />
      <div
        class="d-flex align-items-center justify-content-center input-group-text"
        v-for="item in sortedItemList"
        :key="item.key"
        v-text="item.key"
        :class="item.span > 0 ? `gridCol-${item.span}`:''"
      />

      <template v-for="k in keys">
        <div
          class="d-flex align-items-center justify-content-center input-group-text"
          v-text="k"
          :key="k"
        />

        <b-input
          v-for="item in valueItemList"
          v-model="exportData[k][item]"
          :key="k + item"
          @change="updateValue"
        />

      </template>
    </tempGrid>
  </div>
</template>

<script>
import tempGrid from './tempGrid';
export default {
  data () {
    return {
      itemList: [],
      thLevel: 0,
      exportData: {}
    }
  },

  created () {
    // console.log('HERE', (this.tableTh));
    if (!this.tableTh) return;
    this.getListItem(JSON.parse(this.tableTh), 0);
    this.itemList = this.itemList.sort((a, b) => a.level >= b.level ? 1 : -1);

    this.exportData = this.keys.reduce((acc, cur) => ({
      ...acc, [cur]: this.valueItemList.reduce((sAcc, sCur) => ({
        ...sAcc, [sCur]: (!this.values || !this.values[cur] || !this.values[cur][sCur])
          ? ''
          : this.values[cur][sCur]
      })
        , {})
    })
      , {});


  },
  computed: {
    sortedItemList () {
      return this.itemList.length === 0
        ? []
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        : this.itemList.sort((a, b) => a['level'] >= b['level'] ? 1 : -1);
    },
    valueItemList () {
      return this.itemList.length === 0
        ? []
        : this.itemList.filter(({ span }) => span === 0).map(({ key }) => key);
    }
  },
  props: {
    tableTh: {
      type: String,
      required: true
    },
    keys: {
      type: Array,
      required: true
    },
    lead: {
      type: String,
      default: 'Lead'
    },
    values: {
      type: Object
    }
  },
  components: {
    tempGrid
  },
  methods: {
    getListItem (obj, level) {
      console.log(obj);
      if (this.thLevel < level + 1) this.thLevel = level + 1;
      Object.keys(obj).forEach((key) => {
        const span = Object.keys(obj[key]).length;
        this.itemList.push({ key, span, level });
        if (span > 0) {
          this.getListItem(obj[key], level + 1);
        }
      });
    },
    updateValue () {
      this.$emit("updateValue", this.exportData);
    }
  },
  watch: {
    values (val) {
      if (Object.keys(val).length === 0) {
        Object.keys(this.exportData).forEach(key => this.exportData[key] = '');
      }
    }
  }
}

</script>

<style lang="scss" scoped>
$lightGrayColor: #aaa;
@for $i from 2 through 10 {
  .gridCol-#{$i} {
    grid-column: span #{$i};
  }
  .gridRow-#{$i} {
    grid-row: span #{$i};
  }
}

.table-input {
  border-color: $lightGrayColor;

  border-radius: 5px;
  overflow: hidden;
  /deep/ .temp-grid {
    grid-gap: 2px;
    grid-row-gap: 2px;
    > div {
      border-color: $lightGrayColor;

      &.standarColor {
        background-color: #e9ecef;
      }
    }
  }
}
</style>
