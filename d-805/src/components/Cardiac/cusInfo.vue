<template>
  <CardiacFrame
    class="cus-info"
    :numberOfColumn="numberOfColumn"
    :title="title"
    :theme="theme"
    :border="border"
    :padding="padding"
  >
    <div
      :class="{'d-flex align-items-center': input.before || input.after}"
      v-for="(input, index) in inputs"
      :key="index"
    >
      <div
        class="text-light px-1"
        v-if="input.before"
        v-text="input.before"
      />
      <b-form-group
        v-if="input.type === 'checkbox' || input.type === 'radio' || input.type === 'multipleInput'"
        :label="`${input.label ? input.label + ': ' : ''}`"
      >
        <template v-if="input.type === 'checkbox'">
          <div class="p-1 rounded text-light">
            <b-form-checkbox-group
              switches
              :id="`checkbox-group-${index}`"
              :name="`flavour-${index}`"
              :options="input.options"
              v-model="input.value"
            />
          </div>
          <div class="w-100 mt-1">
            <b-input
              v-if="input.extra && input.extra.key == input.value"
              v-model="input.extra.value"
            />
          </div>
        </template>

        <template v-if="input.type === 'radio'">
          <div class="d-flex">
            <b-form-radio-group
              :id="`radio-group-${index}-${Math.floor(Math.random() * 100)}`"
              v-model="input.value"
              :options="input.options"
              :name="`radio-${index}`"
            />

            <div class="ml-1">
              <b-input
                v-if="input.extra && input.extra.key == input.value"
                v-model="input.extra.value"
              />
            </div>
          </div>
        </template>

        <div
          v-if="input.type === 'multipleInput'"
          class="d-flex align-items-center"
        >
          <template v-for="(s, i) in input.source">
            <span
              class="multiple-string px-1"
              :key="i"
              v-if="s.type === 'String'"
              v-text="s.value"
            />
            <b-input
              :key="i"
              v-if="s.type === 'text'"
              v-model="input[s.value]"
            />
          </template>
        </div>
        <!-- <template v-else-if="input.type === 'multipleInput'">
          <label v-text="input."></label>
        </template> -->
      </b-form-group>

      <b-input-group
        v-else
        :prepend="input.label"
        :class="{ dFlex: input.type === 'date' }"
      >
        <div
          v-if="input.type === 'date'"
          class="date-picker"
        >
          <ejs-datepicker
            v-model="input.value"
            ref="StartTime"
            id="StartTime"
            name="StartTime"
            class="e-field"
            step="5"
            :allowEdit="false"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          />
        </div>
        <template v-else-if="input.type === 'select'">
          <b-form-select
            v-model="input.value"
            :options="input.options"
          ></b-form-select>
          <div
            class="w-100 mt-1"
            v-if="input.extra && input.extra.key == input.value"
          >
            <b-input v-model="input.extra.value" />
          </div>
        </template>

        <b-form-textarea
          v-else-if="input.type==='textarea'"
          v-model="input.value"
        />

        <b-input
          v-else
          v-model="input.value"
        />
        <div
          class="input-group-append"
          v-if="input.unit"
        >
          <span
            class="input-group-text"
            v-text="input.unit"
          />
        </div>

      </b-input-group>
      <div
        class="text-light px-1"
        v-if="input.after"
        v-text="input.after"
      />
    </div>
  </CardiacFrame>
</template>

<script>
import CardiacFrame from './frame'
export default {
  data () {
    return {}
  },
  props: {
    inputs: {
      type: Array
    },
    title: {
      type: String
    },
    theme: {
      type: String
    },
    numberOfColumn: {
      type: Array
    },
    border: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: { width: 0, color: 'transparent', radius: 0 }
    },
    padding: {
      type: Number
    }
  },
  components: {
    CardiacFrame
  }
}
</script>

<style lang="scss">
.date-picker {
  flex: 1 0 0;
  > span {
    height: 100%;
    border-radius: 0 5px 5px 0 !important;
  }
}
.multiple-string {
  white-space: nowrap;
}

.cus-info {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
