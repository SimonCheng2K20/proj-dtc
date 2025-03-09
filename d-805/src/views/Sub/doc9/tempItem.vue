<template>
  <div
    :class="`gridCol-${localItem.span}`"
    class="p-1"
    style="border: 1px dashed #666"
  >

    <b-card
      class="h-100"
      size="sm"
    >
      <template v-slot:header>

        <b-form-input
          size="sm"
          class="flex-1"
          v-model="localItem.label"
          placeholder="輸入標題"
          @keyup="updateitem()"
        />

        <b-form-input
          size="sm"
          class="flex-1"
          v-model="localItem.key"
          placeholder="輸入KEY"
          @keyup="updateitem()"
        />

        <b-form-input
          size="sm"
          class="flex-1"
          v-model="localItem.append"
          placeholder="輸入尾部標題"
          @keyup="updateitem()"
        />

        <!-- <b-form-input
          size="sm"
          class="flex-1"
          v-model="localItem.append"
          placeholder="輸入尾部標題"
          @keyup="updateitem()"
        /> -->
        <b-form-spinbutton
          size="sm"
          style="width: 125px;"
          class="mb-1"
          id="demo-sb"
          v-model="localItem.span"
          min="1"
          :max="spans"
        />

      </template>
      <template v-if="localItem.type!=='statement'">
        <b-form-checkbox
          v-if="localItem.type"
          v-model="localItem.isReadOnly"
          name="check-button"
          switch
          @change="updateitem()"
          size="sm"
        > {{localItem.isReadOnly ? '': '不'}}唯讀
        </b-form-checkbox>

        <b-form-select
          v-show="!localItem.type"
          v-model="localItem.type"
          :options="typeOpts"
          size="sm"
          class="mt-1"
          placeholder="選擇種類"
          @change="updateitem()"
        />
        <div
          v-show="localItem.type"
          v-text="localItem.type"
        />
      </template>
      <template v-else>

        <b-form-textarea
          v-model="localItem.value"
          placeholder="輸入內文"
          rows="3"
          max-rows="18"
        />

        <b-form-radio-group
          id="radio-group-1"
          v-model="options"
          :options="statementOpts"
          name="statement-options"
        ></b-form-radio-group>

      </template>

      <div
        class="p-1"
        v-if="localItem.type==='select' || localItem.type==='radio' || localItem.type==='checkbox'"
      >
        <div
          class="d-flex align-items-center mb-1"
          v-for="(opt,opi) in options"
          :key="opt.id"
        >
          <b-form-input
            class="flex-1 mr-1"
            size="sm"
            v-model="opt.text"
            placeholder="輸入選擇項目名稱"
          />
          <b-form-input
            class="flex-1 mr-1"
            size="sm"
            v-model="opt.value"
            placeholder="輸入選擇項目值"
            @keydown.tab="optKeyDown(opi)"
          />

          <b-form-checkbox
            class="mr-1"
            v-model="opt.disabled"
            name="check-button"
            switch
          />

          <div
            @click="removeOption(opt.id)"
            class="bg-primary text-white px-1 ml-1 rounded"
          >
            <font-awesome-icon icon="minus" />
          </div>
        </div>

        <div
          @click="addOption"
          class="bg-primary text-white px-1 d-table rounded mb-1"
        >
          <font-awesome-icon icon="plus" />
        </div>
      </div>

      <div
        class="p-1"
        v-if="localItem.type==='multiple'"
      >
        <!-- <b-input-group
          prepend="FRONT"
          size="sm"
          class="mb-1"
        >
          <b-form-input v-model="options['front']"></b-form-input>
        </b-input-group>
        <b-input-group
          prepend="END"
          size="sm"
          class="mb-1"
        >
          <b-form-input v-model="options['end']"></b-form-input>
        </b-input-group> -->

        <b-form-spinbutton
          size="sm"
          style="width: 125px;"
          class="mb-1"
          id="demo-sb"
          min="2"
          max="5"
          v-model="options['cls']"
        />

      </div>

      <template v-slot:footer>
        <div class="d-flex">
          <b-button
            class="flex-1 w-100"
            size="sm"
            :disabled="!isFinish"
            @click="updateitem(true)"
            variant="primary"
          >確定</b-button>

          <div style="width: 10px;" />

          <b-button
            v-if="localItem.type"
            class="flex-1  w-100"
            size="sm"
            @click="changeType"
            variant="primary"
          >變更類別</b-button>

          <div style="width: 10px;" />

          <b-button
            class="flex-1 w-100"
            size="sm"
            variant="danger"
            @click="removeItem"
          >刪除</b-button>

        </div>
      </template>
    </b-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      localItem: {},
      options: [],
      typeOpts: [
        { text: 'statement', value: 'statement' },
        { text: 'text', value: 'text' },
        { text: 'multipleText', value: 'multiple' },
        { text: 'textarea', value: 'textarea' },
        { text: 'select', value: 'select' },
        { text: 'radio', value: 'radio' },
        { text: 'checkbox', value: 'checkbox' },
        { text: 'gap', value: 'gap' },
      ],
      statementOpts: [
        { text: 'theme1', value: 'bg-black text-white' },
        { text: 'theme2', value: 'bg-primary text-white' },
        { text: 'theme3', value: 'bg-white text-black' },
      ]
    }
  },
  props: {
    item: {
      type: Object
    },
    pos: {
      type: Array
    },
    spans: {
      type: Number
    }
  },
  created () {
    this.localItem = Object.assign({}, this.item);
    if (this.localItem.type === 'statement') {
      this.options = this.localItem.theme;
    } else if (this.localItem.type === 'multiple') {
      this.options = this.localItem.multiple;
    } else {
      if (this.item.options) this.options = this.item.options;
    }
  },
  methods: {
    optKeyDown (curry) {
      if (curry === this.options.length - 1) { // last one
        this.addOption();
      }
    },
    updateitem (confirm = false) {
      const [k1, k2] = this.pos;
      if ((this.localItem.type === 'select' || this.localItem.type === 'checkbox' || this.localItem.type === 'radio') && this.options.length > 0) {
        this.localItem = { ...this.localItem, options: this.options.reduce((a, { text, value, disabled }) => text && value ? a.concat({ text, value, 'disabled': !disabled }) : a, []) };
      } else if (this.localItem.type === 'statement' && this.options) {
        this.localItem = { ...this.localItem, theme: this.options };
      } else if (this.localItem.type === 'multiple' && this.options) {

        this.localItem = { ...this.localItem, multiple: this.options };
      } else {
        if (this.localItem.options) delete this.localItem.options;
      }



      if (confirm) this.localItem.isFinish = confirm;
      this.$emit('updateSpecificItem', { k1, k2, item: this.localItem });
    },
    addOption () {
      this.options.push({ id: new Date().getTime(), text: '', value: '', disabled: true });
    },
    removeOption (id) {
      const optIndex = this.options.findIndex(opt => opt.id === id);
      this.options.splice(optIndex, 1);
    },
    changeType () {
      this.localItem.type = null;
      this.updateitem();
    },
    removeItem () {
      const [k1, k2] = this.pos;
      this.$emit('removeColumn', { k1, k2 });
    }
  },
  computed: {
    isFinish () {
      return (this.localItem.label && this.localItem.key && this.localItem.type) || this.localItem.type === 'gap';
    }
  },
  watch: {
    'localItem.type' (value) {
      if (value === 'multiple') {
        this.options = { cls: 2 };
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@for $i from 2 through 6 {
  .gridCol-#{$i} {
    grid-column: span #{$i};
  }
}
</style>
