<template>
  <div>
    <!-- <label v-text="'row' + (idx + 1)"></label> -->
    <!-- <b-form-input id="range" v-model="columnNumber" type="range" min="1" max="6"/> -->
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
        style="width: 125px;"
        class="mb-1"
        id="demo-sb"
        v-model="columnNumber"
        @change="updateNumbers"
        min="1"
        max="6"
      />

      <div
        class="pr-1 d-flex ml-3"
        style="flex: 1 0 0;"
      >

        <b-form-checkbox
          class="mr-1"
          v-model="showTabs"
          name="showTabs-button"
        />

        <div
          class="mr-1 d-flex"
          v-if="showTabs && tabs"
        >
          <b-input-group
            prepend="tabs名稱"
            size="sm"
          >
            <b-form-input
              v-model="localTabs.name"
              @change="updateTabs"
            />
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
        </div>

      </div>

      <div>
        <b-button
          v-if="idx>0"
          variant="primary"
          size="sm"
          :class="{'mr-1': idx==total-1}"
          @click="moveColumns('up')"
        >
          <font-awesome-icon icon="chevron-up" />
        </b-button>
        <b-button
          v-if="idx < total -1"
          variant="success"
          size="sm"
          class="ml-1"
          :class="{'ml-auto': idx===0}"
          @click="moveColumns('down')"
        >
          <font-awesome-icon icon="chevron-down" />
        </b-button>

        <b-button
          variant="secondary"
          size="sm"
          class="mx-1"
        >
          <font-awesome-icon icon="minus" />
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
</template>

<script>
export default {
  data () {
    return {
      columnNumber: 1,
      columnTitle: '',
      showTabs: true,
      localTabs: null
    }
  },
  props: {
    cols: {
      type: Number
    },
    idx: {
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

    }
  },
  created () {
    this.columnNumber = this.cols;
    this.columnTitle = this.title;
    this.localTabs = Object.assign({ key: '', name: '' }, this.tabs);
    this.showTabs = (this.localTabs && this.localTabs.key && this.localTabs.name);
  },
  methods: {
    updateTitle () {
      this.$emit("updateTitle", { idx: this.idx, title: this.columnTitle })
    },
    updateNumbers () {
      this.$emit("updateColumns", { idx: this.idx, number: this.columnNumber })
    },
    removeColumns () {
      this.$emit("removeColumns", this.idx);
    },
    moveColumns (method) {
      const swap = this.idx + (method === 'up' ? -1 : 1);
      this.$emit('moveColumn', { swap, current: this.idx });
    },
    updateTabs (e) {
      this.$emit('updateParentTabs', { tabs: this.localTabs, idx: this.idx });
    }
  },
  watch: {
    showTabs (val) {
      if (val && !this.tabs) {
        // this.$emit('createTabs', this.idx);
      } else if (!val && typeof val === 'boolean') {
        this.localTabs = { key: '', name: '' };
        this.$emit('updateParentTabs', { tabs: this.localTabs, idx: this.idx });
      }

    }
  }
}
</script>

<style>
.template-board {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 0;
  grid-template-columns: repeat(var(--gridColumnNumber), 1fr);
}
.control-pad {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAgMAAADw5/WeAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRF////////AAAAjvTD7AAAAAN0Uk5TLQoAMAz55wAAADxJREFUeJwdyTEBADAMAkF0VFDE1A0eshSVBX645XHkMJV1b3wZ0FTWDCgDyrCsHtbDekTWvfGdqKms+wHzSjwGHkUHyAAAAABJRU5ErkJggg==");
}

.input-group-text {
  line-height: 1 !important;
}
</style>
