<template>
  <div class="pageContent zhTW fix-light position-relative">
    <div class="modality-btns">
      <b-button
        v-for="k in Object.keys(roomColor)"
        :key="k"
        :class="{ [roomColor[k].join(' ')]: true, active: chosenModality === k }"
        v-text="k"
        @click="showDailyCalendar(k)"
      />
    </div>
    <b-tabs v-model="tabIndex" changed>
      <b-tab
        title="報到作業"
        active
        @click="showWorkingCalendar = false"
        :title-link-class="tabIndex === 0 ? bTabStyle : bTabNorStyle"
      >
        <b-card no-body class="mx-1 mt-1 border" bg-variant="transparent">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left" @click="showDebugId"
                >櫃台報到．查詢作業</b-col
              >
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <div class="search-section d-grid grid-col-6 px-1" style="grid-gap: 2px">
              <b-input-group prepend="申請單號">
                <b-input
                  ref="AccessionNo1"
                  v-model.trim="checkQuery.AccessionNo"
                  autocomplete="off"
                />
              </b-input-group>

              <b-input-group prepend="病歷號">
                <b-input v-model.trim="checkQuery.PatientId" />
              </b-input-group>

              <b-input-group prepend="身分證號">
                <b-input v-model.trim="checkQuery.OtherPatientId" />
              </b-input-group>

              <b-input-group prepend="開單日期">
                <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                  <ejs-daterangepicker v-model="OpenDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="報到日期">
                <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
                  <ejs-daterangepicker v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="檢查日期">
                <div
                  id="ProduredCompletePicker"
                  class="form-control"
                  style="padding: 0px 0px"
                >
                  <ejs-daterangepicker
                    v-model="ProduredCompleteDateRange"
                  ></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="檢查項目">
                <v-super-select
                  @closed="onSuperMenuClose"
                  @opened="onSuperMenuOpen"
                  class="bg-white"
                  placeholder="請選擇"
                  v-model="checkQuery.ProcedureCode"
                  :items="optionsCheckItem"
                  noneFoundText="無此筆資料"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group prepend="報到狀態">
                <b-select v-model="checkQuery.status" :options="CheckinStatusSource" />
              </b-input-group>

              <b-input-group prepend="急作">
                <b-form-radio-group
                  class="pl-2 rounded-right bg-white text-black d-flex justify-content-center align-items-center flex-1"
                  style="border: 1px solid #ced4da; height: 38px"
                  v-model="checkQuery.EmgFlag"
                >
                  <b-form-radio class="text-black" value="Y">是</b-form-radio>
                  <b-form-radio class="text-black" value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>

              <div class="grid-span-3 d-flex justify-content-end">
                <b-button class="mr-1" variant="success" @click="handleWaitingNo">
                  <font-awesome-icon icon="tools" />修改等待號碼
                </b-button>

                <b-button class="mr-1" variant="secondary" @click="readIcCard">
                  <font-awesome-icon icon="credit-card" />讀取健保卡
                </b-button>
                <b-button
                  class="mr-1"
                  variant="warning"
                  @click="$bvModal.show('enterDlg')"
                >
                  <font-awesome-icon icon="edit" />手動開單
                </b-button>
                <b-button
                  class="mr-1 purple-button"
                  v-if="changeBtn"
                  variant="primary"
                  @click="changeCheck"
                >
                  <font-awesome-icon icon="history" />預約/變更時間
                </b-button>
                <b-button
                  class="mr-1"
                  variant="danger"
                  v-if="checkinBtn"
                  @click="Checkin_confirm"
                >
                  <font-awesome-icon icon="user-clock" />病患報到
                </b-button>

                <b-button class="mr-1" variant="info" @click="TodayQuery">
                  <font-awesome-icon icon="calendar" />今日排程
                </b-button>
                <b-button class="mr-1" variant="success" @click="clear">
                  <font-awesome-icon icon="eraser" />清除條件
                </b-button>
                <b-button
                  :class="{ 'mr-1': CancelBtn }"
                  variant="primary"
                  @click="startSearchData"
                >
                  <font-awesome-icon icon="search" />進行查詢
                </b-button>
                <b-button variant="danger" v-if="CancelBtn" @click="handleWithItems()">
                  <font-awesome-icon icon="trash" />取消報到
                </b-button>
                <!-- v-if="QuickcheckinBtn" -->
                <!-- <b-button variant="danger" @click="To-DO">
                    <font-awesome-icon icon="fighter-jet" />快速排檢
                  </b-button>&nbsp;-->
              </div>
            </div>
          </b-card-text>
        </b-card>

        <b-container fluid class="mt-1 px-1" ref="mainResult">
          <b-row no-gutters>
            <!-- 左方未報到病人 -->
            <!-- x['PatientStatusForShow'] = `<div>${x.StatusName}</div>_<div>${x.ScheduleLocationName}</div>`; -->
            <b-col sm="9">
              <div
                id="block4QueryResult"
                class="mr-1 rounded"
                style="border: 1px solid #ced4da"
              >
                <twp
                  ref="twp1"
                  v-bind:FieldConfig="tableConfig4QueryResult"
                  :DataFetch="getNormalPatientData"
                  CheckBox1Head
                  :specialColumn="[
                    {
                      pos: 1,
                      label: '報表',
                      text: '列印',
                      event: printItem,
                      type: 'button3',
                    },
                    {
                      pos: 2,
                      label: '快速作業',
                      event: instantlyRegister,
                      type: 'button2',
                      textObj: { 12: '報到', 21: '取消' },
                      key: 'Status',
                    },
                    {
                      pos: 3,
                      label: '報到狀態',
                      format: (item) =>
                        `${item.StatusName}${
                          item.ScheduleLocationName
                            ? '<div style=\'font-size: 8px;\' class=text-primary>' +
                              item.ScheduleLocationName +
                              '</div>'
                            : ''
                        }`,
                      type: 'html',
                    },
                  ]"
                  :CheckBox1Lead="true"
                  :CheckBox1Func="itemChecked"
                  v-on:afterRefresh="onAfterFresh"
                  :isBackEndPagination="true"
                  :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
                  v-on:allUnSelected="ResetFirstCheckItem"
                  :CheckIfShowRowCheckBox="CheckIfIdMatchMuitiSelect"
                  :CheckIfShowHeaderCheckBox="CheckIfShowHeaderCheckBox"
                  :superMenuOpen="superMenuOpen"
                />
              </div>
            </b-col>
            <!-- 右方今日排檢之病人 -->
            <b-col sm="3">
              <div id="block4TodayList" class="rounded">
                <checkin-room
                  :rooms="rooms"
                  :specificMod="checkRoomMod"
                  v-on:updateSpecificRoomMember="
                    ({ WaitList, RoomNo }) => {
                      const room = rooms.find((r) => r.RoomNo === RoomNo);
                      room.WaitList = WaitList;
                    }
                  "
                  :is-fixed-mode="isCheckinRoomFixed"
                  ref="checkinRoom"
                />
              </div>
            </b-col>
          </b-row>
        </b-container>

        <mu-dialog
          transition="slide-bottom"
          fullscreen
          :open.sync="dialogOpened"
          @close="
            () => {
              dialogOpened = false;
              UpdateView();
            }
          "
        >
          <bookingBar
            :when.sync="when"
            :dialogOpened.sync="dialogOpened"
            :rooms="dtcRooms"
            :variants="variants"
            :dtcBtnId="dtcBtnId"
            :patientInfo="patientInfo"
            @callLastDay="showLastDay"
            @upTime="({ text, value }) => updateDtcTime(text, value)"
            @upRoom="({ item, value }) => updateDtcRoom(item, value)"
            @executeAfterFresh="onAfterFresh"
            @UpView="UpdateView"
          />
          <bookingView
            ref="bookingView"
            :bookingObjs="bookingObjs"
            :bookingDate="viewDate"
            :patientInfo="patientInfo"
            :bookingProxy="bookingProxy"
            :specialTimeArr="specialTimeArr"
            :shouldBack="true"
          />
        </mu-dialog>
      </b-tab>

      <!-- 綜合查詢頁籤 -->
      <b-tab
        title="綜合查詢"
        @click="showWorkingCalendar = false"
        :title-link-class="tabIndex === 1 ? bTabStyle : bTabNorStyle"
      >
        <b-card no-body class="mx-1 mt-1 border" bg-variant="transparent">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">櫃台報到．綜合查詢</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <div class="search-section d-grid grid-col-6 px-1" style="grid-gap: 2px">
              <b-input-group prepend="申請單號">
                <b-input v-model="checkQuery.AccessionNo" />
              </b-input-group>

              <b-input-group prepend="病歷號">
                <b-input ref="AccessionNo" v-model="checkQuery.PatientId" />
              </b-input-group>

              <b-input-group prepend="身分證號">
                <b-input v-model="checkQuery.OtherPatientId" />
              </b-input-group>

              <b-input-group prepend="開單起訖">
                <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                  <ejs-daterangepicker v-model="OpenDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="報到日期">
                <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
                  <ejs-daterangepicker v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="檢查日期">
                <div
                  id="ProduredCompletePicker"
                  class="form-control"
                  style="padding: 0px 0px"
                >
                  <ejs-daterangepicker
                    v-model="ProduredCompleteDateRange"
                  ></ejs-daterangepicker>
                </div>
              </b-input-group>

              <b-input-group prepend="檢查項目">
                <v-super-select
                  class="bg-white"
                  noneFoundText="無此筆資料"
                  @closed="onSuperMenuClose"
                  @opened="onSuperMenuOpen"
                  placeholder="請選擇"
                  v-model="checkQuery.ProcedureCode"
                  :items="optionsCheckItem"
                  style="z-index: 1"
                />
                <!-- <b-select v-model="ceckQuery.ProcedureCode" :options="optionsCheckItem" /> -->
              </b-input-group>

              <b-input-group prepend="報到狀態">
                <b-select v-model="checkQuery.status" :options="TotalStatusSource" />
              </b-input-group>

              <b-input-group
                prepend="開單醫生"
                class="bg-white rounded"
                v-if="getListDrs.length > 0"
              >
                <v-super-select
                  noneFoundText="無此筆資料"
                  @closed="() => {}"
                  @opened="() => {}"
                  ref="RequestingPhysicianId"
                  @keydown.esc="escEvent('RequestingPhysicianId')"
                  placeholder="請選擇"
                  v-model="checkQuery.RequestingPhysicianId"
                  :items="getListDrs"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group
                prepend="分派醫師"
                class="bg-white rounded"
                v-if="getDxDrs.length > 0"
              >
                <v-super-select
                  noneFoundText="無此筆資料"
                  @closed="() => {}"
                  @opened="() => {}"
                  placeholder="請選擇"
                  ref="DxreportPhysicianId"
                  @keydown.esc="escEvent('DxreportPhysicianId')"
                  v-model="checkQuery.DxreportPhysicianId"
                  :items="getDxDrs"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group
                prepend="審核醫師"
                class="bg-white rounded"
                v-if="getIssueDrs"
              >
                <v-super-select
                  noneFoundText="無此筆資料"
                  @closed="() => {}"
                  @opened="() => {}"
                  placeholder="請選擇"
                  ref="IssuePhysicianId"
                  @keydown.esc="escEvent('IssuePhysicianId')"
                  v-model="checkQuery.IssuePhysicianId"
                  :items="getIssueDrs"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group
                prepend="開單科別"
                class="bg-white rounded"
                v-if="optionsClassSource"
              >
                <v-super-select
                  noneFoundText="無此筆資料"
                  @closed="() => {}"
                  @opened="() => {}"
                  placeholder="請選擇"
                  ref="RequestingServiceId"
                  @keydown.esc="escEvent('RequestingServiceId')"
                  v-model="checkQuery.RequestingServiceId"
                  :items="optionsClassSource"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group prepend="儀器類別" class="bg-white rounded">
                <v-super-select
                  ref="modalitySuperSelect"
                  noneFoundText="無此筆資料"
                  @closed="() => {}"
                  @opened="() => {}"
                  placeholder="請選擇"
                  @keydown.esc="escEvent('modalitySuperSelect')"
                  v-model="checkQuery.Modality"
                  :items="roomTabs.map((m) => ({ text: m, value: m }))"
                  style="z-index: 1"
                />
              </b-input-group>

              <b-input-group prepend="急作">
                <b-form-radio-group
                  class="pl-2 rounded-right d-flex justify-content-center text-black align-items-center bg-white flex-1"
                  style="border: 1px solid #ced4da; height: 40px"
                  v-model="checkQuery.EmgFlag"
                >
                  <b-form-radio value="Y">是</b-form-radio>
                  <b-form-radio value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>

              <b-input-group
                prepend="檢查室"
                class="grid-span-2 d-flex align-items-stretch"
              >
                <treeselect
                  id="locationCode"
                  class="flex-1"
                  v-model="checkQuery.Location"
                  :multiple="true"
                  :searchable="true"
                  :options="
                    optionsLocationSource
                      .filter(({ text }) => text != '請選擇')
                      .map(({ value, text }) => ({ id: value, label: text }))
                  "
                />
              </b-input-group>

              <b-input-group
                prepend="病患來源"
                class="grid-span-2 d-flex align-items-stretch"
              >
                <treeselect
                  id="patientCode"
                  class="flex-1"
                  v-model="checkQuery.PatientSourceTypeCode"
                  :multiple="true"
                  :searchable="true"
                  :options="
                    optionsPatientSource
                      .filter(({ text }) => text != '請選擇')
                      .map(({ value, text }) => ({ id: value, label: text }))
                  "
                />
              </b-input-group>
            </div>

            <div class="mt-1">
              <b-button variant="warning" class="mr-1" @click="downloadExcel">
                <font-awesome-icon icon="download" />
                下載excel
              </b-button>

              <b-button variant="success" class="mr-1" @click="clear">
                <font-awesome-icon icon="eraser" />清除條件
              </b-button>
              <b-button variant="primary" @click="startSearchData">
                <font-awesome-icon icon="search" />進行查詢
              </b-button>
            </div>
          </b-card-text>
        </b-card>

        <b-container fluid class="mt-1 px-1">
          <b-row no-gutters>
            <b-col>
              <div
                id="block4QueryResult"
                class="mr-1 rounded mix"
                style="border: 1px solid #ced4da"
              >
                <twp
                  ref="twp2"
                  v-bind:FieldConfig="tableConfig4MixResult"
                  :DataFetch="getMixPatientData"
                  :isBackEndPagination="true"
                  :CheckBox1Func="openHistory"
                  :CheckIfShowRowCheckBox="showcheckBox"
                  :CheckIfShowHeaderCheckBox="showcheckBox"
                  :superMenuOpen="superMenuOpen"
                  :OpButton1Text="'編輯'"
                  v-bind:OpButton1Func="editDtcRow"
                ></twp>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>

      <!-- 純粹區隔 -->
      <!-- <b-tab title /> -->
      <!-- :title-link-class= -->
      <!-- 病患歷程資料 TO-DO美觀設計....-->
      <b-modal
        varient="primary"
        ref="PatientHistory"
        title="歷程記錄"
        hide-footer
        size="lg"
      >
        <b-card
          v-if="chosenPatient"
          :title="chosenPatient.PatientName + ' - ' + chosenPatient.OrderNo"
          :sub-title="
            '【檢查項目】' +
            chosenPatient.ProcedureName +
            ' ,【申請單號】' +
            chosenPatient.AccessionNo +
            ' ,【病歷號】' +
            chosenPatient.PatientId
          "
        >
          <b-table
            striped
            show-empty
            :items="displayTreeSource"
            :fields="[
              { key: 'ActionAccount', label: '操作帳號' },
              { key: 'Action', label: '事件名稱', thClass: 'white-space-nowrap' },
              { key: 'ActionContent', label: '事件細項', tdClass: 'record-td' },
              { key: 'CreateTime', label: '事件時間' },
            ]"
          >
            <template v-slot:cell(ActionContent)="data">
              <span v-html="data.value"></span>
            </template>
            <template v-slot:empty="scope">
              <h4 class="text-center">暫無資料</h4>
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="treeSource.length"
            :per-page="10"
            align="fill"
            size="sm"
            class="my-0"
          ></b-pagination>
        </b-card>
      </b-modal>

      <ManuallyEnter
        :optionsCheckItem="optionsCheckItem"
        :optionsPatientSource="optionsPatientSource"
        :CheckinStatusSource="CheckinStatusSource"
        :optionsLocationSource="optionsLocationSource"
      />
      <EditPersonalData
        :optionsCheckItem="optionsCheckItem"
        :optionsPatientSource="optionsPatientSource"
        :CheckinStatusSource="CheckinStatusSource"
        :optionsLocationSource="optionsLocationSource"
      ></EditPersonalData>

      <transition name="fade">
        <daily
          v-if="showWorkingCalendar"
          ref="daily"
          @closeCalendar="showWorkingCalendar = false"
          @checkinService="CheckinService"
          @checkoutService="CheckoutService"
          @changeRoomService="changeRoomService"
          @changeTimeService="changeTimeService"
          :roomTabs="roomTabs"
          :pRoom="chosenModality"
          :showModality="false"
        />
      </transition>

      <!-- 此病患報到之檢查項目該去哪一檢查室 TO-DO美觀設計....-->
      <!-- getThemeColors.key === 'white' || getThemeColors.key === 'lightGray' ? 'light' : 'black' -->

      <b-Modal
        ref="MergeListModal"
        aria-label=""
        id="merge-list-modal"
        hide-header
        hide-footer
        size="lg"
      >
        <template v-if="MergeList.length > 0">
          <b-card
            :header-bg-variant="altExpend == item.Id ? 'success' : 'danger'"
            header-size="sm"
            class="mb-2"
            body-bg-variant="transparent"
            v-for="item in MergeList"
            :key="item.Id + '_' + item.ChangeToModality"
          >
            <template class="p-1" v-slot:header>
              <div class="text-white d-flex align-items-center">
                <template v-if="!altExpend || item.CounterRegister">
                  檢查項目:
                  <b-form-group
                    v-if="item.ProcedureAccession.length > 0"
                    variant="success"
                    class="ml-2 mb-0 p-0"
                    :disabled="altExpend"
                  >
                    <b-form-checkbox-group
                      size="lg"
                      class="text-white"
                      v-model="item.CheckedAccessions"
                      :disabled="item.ProcedureAccession.length === 1"
                      :options="item.ProcedureAccession"
                    />
                  </b-form-group>
                  <div v-else>單號: {{ item.No }} 暫無資料</div>
                </template>
                <div>&nbsp;</div>
              </div>

              <div
                v-if="!item.CounterRegister"
                @click="altExpend = altExpend === item.Id ? null : item.Id"
                class="cursor-pointer position-absolute change-item bg-white text-primary px-1 rounded"
              >
                變更項目
                <font-awesome-icon icon="exchange-alt" />
              </div>
            </template>

            <template v-if="!item.CounterRegister">
              <b-collapse
                :id="'collapse-' + item.Id"
                class="mt-2"
                :visible="altExpend !== item.Id"
              >
                <div>
                  預計檢查室:
                  {{
                    item.temproom && item.roomList && item.roomList.length === 1
                      ? item.roomList.find((it) => it.value == item.temproom)["text"] ||
                        "unknown"
                      : item.roomList && item.roomList.length > 0
                      ? "請選擇下列檢查室"
                      : "目前此檢查項目沒有符合的檢查室"
                  }}
                </div>
                <div class="p-2" v-if="item.roomList && item.roomList.length > 1">
                  <b-form-radio-group
                    :id="`radio-group-${item.Id}`"
                    v-model="item.temproom"
                    :options="item.roomList"
                    :name="`radio-group-${item.Id}`"
                    @change="itemRoomChangeEvent"
                  />
                </div>
              </b-collapse>

              <b-collapse :id="'collapse-' + item.Id" :visible="altExpend == item.Id">
                <changeItems
                  :key="'changeItems_' + item.Id"
                  :items="item.ProcedureCodeList"
                  :accessionNo="item.Accessions"
                  :modality="item.Modality"
                  :otherProcedure="MergeList.filter((m) => m != item)"
                  v-on:closeChangeEvent="() => (altExpend = null)"
                  v-on:completeChangeEvent="updateChangeItemsEvent"
                />
              </b-collapse>
            </template>

            <div v-else class="mb-2">已報到</div>

            <font v-if="item.UNExamList && item.UNExamList.length > 0" color="#FF0000"
              >尚未安排之檢查:
              {{
                item.UNExamList.map(({ ProcedureName }) => `【${ProcedureName}】`).join(
                  ", "
                )
              }}</font
            >
            <div v-for="item in MergeList.UnCheckList" v-bind:key="item.id" class="mt-2">
              <font color="#FF0000"
                >檢查項目:{{ item.ProcedureName }}申請單號為:{{ item.AccessionNo }}</font
              >
            </div>

            <div class="merge-modal-btns">
              <b-button
                variant="danger"
                v-if="item.CounterRegister"
                :disabled="item.CheckedAccessions.length === 0"
                @click="Checkin_cancel(MergeList)"
              >
                <font-awesome-icon icon="search" class="mr-2" />取消報到
              </b-button>

              <template v-else>
                <b-button
                  id="Button_color"
                  :disabled="
                    !MergeList ||
                    MergeList.some((i) => !i.temproom) ||
                    altExpend ||
                    item.CheckedAccessions.length === 0
                  "
                  @click="confirm_room({ confirm: true, item })"
                >
                  <font-awesome-icon icon="calendar-check" class="mr-2" />確定報到
                </b-button>

                <b-button
                  class="purple-button"
                  v-if="changeBtn"
                  variant="primary"
                  :disabled="
                    !MergeList ||
                    MergeList.some((i) => !i.temproom) ||
                    altExpend ||
                    item.CheckedAccessions.length === 0
                  "
                  @click="changeCheck"
                >
                  <font-awesome-icon icon="history" class="mr-2" />預約/變更時間
                </b-button>

                <b-button
                  id="Button_color"
                  :disabled="
                    !MergeList ||
                    MergeList.some((i) => !i.temproom) ||
                    altExpend ||
                    item.CheckedAccessions.length === 0
                  "
                  @click="confirm_room({ confirm: true, print: true, item })"
                >
                  <font-awesome-icon icon="print" class="mr-2" />確定報到及列印
                </b-button>
              </template>

              <b-button id="Button_color" @click="confirm_room({ confirm: false })">
                <font-awesome-icon icon="eraser" class="mr-2" />取消
              </b-button>

              <b-button class="ml-auto" variant="success" @click="showRegistDetail">
                <font-awesome-icon icon="info" class="mr-2" />明細
              </b-button>
            </div>

            <b-collapse id="registDetail" :visible="registDetail">
              <div
                class="detail-row border rounded-lg mt-2"
                :key="row.OrderNo"
                v-for="(row, idx) in $refs.twp1.Rows.filter(
                  (row) => row.TWPCheckBox1Value
                )"
              >
                <div class="detail-no bg-secondary text-white px-2">
                  No: {{ row.OrderNo }}
                </div>
                <div class="detail-name px-2">{{ row.ProcedureName }}</div>
              </div>
            </b-collapse>
          </b-card>
        </template>
        <b-card title="暫無資料" v-else>
          <b-card-text> 單號: {{ checkNos.join(",") }} 伺服器暫無資料 </b-card-text>
        </b-card>
      </b-Modal>
    </b-tabs>
    <reportCounterPrint
      :items="printStuff"
      v-on:closePrint="printStuff = null"
      v-if="!!printStuff"
    />

    <!-- <transition name="zoom">
      <div
        v-if="getLoadingStatus"
        class="position-fixed loading-work d-flex align-items-center justify-content-center"
      >
        <b-spinner
          class="text-white"
          label="Spinning"
        />
      </div>
    </transition> -->

    <b-modal size="lg" v-model="modalWaiting" title="修改X光室號碼" hide-footer>
      <b-table
        striped
        hover
        :items="roomsCr"
        :fields="[
          { key: 'RoomName', label: '檢查室名稱' },
          { key: 'currentCount', label: '目前號碼' },
          { key: 'setOne', label: '設定號碼' },
          { key: 'manel', label: '手動輸入' },
        ]"
      >
        <template v-slot:cell(setOne)="row">
          <b-button
            size="sm"
            :disabled="row.item.currentCount === 1"
            @click="setRoomCallNo(row.item.RoomNo, 1)"
          >
            設定為 1
          </b-button>
        </template>
        <template v-slot:cell(manel)="row">
          <div class="d-flex">
            <b-input
              v-model="row.item.modifyCount"
              class="w-50"
              type="number"
              min="1"
              max="99"
            />
            <b-button
              :disabled="
                row.item.modifyCount === 0 ||
                row.item.currentCount == row.item.modifyCount
              "
              size="sm"
              class="ml-1"
              @click="setRoomCallNo(row.item.RoomNo, row.item.modifyCount)"
            >
              確定
            </b-button>
          </div>
        </template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters, mapMutations } from "vuex";
