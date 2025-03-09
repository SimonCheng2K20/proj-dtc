<template>
  <div :class="`gridCol-${localItem.span}${localItem.type==='break' ? ' break':''}`">
    <template v-if="isFormType">
      <b-form-group
        v-if="localItem.type === 'checkbox' || localItem.type === 'radio' || localItem.type === 'imgcheckbox'"
        :label="`${localItem.label ? localItem.label + ': ' : ''}`"
      >
        <template v-if="localItem.value && localItem.type === 'checkbox'">
          <b-form-checkbox-group
            switches
            :id="`checkbox-group-${pos.join(',')}`"
            :name="`flavour-${pos.join(',')}`"
            :options="localItem.options"
            :disabled="localItem.isReadOnly || isPreview"
            v-model="localItem.value"
          />
        </template>

        <template v-if="localItem.type === 'radio'">
          <b-form-radio-group
            :id="`radio-group-${pos.join(',')}-${Math.floor(Math.random() * 100)}`"
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly || isPreview"
            :name="`radio-${pos.join(',')}`"
          />
        </template>

        <div
          v-if="localItem.type === 'imgcheckbox'"
          class="d-flex flex-wrap"
        >
          <div
            v-for="option in localItem.options"
            :key="option.value"
            class="w-50 p-1"
          >
            <div
              class="imgCheckbox position-relative"
              :style="{ backgroundImage: `url(${option.text})` }"
            >
              <input
                style="right: 5px; top: 5px; width: 25px; height: 25px;"
                type="checkbox"
                class="position-absolute"
                :disabled="localItem.isReadOnly || isPreview"
                :name="option.text"
                :value="option.value"
                :checked="localItem.value.includes(option.value)"
                @click="(e) => clickImageCheckBox(e, option)"
              />
            </div>
          </div>
        </div>
      </b-form-group>

      <div v-else-if="localItem.type === 'multiple'">
        <b-input-group
          :prepend="localItem.label"
          :append="localItem.append"
        >
          <b-input
            v-for="mi in localItem.multiple.cls"
            :key="'mul' + mi"
            class="d-table"
            :disabled="localItem.isReadOnly || isPreview"
          />
        </b-input-group>
      </div>

      <b-input-group
        v-else
        :append="localItem.append"
        :prepend="(localItem.type !== 'textarea' && localItem.type !== 'fabric') ? localItem.label : ''"
        :class="{ dFlex: localItem.type === 'date' }"
      >
        <div
          v-if="localItem.type === 'date'"
          class="date-picker"
        >
          <ejs-datepicker
            v-model="localItem.value"
            ref="StartTime"
            id="StartTime"
            name="StartTime"
            class="e-field"
            step="5"
            :disabled="localItem.isReadOnly || isPreview"
            :allowEdit="false"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          />
        </div>
        <template v-else-if="localItem.type === 'select'">
          <b-form-select
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly || isPreview"
          ></b-form-select>
        </template>

        <template v-else-if="localItem.type === 'textarea'">
          <div class="w-100">
            <div
              v-if="localItem.label && localItem.label.trim()"
              v-text="localItem.label"
              class="bg-normal text-dark py-1 px-3 rounded-top"
              style="font-size: 18px; line-height: 1.7; margin-bottom: 0px;"
            />
            <b-form-textarea
              class="w-100"
              :class="{ 'with-title': localItem.label.trim() }"
              v-model="localItem.value"
              :disabled="localItem.isReadOnly || isPreview"
              rows="3"
              max-rows="18"
            />
          </div>
        </template>

        <template v-else-if="localItem.type === 'table'">
          <tableInput
            :tableTh="localItem.tableTh || '{}'"
            :keys="localItem.options"
            :values="localItem.value|| {}"
            @updateValue="(uValue)=> localItem.value = uValue"
          />
        </template>

        <template v-else-if="localItem.type === 'fabric'">
          <image-operator
            :imgSrc="localItem.imageUrl"
            :canvasValue="localItem.value"
            v-on:saveOperator="saveImageOperator"
          />
        </template>

        <b-input
          v-else
          v-model="localItem.value"
          :disabled="localItem.isReadOnly || isPreview"
        />
      </b-input-group>
    </template>

    <template v-else-if="isStatement">
      <div
        :class="localItem.theme"
        class="statement"
      >
        <h4
          v-if="localItem.label && localItem.label.trim()"
          v-text="localItem.label"
        />
        <p
          class="m-0"
          v-html="localItem.value"
        />
      </div>
    </template>

    <div v-else-if="isGap" />

    <div
      class="break-space"
      v-else-if="isBreak"
    />

    <template v-else>
      <div v-text="localItem.label" />
      <images-list
        :images="images"
        :cols="localItem.value"
      />
    </template>

    <div
      class="controller-platform mt-1"
      v-if="!isPreview"
    >
      <b-button
        v-if="localItem.type!='break'"
        class="px-3 mr-1"
        size="sm"
        variant="primary"
        @click="editItem"
      >修改</b-button>

      <b-button
        v-if="localItem.type!='break'"
        class="px-3 mr-1"
        size="sm"
        @click="changeType"
        variant="primary"
      >變更類別</b-button>

      <b-button
        class="px-3"
        size="sm"
        variant="danger"
        @click="removeItem"
      >刪除</b-button>
      <b-button
        v-if="localItem.type!='break'"
        class="px-3 mr-1"
        size="sm"
        variant="primary"
        @click="copyItem"
      >拷貝</b-button>
    </div>
  </div>
