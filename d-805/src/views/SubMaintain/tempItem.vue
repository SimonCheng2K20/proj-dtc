<template>
  <div
    :class="`gridCol-${localItem.span}${localItem.type==='break' ? ' break':''}`"
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
          @keydown.tab="autoInsertKey"
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
      <template v-if="localItem.type !== 'statement'">
        <b-form-checkbox
          v-if="localItem.type"
          v-model="localItem.isReadOnly"
          name="check-button"
          switch
          @change="updateitem()"
          size="sm"
        >
          {{ localItem.isReadOnly ? "" : "不" }}唯讀
        </b-form-checkbox>

        <b-form-select
          v-show="!localItem.type"
          v-model="localItem.type"
          :options="dropdownOptions"
          size="sm"
          class="mt-1"
          placeholder="選擇種類"
          @change="updateitem()"
        />
        <!-- <div
          v-show="localItem.type"
          v-text="localItem.type"
        /> -->
      </template>
      <template v-else>
        <b-form-textarea
          v-model="localItem.value"
          placeholder="輸入內文"
          rows="3"
          max-rows="18"
        />
        <!-- <b-form-radio-group id="radio-group-1" v-model="options" :options="statementOpts" name="statement-options"></b-form-radio-group> -->
      </template>

      <div
        ref="insertOptions"
        class="p-1"
        v-if="localItem.type === 'select' || localItem.type === 'radio' || localItem.type === 'checkbox' || localItem.type === 'imgcheckbox'"
      >
        <div
          class="d-flex align-items-center mb-1"
          v-for="(opt, opi) in options"
          :key="opt.createTime"
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
            @click="removeOption(opt)"
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
        v-if="localItem.type==='textarea'"
      >
        <div
          class="d-flex align-items-center mb-1"
          v-for="(opt, optIdx) in options"
          :key="opt.createTime"
        >
          <b-form-input
            class="flex-1 mr-1"
            size="sm"
            v-model="opt.text"
            placeholder="輸入片語資料"
            @keydown.tab="optKeyDown(optIdx)"
          />
          <div
            @click="removeOption(opt)"
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
        v-if="localItem.type === 'multiple'"
      >
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

      <div
        class="p-1"
        v-if="localItem.type === 'fabric'"
      >
        <b-input-group
          prepend="圖片URL"
          size="sm"
          class="mb-1"
        >
          <b-form-input v-model="localItem['imageUrl']"></b-form-input>
        </b-input-group>
        <!-- <div v-text="localItem" /> -->

      </div>

      <div
        class="p-1"
        v-if="localItem.type==='table'"
      >
        <b-form-textarea v-model="localItem['tableTh']" />
        <div v-text="localItem['tableTh']" />
        <div
          class="d-flex align-items-center mb-1"
          v-for="(opt, optIdx) in options"
          :key="opt.createTime"
        >
          <b-form-input
            class="flex-1 mr-1"
            size="sm"
            v-model="opt.text"
            placeholder="輸入項目"
            @keydown.tab="optKeyDown(optIdx)"
          />
          <div
            @click="removeOption(opt)"
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
        class="p1"
        v-if="imageOptions.some(({ key }) => localItem.type === key)"
      >
        <!-- <b-form-input v-model="localItem.value" @change="updateitem()" /> -->
        <b-form-spinbutton
          size="sm"
          style="width: 125px;"
          class="mb-1"
          id="demo-sb"
          v-model="localItem.value"
          @change="updateitem()"
          min="1"
          :max="10"
        />
        <!-- <div v-text="localItem" /> -->
      </div>

      <template v-slot:footer>
        <div class="d-flex foot-btns">
          <b-button @click="switchPosition('left')">
            <font-awesome-icon icon="chevron-left" />
          </b-button>

          <b-button
            class="flex-1 w-100"
            size="sm"
            :disabled="!isFinish"
            @click="updateitem(true)"
            variant="primary"
          >確定
          </b-button>

          <b-button
            v-if="localItem.type"
            class="flex-1  w-100"
            size="sm"
            @click="changeType"
            variant="primary"
          >變更</b-button>

          <b-button
            class="flex-1 w-100"
            size="sm"
            variant="danger"
            @click="removeItem"
          >刪除</b-button>

          <b-button @click="switchPosition('right')">
            <font-awesome-icon icon="chevron-right" />
          </b-button>
        </div>
      </template>
    </b-card>
  </div>
</template>