import twp from "@/components/TWPv5_1";
import "muse-ui/dist/muse-ui.css";
import { Dialog, AppBar } from "muse-ui";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import bookingView from "@/components/Booking/Index";
import bookingBar from "@/components/Booking/BarRevise";
import ManuallyEnter from "./ManuallyEnter";
import EditPersonalData from "./EditPersonalData";
import VSuperSelect from "v-super-select";
import checkinRoom from "./comps/checkinRoom";
import changeItems from "./comps/changeItems";
import daily from "@/components/Daily";
import { roomColor } from "@/components/Daily/roomColor.js";
import dailyMethods from "@/components/Daily/dailyMethods.js";
import socketService from "@/mixins/socketConnectionService.js";
import ReportCounterPrint from "@/components/ReportCounterPrint.vue";
import {
  tableConfig4QueryResult,
  tableConfig4MixResult,
  tableConfig4TodayList,
} from "./comps/tableField.js";
import { modalityKey } from "@/assets/js/common.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import treeSource from "./comps/treeSource.js";
import {
  getOptionsRequestingServiceSource,
  patientRegisterCounterEvent,
  getPatientDataById,
  getCounterPatients,
  getCounterPatientsAxios,
  getOptionsPatientSource,
  getOptionsRoomSource,
  getCounterStatusSource,
  getRoomRelativeList,
  getIcCardInfo,
  getCurrentNo,
  setCurrentNo,
  getPatientTracking,
  addRecodeToAccessionNo,
  examCheckInEvent,
  getEmployeeDataByType,
  getMixSearchExportList,
} from "@/assets/service/dataManager.js";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(DateRangePickerPlugin);
const timeOptions = ["AM", "PM", "All day"];

