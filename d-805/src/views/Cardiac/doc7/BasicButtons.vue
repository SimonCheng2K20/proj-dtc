<template>
  <sectoin class="dtc-car5-grid">
    <div class="nav">
      <font-awesome-icon icon="arrow-left" class="mt-1" />
      <div>2/123</div>
      <font-awesome-icon icon="arrow-right" class="mt-1" />
    </div>
    <div class="dtc-btns">
      <b-input-group prepend="連續報告">
        <b-button variant="warning">
          啟用
          <font-awesome-icon icon="check" class="ml-1" />
        </b-button>
        <b-button variant="info">取消</b-button>
      </b-input-group>
      <div></div>
      <main>
        <b-button variant="primary" class="mr-1"> <font-awesome-icon icon="images" class="mr-1" />呼叫PACS </b-button>
        <!-- <b-button variant="info">
          <font-awesome-icon icon="save" class="mr-1" />修改報告
        </b-button>-->
        <b-button variant="info"> <font-awesome-icon icon="save" class="mr-1" />暫存報告 </b-button>
        <b-button variant="success" class="mr-1"> <font-awesome-icon icon="address-card" class="mr-1" />正式報告 </b-button>
        <!-- <b-button variant="primary" class="mr-1">
          <font-awesome-icon icon="chalkboard-teacher" class="mr-1" />送交審核
        </b-button>
        <b-button variant="danger" class="mr-1">
          <font-awesome-icon icon="chalkboard-teacher" class="mr-1" />退回重寫
        </b-button>
        <b-button variant="success" class="mr-1">
          <font-awesome-icon icon="book-medical" class="mr-1" />片語維護
        </b-button>
        <b-button variant="danger" class="mr-1">
          <font-awesome-icon icon="sms" class="mr-1" />緊急通報
        </b-button>
        <b-button variant="info" class="mr-1">
          <font-awesome-icon icon="sms" class="mr-1" />CALL LAB
        </b-button>-->

        <b-button variant="dark">
          <b-spinner small type="grow" class="mr-1 align-middle" />
          <font-awesome-icon icon="bell" class="mr-1" />
          <span>交班記錄</span>
        </b-button>
        <!-- <b-button variant="info">
          <font-awesome-icon icon="edit" class="mr-1" />癌症報告
        </b-button>-->
        <b-button variant="success"> <font-awesome-icon icon="history" class="mr-1" />報告版次 </b-button>
        <b-button variant="primary" v-if="showHistoryBtn"> <font-awesome-icon icon="edit" class="mr-1" />歷史診斷報告 </b-button>
      </main>
    </div>
  </sectoin>
</template>

<script>
export default {
  data() {
    return {
      showHistoryBtn: false
    };
  },
  beforeMount() {
    this.$root.$on("car-report-toggle-detail", val => {
      this.showHistoryBtn = !val;
    });
  }
};
</script>

<style lang="scss" scoped>
.dtc-car5-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: 282px 1fr;
  grid-gap: 8px !important;
  > div {
    height: 38px;
    border: 1px solid white;
    border-radius: 5px;
  }
  .nav {
    display: grid;
    padding: 5px 1rem 0px 1rem;
    grid-template-columns: 30px 1fr 30px;
    text-align: center;
    grid-gap: 1rem;
    color: var(--light);
  }
  .dtc-btns {
    display: grid;
    grid-template-columns: max-content 1.3rem 1fr;
    overflow: hidden;
  }
  .input-group-prepend .input-group-text {
    min-width: 90px;
    max-width: 90px;
    max-height: 38px;
    background: rgba(0, 0, 0, 0.7);
    color: hsla(0, 0%, 100%, 0.7);
  }
  button {
    max-height: 38px;
  }
}
</style>
