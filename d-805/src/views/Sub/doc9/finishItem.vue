<template>
  <div :class="`gridCol-${localItem.span}`">
    <template v-if="isFormType">
      <b-form-group
        class="text-white"
        v-if="localItem.type === 'checkbox' || localItem.type === 'radio'"
        :label="`${localItem.label ? localItem.label + ': ' : ''}`"
      >
        <template v-if="localItem.type === 'checkbox'">
          <b-form-checkbox-group
            switches
            :id="`checkbox-group-${index}`"
            :name="`flavour-${index}`"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            v-model="localItem.value"
          />
        </template>

        <template v-if="localItem.type === 'radio'">
          <b-form-radio-group
            :id="`radio-group-${index}-${Math.floor(Math.random() * 100)}`"
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            :name="`radio-${index}`"
          />
        </template>
      </b-form-group>

      <div v-else-if="localItem.type==='multiple'">
        <b-input-group
          :prepend="localItem.label"
          :append="localItem.append"
        >
          <b-input
            v-for="mi in localItem.multiple.cls"
            :key="'mul' + mi"
            class="d-table"
            :disabled="localItem.isReadOnly"
          />
        </b-input-group>
      </div>

      <b-input-group
        v-else
        :append="localItem.append"
        :prepend="localItem.type!=='textarea' ? localItem.label: ''"
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
          />
        </div>
        <template v-else-if="localItem.type === 'select'">
          <b-form-select
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
          ></b-form-select>
        </template>

        <template v-else-if="localItem.type==='textarea'">
          <div class="w-100">
            <div
              v-if="localItem.label && localItem.label.trim()"
              v-text="localItem.label"
              class="bg-normal text-dark py-1 px-3 rounded-top"
              style="font-size: 18px; line-height: 1.7; margin-bottom: 0px;"
            />
            <b-form-textarea
              class="w-100"
              :class="{'with-title': localItem.label.trim()}"
              v-model="localItem.value"
              :disabled="localItem.isReadOnly"
              rows="3"
              max-rows="18"
            />
          </div>
        </template>

        <b-input
          v-else
          v-model="localItem.value"
          :disabled="localItem.isReadOnly"
        />
      </b-input-group>
    </template>

    <template v-else-if="isStatement">
      <div :class="localItem.theme">
        <h3
          v-if="localItem.label.trim()"
          v-text="localItem.label"
        />
        <p
          class="m-0"
          v-text="localItem.value"
        />
      </div>
    </template>

    <template v-else-if="isGap">
      <div />
    </template>

    <div class="controller-platform mt-1">
      <b-button
        class="px-3 mr-1"
        size="sm"
        variant="primary"
        @click="editItem"
      >修改</b-button>

      <b-button
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
      >移除</b-button>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      localItem: {},
      options: [],
    }
  },
  props: {
    item: {
      type: Object
    },
    pos: {
      type: Array
    }
  },
  created () {
    // this.localItem = Object.assign({}, this.item);
    this.localItem = this.item;
  },
  computed: {
    isFormType () {
      return ['text', 'textarea', 'select', 'radio', 'checkbox', 'multiple'].some(v => v === this.localItem.type);
    },
    isStatement () {
      return this.localItem.type === 'statement';
    },
    isGap () {
      return this.localItem.type === 'gap';
    }
  },
  methods: {
    editItem () {
      const [k1, k2] = this.pos;
      this.localItem.isFinish = false;
      this.$emit('updateSpecificItem', { k1, k2, item: this.localItem });
    },
    removeItem () {
      const [k1, k2] = this.pos;
      this.$emit('removeColumn', { k1, k2 });
    },
    changeType () {
      const [k1, k2] = this.pos;
      this.localItem.type = null;
      this.localItem.isFinish = null;
      this.$emit('updateSpecificItem', { k1, k2, item: this.localItem });
    },
  }
}
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
</style>

<style>
/* .input-group-text {
  min-width: 100px;
} */

.bg-normal {
  background-color: #b3b3b3;
}
</style>
