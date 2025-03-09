<template>
  <div class="cardBox" ref="cardBox">
    <div class="cardBoxTitle" v-if="title">
      <div>{{title}}</div>
      <slot name="header" />
    </div>
    <div class="cardBoxContent" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title','contentClass']
}
</script>