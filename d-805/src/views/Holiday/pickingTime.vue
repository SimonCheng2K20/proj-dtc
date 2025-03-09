<template>
  <div>

    <b-input-group
      :prepend="label"
      class="w-100 d-flex"
    >
      <div class="bg-white d-flex align-items-center flex-1 rounded-right">
        <input
          class="custom-picker text-center ml-auto"
          type="number"
          min="0"
          max="24"
          style="width: 50px;"
          v-model="pickupHour"
        >
        <font class="text-black">:</font>
        <input
          class="custom-picker text-center mr-auto"
          type="number"
          min="0"
          max="59"
          step="30"
          style="width: 50px;"
          :disabled="pickupHour=='24'"
          v-model="pickupMins"
        >
      </div>
    </b-input-group>

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      required: true
    }
  },
  computed: {
    pickupHour: {
      get () {
        return this.time.substr(0, 2);
      },
      set (val) {
        const min = (val === '24') ? '00' : this.time.substr(3, 2);
        this.$emit("update:time", `${this.$number2Digits(val)}:${min}:00`);
      }
    },
    pickupMins: {
      get () {
        return this.time.substr(3, 2);
      },
      set (val) {
        const newMin = (this.time.substr(0, 2) === '24') ? 0 : val;
        this.$emit("update:time", `${this.time.substr(0, 2)}:${this.$number2Digits(newMin)}:00`);
      }
    },
  }
}

</script>

<style scoped>
.custom-picker {
  border: none;
}
</style>
