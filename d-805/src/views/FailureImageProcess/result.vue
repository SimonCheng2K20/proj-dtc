<template>
  <div>
    <b-table
      bordered
      striped
      small
      show-empty
      class="mb-1"
      :items="rowData.Items"
      :fields="fields"
      :empty-html="html4EmptyContent"
    >
      <template v-slot:cell(imageChecking)="data">
        <!-- {{ data.index + 1 }} -->
        <b-btn
          variant="primary"
          size="sm"
          @click.stop="showImageEvent(data.item.AccessionNo)"
        >檢視</b-btn>
      </template>

      <template v-slot:cell(imageUpload)="data">
        <b-form-file
          plain
          size="sm"
          style="width: 220px;"
          ref="file-input"
          @change="(event)=>uploadImage(event, data.item.AccessionNo)"
          accept="image/jpeg, image/png, image/gif"
        />
      </template>
    </b-table>
    <b-row :noGutters="true">
      <b-col
        cols="4"
        offset="4"
      >
        <b-pagination
          class="pagination"
          v-model="currentPage"
          :total-rows="rowData.Count"
          :per-page="perPage"
          aria-controls="my-table"
        />
      </b-col>
    </b-row>

  </div>
</template>

<script>
import fieldData from "./fieldData.json";
export default {
  data () {
    return {
      fieldData,
      isLoading: false,
      currentPage: 1,
      rows: 1,
      perPage: 10
    }
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({ Count: 0, Items: [] })
    }
  },
  computed: {

    html4EmptyContent () {
      return this.isLoading
        ? '<b class="text-success"><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : "<b>很抱歉, 目前並無任何內容可供呈現.</b>";
    },
    fields () {
      return [
        { key: 'imageChecking', label: '檢視影像' },
        { key: 'imageUpload', label: '上傳影像' },
        ...this.fieldData
      ];
    }

  },
  mounted () {
    // setTimeout(() => this.isLoading = true, 5000);
  },
  methods: {
    showImageEvent (accessionNo) {
      this.$emit("readImage", accessionNo);
    },
    uploadImage (event, accessionNo) {
      this.$emit("uploadImage", { data: event.target.files, accessionNo });
      setTimeout(() => {
        event.target.value = '';
      }, 1000);
    }
  }
}
</script>

<style lang="scss">
.pagination {
  li:nth-child(1) {
    margin-left: auto;
  }
  li:nth-last-child(1) {
    margin-right: auto;
  }
}
</style>