</template>

<script>
import tableInput from '@/components/template/tableInput.vue';
import imagesList from "@/components/template/imagesList.vue";
import imageOperator from "@/components/imageOperator";
export default {
  data () {
    return {
      localItem: {},
      options: [],
    };
  },
  props: {
    item: {
      type: Object,
    },
    pos: {
      type: Array,
      default: new Array(),
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    imageOptions: {
      type: Array,
      default: new Array(),
    },
    spans: {
      type: Number,
    },
  },
  created () {
    // this.localItem = Object.assign({}, this.item);
    this.localItem = this.item;
    if ((this.localItem.type === "checkbox" || this.localItem.type === "radio") && this.localItem.value === "") this.localItem.value = [];
  },
  mounted () {
    if (!this.localItem.isReadOnly && (this.localItem.type === "checkbox" || this.localItem.type === "select")) {
      Array.from(this.$el.querySelectorAll("input[type=checkbox], select option")).forEach(el => {
        if (el.hasAttribute("disabled")) el.removeAttribute("disabled");
      });
    }
  },
  components: {
    imagesList,
    imageOperator,
    tableInput
  },
  computed: {

    isFormType () {
      return ["text", "textarea", "select", "radio", "checkbox", "multiple", "imgcheckbox", "fabric", "table"].some((v) => v === this.localItem.type);
    },
    isStatement () {
      return this.localItem.type === "statement";
    },
    isGap () {
      return this.localItem.type === "gap";
    },
    isBreak () {
      return this.localItem.type === "break";
    },
    images () {
      return !this.imageOptions || this.imageOptions.length === 0 || this.imageOptions.filter((opt) => opt.key === this.localItem.type).length === 0
        ? []
        : this.imageOptions
          .filter((opt) => opt.key === this.localItem.type)[0]
          .options.filter((item) => this.imageOptions.filter((opt) => opt.key === this.localItem.type)[0].value.includes(item.value))
          .map(({ text }) => text);
    },
  },
  methods: {
    saveImageOperator (str) {
      this.localItem.value = str;
    },
    copyItem () {
      const [k0, k1, k2] = this.pos;
      this.$emit("copySpecificItem", { k0, k1, 'k2': k2 + 1, item: { ...this.localItem, isFinish: false, key: '' } });
    },
    editItem () {
      const [k0, k1, k2] = this.pos;
      this.localItem.isFinish = false;
      this.$emit("updateSpecificItem", { k0, k1, k2, item: this.localItem });
    },
    removeItem () {
      const [k0, k1, k2] = this.pos;
      this.$emit("removeColumn", { k0, k1, k2 });
    },
    changeType () {
      const [k0, k1, k2] = this.pos;
      this.localItem.type = null;
      this.localItem.isFinish = null;
      this.$emit("updateSpecificItem", { k0, k1, k2, item: this.localItem });
    },
    clickImageCheckBox (e, option) {
      // console.log(e.target.checked, localValue, option);
      let tmpArr = this.localItem.value === "" ? [] : this.localItem.value;
      if (e.target.checked && !tmpArr.some((v) => v === option.value)) {
        tmpArr.push(option.value);
      } else {
        tmpArr = tmpArr.filter((v) => v != option.value);
      }
      this.localItem.value = [...tmpArr];
    },
    updateitem () {
      const [k0, k1, k2] = this.pos;
      this.$emit("updateSpecificItem", { k0, k1, k2, item: this.localItem });
    }
  },
  watch: {
    spans (value) {
      if (this.localItem.span > value) {
        this.localItem.span = value;
        this.updateitem();
      }
    },
  }
};
</script>

<style lang="scss" scoped>
/deep/ textarea.with-title {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/deep/ .input-group-prepend .input-group-text {
  min-width: 45px;
}

@for $i from 2 through 6 {
  .gridCol-#{$i} {
    grid-column: span #{$i};
  }
}

@for $i from 1 through 10 {
  .w-#{$i * 10} {
    width: #{$i * 10%};
  }
}

.img-display {
  padding-top: 100%;
  background: transparent no-repeat center center / cover;
}

.form-control,
.input-group textarea.form-control {
  background-color: transparent;
  color: var(--themeTextColor) !important;
}

div.lightTheme,
div.darkTheme {
  label.custom-control-label {
    color: var(--themeTextColor) !important;
  }
}
</style>

<style>
.bg-normal {
  background-color: #b3b3b3;
}

.imgCheckbox {
  padding-top: 100%;
  background: transparent no-repeat center center / cover;
}

.fabric-image {
  padding-top: 25%;
  background: #000 no-repeat center center / contain;
}

.statement {
  color: gray;
}
</style>
