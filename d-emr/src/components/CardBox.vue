<template>
  <div class="cardBox" ref="cardBox">
    <div class="cardBoxTitle" v-if="title">{{title}}</div>
    <slot name="header" />
    <div class="cardBoxContent">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>