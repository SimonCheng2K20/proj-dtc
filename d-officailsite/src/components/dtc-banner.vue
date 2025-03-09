<template>
  <div class="dtc-banner d-flex align-items-center justify-content-center" :style="{backgroundImage: `url(${image})`}">
    <div class="slogan" :style="`color: ${fontColor}`">
      <h1 class="m-0" v-text="title" />
      <div class="path" v-text="path" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      fontColor: {
        type: String,
        default: '#fff'
      }
    }
  }
</script>
 
<style lang="scss" scoped>

.dtc-banner {
  background: transparent no-repeat center center / cover;
  width: 100%;
  height: 40vw;
}
.slogan {
  text-align: center;
  font-weight: bold;
  h1 {
    font-size: 1.7rem;
  }
  .path {
    font-size: 0.7rem;
  }
}

</style>
