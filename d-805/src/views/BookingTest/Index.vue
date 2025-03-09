<template>
  <div class="pageLeftContent pb-1">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader py-2">
        <b-row no-gutters>
          <b-col cols="6">排程 Booking</b-col>
        </b-row>
      </b-card-header>

      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <!-- 負數大單 -->
          <div v-for="(order, index) in bookingOrders" :key="index" class="my-3">
            <!-- 預約項目 -->
            <b-row no-gutters>
              <b-col class="px-1">
                預約檢查項目
                <ejs-dropdownlist
                  v-model="selectCheckItems[index]"
                  :dataSource="filteredCheckItems[index]"
                  :fields="{ text: 'Name', value: 'No' }"
                  placeholder="檢查項目"
                  mode="Box"
                ></ejs-dropdownlist>
              </b-col>
            </b-row>

            <b-row no-gutters>
              <b-col class="px-1 mb-3" style="text-align: right;">
                <input v-model="filterKey[index]" class="w-100 mt-1" />
              </b-col>
            </b-row>

            <!-- 預約日期 -->
            <b-row no-gutters>
              <b-col class="px-1">
                <ejs-datepicker
                  ref="StartTime"
                  id="StartTime"
                  name="StartTime"
                  placeholder="預約日期"
                  v-model="viewDate"
                ></ejs-datepicker>
              </b-col>
            </b-row>
            <!-- 申請單號 -->
            <b-row no-gutters>
              <b-col class="px-1">
                <ejs-textbox
                  v-model="bookingOrders[index]"
                  floatLabelType="Always"
                  placeholder="申請單號(大單號)"
                  @keyup.enter="onFilter"
                />
              </b-col>
            </b-row>
          </div>

          <b-row no-gutters>
            <b-col class="px-1">
              <b-button
                variant="primary"
                @click="dialogOpened = true"
              >
                <font-awesome-icon icon="save" /> 預約</b-button>
            </b-col>
          </b-row>
          <!-- Token -->
          <b-row no-gutters>
            <b-col>
              <ejs-textbox
                v-model="token"
                floatLabelType="Always"
                placeholder="Token"
              />
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col class="px-1">
              <b-button
                variant="primary"
                @click="openHisWindow()"
              >
                <font-awesome-icon icon="save" /> HIS預約</b-button>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col class="px-1">
              <b-button
                variant="primary"
                @click="openHisWindowPost()"
              >
                <font-awesome-icon icon="save" /> HIS預約 Post</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <mu-dialog
      transition="slide-bottom"
      fullscreen
      :open.sync="dialogOpened"
    >
      <mu-appbar
        color="primary"
        title="選擇排程時段"
      >
        <b-row no-gutters>
          <b-col
            class="px-1"
            cols="6"
          >
            選擇排程時段
          </b-col>
          <b-col
            class="text-right"
            cols="6"
          >
            <b-button
              variant="primary"
              @click="dialogOpened = false"
            >
              <font-awesome-icon icon="times" />
            </b-button>
          </b-col>
        </b-row>
      </mu-appbar>
      <bookingView
        :bookingObjs="bookingObjs"
        :bookingDate="viewDate"
        :patientInfo="patientInfo"
      ></bookingView>
    </mu-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
