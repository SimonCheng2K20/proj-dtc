<template>
  <div :class="`gridCol-${localItem.span}`">
    <template v-if="isFormType">
      <b-form-group
        v-if="localItem.type === 'checkbox' || localItem.type === 'radio'"
        :label="`${localItem.label ? localItem.label + ': ' : ''}`"
        class="text-white"
      >
        <template v-if="localItem.type === 'checkbox'">
          <b-form-checkbox-group
            switches
            :id="`checkbox-group-${index}`"
            :name="`flavour-${index}`"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            @change="updateItem"
            v-model="localItem.value"
          />
        </template>

        <template v-if="localItem.type === 'radio'">
          <b-form-radio-group
            :id="`radio-group-${index}-${Math.floor(Math.random() * 100)}`"
            v-model="localItem.value"
            :options="localItem.options"
            :disabled="localItem.isReadOnly"
            @change="updateItem"
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
            v-model="localItem.value[mi]"
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

        <template v-else-if="localItem.type==='textarea'">
          <div class="w-100">
            <div
              v-if="localItem.label.trim()"
              v-text="localItem.label"
              class="bg-normal text-dark py-1 px-3 rounded-top"
              style="font-size: 18px; line-height: 1.7; margin-bottom: 0px;"
            />
            <b-form-textarea
              class="w-100 with-title"
              :class="{'with-title': localItem.label.trim()}"
              rows="3"
              max-rows="18"
              v-model="localItem.value"
              :disabled="localItem.isReadOnly"
              @change="updateItem"
            />
          </div>
        </template>

        <b-input
          v-else
          v-model="localItem.value"
          :disabled="localItem.isReadOnly"
          @change="updateItem"
        />
      </b-input-group>
    </template>

    <div v-else-if="localItem.type==='gap'" />

    <template v-else-if="localItem.type==='statement'">
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

  </div>
</template>

<script>
import bus from '@/assets/service/bus.js';
export default {
  data () {
    return {
      localItem: {},
      options: [],
      multValues: {}
    }
  },
  props: {
    item: {
      type: Object
    },
    pos: {
      type: Array
    },
    secTime: {
      type: Number
    }
  },
  created () {
    this.localItem = Object.assign({}, this.item);
  },
  computed: {
    isFormType () {
      return ['text', 'textarea', 'select', 'radio', 'checkbox', 'multiple'].some(v => v === this.localItem.type);
    }
  },
  methods: {
    updateItem () {
      bus.$emit('updateItem', { key: this.localItem.key, value: this.localItem.value, secTime: this.secTime });
    },
    multChange () {
      this.localItem.value = this.multValues;
      this.updateItem();
    }
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
.input-group-prepend .input-group-text {
  min-width: 90px;
}

.bg-normal {
  background-color: #b3b3b3;
}
</style>
