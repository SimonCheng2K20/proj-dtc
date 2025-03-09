<template>
  <div>

    <b-card
      :header-bg-variant="altExpend == item.Id ? 'success' : 'danger'"
      header-size="sm"
      body-bg-variant="transparent"
      class="mb-2"
      v-for="item in MergeList"
      :key="item.Id + '_' + item.ChangeToModality"
    >
      <template
        class="p-1"
        v-slot:header
      >
        <div class="text-white d-flex align-items-center">
          檢查項目:
          <b-form-group
            variant="success"
            class="ml-2 mb-0 p-0"
          >
            <b-form-checkbox-group
              size="lg"
              v-model="item.CheckedAccessions"
              :options="item.ProcedureAccession"
            />
          </b-form-group>

        </div>

        <div
          @click="altExpend = altExpend === item.Id ? null : item.Id"
          class="cursor-pointer position-absolute change-item bg-white text-primary px-1 rounded"
        >
          變更項目
          <font-awesome-icon icon="exchange-alt" />
        </div>
      </template>

      <template v-if="!MergeList.some(i => i.CounterRegister)">
        <b-collapse
          :id="'collapse-' + item.Id"
          class="mt-2"
          :visible="altExpend !== item.Id"
        >
          <div>
            預計檢查室:
            {{
              item.temproom && item.roomList && item.roomList.length === 1
                ? item.roomList.find(it => it.value == item.temproom)["text"] || "unknown"
                : item.roomList && item.roomList.length > 0
                ? "請選擇下列檢查室"
                : "目前此檢查項目沒有符合的檢查室"
            }}
          </div>
          <div
            class="p-2"
            v-if="item.roomList && item.roomList.length > 1"
          >
            <b-form-radio-group
              :id="`radio-group-${item.Id}`"
              v-model="item.temproom"
              :options="item.roomList"
              :name="`radio-group-${item.Id}`"
              @change="itemRoomChangeEvent"
            />
          </div>
        </b-collapse>

        <b-collapse
          :id="'collapse-' + item.Id"
          :visible="altExpend == item.Id"
        >
          <changeItems
            :key="'changeItems_' + item.Id"
            :items="item.ProcedureCodeList"
            :accessionNo="item.Accessions"
            :modality="item.Modality"
            v-on:closeChangeEvent="() => (altExpend = null)"
            v-on:completeChangeEvent="updateChangeItemsEvent"
          />
        </b-collapse>
      </template>

      <div v-else>已報到</div>
    </b-card>

    <font
      v-if="unExamList.length > 0"
      color="#FF0000"
    >尚未安排之檢查: {{ unExamList.map(({ ProcedureName }) => `【${ProcedureName}】`).join(", ") }}</font>
    <div
      v-for="item in MergeList.UnCheckList"
      v-bind:key="item.id"
      class="mt-2"
    >
      <font color="#FF0000">檢查項目:{{ item.ProcedureName }}申請單號為:{{ item.AccessionNo }}</font>
    </div>
    <div class="merge-modal-btns">
      <b-button
        variant="danger"
        v-if="MergeList.some(i => i.CounterRegister)"
        @click="$emit('Checkin_cancel', MergeList)"
      >
        <font-awesome-icon
          icon="search"
          class="mr-2"
        />取消報到
      </b-button>

      <template v-else>
        <b-button
          id="Button_color"
          :disabled="!MergeList || MergeList.some(i => !i.temproom) || altExpend"
          @click="$emit('confirm_room', {confirm: true, print: false})"
        >
          <font-awesome-icon
            icon="calendar-check"
            class="mr-2"
          />確定報到
        </b-button>
        <b-button
          id="Button_color"
          :disabled="!MergeList || MergeList.some(i => !i.temproom) || altExpend"
          @click="$emit('confirm_room', {confirm: true, print: true})"
        >
          <font-awesome-icon
            icon="print"
            class="mr-2"
          />確定報到及列印
        </b-button>

        <b-button
          class="purple-button"
          v-if="changeBtn"
          variant="primary"
          :disabled="!MergeList || MergeList.some(i => !i.temproom) || altExpend"
          @click="$emit('changeCheck')"
        >
          <font-awesome-icon
            icon="history"
            class="mr-2"
          />預約/變更時間
        </b-button>
      </template>

      <b-button
        id="Button_color"
        @click="$emit('confirm_room', {confirm: true, print: false})"
      >
        <font-awesome-icon
          icon="eraser"
          class="mr-2"
        />取消 </b-button>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    MergeList: {
      type: Array,
      required: true
    },
    unExamList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
</style>