export default {
  name: "home",
  mixins: [dailyMethods, socketService],
  components: {
    twp,
    bookingView,
    bookingBar,
    ManuallyEnter,
    VSuperSelect,
    checkinRoom,
    daily,
    EditPersonalData,
    ReportCounterPrint,
    changeItems,
    Treeselect,
  },
  data() {
    return {
      registDetail: false,
      currentPage: 1,
      altExpend: null,
      printFirstRow: false,
      printStuff: null,
      editData: false,
      checkRoomMod: "",
      dtcBtnId: "",
      variants: ["primary", "secondary", "success", "danger", "info", "light", "dark"],
      dtcRooms: [],
      when: "全天",
      timeOptions,
      showWorkingCalendar: false,
      isMounted: false,
      isCheckinRoomFixed: false,
      chosenModality: "",
      sockConnection: null,
      hubProxy: null,
      bookingProxy: null,
      hubReconnectCount: 0,
      hubReconnectCountLimit: 3,
      rooms: [],
      accessKeyEvent: { type: null, timeStamp: null },
      scannerData: { count: "", ensure: false },
      superMenuOpen: false,
      enterData: false,
      showManuallyForm: false,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
      HotkeyList: [],
      //for booking
      selectCheckItems: [],
      dialogOpened: false,
      viewDate: new Date(),
      tabIndex: 0,
      patientInfo: {
        orderNo: "",
        name: "",
        id: "",
        gender: "",
        hrNum: "",
        tel: "",
        sourceType: "O",
        sourceCode: "",
        birthDay: null,
      },
      bookingObjs: null,
      //左下角Table的header
      tableConfig4QueryResult,
      //右下角Table的header
      tableConfig4TodayList,
      tableConfig4MixResult: tableConfig4MixResult(),
      //檢查項目選單
      optionsCheckItem: window.dtcOptionsCheckItem,
      //病患來源選單
      optionsPatientSource: [],
      //檢查室選單
      optionsLocationSource: [],
      optionsClassSource: null,
      CheckinStatusSource: [],
      TotalStatusSource: [],
      firstCheckedItem: null,
      //報到人數
      checkinCount: 0,
      UncheckinCount: 1,
      //User點擊按鈕紀錄(用以判斷API的條件)
      BtnNo: 0,
      //for query
      checkQuery: {
        AccessionKeyDown: null,
        //申請單號
        AccessionNo: "",
        //病歷號
        PatientId: "",
        //身分證字號
        OtherPatientId: "", // A110132798 "DTC20200320164901" F123456789
        //開單日期From
        StartDT: "",
        //開單日期To
        EndDT: "",
        // 開單醫生
        RequestingPhysicianId: "",
        // 開單科別
        RequestingServiceId: "",
        //檢查項目
        ProcedureCode: null,
        //病患來源
        PatientSourceTypeCode: null,
        //報到狀態
        status: null,
        EmgFlag: null,
        //檢查室
        Location: null,
        //報到狀態
        PatientStatus: null,
        // Modality別
        Modality: null,
        // 分派醫師
        DxreportPhysicianId: null,
        // 審核醫師
        IssuePhysicianId: null,
      },
      //開單起訖日
      OpenDateRange: ["", ""],
      //報到起訖日
      CheckDateRange: ["", ""],
      //檢查起訖日
      ProduredCompleteDateRange: ["", ""],
      //按鈕顯示
      checkinBtn: false,
      CancelBtn: false,
      changeBtn: false,
      //選擇檢查室
      choice_room: [],
      //Modal上的檢查室資料
      //病患檢查項目
      PatientcheckItem_List: [],
      //報到後的檢查項目相關資料
      CheckinListModalList: [],
      MergeList: [],
      unExamList: [],
      //病患今日檢查項目類型:0.無檢查1.今日有檢查3.有檢查不再今日
      checkTypeList: "A",
      //歷程樹
      treeSource: [],
      chosenPatient: null,
      roomTabs: modalityKey,
      roomColor,
      procedureList: {},
      modalWaiting: false,
      searchCondition: null,
      availableHgt: 690,
      emptyMergeItem: {
        Accessions: [],
        CheckedAccessions: [],
        CounterRegister: "",
        Id: "",
        MargeCheckItemIds: [],
        MargeCheckItemNos: [],
        Modality: "",
        Name: "",
        No: "",
        PackageName: "",
        ProcedureAccession: "",
        ProcedureCode: "",
        ProcedureCodeList: [],
        ProcedureName: "",
        Type: "",
        UNExamList: [],
        roomList: [],
        temproom: "",
        temproomName: "",
      },
      checkNos: [],
      specialTimeArr: [],
    };
  },
  provide: {
    modalityColor: roomColor,
  },
  computed: {
    ...mapGetters([
      "getLoadingStatus",
      "getThemeColors",
      "getIssueDrs",
      "getDxDrs",
      "getListDrs",
    ]),
    ...mapState(["Profile4User", "procedureData", "showLoading"]),
    patientHistoryModalIsShow() {
      return this.isMounted ? this.$refs["PatientHistory"].isShow : false;
    },
    mergeListState() {
      return this.isMounted ? this.$refs["MergeListModal"].isShow : false;
    },
    roomsCr() {
      return this.rooms.filter(({ Modality }) => Modality === "CR");
    },
    bTabStyle() {
      return this.getThemeColors.key === "white" ||
        this.getThemeColors.key === "lightGray"
        ? ["bg-primary", "text-white", "px-5"]
        : ["bg-primary", "text-white", "px-5"];
    },
    bTabNorStyle() {
      return this.getThemeColors.key === "white" ||
        this.getThemeColors.key === "lightGray"
        ? ["text-black", "px-5"]
        : ["text-white", "px-5"];
    },
    displayTreeSource() {
      return this.treeSource.filter(
        (item, index) =>
          index >= (this.currentPage - 1) * 10 && index < this.currentPage * 10
      );
    },
  },
  methods: {
    ...mapMutations([
      "SET_SIDE_MESSAGE",
      "SHOW_LOADING",
      "HIDE_LOADING",
      "SET_ISSUE_DR",
      "SET_DX_DR",
      "SET_LIST_DR",
    ]),
    showRegistDetail(state) {
      this.registDetail = !this.registDetail;
    },
    escEvent(refName) {
      if (this.checkQuery.hasOwnProperty(refName)) this.checkQuery[refName] = null;
      this.$refs[refName].clearSelection();
    },
    async downloadExcel() {
      this.SHOW_LOADING();
      const { Url } = await getMixSearchExportList(this.getQueryParameter());
      window.open(Url);
      this.HIDE_LOADING();
    },
    async setRoomCallNo(roomNo, no) {
      try {
        await setCurrentNo({ roomNo, no });
        this.modalWaiting = false;
      } catch (err) {}
    },
    async getForSpecialTime() {
      try {
        const { Items } = await window.axios.get(
          "/checkItem/ForSpecialTime?includeCombo=true"
        );
        this.specialTimeArr = [...Items];
      } catch (err) {}
    },
    updateChangeItemsEvent(accessionNo) {
      this.altExpend = null;
      // this.Checkin_confirm();
      this.confirm_room({ confirm: false });
      setTimeout(() => {
        this.checkQuery.AccessionNo = accessionNo.substr(0, 10);
        this.startSearchData();
      }, 1000);
    },

    converNameToCode(names, type) {
      return !names || !this.optionsCheckItem
        ? []
        : names
            .split(" + ")
            .map((name) =>
              type === "object"
                ? this.optionsCheckItem.find(({ value, text }) => name === text)
                : this.optionsCheckItem.find(({ value, text }) => name === text)["value"]
            );
    },
    converCodeToObj(codes) {
      return !codes || !this.optionsCheckItem
        ? []
        : codes.map((code) => ({
            ...this.optionsCheckItem.find(({ value }) => code === value),
          }));
    },
    showDebugId() {
      // alert(window.dtcMMPatientId);
    },
    async fetchDoctorAndClassSource() {
      // "getIssueDrs", "getDxDrs"

      if (this.getListDrs.length === 0) {
        //開單醫師
        const { result } = await getEmployeeDataByType("20,21,23,25,27,29", "false"); // getOptionsIssuePhysicianSource()
        this.SET_LIST_DR(result);
      }

      if (this.getIssueDrs.length === 0) {
        // 審核醫師
        const emp21 = await getEmployeeDataByType("21");
        this.SET_ISSUE_DR(emp21.result);
      }

      if (this.getDxDrs.length === 0) {
        //
        const empDx = await getEmployeeDataByType("21,23,25,27,28,29");
        this.SET_DX_DR(empDx.result);
      }

      let resultServiceSource = await getOptionsRequestingServiceSource();
      this.optionsClassSource = resultServiceSource.result.map((item) => ({
        text: item.Name,
        value: item.No,
      }));
    },

    handleWithItems() {
      const mergeItems = [];

      this.$refs["twp1"].Rows.forEach((row) => {
        if (row.TWPCheckBox1Value) {
          const _option = {
            text: row.ProcedureName,
            value: row.AccessionNo,
          };
          const _tempAccession = row.AccessionNo.slice(0, 9);
          if (
            mergeItems.some((mItem) =>
              mItem.Accessions.some((no) => no.includes(_tempAccession))
            )
          ) {
            // 存在於清單中
            mergeItems.forEach((mItem) => {
              if (mItem.Accessions.some((no) => no.includes(_tempAccession))) {
                mItem.Accessions.push(row.AccessionNo);
                mItem.CheckedAccessions.push(row.AccessionNo);
                mItem.ProcedureAccession.push(_option);
              }
            });
          } else {
            const tmpItem = JSON.parse(JSON.stringify(this.emptyMergeItem)); // 不存在
            Object.keys(tmpItem).forEach((k) => {
              if (row.hasOwnProperty(k)) tmpItem[k] = row[k];
            });
            tmpItem.Accessions = [row.AccessionNo];
            tmpItem.CheckedAccessions = [row.AccessionNo];
            tmpItem["ProcedureAccession"] = [_option];
            mergeItems.push(tmpItem);
          }
        }
      });

      if (mergeItems.length > 0) {
        this.MergeList = mergeItems;
        this.$refs["MergeListModal"].show();
      }
    },
    instantlyRegister(item) {
      item.TWPCheckBox1Value = true;
      if (item.Status === "21") {
        if (item.Modality === "CR") {
          const _tempAccession = item.AccessionNo.slice(0, 9);
          this.$refs["twp1"].Rows.forEach((row) => {
            if (row.AccessionNo.includes(_tempAccession))
              row.TWPCheckBox1Value = item.TWPCheckBox1Value;
          });
        }
        this.$refs["twp1"].$refs.twpt1.refresh(); // checkbox 才可以勾起來
        this.handleWithItems();
      } else {
        this.Checkin_confirm();
      }
    },
    printItem(item) {
      this.printStuff = [item];
      addRecodeToAccessionNo({ AccessionNo: item.AccessionNo, Action: "報表列印" });
    },
    editDtcRow(item) {
      window.dtcPersonItem = Object.assign({}, item);
      // const str = JSON.stringify(item, 0, 2);
      // console.log(str);
      this.$bvModal.show("dtc-edit-personal-data");
    },
    updateDtcTime(str, type) {
      this.when = str;
      this.$root.$emit("book-type", type);
    },
    updateDtcRoom(item, str) {
      if (str) {
        this.dtcBtnId = str;
        this.$root.$emit("dtc-room-update", str);
      } else {
        this.dtcBtnId = item.Id;
        this.$root.$emit("dtc-room-update", item.Id);
      }
    },
    showDailyCalendar(key) {
      this.chosenModality = key;
      if (!this.showWorkingCalendar) this.showWorkingCalendar = true; // 關閉的狀態下
      if (this.$refs.daily) this.$refs.daily.changeModality(this.chosenModality);
    },
    changePatientStatus({ Status, AccessionNo, PatientName }) {
      // 11 未排檢、12已排檢、21已報到
      if (Status === "12" || Status === "21")
        this.$bvModal
          .msgBoxConfirm(`確定要將【${PatientName}】${Status === "21" ? "取消" : ""}報到`)
          .then((value) => {
            if (value) {
              this[Status === "21" ? "Checkin_cancel" : "Checkin_confirm"]([AccessionNo]);
            }
          })
          .catch((err) => {
            // An error occurred
          });
    },
    itemRoomChangeEvent(no) {
      this.checkRoomMod = no.substr(0, 2);
      this.$refs.checkinRoom.getDetail(no);
    },
    //綜合查詢時 判斷狀態是否允許顯示此階段資訊
    showcheckBox() {
      return false;
    },
    onSuperMenuOpen() {
      this.superMenuOpen = true;
    },
    onSuperMenuClose() {
      this.superMenuOpen = false;
    },
    async openHistory(patient) {
      //顯示病歷歷程
      this.chosenPatient = patient;
      let { Items } = await getPatientTracking(
        patient.Modality === "CR" ? patient.OrderNo : patient.AccessionNo,
        patient.Modality
      );
      // Items.forEach(item=>{
      //   item['PrevActionNote'] = 'JUST TEST !!!';
      // })
      this.treeSource = Items.filter(
        ({ AccessionNo }) => AccessionNo === patient.AccessionNo
      )
        .map((item) => ({
          ...item,
          ActionContent:
            (item.NewActionNote ? `【事件後】: ${item.NewActionNote}` : "") +
            (item.NewActionNote && item.PrevActionNote ? "<br />" : "") +
            (item.PrevActionNote ? `【事件前】: ${item.PrevActionNote}` : ""),
          CreateTime: this.$moment(item.CreateTime).format("YYYY-MM-DD HH:mm:ss"),
        }))
        .sort((a, b) => (a.CreateTime > b.CreateTime ? -1 : 1)); // .reverse()
      // if (this.treeSource.length === 0) {
      //   this.treeSource = [{
      //     'Action': patient.StatusName,
      //     'NewActionNote': patient.RequestingServiceName,
      //     'CreateTime': this.$moment(patient.CounterRegister).format("YYYY-MM-DD hh:mm:ss")
      //   }]
      // }

      // this.treeSource = this.treeSource.reverse();
      // console.log(this.treeSource);

      // const treeSourceList = Object.entries(this.treeSource);
      // .find([key, tree] => tree.name )

      // this.treeSource.forEach(s => {
      //   s.disabled = true;
      //   s.display = s.name;
      //   if (s.name == "櫃台報到") {
      //     s.disabled = false;
      //     s.Detail.CounterRegister = "櫃台到時間: " + (patient.CounterRegister ? this.$moment(patient.CounterRegister).format("YYYY/MM/DD HH:mm:ss") : "無有效日期紀錄");
      //     s.Detail.COUNTER_STAFF_Name =
      //       "櫃台報到人員: " + (patient.CounterStaffName ? patient.CounterStaffName : patient.CounterStaffId ? patient.CounterStaffId : "無操作人員"); //沒有名字就帶入id, 理論上一定會有id
      //     s.Detail.ScheduleLocationName = "預計檢查室: " + (patient.ScheduleLocationName ? patient.ScheduleLocationName : "尚未指定檢查室");
      //     s.Detail.ScheduleTime = "預計檢查時間: " + this.$moment(patient.ScheduleTime).format("YYYY/MM/DD HH:mm:ss");
      //   }
      //   if (s.name == "檢查室") {
      //     s.display += " - 尚未進行檢查";
      //     if (patient.Status >= 31) {
      //       s.disabled = false;
      //       s.display = s.name;
      //     }

      //     s.Detail.StartTime = "檢查開始時間: " + (patient.ProcedureStart ? this.$moment(patient.ProcedureStart).format("YYYY/MM/DD HH:mm:ss") : "尚未檢查");
      //     s.Detail.EndTime = "檢查結束時間: " + (patient.ProcedureCompleted ? this.$moment(patient.ProcedureCompleted).format("YYYY/MM/DD HH:mm:ss") : "尚未檢查");
      //     s.Detail.PerformRadiographer1Name = "放射師1: " + (patient.PerformRadiographer1Name ? patient.PerformRadiographer1Name : "無放射師紀錄");

      //     s.Detail.PerformRadiographer2Name = "放射師2: " + (patient.PerformRadiographer2Name ? patient.PerformRadiographer2Name : "無放射師紀錄");
      //     s.Detail.PerformNurseName = "護理師: " + (patient.PerformNurseName ? patient.PerformNurseName : "無護理師紀錄");
      //   }
      //   if (s.name == "報告分派人員") {
      //     s.display += " - 尚未分派報告";
      //     if (patient.Status >= 51) {
      //       s.disabled = false;
      //       s.display = s.name;
      //     }
      //     s.Detail.DxreportPhysicianName = "報告分派人員: " + (patient.DxreportPhysicianName ? patient.DxreportPhysicianName : "尚未分派");
      //   }
      //   if (s.name == "報告撰寫") {
      //     s.display += " - 尚未進行報告撰寫";
      //     if (patient.Status >= 61) {
      //       s.disabled = false;
      //       s.display = s.name;
      //     }
      //     s.Detail.DxreportPhysicianName = "報告(撰寫)人員: " + (patient.DxreportPhysicianName ? patient.DxreportPhysicianName : "報告尚未撰寫");
      //     s.Detail.IssuePhysicianName = "主治/審核報告醫師: " + (patient.IssuePhysicianName ? patient.IssuePhysicianName : "報告尚未交付審核");
      //   }
      // });
      this.$refs["PatientHistory"].show();
    },
    HKWatch(event) {
      if (event.key === "Enter") {
        this.startSearchData(() => {
          this.$refs["AccessionNo1"].focus();
        });
      }
    },
    clear() {
      //清除輸入的條件
      //申請單號
      (this.checkQuery.AccessionNo = ""),
        //病歷號
        (this.checkQuery.PatientId = ""),
        //身分證字號
        (this.checkQuery.OtherPatientId = ""),
        //開單日期From
        (this.OpenDateRange = ["", ""]),
        //報到日期
        (this.CheckDateRange = ["", ""]),
        //檢查日期
        (this.ProduredCompleteDateRange = ["", ""]),
        //檢查項目
        (this.checkQuery.ProcedureCode = null),
        //病患來源
        (this.checkQuery.PatientSourceTypeCode = null),
        (this.checkQuery.Location = null),
        //急作
        (this.checkQuery.EmgFlag = null),
        //是否報到
        (this.checkQuery.status = null),
        (this.checkQuery.DxreportPhysicianId = null),
        (this.checkQuery.IssuePhysicianId = null),
        (this.checkQuery.Modality = null);
      this.$refs["modalitySuperSelect"].clearSelection();
      this.BtnNo = 0;
      this.$refs["twp1"].checkedItems.length = 0;
      this.$refs["twp1"].OnForceRefresh();
      this.ResetFirstCheckItem();
      setTimeout(() => {
        const q = ".super-select-input input[type=text]";
        [...document.querySelectorAll(q)].forEach((s) => {
          s.value = "";
        });
        this.onAfterFresh();
      }, 300);
    },
    QueryMethod() {
      //預設一進來時 帶入左方畫面資料的條件:已報到及未報到
      if (this.BtnNo === 0) {
        return new Query();
      }
      //按下查詢按鈕(進行查詢)):1
      else if (this.BtnNo === 1) {
        return this.getQuery();
      }
      //今日排程按鈕
      else if (this.BtnNo === 2) {
        return this.getQuery();
      }
    },
    getQueryParameter(page = 0, per = 0) {
      const generateParameters = (key, value, method) =>
        method === "contains"
          ? `substringof('${value.toLowerCase()}',tolower(${key}))`
          : `tolower(${key}) eq '${value.toLowerCase()}'`;

      const containKeys = ["AccessionNo", "PatientId"]; // 使用contains
      const equalKeys = [
        "RequestingPhysicianId",
        "RequestingServiceId",
        "Modality",
        "DxreportPhysicianId",
        "IssuePhysicianId",
      ]; // 使用equal
      const params = [containKeys, equalKeys].reduce((acc, cur, idx) => {
        if (idx === 1) {
          cur.forEach((key) => {
            if (this.checkQuery[key])
              acc.push(
                generateParameters(
                  key,
                  typeof this.checkQuery[key] === "object"
                    ? this.checkQuery[key].value
                    : this.checkQuery[key],
                  "equal"
                )
              );
          });
        } else {
          cur.forEach((key) => {
            if (this.checkQuery[key])
              acc.push(
                generateParameters(
                  key,
                  typeof this.checkQuery[key] === "object"
                    ? this.checkQuery[key].value
                    : this.checkQuery[key],
                  "contains"
                )
              );
          });
        }
        return acc;
      }, []);
      //判斷身分證字號
      if (
        this.checkQuery.OtherPatientId &&
        this.checkQuery.OtherPatientId != "Error:沒有插卡！"
      ) {
        params.push(
          generateParameters(
            "OtherPatientId",
            this.checkQuery.OtherPatientId.trim(),
            "contains"
          )
        );
      }

      if (this.checkQuery.ProcedureCode && this.checkQuery.ProcedureCode != "")
        params.push(
          generateParameters(
            "ProcedureCode",
            this.checkQuery.ProcedureCode.value,
            "equal"
          )
        );

      //判斷病患來源
      if (
        this.checkQuery.PatientSourceTypeCode &&
        this.checkQuery.PatientSourceTypeCode != "" &&
        this.checkQuery.PatientSourceTypeCode.length > 0
      ) {
        const predicateState1 = this.checkQuery.PatientSourceTypeCode.map((condition) =>
          generateParameters("PatientSourceTypeCode", condition, "equal")
        ).join(" or ");
        params.push(`(${predicateState1})`);
      }

      //判斷檢查室
      if (
        this.checkQuery.Location &&
        this.checkQuery.Location != "" &&
        this.checkQuery.Location.length > 0
      ) {
        const predicateState2 = this.checkQuery.Location.map((condition) =>
          generateParameters("ScheduleLocation", condition, "equal")
        ).join(" or ");
        params.push(`(${predicateState2})`);
      }
      //是否急作
      if (this.$Exists(this.checkQuery.EmgFlag) && this.checkQuery.EmgFlag != null) {
        params.push(generateParameters("EmgFlag", this.checkQuery.EmgFlag, "equal"));
      }
      //報到狀態
      if (this.$Exists(this.checkQuery.status) && this.checkQuery.status != null) {
        params.push(generateParameters("Status", this.checkQuery.status, "equal"));
      }
      const pageParam =
        page === 0 && per === 0 ? "" : `&$skip=${(page - 1) * per}&$top=${per}`;
      const { allDateRange, Todayurl } = this.getMixParams(true);
      const orderBy = "&$orderby=OrderDate desc";
      return params.length > 0
        ? `$filter=${params.join(" and ")}${pageParam}${
            allDateRange ? allDateRange : Todayurl
          }${orderBy}`
        : `${allDateRange ? allDateRange : Todayurl}${pageParam}${orderBy}`;
    },
    getQuery: function () {
      let query = new Query();

      const collectOrConditions = (arr, key) => {
        return arr.reduce((ac, cu, idx) => {
          if (idx === 0) {
            ac = new Predicate(key, "equal", cu);
          } else if (idx === 1) {
            ac = ac.or(key, "equal", cu);
          } else {
            ac.predicates.push(new Predicate(key, "equal", cu));
          }
          return ac;
        }, null);
      };

      //判斷申請單號
      if (this.checkQuery.AccessionNo != "")
        query = query.where(
          "AccessionNo",
          "contains",
          this.checkQuery.AccessionNo.trim(),
          true
        );
      //判斷病例編號
      if (this.checkQuery.PatientId != "")
        query = query.where("PatientId", "contains", this.checkQuery.PatientId);
      if (this.checkQuery.RequestingPhysicianId && this.tabIndex === 1)
        query = query.where(
          "RequestingPhysicianId",
          "equal",
          this.checkQuery.RequestingPhysicianId
        );
      if (this.checkQuery.RequestingServiceId && this.tabIndex === 1)
        query = query.where(
          "RequestingServiceId",
          "equal",
          this.checkQuery.RequestingServiceId
        );
      if (this.checkQuery.Modality && this.tabIndex === 1)
        query = query.where("Modality", "equal", this.checkQuery.Modality.value);
      if (this.checkQuery.DxreportPhysicianId && this.tabIndex === 1)
        query = query.where(
          "DxreportPhysicianId",
          "equal",
          this.checkQuery.DxreportPhysicianId.value
        );
      if (this.checkQuery.IssuePhysicianId && this.tabIndex === 1)
        query = query.where(
          "IssuePhysicianId",
          "equal",
          this.checkQuery.IssuePhysicianId.value
        );

      //判斷身分證字號
      if (
        this.checkQuery.OtherPatientId != "" &&
        this.checkQuery.OtherPatientId != "Error:沒有插卡！"
      )
        query = query.where(
          "OtherPatientId",
          "contains",
          this.checkQuery.OtherPatientId.trim(),
          true
        );
      //判斷檢查項目
      // console.log(this.checkQuery.ProcedureCode);
      if (this.checkQuery.ProcedureCode) {
        if (this.checkQuery.ProcedureCode != "") {
          //const s = JSON.stringify(this.checkQuery.ProcedureCode);
          //this.checkQuery.ProcedureCode.value = this.checkQuery.ProcedureCode.value ? this.checkQuery.ProcedureCode.value : this.checkQuery.ProcedureCode.text;
          query = query.where(
            "ProcedureCode",
            "equal",
            this.checkQuery.ProcedureCode.value
          );
        }
      }
      //判斷病患來源
      if (this.checkQuery.PatientSourceTypeCode) {
        if (
          this.checkQuery.PatientSourceTypeCode != "" &&
          this.checkQuery.PatientSourceTypeCode.length > 0
        ) {
          // const predicateState1 = new Predicate("PatientSourceTypeCode", "equal", this.checkQuery.PatientSourceTypeCode[0]);
          const predicateState1 = collectOrConditions(
            this.checkQuery.PatientSourceTypeCode,
            "PatientSourceTypeCode"
          );
          query = query.where(predicateState1);
        }
      }
      //判斷檢查室
      if (this.checkQuery.Location) {
        if (this.checkQuery.Location != "" && this.checkQuery.Location.length > 0) {
          const predicateState2 = collectOrConditions(
            this.checkQuery.Location,
            "ScheduleLocation"
          );
          query = query.where(predicateState2);
        }
      }
      //是否急作
      if (this.$Exists(this.checkQuery.EmgFlag)) {
        if (this.checkQuery.EmgFlag != null) {
          query = query.where("EmgFlag", "equal", this.checkQuery.EmgFlag);
        }
      }
      //報到狀態
      if (this.$Exists(this.checkQuery.status)) {
        if (this.checkQuery.status != null) {
          query = query.where("Status", "equal", this.checkQuery.status);
        }
      }
      return query;
    },
    getRoomCount(date) {
      window.axios
        .get(`/exam/GetDayCount${date ? "?date=" + date : ""}`)
        .then(
          (res) =>
            (this.rooms = res.map((item) => ({
              ...item,
              currentCount: 1,
              modifyCount: 1,
            })))
        )
        .catch((err) => {
          window.console.log(err);
          this.rooms.length = 0;
        });
    },
    async startSearchData(callback = null, executeAccessNo = true) {
      if (!this.showLoading === null) return;
      //將按鈕狀態改為有條件查詢(輸入的資料查詢)
      this.ResetFirstCheckItem();
      this.BtnNo = 1;
      if (this.tabIndex === 0) {
        // 報到視窗出現不給搜尋列表
        if (this.mergeListState) return;
        // 普通報到
        this.$refs["twp1"].OnCancelAllSelects();
        if (executeAccessNo) this.SHOW_LOADING();
        if (executeAccessNo) this.searchCondition = null; // 非sucket 則清除條件
        this.$refs["twp1"].OnForceRefresh().then(() => {
          setTimeout(() => {
            if (executeAccessNo && this.checkQuery.AccessionNo && this.tabIndex == 0) {
              // 自動報到
              this.$refs["twp1"].Rows.forEach((r) => {
                if (!this.firstCheckedItem) this.itemChecked(r);
                if (
                  r.AccessionNo === this.checkQuery.AccessionNo ||
                  (this.printFirstRow && r.PatientId === this.checkQuery.PatientId)
                ) {
                  r.TWPCheckBox1Value = true;
                }
              });
              this.checkQuery.PatientId = "";
              this.Checkin_confirm();
            } else {
              if (executeAccessNo) this.HIDE_LOADING();
            }

            if (this.printFirstRow) {
              this.printFirstRow = false;
            }

            if (callback && typeof callback === "function") callback();
            // this.getRoomCount()
            setTimeout(() => {
              this.$refs["AccessionNo1"].focus();
            }, 1000);
          }, 200);
        });
      } else if (this.tabIndex === 1) {
        // 綜合報到
        if (this.$refs["twp2"] && (executeAccessNo || !this.checkQuery.AccessionNo))
          this.$refs["twp2"].OnForceRefresh();
      }

      this.ResetFirstCheckItem();
      this.itemChecked(null);
    },
    //更改檢查
    async changeCheck() {
      console.log("changeCheck");
      // 若報到作業開著 則關閉
      if (this.mergeListState) this.$refs["MergeListModal"].hide();

      //先串現有之檢查項目 並清空
      this.selectCheckItems = [];
      // let data = this.$refs["twp1"].checkedItems;
      let data = this.$refs["twp1"].Rows.filter(
        ({ TWPCheckBox1Value }) => TWPCheckBox1Value
      );

      let OrderNoList = [];
      let result = [];
      data.forEach((x) => {
        var ans = OrderNoList.some(function (item) {
          return item.OrderNo == x.OrderNo; // 當全部 age 大於 10 才能回傳 true
        });
        if (!ans) {
          OrderNoList.push(x.OrderNo);
        }
      });

      OrderNoList.forEach((x) => {
        let ProcedureCodeList = data.filter(function (item) {
          return item.OrderNo === x;
        });
        let tempList = [];
        ProcedureCodeList.forEach((s) => {
          tempList.push(s.ProcedureCode);
        });
        let obj = {
          orderNo: x,
          checkItemNos: tempList,
        };
        result.push(obj);
      });

      // console.log(result);
      this.bookingObjs = result;
      //病患身分證字號, R:或居留證、護照號碼'
      // let OTHER_PATIENT_ID = data[0].OtherPatientId;
      let PATIENT_ID = data[0].PatientId;
      let ORDER_NO = data[0].OrderNo;
      let ids = Object.values(this.selectCheckItems);
      console.log("data", data, "OrderNoList", OrderNoList, "result", result);
      this.checkItemNos = ids.join(",");
      // console.log(this.checkItemNos);
      //再抓取病患資料 call api
      const { actual } = await getPatientDataById("?no=" + PATIENT_ID);
      let patientData = actual;
      //病患來源代碼
      this.patientInfo = Object.assign({}, patientData.NaturalPerson);
      this.patientInfo.sourceType = this.optionsPatientSource.find(
        (s) => s.value == data[0].PatientSourceTypeCode
      ).text;
      //姓名
      this.patientInfo.name = patientData.NaturalPerson.Name;
      this.patientInfo.orderNo = ORDER_NO;
      //身分證字號
      this.patientInfo.id = patientData.RESIDENTUID;
      //性別
      this.patientInfo.gender = patientData.NaturalPerson.Sex;
      //病歷號碼
      this.patientInfo.hrNum = PATIENT_ID;
      this.patientInfo.birthDay = new Date(patientData.NaturalPerson.Birthday);
      //電話
      this.patientInfo.tel = patientData.PhoneNo4Mobile
        ? patientData.PhoneNo4Mobile
        : patientData.PhoneNo4Residence
        ? patientData.PhoneNo4Residence
        : patientData.PhoneNo4Work
        ? patientData.PhoneNo4Work
        : "";
      this.patientInfo.sourceCode = data[0].PatientSourceTypeCode;

      this.dialogOpened = true;

      // this.$refs["bookingModal"].show();
    },
    setNormalCondition(pageIndex, perpage) {
      if (!pageIndex) {
        pageIndex = 0;
        perpage = 10;
      }
      //串DataManager 打API出去 回傳資料再塞回畫面
      //開單時間的URL
      const { allDateRange, Todayurl } = this.getMixParams(false);
      // 報到狀態
      const status = "11,12" + (this.BtnNo !== 0 ? ",21" : "");
      //第一次進來時 預設只看報到跟未報到
      const param = `?status=${status}${allDateRange ? allDateRange : Todayurl}`;
      const query = this.QueryMethod()
        .page(pageIndex, perpage)
        .sortBy("OrderDate desc, CounterRegister desc");
      this.searchCondition = { param, query };
      return { param, query };
    },
    async getNormalPatientData(test, pageIndex, perpage) {
      if (this.tabIndex != 0) return;
      let _eventFromPage = false;
      if (this.searchCondition) {
        // 若是按下方的頁碼換頁
        const { e } = this.searchCondition.query.queries.find(
          ({ fn }) => fn === "onPage"
        );
        if (pageIndex !== e.pageIndex) {
          this.searchCondition = null;
          this.SHOW_LOADING();
          _eventFromPage = true;
        }
      }

      const { param, query } = this.searchCondition
        ? this.searchCondition
        : this.setNormalCondition(pageIndex, perpage);
      const {
        actual: { Items, Count },
      } = await getCounterPatients(param, query);

      if (_eventFromPage) {
        this.HIDE_LOADING();
      }

      //今天檢查項目數量
      let CheckCount = 0;
      //今日檢查之病人
      let todaycheck = [];

      Items.forEach((item) => {
        //轉換資料顯示
        item.EmgFlagName = item.EmgFlag === "Y" ? "急作" : "一般";
        //先轉成YYYY/MM/DD格式
        this.handelDateFormat(item);
        //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
        if (
          item.ScheduleTime === this.$moment().format("YYYY/MM/DD") &&
          (item.Status == "11" || item.Status == "12")
        ) {
          item._rowVariant = "danger";
          CheckCount++;
          todaycheck.push(item);
        }
        if (item.Status == "21") {
          item._rowVariant = "info";
        }
      });

      //若查詢出資料 無資料 表示該病患無檢查
      if (Count <= 0) {
        this.checkTypeList = "A";
      }
      //若查詢出資料 有資料 表示該病患有檢查
      else if (Count > 0) {
        //今日有檢查
        if (CheckCount > 0) {
          this.checkTypeList = "B";
          //裡面有今日檢查的檢查項目
          this.PatientcheckItem_List = todaycheck;
        }
        //今日無檢查，但要顯示接下來的檢查時間
        else if (CheckCount <= 0) {
          this.checkTypeList = "C";
          this.PatientcheckItem_List = Items;
        }
      }

      //Role:若申請單號 病歷號 身分證其中一個有值 表示此次查詢為針對單一病人查詢
      //     需顯示相關資料
      // if (
      //   (this.checkQuery.AccessionNo != "" ||
      //     this.checkQuery.PatientId != "" ||
      //     this.checkQuery.OtherPatientId != "") &&
      //   //表示此次查詢有值
      //   Count > 0
      // ) {
      //   this.$refs["TodayCheckList"].show();
      // }
      return { Items, Count };
    },
    getMixParams(isMix = true) {
      const allDateRange = [
        { range: this.OpenDateRange, key: "orderDate" },
        { range: this.CheckDateRange, key: "counterRegister" },
        {
          range: this.ProduredCompleteDateRange,
          key: isMix ? "procedureCompleted" : "scheduleTime",
        },
      ].reduce((acc, { range, key }) => {
        acc +=
          range && range[0] != "" && range[1] != ""
            ? `&${key}Start=${range[0].toJSON()}&${key}End=${new Date(
                this.$moment(range[1]).format("YYYY-MM-DD 23:59:59")
              ).toJSON()}`
            : "";
        return acc;
      }, "");

      //第一次進來時 預設只看報到跟未報到
      const Todayurl =
        this.BtnNo === 0 || !this.CheckDateRange
          ? `&${isMix ? "counterRegister" : "scheduleTime"}Start=${this.$moment().format(
              "YYYY-MM-DD 00:00:00"
            )}&${isMix ? "counterRegister" : "scheduleTime"}End=${this.$moment().format(
              "YYYY-MM-DD 23:59:59"
            )}`
          : "";
      return { allDateRange, Todayurl };
    },
    async getMixPatientData(test, pageIndex, perpage) {
      if (this.tabIndex != 1) return;
      if (!pageIndex) {
        pageIndex = 0;
        perpage = 10;
      }
      //串DataManager 打API出去 回傳資料再塞回畫面
      //開單時間的URL
      this.SHOW_LOADING();
      try {
        const params = this.getQueryParameter(pageIndex, perpage);
        if (!params) return;
        const actual = await getCounterPatientsAxios(params);
        //今天檢查項目數量
        const CheckCount = actual.Items.length,
          todaycheck = [];
        //今日檢查之病人
        //資料流進來後 篩選資料 ，如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示
        actual.Items.forEach((item) => {
          //轉換資料顯示
          item["EmgFlagName"] = item.EmgFlag === "Y" ? "急作" : "一般";
          const reqObj = this.optionsClassSource
            ? this.optionsClassSource.find(
                ({ value }) => item["RequestingServiceId"] === value
              )
            : null;
          item["RequestingServiceName"] = reqObj
            ? reqObj["text"]
            : item["RequestingServiceId"];

          this.handelDateFormat(item);
          //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
          if (
            item.ScheduleTime === this.$moment(new Date()).format("YYYY/MM/DD") &&
            (item.Status == "11" || item.Status == "12")
          ) {
            item._rowVariant = "danger";
            todaycheck.push(item);
          }
        });
        //若查詢出資料 無資料 表示該病患無檢查
        if (actual.Count <= 0) {
          this.checkTypeList = "A";
        }
        //若查詢出資料 有資料 表示該病患有檢查
        else if (actual.Count > 0) {
          //今日有檢查
          if (CheckCount > 0) {
            this.checkTypeList = "B";
            //裡面有今日檢查的檢查項目
            this.PatientcheckItem_List = todaycheck;
          }
          //今日無檢查，但要顯示接下來的檢查時間
          else if (CheckCount <= 0) {
            this.checkTypeList = "C";
            this.PatientcheckItem_List = actual.Items;
          }
        }
        return actual;
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err.toString().replace("Error: ", ""), type: 2 });
        return [];
      } finally {
        this.HIDE_LOADING();
      }
    },
    /*
    今日排程按鈕
    */
    TodayQuery() {
      let times = new Array(2).fill().map((v) => new Date());
      times.forEach((k, i) =>
        i === 0 ? k.setHours(0, 0, 0, 0) : k.setHours(23, 59, 59, 999)
      );
      this.OpenDateRange = times;
      this.startSearchData();
    },
    UpdateView() {
      this.$root.$emit("close-dtc-booking-dlg");
      this.$refs["twp1"].OnForceRefresh();
      this.$refs["twp1"].OnCancelAllSelects();
      this.ResetFirstCheckItem();
      this.itemChecked(null);
    },

    showLastDay() {
      if (window.dtcDebug) {
        alert(window.dtcLastDay);
      }
    },

    /*
    單擊列表，並勾選--傳入用
    */
    rowClickFunc(x) {
      x.TWPCheckBox1Value = !x.TWPCheckBox1Value;
    },
    assembleMergeList(accessionNoGroup) {
      const promises = [];
      accessionNoGroup.forEach((chosenList) => {
        promises.push(
          new Promise(async (resolve, reject) => {
            const isCheckUp = this.$refs["twp1"].Rows.filter((row) =>
              chosenList.some((li) => li.AccessionNo == row.AccessionNo)
            ).every((row) => row.PatientSourceTypeCode === "G");
            const orderNo = Array.from(
              new Set(chosenList.map(({ AccessionNo }) => AccessionNo.substr(0, 10)))
            );
            const hasOther = accessionNoGroup
              .filter((group) => group != chosenList)
              .some((group) => {
                const otherNo = Array.from(
                  new Set(group.map(({ AccessionNo }) => AccessionNo.substr(0, 10)))
                );
                return orderNo.some((no) => otherNo.includes(no));
              });
            this.checkNos = chosenList.map((li) => li.AccessionNo);
            // Exams 變動檢查作業, UnExams 今日尚有未檢查的其他檢查作業
            const { Exams, UnExams } = await examCheckInEvent({
              changeState: false,
              marge: !hasOther,
              isCheckUp,
              accessions: this.checkNos,
            });
            const isFound = Exams.map(({ AccessionNo }) => AccessionNo).some((no) =>
              chosenList.some(
                ({ ProcedureCodeList }) =>
                  ProcedureCodeList && ProcedureCodeList.some((code) => no === code)
              )
            );

            const param = `?checkItems=${
              isFound
                ? Exams.map((l) => l.ProcedureCode).join(",")
                : chosenList[0].ProcedureCodeList &&
                  chosenList[0].ProcedureCodeList.length > 0
                ? chosenList[0].ProcedureCodeList[0]
                : chosenList[0].ProcedureCode
            }&isNo=true`;

            const result = await patientRegisterCounterEvent(param);

            let mergedList = [...result.actual];
            if (result) {
              UnExams.forEach((unexam) => {
                // this.unExamList = UnExams;
                if (
                  this.$refs["twp1"].Rows.every(
                    ({ AccessionNo }) => unexam.AccessionNo !== AccessionNo
                  )
                ) {
                  unexam.EmgFlagName = unexam.EmgFlag === "Y" ? "急作" : "一般";
                  this.handelDateFormat(unexam);
                  this.$refs["twp1"].Rows.push(unexam);
                }
              });

              mergedList.forEach((mi) => {
                mi["Accessions"] =
                  Exams.length === 0
                    ? []
                    : Exams.reduce((a, exam) => {
                        const isMatch =
                          mi.MargeCheckItemNos.indexOf(exam.ProcedureCode) >= 0;

                        console.log(mi.MargeCheckItemNos, exam.ProcedureCode);

                        const chosenItem = chosenList.find(
                          (item) =>
                            item.AccessionNo.slice(0, -2) ===
                            exam.AccessionNo.slice(0, -2)
                        );
                        console.log({ chosenItem });
                        if (chosenItem) {
                          mi["ProcedureCodeList"] = chosenList.reduce(
                            (acc, cur, idx) =>
                              acc.concat({
                                text: cur.ProcedureNameList.split(", ")[0],
                                value:
                                  chosenItem["ProcedureCodeList"] &&
                                  chosenItem["ProcedureCodeList"].length > 0
                                    ? chosenItem["ProcedureCodeList"][idx]
                                    : chosenItem["ProcedureCode"],
                              }),
                            []
                          );
                        }

                        mi["ProcedureAccession"] = chosenList.reduce(
                          (acc, cur) =>
                            acc.concat({
                              text: cur.ProcedureNameList.split(", ")[0],
                              value: cur.AccessionNo,
                            }),
                          []
                        );
                        // console.log(mi["ProcedureAccession"]);
                        mi["UNExamList"] = UnExams;
                        mi["temproom"] = exam.ScheduleLocation;
                        mi["temproomName"] = exam.ScheduleLocationName;
                        mi["ProcedureName"] = exam.ProcedureName;
                        // mi["ProcedureCode"] = this.converNameToCode(exam.ProcedureName, "object").map(v => Object.assign(v, { change: null }), 'object');
                        mi["ProcedureCode"] = this.converCodeToObj(
                          mi["MargeCheckItemNos"].split(",")
                        );
                        mi["Modality"] = exam.Modality;
                        mi["CounterRegister"] = chosenList[0].Status === "21";
                        // a.concat(mi["ProcedureAccession"][0]["value"])
                        return isMatch
                          ? a.concat(exam.AccessionNo)
                          : Array.from(
                              new Set(
                                a.concat(chosenList.map(({ AccessionNo }) => AccessionNo))
                              )
                            );
                      }, []);

                // mi["Accessions"].forEach((no) => {
                //   if (this.$refs["twp1"].Rows.filter(({ TWPCheckBox1Value }) => TWPCheckBox1Value).some((li) => li.AccessionNo === no && li.CounterRegister_forShow)) {
                //     mi["CounterRegister"] = true;
                //   }
                // });

                if (mi["ProcedureAccession"]) {
                  mi["CheckedAccessions"] = [
                    ...mi["ProcedureAccession"].map(({ value }) => value),
                  ];
                }
              });
              resolve(mergedList);
            } else {
              reject(null);
            }
          })
        );
      });
      return promises;
    },
    async Checkin_confirm() {
      // 確定報到 處理單
      this.MergeList = []; // 清除舊單
      this.checkNos = [];
      this.SHOW_LOADING();
      try {
        // 取得勾選的項目
        const chosenGroupList = this.$refs["twp1"].Rows.reduce(
          (
            acc,
            {
              showCheckBox,
              TWPCheckBox1Value,
              AccessionNo,
              Status,
              ProcedureCodeList,
              ProcedureCode,
              ProcedureNameList,
            }
          ) => {
            if (TWPCheckBox1Value && showCheckBox) {
              if (!acc[Status]) acc[Status] = []; // 依狀態來區分，分別打api
              // if (!acc[Status].some(item => item.AccessionNo.substr(0, 10) === AccessionNo.substr(0, 10) && item.Status === Status)) {
              //   acc[Status].push({ AccessionNo, Status, ProcedureCodeList, ProcedureNameList });
              // }
              acc[Status].push({
                AccessionNo,
                Status,
                ProcedureCode,
                ProcedureCodeList,
                ProcedureNameList,
              });
            }
            return acc;
          },
          {}
        );

        // 若沒有資料則移除搜尋條件
        if (chosenGroupList && Object.values(chosenGroupList).length == 0) {
          this.checkQuery.AccessionNo = "";
          throw new Error("查無資料");
        }
        // const [registerItems, unRegisterItems] = [Object.entries(chosenGroupList).filter(([k]) => k == 21), Object.entries(chosenGroupList).filter(([k]) => k != 21)];
        // console.log({ registerItems, unRegisterItems });
        // 透過api收集併單資料
        // console.log({ chosenGroupList });

        const promises = this.assembleMergeList(Object.values(chosenGroupList));
        Promise.all(promises)
          .then((groupRes) => {
            this.MergeList = groupRes.flat();
            // const dataList = this.$refs["twp1"].Rows.reduce((a, { TWPCheckBox1Value, AccessionNo, Modality, PatientSourceTypeCode }) =>TWPCheckBox1Value ? [...a, { TWPCheckBox1Value, AccessionNo, Modality, PatientSourceTypeCode }] : a, [] );
            //先打一次Checkin 並帶入false 不改狀態 純拿預計檢查室 Modality
            // 判斷是否為健檢

            // 更新按鈕狀態
            this.onAfterFresh(
              Object.values(chosenGroupList)
                .flat()
                .map((li) => li.Status)
            );
            // 取得檢查室資料
            this.getRoomAPI().then(() => {
              this.$refs["MergeListModal"].show();
            });
          })
          .catch((groupErr) => {
            throw new Error("api error");
          });
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err.toString().replace("Error: ", ""), type: 2 });
      } finally {
        this.HIDE_LOADING();
      }
    },
    //取得檢查室相關資料
    getRoomAPI() {
      let promises = [];
      this.MergeList.forEach(async (x) => {
        const param = "?type=" + x.Type + "&id=" + x.Id;
        promises.push(getRoomRelativeList(param));
      });

      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then((values) => {
            values.forEach((r, idx) => {
              this.MergeList[idx].roomList = r.actual.Items.map(({ No, Name }) => ({
                text: Name,
                value: No,
              }));
              if (!this.MergeList[idx].temproom) {
                // 取得第一順序的檢查室
                console.log("this.MergeList[idx].roomList.length");
                if (this.MergeList[idx].roomList.length > 0)
                  [this.MergeList[idx].temproom, this.MergeList[idx].temproomName] = [
                    this.MergeList[idx].roomList[0].value,
                    this.MergeList[idx].roomList[0].text,
                  ];
              }
              this.$set(this.MergeList, idx, this.MergeList[idx]);
            });
            resolve();
          })
          .catch(() => reject());
      });
    },
    //confirm true 確定報到 false 關閉畫面, print true 列印 false 不列印
    async confirm_room({ confirm, print = false, item = null }) {
      if (confirm) {
        //確定報到 寫入檢查室資料
        let printingList = [];
        this.MergeList.filter((merge) => merge == item).forEach(
          async (
            { temproom, roomList, Accessions, CheckedAccessions, ProcedureCodeList },
            idx
          ) => {
            try {
              const isMerge =
                CheckedAccessions.length === ProcedureCodeList.length &&
                CheckedAccessions.length > 1;
              // console.log(isMerge, CheckedAccessions.length, ProcedureCodeList.length, CheckedAccessions.length > 1);
              // 判斷是否為健檢
              const isCheckUp = this.$refs["twp1"].Rows.filter((row) =>
                Accessions.includes(row.AccessionNo)
              ).every((row) => row.PatientSourceTypeCode === "G");
              const res = await this.hubProxy.invoke(
                "checkIn",
                isMerge ? Accessions : CheckedAccessions,
                temproom,
                true,
                isCheckUp,
                isMerge,
                this.Profile4User.JWTToke
                // this.$store.state.Profile4User.JWTToke
              );
              const mergeRoom = roomList.filter(({ value }) => temproom === value);
              this.SET_SIDE_MESSAGE({
                msg: `報到完成 檢查室: ${
                  mergeRoom.length > 0 ? mergeRoom[0].text : "UNKNOWN"
                }, 報到序號: ${res.Info.CallNo}`,
                type: 1,
              });
              if (print) {
                const { Exams, UnExams } = res.Info;
                printingList = printingList.concat([...Exams, ...UnExams]);
              }
              if (idx === this.MergeList.length - 1) {
                // 最後一筆報到
                this.ResetFirstCheckItem();
                this.itemChecked(null);
                this.changeBtn = this.checkinBtn = false;
                this.checkQuery.AccessionNo = Accessions[0].substr(0, 10);
                this.$refs["twp1"].OnCancelAllSelects();
                this.$refs["twp1"].OnForceRefresh().then(() => {
                  this.checkQuery.AccessionNo = "";
                  this.$refs.checkinRoom.showRoom(temproom);
                });
                if (print) {
                  setTimeout(() => {
                    if (printingList.length > 0) this.printStuff = printingList;
                  }, 50);
                }
              } else {
                this.$refs["twp1"].OnForceRefresh();
              }
            } catch (err) {
              this.SET_SIDE_MESSAGE({
                msg: "報到錯誤! 請稍後再試. " + err.toString().replace("Error: ", ""),
                type: 2,
              });
            }
          }
        );
      } else {
        this.checkQuery.AccessionNo = "";
      }
      this.$refs["MergeListModal"].hide();
    },
    //取消報到
    async Checkin_cancel(mergeList = null) {
      this.SHOW_LOADING();
      let data = this.$refs["twp1"].Rows.filter(
        (data) => data.TWPCheckBox1Value && data.CounterRegister_forShow
      );
      const AccessionNo = data.map(({ AccessionNo }) => AccessionNo);
      let isMerge = true,
        mergeItem;
      if (mergeList) {
        mergeItem = mergeList.find((item) =>
          AccessionNo.some((no) => item.Accessions[0] === no)
        );
        isMerge =
          !!mergeItem && mergeItem.ProcedureCodeList && mergeItem.CheckedAccessions
            ? mergeItem.CheckedAccessions.length === mergeItem.ProcedureCodeList.length &&
              mergeItem.CheckedAccessions.length > 1
            : false;
      } else {
        if (AccessionNo.length) {
          this.Checkin_confirm();
          return;
        }
      }
      // console.log(!mergeList ? AccessionNo : mergeItem.CheckedAccessions, isMerge, this.Profile4User.JWTToke);
      await this.hubProxy.invoke(
        "checkInBack",
        !mergeList ? AccessionNo : mergeItem.CheckedAccessions,
        isMerge,
        this.Profile4User.JWTToke
      );
      this.HIDE_LOADING();
      this.SET_SIDE_MESSAGE({ msg: "報到取消完成" });
      this.$refs["twp1"].OnForceRefresh();
      this.$refs["twp1"].OnCancelAllSelects();
      this.ResetFirstCheckItem();
      this.itemChecked(null);
      this.$refs["MergeListModal"].hide();
      this.onAfterFresh();
      this.getRoomCount();
      this.$refs["MergeListModal"].hide();
    },
    cancel_room() {
      this.$refs["Choice_Room"].hide();
    },
    //
    //header checkbox 勾選後 若為取消 將firstCheckedItem設為null
    //
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    ResetFirstCheckItem() {
      this.firstCheckedItem = null;
    },
    //
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      if (this.firstCheckedItem == null) return true;
      return item.PatientId == this.firstCheckedItem.PatientId;
    },
    //
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox(rows) {
      //若查詢的條件有不一致的病人 則不予使用此功能
      return this.firstCheckedItem == null ? false : true;
      // const result = rows.some(({ TWPCheckBox1Value }) => TWPCheckBox1Value);
      // console.log(rows)
      // return result;
    },
    isSameday(dayOne, dayTwo) {
      const covert = (time) => {
        return this.$moment(time).format("YYYY-MM-DD");
      };
      return covert(dayOne) === covert(dayTwo);
    },
    onAfterFresh(list = []) {
      this.checkinBtn = false;
      this.CancelBtn = false;
      this.changeBtn = false;
      if (list.includes("11")) {
        this.checkinBtn = true;
        this.CancelBtn = false;
        this.changeBtn = true;
      }
      if (list.includes("12")) {
        this.checkinBtn = true;
        this.CancelBtn = false;
        this.changeBtn = true;
      }
      if (list.includes("21")) {
        this.checkinBtn = false;
        this.CancelBtn = true;
        this.changeBtn = false;
      }
      //同時點選未排檢與已排檢 只可更改檢查 不可取消或是報到
      if (list.includes("11") && list.includes("12")) {
        this.checkinBtn = true;
        this.CancelBtn = false;
        this.changeBtn = true;
      }
      //同時點選未排檢與已報到 甚麼都不能做
      if (list.includes("11") && list.includes("21")) {
        this.checkinBtn = false;
        this.CancelBtn = false;
        this.changeBtn = false;
      }
      //同時點選已排檢與已報到 甚麼都不能做
      if (list.includes("12") && list.includes("21")) {
        this.checkinBtn = false;
        this.CancelBtn = false;
        this.changeBtn = false;
      }
      if (list.includes("11") && list.includes("12") && list.includes("21")) {
        this.checkinBtn = false;
        this.CancelBtn = false;
        this.changeBtn = false;
      }
    },
    //
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      if (!item) return;
      if (this.firstCheckedItem == null) this.firstCheckedItem = item;
      //紀錄此次勾選的檢察單號
      let viewdata = this.$refs["twp1"].Rows;
      item.TWPCheckBox1Value = !item.TWPCheckBox1Value;
      if (item.Modality === "CR") {
        let tempAccession = item.AccessionNo.substr(0, 9);
        // if (item.showCheckBox) item.TWPCheckBox1Value = !item.TWPCheckBox1Value;
        viewdata.forEach((x) => {
          if (x.AccessionNo.indexOf(tempAccession) === 0) {
            x.TWPCheckBox1Value = item.TWPCheckBox1Value;
          }
        });
      } else if (item.Modality === "MR" || item.Modality === "CT") {
        // if (item.showCheckBox) item.TWPCheckBox1Value = !item.TWPCheckBox1Value;
        viewdata.forEach((vd) => {
          if (
            item.ScheduleTime &&
            vd.ScheduleTime &&
            this.isSameday(item.ScheduleTime, vd.ScheduleTime) &&
            vd.PatientId == item.PatientId
          ) {
            vd.showCheckBox = true;
            // vd.TWPCheckBox1Value = item.TWPCheckBox1Value;
          }
        });
      }
    },
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      // no use
    },
    //取得病患來源列表
    async GetOptionsPatientSource() {
      const {
        actual: { Items },
      } = await getOptionsPatientSource();
      this.optionsPatientSource = [{ value: null, text: "請選擇" }].concat(
        Items.map((item) => ({ value: item.No, text: item.Name }))
      );
    },
    //檢查室清單
    async GetLocationSource() {
      const {
        actual: { Items },
      } = await getOptionsRoomSource();
      this.optionsLocationSource = [{ value: null, text: "請選擇" }].concat(
        Items.map((item) => ({ value: item.No, text: item.Name }))
      );
    },
    //取得報到狀態的清單
    async GetStatusSource() {
      const param = "?groupNo=ExamState";
      const {
        actual: { Items },
      } = await getCounterStatusSource(param);
      this.TotalStatusSource = [{ value: null, text: "請選擇" }].concat(
        Items.map((item) => ({ value: item.No, text: item.Name }))
      );
      this.CheckinStatusSource = this.$DeepCopy(
        this.TotalStatusSource.filter(
          (item) =>
            item.value == null ||
            item.value === "11" ||
            item.value === "12" ||
            item.value === "21"
        )
      );
      //綜合查詢的Source
    },
    handleWaitingNo() {
      this.roomsCr.forEach(async (room, idx) => {
        room.currentCount = await getCurrentNo(room.RoomNo);
        console.log("this.roomsCr.length - 1");
        if (idx === this.roomsCr.length - 1) this.modalWaiting = true;
      });

      // getCurrentNo();
    },
    async readIcCard() {
      try {
        let { message } = await getIcCardInfo();
        const [code, id] = message.replace(/[^a-zA-Z0-9]+/g, "-").split("-");
        this.checkQuery.OtherPatientId = id;
        this.startSearchData(() => {
          if (this.checkQuery.AccessionNo) {
            addRecodeToAccessionNo({
              AccessionNo: this.checkQuery.AccessionNo,
              Action: "健保卡登入",
              NewActionNote: message.replace(code, ""),
            });
          }
        });
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err.ErrorMessage || err.Message, type: 2 });
      }
    },
    socketChangeStatus(exam, type) {
      if (type === "hubProxy") {
        this.startSearchData(null, false);
      } else if (type === "bookingProxy") {
        // if (this.$refs.daily) this.$refs.daily.reFreshData();
        // this.$refs.bookingView.reFreshData(exam);
      }
    },
    handelDateFormat(item) {
      [
        "ProcedureCompleted",
        "ScheduleTime",
        "CounterRegister",
        "OrderDate",
        "IssueTime",
      ].forEach((t) => {
        if (item[t]) {
          const showFormat = this.$moment(item[t]).format(
            "YYYY/MM/DD" + (t != "OrderDate" ? " HH:mm:ss" : "")
          );
          item[`${t}_forShow`] = showFormat === "Invalid date" ? "" : showFormat;
        }
      });
    },
    resizeAvailableHgt() {
      this.availableHgt = window.innerHeight - 280;
    },
  },
  created() {
    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //取得打API時 需 Hold住畫面的Mehtod
    // 宣告監聽器:攔截 KeyPress
    window.addEventListener("keydown", this.HKWatch);
    //
    //檢查項目下拉選單
    this.GetOptionsCheckItem(); //checkItem.Options()
    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //報到狀態下拉選單
    this.GetStatusSource();
    // 取得檢查室資訊
    this.getRoomCount();
    // connect webSocket
    this.ConnectionHubConnection();
    // 取得開單資訊
    this.fetchDoctorAndClassSource();

    // 取得checkItem/ForSpecialTime
    this.getForSpecialTime();

    document.documentElement.style.setProperty("--theme-modal-bg-color", "black");

    //病患狀態下拉選單
    //focus到病歷號上
    // 畫面自動呼叫讀卡機程式 抓取讀卡機資料 To-DO
    // setInterval(() => {
    //   this.readIcCard();
    // }, 5000);
    // let _this = this;
    // window.axios
    //   .get(configs.publicPath + "../checkItem/SelectList")
    //   .then(e => {
    //     _this.checkItems = e.data.Items;
    //     _this.selectCheckItems.push(_this.checkItems[0].Id);
    //   });
  },
  mounted() {
    setTimeout((x) => {
      this.$nextTick(() => this.$refs["AccessionNo1"].focus());
      // this.$refs["AccessionNo1"].$el.addEventListener("keyup", ({ type, timeStamp, key }) => {
      //   this.accessKeyEvent = { type, timeStamp };
      //   if (key === "Enter") {
      //     this.scannerData.count = 0;
      //     this.scannerData.ensure = false;
      //   }
      // });
      // this.startSearchData(); // for lazyness
      // const topLgt = this.$refs.mainResult.offsetTop;
      // document.getElementById('block4QueryResult').style.height = `calc(100vh - ${topLgt + 59}px)`;
    }, 500);
    this.isMounted = true;
    this.resizeAvailableHgt();
    window.addEventListener("resize", this.resizeAvailableHgt);
  },

  beforeMount() {
    this.$root.$on("update-dtc-rooms", (rooms) => {
      rooms.length > 0 ? (this.dtcBtnId = rooms[0].Id) : (this.dtcBtnId = "");
      this.dtcRooms = rooms;
    });
    this.$root.$on("show-dtc-print-dlg", (item) => {
      //const h = this.checkQuery.PatientId;
      this.checkQuery.PatientId = item.PatientId;
      this.printFirstRow = true;
      this.startSearchData(null, true);
      //setTimeout(() => (this.checkQuery.PatientId = h), 400);
    });
    this.$root.$on("dtc-edit-med-done", (AccessionNo) => {
      this.checkQuery.AccessionNo = AccessionNo;
      this.startSearchData();
      this.checkQuery.AccessionNo = "";
      //this.$refs["twp1"].OnForceRefresh();
    });
  },
  beforeDestroy() {
    this.sockConnection.stop();
    window.removeEventListener("resize", this.resizeAvailableHgt);
  },
  destroyed() {
    // console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    // this.websock.close(); //离开路由之后断开websocket连接
  },
  watch: {
    accessKeyEvent(n, o) {
      if (!o.timeStamp) return;
      const diffTimeStamp = Math.floor(n.timeStamp - o.timeStamp);
      if (diffTimeStamp < 10) {
        this.scannerData.count += 1;
        if (this.scannerData.count === 3) {
          this.checkQuery.AccessionNo = this.checkQuery.AccessionNo.slice(-4);
        }
      } else if (diffTimeStamp > 10) {
        this.scannerData.count = 0;
      }
    },
    mergeListState(value) {
      this.isCheckinRoomFixed = value;

      if (value) {
        if (this.MergeList.length > 0 && this.MergeList[0].temproom)
          this.itemRoomChangeEvent(this.MergeList[0].temproom);
        let space = (document.body.clientWidth - 798) * 0.5;
        let gap = space - this.$refs.checkinRoom.$el.clientWidth - 20;
        if (gap < 0) {
          document.body.querySelector(".modal-content").style.transform = `translateX(${
            Math.abs(gap) > space ? -space : gap
          }px)`;
        } else {
          document.body.querySelector(".modal-content").style.transform = "";
        }
      } else {
        this.$refs["twp1"].OnCancelAllSelects();
        this.onAfterFresh();
        this.ResetFirstCheckItem();
        this.getRoomCount();
        this.checkQuery.AccessionNo = "";
        this.checkRoomMod = "";
        this.altExpend = null;
        this.$refs["AccessionNo1"].focus();
      }
    },
    showWorkingCalendar(value) {
      document.getElementById("app").classList[value ? "add" : "remove"]("no-scroll");
      if (!value) {
        this.chosenModality = "";
      }
    },
    tabIndex(value) {
      console.log("tabIndex---");
      this.$refs[`twp${value + 1}`].Rows.length === 0 &&
        this.$refs[`twp${value + 1}`].OnForceRefresh();
      if (value === 1) this.clear();
    },
    patientHistoryModalIsShow(value) {
      if (!value) this.currentPage = 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/animation.scss";
.dtc-title {
  position: relative;
  .dtc-when {
    position: absolute;
    top: 20%;
    left: 50%;
    right: 0;
    bottom: 0;
    display: block;
    width: 200px;
    height: 30px;
    color: white;
    transform: translate(-50%, -50%);
  }
}
.merge-modal-btns {
  > button {
    margin-right: 5px;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}

.cardHeader {
  padding: 2px 1.25rem;
}
#ModalButton {
  width: 766px;
  background-color: #01579b;
}
#Button_color {
  background-color: #01579b;
}
#block4TodayList {
  overflow-y: auto;
  border: 1px solid #ced4da;
  height: var(--tableHgt);
}
.calendar {
  cursor: pointer;
  right: 10px;
}

