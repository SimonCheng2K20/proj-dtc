<template>
  <div :class="`gridCol-${localItem.span}${localItem.type==='break' ? ' break':''}`">

    <template v-if="isFormType">
      <b-form-group
        v-if="localItem.type === 'checkbox' || localItem.type === 'radio' || localItem.type === 'imgcheckbox'"
        :label="`${localItem.label ? localItem.label + ': ' : ''}`"
      >
        <template v-if="localItem.type === 'checkbox'">
          <b-form-checkbox-group
            switches
            :id="`checkbox-group-${pos[2]}`"
            :name="`flavour-${pos[2]}`"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            @change="updateItem"
            v-model="localItem.value"
          />
        </template>

        <template v-if="localItem.type === 'radio'">
          <b-form-radio-group
            :id="`radio-group-${pos[2]}-${Math.floor(Math.random() * 100)}`"
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            @change="updateItem"
            :name="`radio-${pos[2]}`"
          />
        </template>

        <div
          v-if="localItem.type === 'imgcheckbox'"
          class="d-flex flex-wrap"
        >
          <div
            v-for="(option, i) in localItem.options"
            :key="option.value"
            class="w-50 p-1"
          >
            <div
              class="imgCheckbox position-relative"
              :style="{ backgroundImage: `url(${option.text})` }"
              @click="preview(i)"
            >
              <input
                style="right: 5px; top: 5px; width: 25px; height: 25px;"
                type="checkbox"
                class="position-absolute"
                :disabled="localItem.isReadOnly"
                :name="option.text"
                :value="option.value"
                :checked="localItem.value.includes(option.value)"
                @click.stop="(e) => clickImageCheckBox(e, option)"
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
            v-model="localItem.value[mi]"
            class="d-table"
            :disabled="localItem.isReadOnly"
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
            :disabled="localItem.isReadOnly"
            :allowEdit="false"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
            @change="updateItem"
          />
        </div>
        <template v-else-if="localItem.type === 'select'">
          <b-form-select
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            @change="updateItem"
          />
        </template>

        <template v-else-if="localItem.type === 'textarea'">
          <div class="w-100">
            <div
              v-if="localItem.label"
              class="input-group-text py-1 px-3 rounded-top"
              style="font-size: 18px; line-height: 1.7; margin-bottom: 0px;"
            >
              <b-button
                v-if="localItem.options.length > 0"
                size="sm"
                variant="dark"
                @click.stop="showPhrash=true"
                v-text="localItem.label"
              />

              <font
                v-else
                v-text="localItem.label"
              />

            </div>
            <b-form-textarea
              class="w-100 with-title"
              :class="{ 'with-title': localItem.label }"
              rows="3"
              max-rows="18"
              v-model="localItem.value"
              :disabled="localItem.isReadOnly"
              @change="updateItem"
            />
          </div>
        </template>

        <tableInput
          v-else-if="localItem.type === 'table'"
          :tableTh="localItem.tableTh || {}"
          :keys="localItem.options"
          :values="localItem.value"
          @updateValue="(val)=> updateTableValues(val)"
        />

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
          :disabled="localItem.isReadOnly"
          @keyup="updateItem"
        />
      </b-input-group>
    </template>

    <div v-else-if="localItem.type === 'gap'" />

    <div
      v-else-if="localItem.type === 'statement'"
      :class="localItem.theme"
      class="statement"
    >
      <h4
        class="mt-2"
        v-if="localItem.label"
        v-text="localItem.label"
      />
      <p
        class="m-0"
        v-html="localItem.value"
      />
    </div>

    <template v-else>
      <div
        class="mb-2"
        v-text="localItem.label ? localItem.label + ':':''"
      />
      <images-list
        v-if="!typeOpts.some(opt=>opt.value===localItem.type)"
        :images="images"
        :cols="localItem.value"
      />
    </template>

    <b-modal
      id="modal-phrash"
      size="lg"
      v-model="showPhrash"
      hide-header
      hide-footer
      no-stacking
      cancel-title
    >

      <div
        class="phrash-button py-1 px-2 rounded border mb-1"
        v-for="(opt,idx) in localItem.options"
        :key="idx"
        v-text="opt.text"
        @click.stop="insertPhrash(opt)"
      />

    </b-modal>

    <b-modal
      id="modal-multi-1"
      size="lg"
      v-model="showPreview"
      hide-header
      hide-footer
      no-stacking
      cancel-title
    >
      <div class="w-100 preview-frame position-relative">
        <font-awesome-icon
          class="position-absolute close"
          icon="times-circle"
          @click.stop="showPreview = false"
        />

        <font-awesome-icon
          v-show="previewPosition < previewImgs.length - 1"
          class="position-absolute arrow-left"
          icon="arrow-alt-circle-left"
          @click.stop="sliderImg('left')"
        />
        <font-awesome-icon
          v-show="previewPosition > 0"
          class="position-absolute arrow-right"
          icon="arrow-alt-circle-right"
          @click.stop="sliderImg('right')"
        />

        <input
          v-if="previewImgs.length > 0"
          style="right: 5px; top: 5px; width: 25px; height: 25px;z-index: 201"
          type="checkbox"
          class="position-absolute"
          :disabled="localItem.isReadOnly"
          :checked="localItem.value.includes(localItem.options[previewPosition]['value'])"
          @click.stop="(e) => clickImageCheckBox(e, localItem.options[previewPosition])"
        />

        <div
          class="preview-imgs"
          :style="{ transform: `translateX(${positionPercentage})` }"
        >
          <img
            class="d-inline-table"
            v-for="(img, i) in previewImgs"
            :key="i"
            :src="img"
            style="width: 766px;"
          />
        </div>
      </div>

      <!-- <b-button v-b-modal.modal-multi-2>Open Second Modal</b-button> -->
    </b-modal>
  </div>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
