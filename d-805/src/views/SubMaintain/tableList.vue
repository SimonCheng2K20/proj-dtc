<template>
  <div>
    <b-table
      striped
      small
      head-variant="dark"
      class="rounded"
      :items="currentItems"
      :fields="fields"
    >

      <template v-slot:cell(Operation)="data">
        <b-button
          variant="success"
          @click="$emit('reviewSecs', data.item)"
          class="mr-1"
          size="sm"
        >預覽</b-button>

        <b-button
          class="mr-1"
          variant="primary"
          @click="$emit('editSecs', data.item)"
          size="sm"
        >編輯</b-button>

        <b-button
          variant="danger"
          @click="$emit('remove', data.item)"
          size="sm"
        >刪除</b-button>
      </template>

    </b-table>
    <div class="d-grid grid-col-3">
      <div
        style="grid-column-start: 2;"
        class="d-flex justify-content-center"
      >
        <b-pagination
          class="mx-auto"
          v-model="currentPage"
          :total-rows="rowCount"
          :per-page="perPage"
          aria-controls="uncstTable"
        />
      </div>
      <div class="d-flex align-items-center">
        <label class="mr-3 mb-0 ml-auto">
          共計 <b>{{$FormatForceInteger(this.rowCount)}}</b> 筆, 每頁顯示
        </label>
        <b-form-select
          id="pagingPerPageOption"
          size="sm"
          plain
          v-model="perPage"
          :options="this.$DefaultPerPageOption"
          @change="ChangePerPage"
          style="width: 150px;"
          class="mr-2"
        />

      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'reportId', label: '代號', sortable: true },
        { key: 'reportTitle', label: '報告名稱', sortable: true },
        { key: 'CSTVersion', label: '版次', sortable: true },
        { key: 'Operation', label: '操作' }
      ],
      currentPage: 1,
      perPage: 10
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    rowCount () {
      return this.items.length
    },
    currentItems () {
      return this.items.filter((item, idx) => idx >= (this.currentPage - 1) * this.perPage && this.currentPage * this.perPage > idx)
    },
    GetPageOptionLabel () {
      return "共計 <b>" + this.$FormatForceInteger(this.rowCount) + "</b> 筆, 每頁顯示&nbsp;";
    },
  },
  methods: {
    ChangePerPage () {
      alert(this.perPage);
    }
  }
}
</script>

<style>
</style>