.modality-btns {
  position: absolute;
  right: 5px;
  top: 0;
  button {
    border-width: 0;
    margin-left: 2px;
    &.active {
      transform: scale(0.85) translateY(5%);
    }
  }
}
.input-group-text {
  min-width: 90px !important;
}
.loading-work {
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1500;
}

.custom-control-input:disabled ~ .custom-control-label,
.custom-control-input[disabled] ~ .custom-control-label {
  color: #fff;
}

.input-group /deep/ .vue-treeselect > div {
  min-height: 38px;
}

/deep/ .custom-control-input:disabled ~ .custom-control-label,
/deep/ .custom-control-input[disabled] ~ .custom-control-label {
  color: #fff !important;
}

.search-section {
  button.btn {
    padding-left: 6px;
    padding-right: 6px;
  }
}

.detail-row {
  .detail-no {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    font-size: 14px;
  }
  .detail-name {
    font-size: 18px;
  }
}
</style>
<style lang="scss">
#merge-list-modal___BV_modal_body_ {
  .card-header {
    position: relative;
    padding: 8px 110px 8px 15px;
  }
  .card-body {
    padding: 8px;
  }
  .change-item {
    right: 8px;
    top: 8px;
  }
}

@media (min-width: 992px) {
  #ModalSize .modal .modal-huge {
    max-width: 100% !important;
    width: 100% !important;
  }
}