// import bus from "@/assets/service/bus.js";
import imagesList from "@/components/template/imagesList.vue";
import imageOperator from "@/components/imageOperator";
import tableInput from '@/components/template/tableInput.vue';
import { typeOpts } from "@/assets/js/common.js";
export default {
  data () {
    return {
      localItem: {},
      options: [],
      multValues: {},
      showPreview: false,
      previewImgs: [],
      previewPosition: 0,
      showPhrash: false,
      typeOpts
    };
  },
  mounted () {
    // 不知道為何 會自動加上disabled
    if (!this.localItem.isReadOnly && (this.localItem.type === "checkbox" || this.localItem.type === "select")) {
      Array.from(this.$el.querySelectorAll("input[type=checkbox], select option")).forEach(el => {
        if (el.hasAttribute("disabled")) el.removeAttribute("disabled");
      });
    }
  },
  props: {
    item: {
      type: Object,
    },
    pos: {
      type: Array,
    },
    imageOptions: {
      type: Array,
      default: () => [],
    },
  },
  created () {
    // window.isSavingDtc = false;
    this.localItem = Object.assign({}, this.item);
  },
  computed: {
    isFormType () {
      return ["text", "textarea", "select", "radio", "checkbox", "imgcheckbox", "multiple", "fabric", "table"].some((v) => v === this.localItem.type);
    },
    positionPercentage () {
      return this.previewPosition === 0 ? "0px" : ((-this.previewPosition / this.previewImgs.length) * 100).toFixed(3) + "%";
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
  components: {
    imagesList,
    imageOperator,
    tableInput
  },
  methods: {
    updateTableValues (tableValue) {
      this.localItem.value = tableValue;
      this.updateItem();
    },
    insertPhrash ({ text }) {
      this.localItem.value += ((this.localItem.value ? '\n' : '') + text);
      this.showPhrash = false;
    },
    saveImageOperator (str) {
      this.localItem.value = str;
      this.updateItem();
    },
    updateItem () {
      BusFactory.$emit("updateItem", { item: this.localItem, pos: this.pos });
    },
    multChange () {
      this.localItem.value = this.multValues;
      this.updateItem();
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
      this.updateItem();
    },
    preview (index) {
      this.previewImgs = this.localItem.options.map(({ text }) => text);
      this.showPreview = !this.showPreview;
      this.previewPosition = index;
    },
    sliderImg (direction) {
      if (direction === "left") {
        if (this.previewPosition < this.previewImgs.length - 1) {
          this.previewPosition += 1;
        }
      } else {
        if (this.previewPosition > 0) {
          this.previewPosition -= 1;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ textarea.with-title {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

@for $i from 2 through 6 {
  .gridCol-#{$i} {
    grid-column: span #{$i};
  }
}

.preview-frame {
  overflow-x: hidden;
  .arrow-left,
  .arrow-right,
  .close {
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;
    cursor: pointer;
    z-index: 200;
  }
  .arrow-left {
    left: 5px;
  }
  .arrow-right {
    right: 5px;
  }
  .close {
    right: calc(50% - 15px);
    top: 20px;
    opacity: 1;
  }
  .preview-imgs {
    width: fit-content;
    white-space: nowrap;
    transition: ease 0.5s transform;
  }
}

.phrash-button {
  background-color: #555;
  color: #fff;
  &:nth-last-child(1) {
    margin-bottom: 0 !important;
  }
  &:hover {
    background-color: #222;
    cursor: pointer;
  }
}

.break {
  grid-column: var(--gridColumnNumber) / span 1;
}
</style>

<style>
.input-group-prepend .input-group-text {
  min-width: 90px;
}

.bg-normal {
  background-color: #b3b3b3;
}

.imgCheckbox {
  padding-top: 100%;
  background: transparent no-repeat center center / cover;
}

.statement h4 {
  color: var(--themeTextColor);
}
</style>