<script>
import { typeOpts } from "@/assets/js/common.js";
export default {
  data () {
    return {
      localItem: {},
      options: [],
      typeOpts,
      statementOpts: [
        { text: "theme1", value: "bg-black text-white" },
        { text: "theme2", value: "bg-primary text-white" },
        { text: "theme3", value: "bg-white text-black" },
      ],
    };
  },
  props: {
    item: {
      type: Object,
    },
    pos: {
      type: Array,
    },
    spans: {
      type: Number,
    },
    imageOptions: {
      type: Array,
      default: new Array(),
    },
    usedKeys: {
      type: Array,
      default: new Array(),
    }
  },
  created () {
    this.localItem = Object.assign({}, this.item);
    const currentTime = new Date().getTime();

    if (this.localItem.type === "statement") {
      this.options = this.localItem.theme;
    } else if (this.localItem.type === "multiple") {
      this.options = this.localItem.multiple;
    } else if (this.localItem.type === "table" && this.item.options) {
      if (this.item.options) this.options = this.item.options.map((v, i) => ({ text: v, createTime: currentTime + i }));
    } else {
      if (this.item.options) this.options = this.item.options.map((v, i) => ({ ...v, createTime: currentTime + i }));
    }


  },
  methods: {
    autoInsertKey () {
      if (!this.localItem.key) {
        this.localItem.key = this.localItem.label.split(' ').map((v, i) => {
          return i === 0
            ? v.toLowerCase()
            : v[0].toUpperCase() + v.substr(1).toLowerCase()
        }).join('');
      }
    },
    optKeyDown (curry) {
      if (curry === this.options.length - 1) {
        // last one
        this.addOption();
      }
    },
    updateitem (confirm = false) {
      const [k0, k1, k2] = this.pos;
      if (
        (this.localItem.type === "select" || this.localItem.type === "checkbox" || this.localItem.type === "radio" || this.localItem.type === "imgcheckbox") &&
        this.options.length > 0
      ) {

        this.localItem = {
          ...this.localItem,
          options: this.options.reduce((a, { text, value, disabled }) => (text && value ? a.concat({ text, value, disabled: !disabled }) : a), []),
        };
      } else if (this.localItem.type === "textarea" && this.options) {
        this.localItem = {
          ...this.localItem,
          options: this.options.reduce((a, { text }) => (text ? a.concat({ text }) : a), []),
        };
      } else if (this.localItem.type === "table" && this.options) {
        this.localItem = {
          ...this.localItem,
          options: this.options.map(({ text }) => text),
        };
      } else if (this.localItem.type === "statement" && this.options) {
        this.localItem = { ...this.localItem, theme: this.options };
      } else if (this.localItem.type === "multiple" && this.options) {
        this.localItem = { ...this.localItem, multiple: this.options };
      } else {
        if (this.localItem.options) delete this.localItem.options;
      }

      if (confirm) this.localItem.isFinish = confirm;
      this.$emit("updateSpecificItem", { k0, k1, k2, item: this.localItem });
    },
    addOption () {
      if (this.localItem.type === "textarea" || this.localItem.type === "table") {
        this.options.push({ id: new Date().getTime(), text: "" });
      } else {
        this.options.push({ id: new Date().getTime(), text: "", value: "", disabled: true });
        setTimeout(() => {    // focus on NEW option
          const opts = Array.from(this.$refs.insertOptions.querySelectorAll("input[type='text']"));
          opts.forEach((opt, idx) => {
            if (idx === opts.length - 2) {
              opt.focus();
            }
          });
        }, 50);

      }

    },
    removeOption (selectOption) {
      // const optIndex = this.options.findIndex((opt) => opt.id === id);
      // this.options.splice(optIndex, 1);
      this.options = this.options.filter(opt => opt !== selectOption);
    },
    changeType () {
      this.localItem.type = null;
      this.updateitem();
    },
    removeItem () {
      const [k0, k1, k2] = this.pos;
      this.$emit("removeColumn", { k0, k1, k2 });
    },
    switchPosition (direction) {

      this.$emit("changePosition", { pos: this.pos, newPos: this.pos[2] + (direction === 'left' ? -1 : 1) });

    }
  },
  computed: {
    isFinish () {
      return (this.localItem.key && this.localItem.type && (this.usedKeys.filter(key => key === this.localItem.key).length < 2)) || (this.localItem.type === "gap" || this.localItem.type === "break" || this.localItem.type === "statement");
    },
    dropdownOptions () {
      return !this.imageOptions || this.imageOptions.length === 0
        ? this.typeOpts
        : this.typeOpts.concat(this.imageOptions.map((opt) => ({ text: opt.label, value: opt.key })));
    }
  },
  watch: {
    "localItem.type" (value) {
      if (value === "multiple") {
        this.options = { cls: 2 };
      } else if ((value === 'select' || value === 'checkbox' || value === 'radio') && this.options.length === 0) {
        this.options = [{ text: 'option1', value: 'value1' }, { text: 'option2', value: 'value2' }, { text: 'option3', value: 'value3' }];
      } else if (value === "break") {
        this.updateitem(true);
      }
    },
    spans (value) {
      if (this.localItem.span > value) {
        this.localItem.span = value;
        this.updateitem();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@for $i from 2 through 6 {
  .gridCol-#{$i} {
    grid-column: span #{$i};
  }
}

/deep/ .card-footer {
  padding: 5px;
}
.foot-btns {
  button {
    margin: 0 2px;
  }
}
</style>