#ModalSize .modal-dialog {
  max-width: 95%;
  width: 95%;
}

#ModalSize .modal .modal-huge {
  max-width: 95%;
  width: 95%;
}
$purple: #6a0dad;
.purple-button {
  background-color: $purple;
  &:hover {
    background-color: darken($purple, 10%);
  }
}

.change-item fieldset {
  border: 0;
}
#block4QueryResult,
#block4TodayList {
  min-height: calc(100vh - 225px);
  &.mix {
    min-height: calc(100vh - 308px);
  }
}

/deep/ .mu-appbar-title {
  background-color: aliceblue !important;
}

/deep/ .mu-primary-color {
  background-color: aliceblue !important;
}
</style>
<style>
#OpenDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#OpenDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
#CheckDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#CheckDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
.fix-light .super-select-container {
  z-index: 9999;
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}

/* .fix-light .super-select-input,
.fix-light .super-select-container input,
.fix-light .super-select-container {
  background: transparent !important;
} */

.bg-pink {
  background-color: #e01baf;
}

.btn-orange {
  background: var(--orange);
  color: white;
}

.table-info > td {
  color: #000;
}

.card {
  background-color: transparent !important;
}

/* .custom-control-input:disabled ~ .custom-control-label,
.custom-control-input[disabled] ~ .custom-control-label {
} */

.table {
  color: inherit;
}

.mu-dialog-body {
  color: inherit;
}
.input-group-prepend {
  max-height: 40px;
}

.record-td {
  width: 320px;
}

.white-space-nowrap {
  white-space: nowrap;
}
</style>
