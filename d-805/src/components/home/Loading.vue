<template>
  <section class="loadingApi">
    <div>
      資料處理中請稍後。
      <b-spinner class="mr-1" type="grow" small label="Spinning"></b-spinner>
      <b-spinner class="mr-1" type="grow" small label="Spinning"></b-spinner>
      <b-spinner class="mr-1" type="grow" small label="Spinning"></b-spinner>
    </div>
  </section>
</template>

<script>
// import Swal from "sweetalert2";

export default {
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.loadingApi {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.7);
  border-radius: 0 0 5px 5px;
  display: grid;
  place-items: center;
  color: white;
  z-index: 12345677;
}
</style>