// import Swal from "sweetalert2";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import * as configs from "@/config";
import bookingView from "@/components/Booking/Index";
import { MultiSelectPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import "muse-ui/dist/muse-ui.css";
import { Dialog, AppBar } from "muse-ui";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(TextBoxPlugin);
Vue.use(MultiSelectPlugin);
Vue.use(DatePickerPlugin);

export default {
  data () {
    return {
      dialogOpened: false,
      checkItems: [],
      selectCheckItems: [],
      token: "",
      // locationId:1,
      viewDate: new Date(),
      // endDate: new Date(2019, 9, 31),
      //orderNo: "AAA33072033",
      sockConnection: null,
      hubProxy: null,
      patientInfo: {
        name: "海杰王",
        id: "A987654321",
        gender: "男",
        hrNum: "A123456589",
        sourceType: "O",
        birthDay: new Date(2019, 12, 14)
      },
      bookingOrders: ["S123456589", "S123456590"],
      filterKey: ['', '']
    };
  },
  components: {
    bookingView
  },
  methods: {
    // autoBooking: function() {
    //   let _this = this;
    //   window.axios.get("/schedule/GetFirstFreeTimeSlot?checkItemNo=" + this.selectCheckItems[0].No + "&startTime=" + this.viewDate.toJSON()).then(e => {
    //     let timeslot = e;
    //     Swal.fire({
    //       type: "question",
    //       title: "是否預約？",
    //       showCancelButton: true,
    //       confirmButtonColor: "#20d320",
    //       cancelButtonColor: "#3085d6",
    //       confirmButtonText: "確定預約",
    //       cancelButtonText: "暫不預約",
    //       html: "<br>可預約時間：<b>" + timeslot.StartTime.toLocaleString("zh-TW", { timeZone: "UTC" }) + "</b><br>可預約檢查室：<b>" + timeslot.LocationName + "</b>"
    //     }).then(function(e) {
    //       if (e.value) {
    //         _this.hubProxy
    //           .invoke("addTimeSlot", timeslot)
    //           .then(e => {
    //             if (e.Success) {
    //               Swal.fire({
    //                 type: "success",
    //                 title: "預約成功！",
    //                 html:
    //                   "姓名：<b>" +
    //                   "李小民" +
    //                   "</b><br>預約時間：<b>" +
    //                   timeslot.StartTime.toLocaleString("zh-TW", {
    //                     timeZone: "UTC"
    //                   }) +
    //                   "</b>"
    //               });
    //             } else {
    //               Swal.fire(e.Message, "", "info");
    //             }
    //           })
    //           .fail(function(error) {
    //             Swal.fire("預約失敗！", error, "error");
    //           });
    //       }
    //     });
    //   });
    // },
    openHisWindow () {
      let bookData = { bookingInfo: this.bookingObjs, patientInfo: this.patientInfo };
      const _withHash = !/^http(s?):\/\/10.66.16.74/.test(window.location.href)
      const _url = `${$setting.apiHost}/app${_withHash ? '/#':''}/bookingWindow?token=`
      window.open(_url + this.token + "&orders=" + JSON.stringify(bookData));
    },
    openHisWindowPost () {
      let data = { userName: "admin", password: "admin", bookingData: { bookingInfo: this.bookingObjs, patientInfo: this.patientInfo } };
      var form = document.createElement("form");
      form.action = configs.publicPath + "../booking";
      form.method = "POST";
      form.target = "_blank";
      if (data) {
        for (var key in data) {
          var input = document.createElement("textarea");
          input.name = key;
          input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
          form.appendChild(input);
        }
      }
      form.style.display = "none";
      form.enctype = "application/json";
      document.body.appendChild(form);
      form.submit();
    }
  },
  computed: {
    //
    //合併order number to booking objects
    ...mapGetters(["getThemeColors", "getUserToken"]),
    filteredCheckItems () {
      return this.filterKey.map(key => this.checkItems.filter(item => new RegExp(`^${key}`).test(item.No) || new RegExp(`^${key}`).test(item.Name)))
    },
    bookingObjs () {
      let objs = [];
      let index = 0;
      let _this = this;
      this.bookingOrders.forEach(element => {
        if (_this.selectCheckItems[index] && _this.selectCheckItems[index].length > 0) {
          let obj = {
            orderNo: element,
            checkItemNos: _this.selectCheckItems[index].split(",")
          };
          objs.push(obj);
        }
        index++;
      });
      return objs;
    }
    // checkItemNos() {
    //   let ids = Object.values(this.selectCheckItems);
    //   return ids.join(",");
    // }
  },
  created () {
    let _this = this;
    window.axios.get("/checkItem/SelectNoList?$filter=NonSchedule%20eq%20false").then(e => {
      _this.checkItems = e.Items;
      // _this.selectCheckItems.push(_this.checkItems[0].No);
    });
    this.token = this.getUserToken;
    // if (this.sockConnection == null) {
    //   this.sockConnection = hubConnection(configs.hubUrl);
    //   this.hubProxy = this.sockConnection.createHubProxy("bookingHub");
    // }
    // this.sockConnection
    //   .start({ jsonp: true, transport: ["webSockets"] })
    //   .done(function(conn) {
    //     console.log("Now connected, connection ID=" + conn.id);
    //     console.log("Connected, transport = " + conn.transport.name);
    //   })
    //   .fail(function() {
    //     console.log("Could not connect");
    //   });
  }
};
</script>
