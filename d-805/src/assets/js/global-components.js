export default [
  {
    name: "page-title",
    comp: {
      props: ["title", "img"],
      template: `
        <div class="d-flex align-items-center pl-3 border-bottom my-2">
          <h5>
            <font-awesome-icon
              v-if="img"
              :icon="img"
              class="mr-1"
            />
          </h5>
          <h3 v-text="title" />
          <slot />
        </div>`,
    },
  },
  { // style="background-color: ${color || '#C9E6FF'}"
    name: "color-title",
    comp: {
      props: {
        //  ["title", "img", "color"]
        title: {
          type: String,
          default: ''
        },
        img: {
          type: String,
          default: null
        },
        bgc: {
          type: String,
          default: '#007bff'
        },
        color: {
          type: String,
          default: 'inherit'
        }
      },
      template: `
        <div class="d-flex align-items-center pl-3 py-2 font-weight-bold" :style="{backgroundColor: bgc, color: color}">
          <font-awesome-icon v-if="img" :icon="img" class="mr-1" />
          <div v-text="title" />
          <slot />
        </div>`,
    },
  },
  {
    name: "card-frame",
    comp: {
      props: {
        theme: {
          type: Object,
          default: () => ({ bg: "primary", color: "white" }),
        },
        title: {
          type: String,
          default: "",
        },
      },
      template: `
        <b-card
          :header-bg-variant="theme.bg"
          :header-text-variant="theme.color"
          class="bg-transparent card-border mb-2"
          header-class="p-1 px-2"
          body-class="p-1"
        >
          <template v-slot:header>
            <div v-text="title" />
          </template>
          <slot />
        </b-card>`,
    },
  },
  {
    name: "k-radio",
    comp: {
      props: {
        value: {
          type: [Number, String, Boolean],
          default: null
        },
        options: {
          type: Array,
          default: () => []
        },
        marginRight: {
          type: Number,
          default: 4
        },
        dividClass: {
          type: String,
          default: ''
        },
        minWdt: {
          type: Number,
          default: 50
        }
      },
      template: `
      <div :class="dividClass">
        <form :class="'mr-' + marginRight" v-for="(option, idx) in options" :key="'option' + idx" :style="'min-width: ' + minWdt + 'px;'">
          <label class="mb-0">
            <input type="radio" v-model="localValue" :value="option.value" />
            {{ option.text }}
          </label>
        </form>
      </div>
      `,
      data() {
        return {
          localValue: ''
        }
      },
      created() {
        this.localValue = this.value;
      },
      watch: {
        localValue () {
          this.$emit("updateValue", this.localValue)
        }
      }
    }
  },
  {
    name: "k-form",
    comp: {
      props: {
        label: {
          type: Object,
          default: () => ({ text: '', class: ''})
        },
        dividWidth: {
          type: Number,
          default: 10
        },
        unit: {
          type: String
        },
        border: {
          type: Boolean,
          default: true
        }
      },
      template: `
        <div class="k-input d-flex align-items-center" :class="'wpx-' + dividWidth + (border ? '': ' no-border')">
          <div v-if="label.text" v-text="label.text" :class="label.class" />
          <b-input-group :append="unit || ''" size="sm" class="d-flex align-items-center">
            <slot />
          </b-input-group>
        </div>
      `
    }
  },
  {
    name: "k-input",
    comp: {
      props: {
        label: {
          type: Object,
          default: () => ({ text: '', class: ''})
        },
        tail: {
          type: Object,
          default: () => ({ text: '', class: ''})
        },
        unit: {
          type: String,
          default: ''
        },
        value: {
          type: [Number, String],
          default: null
        },
        dividWidth: {
          type: Number,
          default: 10
        },
        type: {
          type: String
        },
        maxNum: {
          type: Number,
          default: 999
        },
        minNum: {
          type: Number
        }
      },
      template: `
      <div class="k-input d-flex align-items-center" :class="'wpx-' + dividWidth">
        <div v-if="label.text" v-text="label.text" :class="label.class" />
        <b-input-group :append="unit || ''" size="sm" class="d-flex align-items-center">
          <b-input v-model="value" :type="type" :min="minNum" :max="maxNum" @blur="$emit('blurEvent')" />
        </b-input-group>
        <div v-if="tail.text" v-text="tail.text" :class="tail.class" />
      </div>
      `,
      watch: {
        value (newVal) {
          if(this.maxNum && this.type && this.type == 'Number' && newVal > this.maxNum) this.value = this.maxNum;
          this.$emit("updateValue", this.value)
        }
      }
    }
  },
  {
    name: "k-list-input",
    comp: {
      props: {
        options: {
          type: Array,
          default: () => []
        },
        value: {
          type: String,
          default: ''
        },
        listName: {
          type: String,
          require: true
        }
      },
      template: `
      <div class="w-100">
        <input class="w-100" type="text" name="city" @change="e => { $emit('updateValue', e.target.value) }" :list="listName" style="border-radius: 5px; border: 1px solid #ddd; padding-left: 5px;">
        <datalist :id="listName">
          <option v-for="option in options" :key="option" :value="option">
        </datalist>
      </div>
      `
    }
  }
];
