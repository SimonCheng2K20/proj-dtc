<template>
  <div class="my-1 d-flex align-items-center">
    <div v-text="item.title" />:
    <div
      class="ml-2 content"
      v-text="item.value"
    />
    <!-- <b-input-group>
      <b-input-group-prepend v-text="item.title" />
      <b-input
        :plaintext="true"
        :variant="primary"
        type="text"
        v-model="item.value"
      />
    </b-input-group> -->
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  }
}
</script>
<style>
.content {
  min-width: 200px;
}
</style>
