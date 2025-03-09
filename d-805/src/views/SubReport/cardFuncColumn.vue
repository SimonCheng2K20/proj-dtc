<template>
  <div>
    <b-row
      no-gutters
      class="mt-1"
    >
      <b-col
        sm="4"
        class="px-1"
      >
        <b-card
          no-body
          bg-variant="transparent"
          class="h-100 history-card border"
        >
          <b-card-header class="bg-primary text-white font-weight-bold cardHeader">
            <div @click="$emit('showVersionAlert', 2)">
              歷史診斷報告
              {{ this.historyList.length > 0 && !this.loadingHistory ? `(共${this.historyList.length}筆 )` : "(暫無記錄)" }}
            </div>
          </b-card-header>

          <b-card-text
            v-if="this.loadingHistory"
            style="flex-direction:column;padding: 1rem; text-algin:center; display:flex;"
          >
            <div>歷史診斷報告載入中, 請稍待 ..{{this.loadingHistory}}</div>
            <b-spinner
              type="grow"
              label="Spinning"
              class="pl-3"
            ></b-spinner>
          </b-card-text>

          <b-card-text
            class="p-0 flex-1"
            style="overflow-y: auto;"
          >
            <b-container
              fluid
              class="p-0"
            >
              <b-row no-gutters>
                <div
                  ref="blkHistoryList"
                  class="sb4RHis w-100"
                  style="position:relative;"
                >
                  <div
                    class="dtc-his-grid d-flex"
                    style="background:#343a40"
                  >
                    <div
                      v-if="historyList.length"
                      style="padding-left:18px"
                      class="title flex-1 text-white"
                    >項目</div>
                    <div
                      v-if="historyList.length"
                      class="title flex-2 text-white"
                    >完成時間</div>
                  </div>
                  <div
                    class="dtc-his-grid d-flex"
                    style="padding-top:5px;"
                    v-for="(item, i) in historyList"
                    :id="'dtc-history' + i"
                    :key="'dtc-history' + i"
                    @click="$emit('viewHistoryReport', { item, index: i})"
                    :class="i === 0 ? 'active-history' : ''"
                  >
                    <div
                      class="title pl-1 flex-1"
                      :title="item.ProcedureNameList"
                    >
                      {{ item.ProcedureName ? item.ProcedureName : item.ReportContent }}
                    </div>
                    <div
                      class="title flex-2"
                      :title="item.ProcedureNameList"
                      v-text="item.IssueTime ? DateToString(new Date(item.IssueTime)) : '暫無資料'"
                    ></div>
                  </div>
                  <!-- <b-link style="display:block;" class="my-1 ml-2 text-white" :class="{'text-white':!isWhite, 'text-black': isWhite}" v-for="(item, i) in historyList" :key="i">{{item}} </b-link> -->
                </div>
              </b-row>
            </b-container>
          </b-card-text>

        </b-card>
      </b-col>

      <b-col
        sm="4"
        class="px-1"
      >
        <b-card
          no-body
          bg-variant="transparent"
          class="border"
        >
          <b-card-header class="bg-danger text-white font-weight-bold cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >客觀 {{ !theProcedure.Objective ? "(暫無記錄)" : "" }}</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="p-0">
            <b-container
              fluid
              class="p-0"
            >
              <b-row no-gutters>
                <b-textarea
                  id="Objective"
                  tag="Objective"
                  no-resize
                  rows="4"
                  class="border-0 rounded-0"
                  v-model="theProcedure.Objective"
                  readonly
                ></b-textarea>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col
        sm="4"
        class="px-1"
      >
        <b-card
          no-body
          bg-variant="transparent"
          class="border"
        >
          <b-card-header class="bg-info text-white font-weight-bold cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >主訴 {{ !theProcedure.Subjective ? "(暫無記錄)" : "" }}</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="p-0">
            <b-container
              fluid
              class="p-0"
            >
              <b-row
                ref="blkSubjective"
                no-gutters
              >
                <b-textarea
                  tag="Subjective "
                  no-resize
                  rows="4"
                  class="border-0 rounded-0"
                  v-model="theProcedure.Subjective"
                  readonly
                ></b-textarea>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
      <!-- <b-col
        sm="3"
        class="px-1"
      >
        <b-card no-body>
          <b-card-header class="bg-warning font-weight-bold cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                @click="$emit('showPacsUrl')"
                class="float-left text-left"
              >檢查註記 {{ !theProcedure.RadiographerNote ? "(暫無記錄)" : "" }}</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="p-0">
            <b-container
              fluid
              class="p-0"
            >
              <b-row no-gutters>
                <b-textarea
                  no-resize
                  rows="4"
                  tag="RadiographerNote"
                  class="border-0 rounded-0"
                  v-model="theProcedure.RadiographerNote"
                  readonly
                ></b-textarea>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col> -->
    </b-row>
  </div>

</template>

<script>
import { dateFormatMixin } from "@/SupportLib_J.js";
export default {
  mixins: [dateFormatMixin],
  data () {
    return {

    }
  },
  props: {
    labProcedures: {
      type: String,
    },
    specificProcedure: {
      type: Object,
    },
    historyList: {
      type: Array
    },
    isLoading: {
      type: Boolean
    },
    isWhite: {
      type: Boolean,
      default: false
    },
    isBlack: {
      type: Boolean,
      default: false
    },
    isGray: {
      type: Boolean,
      default: false
    }

  },
  created () {

  },
  computed: {
    theProcedure () {
      return this.specificProcedure;
    },
    loadingHistory () {
      return this.isLoading;
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
/deep/ textarea {
  &.form-control:disabled,
  &.form-control[readonly] {
    background-color: transparent;
    color: inherit;
  }
}
.history-card {
  overflow-y: auto;
  height: 80px;
}
</style>
