<template>
  <div
    class="pageContent"
    style="min-height:829px;"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">
            檢查室報到．查詢作業．檢查室︰
            <span class="font-weight-bold">{{ labRoomId }}</span>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="申請單號">
                <b-input value="R123456789" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病歷號">
                <b-input value="H123456789" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="身分證號">
                <b-input value="A123456789" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="開單日期">
                <b-input value="108/12/31" />
                <b-input-group-append>
                  <b-button variant="outline-success">
                    <font-awesome-icon icon="calendar-alt" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="至">
                <b-input value="108/12/31" />
                <b-input-group-append>
                  <b-button variant="outline-success">
                    <font-awesome-icon icon="calendar-alt" />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button variant="success">
                <font-awesome-icon icon="eraser" />清除條件
              </b-button>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查項目">
                <b-select
                  v-model="selectedCheckItem"
                  :options="optionsCheckItem"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患來源">
                <b-select
                  v-model="selectedPatientSource"
                  :options="optionsPatientSource"
                />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="急作">
                <b-form-radio-group name="QryEmergency" class="pt-2 pl-2 rounded-right" style="border:1px solid #ced4da">
                  <b-form-radio value="Y">是</b-form-radio>
                  <b-form-radio value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="預定檢查室">
                <b-select v-model="selectedLabRoom" :options="optionsLabRoom" />
              </b-input-group>
            </b-col>
            <b-col sm="2" class="px-1">
              <b-input-group prepend="作業進度">
                <b-select v-model="selectedProgress" :options="optionsOpProgress" />
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button variant="primary">
                <font-awesome-icon icon="search" />進行查詢
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 mx-0 pl-1 pr-0">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border:1px solid #ced4da; min-height:690px;">
            <twp
              ref="twp1"
              v-bind:FieldConfig="tableConfig4QueryResult"
              v-bind:RowData="tableContent4QueryResult"
              v-bind:OpButton1Func="RowClickFunction"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import twp from "@/components/TWPv2";
import { mapGetters } from "vuex";
const queryResult = require("@/assets/DataSource/DR0101001");
const todayList = require("@/assets/DataSource/DR0101002");
const checkItem = require("@/assets/DataSource/DR0407001");
const patientSource = require("@/assets/DataSource/DR0431001");
const labRoomList = require("@/assets/DataSource/DR0404001");
const opProgress = require("@/assets/DataSource/DR04X1001");

export default {
  name: "FI0201",
  components: { twp },
  data () {
    return {
      BasePath: this.$route.path,
      labRoomId: "CR001",
      selectedLabRoom: 1,
      state4TodayList: false,
      tableConfig4QueryResult: [],
      tableContent4QueryResult: [],
      tableConfig4TodayList: [],
      tableContent4TodayList: [],
      selectedCheckItem: null,
      optionsCheckItem: [],
      selectedPatientSource: 1,
      optionsPatientSource: [],
      optionsLabRoom: [],
      selectedProgress: 31,
      optionsOpProgress: []
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
    col4QueryResult () {
      return this.state4TodayList ? 8 : 12;
    }
  },
  methods: {
    RowClickFunction (x, srcParamId) {
      console.log(`Row Function Button Clicked. (${x.guid})`);
      this.$router.replace(this.BasePath + "/" + x.guid);
    }
  },
  created () {
    this.tableConfig4QueryResult = queryResult.PresentConfig();
    this.tableContent4QueryResult = queryResult.DataSet();
    //
    this.tableConfig4TodayList = todayList.PresentConfig();
    this.tableContent4TodayList = todayList.DataSet();
    //
    this.optionsCheckItem = checkItem.Options();
    this.optionsPatientSource = patientSource.Options();
    this.optionsLabRoom = labRoomList.Options();
    this.optionsOpProgress = opProgress.Options();
  }
};
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
</style>
