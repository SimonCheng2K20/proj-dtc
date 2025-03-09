<template>
  <div class="inputLabel">
    <el-form-item class="inputLabelBox" :label="title" :prop="prop">
      <slot />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    prop: {},
    title: {},
    labelWidth: {
      default:'40%'
    }
  },
}
</script>