<template>
  <div class="px-1">
    <!-- <label v-text="'row' + (idx + 1)"></label> -->
    <!-- <b-form-input id="range" v-model="columnNumber" type="range" min="1" max="6"/> -->
    <div class="rounded grid-ground p-1">
      <div class="d-flex align-items-start pt-1 pr-1 rounded-top control-pad mb-2">

        <b-input-group
          prepend="SECTION 標題"
          size="sm"
          style="width: 250px;"
          class='mr-1'
        >
          <b-form-input
            size="sm"
            v-model="columnTitle"
            @change="updateTitle"
          ></b-form-input>
        </b-input-group>

        <b-form-spinbutton
          size="sm"
          style="width: 125px;min-width: 125px;"
          class="mb-1"
          id="demo-sb"
          v-model="columnNumber"
          @change="updateNumbers"
          min="1"
          max="6"
        />

        <b-form-spinbutton
          size="sm"
          style="width: 125px;min-width: 125px;"
          class="mb-1 ml-1"
          id="demo-sb"
          v-model="sectionWidth"
          @change="updateSectionWidth"
          min="20"
          max="100"
          step="10"
        />

        <div
          class="pr-1 d-flex ml-3 align-items-center"
          style="flex: 1 0 0;"
        >
          <font-awesome-icon
            class="text-white mr-1"
            icon="print"
          />
          <b-form-checkbox
            class="mr-1"
            v-model="printed"
            @change="updatePrinted"
          />

          <font-awesome-icon
            class="text-white mr-1"
            icon="bookmark"
          />
          <b-form-checkbox
            class="mr-1"
            v-model="showTabs"
          />

          <div
            class="mr-1 d-flex align-items-center"
            v-if="showTabs"
          >
            <b-input-group
              prepend="tabs名稱"
              size="sm"
            >

              <!-- <b-form-input
              v-model="localTabs.name"
              @change="updateTabs"
            /> -->

              <b-form-select
                v-model="localTabs.name"
                @change="updateTabs"
                :options="tabList"
                size="sm"
              ></b-form-select>

            </b-input-group>

            <b-input-group
              class="ml-1"
              prepend="tab名稱"
              size="sm"
            >
              <b-form-input
                v-model="localTabs.key"
                @change="updateTabs"
              />
            </b-input-group>

            <font-awesome-icon
              class="text-white ml-2 mr-1"
              icon="eye"
            />
            <b-form-checkbox
              v-model="localTabs.show"
              @change="updateTabs"
              class="mr-1"
            />

          </div>

        </div>

        <div>
          <b-button
            v-if="idx>0"
            variant="primary"
            size="sm"
            class="mr-1"
            :class="{'mx-1': idx==total-1}"
            @click="moveColumns('up')"
          >
            <font-awesome-icon icon="chevron-up" />
          </b-button>
          <b-button
            v-if="idx < total -1"
            variant="success"
            size="sm"
            class="mr-1"
            :class="{'ml-auto': idx===0}"
            @click="moveColumns('down')"
          >
            <font-awesome-icon icon="chevron-down" />
          </b-button>

          <!-- <b-button
          variant="secondary"
          size="sm"
          class="mx-1"
        >
          <font-awesome-icon icon="minus" />
        </b-button> -->

          <b-button
            variant="warning"
            size="sm"
            class="mr-1"
            @click="$emit('copySection')"
          >
            <font-awesome-icon icon="copy" />
          </b-button>

          <b-button
            variant="secondary"
            size="sm"
            class="mr-1"
            @click="completeSec"
          >
            <font-awesome-icon icon="check-circle" />
          </b-button>

          <b-button
            variant="danger"
            size="sm"
            @click="removeColumns()"
          >
            <font-awesome-icon icon="times" />
          </b-button>
        </div>
      </div>

      <div
        class="template-board"
        :style="{'--gridColumnNumber': columnNumber}"
      >
        <slot />
      </div>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      columnNumber: 1,
      sectionWidth: 100,
      columnTitle: '',
      showTabs: false,
      localTabs: null,
      printed: true,
      tabList: null
    }
  },
  props: {
    cols: {
      type: Number
    },
    idx: {
      type: Number
    },
    rowIdx: {
      type: Number
    },
    total: {
      type: Number
    },
    title: {
      type: String
    },
    tabs: {
      type: Object,
    },
    shouldPrinted: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.tabList = new Array(10).fill('').map((v, i) => ({ text: `TAB${i + 1}`, value: `t${i + 1}` }));
    this.columnNumber = this.cols;
    this.columnTitle = this.title;
    this.printed = this.shouldPrinted;
    // this.localTabs = Object.assign({ key: '', name: '' }, this.tabs);
    // this.showTabs = (!!this.localTabs && !!this.localTabs.key && !!this.localTabs.name);
    if (this.tabs) {



      this.localTabs = Object.assign({ key: this.tabList[0].text.value, name: this.tabList[0].text, show: false }, this.tabs);
      this.showTabs = (!!this.localTabs.key && !!this.localTabs.name);
    }
  },
  methods: {
    completeSec () {
      this.$emit('completeSection', { idx: this.idx, rowIdx: this.rowIdx });
    },
    updateTitle () {
      this.$emit("updateTitle", { idx: this.idx, rowIdx: this.rowIdx, title: this.columnTitle })
    },
    updateNumbers () {
      this.$emit("updateColumns", { idx: this.idx, rowIdx: this.rowIdx, number: this.columnNumber })
    },
    updateSectionWidth () {
      this.$emit("updateSectWidth", { idx: this.idx, rowIdx: this.rowIdx, number: this.sectionWidth })
    },
    removeColumns () {
      this.$emit("removeColumns", { current: this.idx, rowIdx: this.rowIdx });
    },
    moveColumns (method) {
      const swap = this.idx + (method === 'up' ? -1 : 1);
      this.$emit('moveColumn', { swap, current: this.idx, rowIdx: this.rowIdx });
    },
    updateTabs (e) {
      this.$emit('updateParentTabs', { tabs: this.localTabs, idx: this.idx, rowIdx: this.rowIdx });
    },
    updatePrinted () {
      this.$emit('updatePrintedState', { rowIdx: this.rowIdx, status: !this.printed });
    }
  },
  watch: {
    showTabs (val, oldVal) {
      if (val && !this.tabs) {
        this.localTabs = { key: '', name: '', show: false };
        this.$emit('createTabs', { idx: this.idx, rowIdx: this.rowIdx });
      } else if (!val && typeof val === 'boolean') {
        // this.localTabs = { key: '', name: '' };
        // this.$emit('updateParentTabs', { tabs: this.localTabs, idx: this.idx, rowIdx: this.rowIdx });
        // this.updateTabs();
        this.$emit('clearTabs', { idx: this.idx, rowIdx: this.rowIdx })
      }
    }
  }
}
</script>


<style>
.lightTheme .grid-ground {
  border: var(--themeTextColor) solid 1px;
}

.darkTheme .grid-ground {
  border: var(--themeTextColor) solid 1px;
}

.template-board {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 0;
  grid-template-columns: repeat(var(--gridColumnNumber), 1fr);
}

.break {
  grid-column: var(--gridColumnNumber) / span 1;
}

.control-pad {
  padding-left: 5px;
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAgMAAADw5/WeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRF////////AAAAjvTD7AAAAAN0Uk5TLQoAMAz55wAAADxJREFUeJwdyTEBADAMAkF0VFDE1A0eshSVBX645XHkMJV1b3wZ0FTWDCgDyrCsHtbDekTWvfGdqKms+wHzSjwGHkUHyAAAAABJRU5ErkJggg==");
}

.lightTheme .control-pad {
  background-color: #aaa;
}

.darkTheme .control-pad {
  background-color: #222;
}

.input-group-text {
  line-height: 1 !important;
}
</style>
