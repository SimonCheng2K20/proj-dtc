<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content
      header="建立慢性精神病患社區復健轉介醫囑單及申請書"
      class="font-bold"
      width="1280px"
      @close="onDialogCancel()"
    >
      <div class="grid gap-2" v-if="page === '1'">
        <section>
          <div class="flex items-end">
            <p class="text-lg">轉介醫囑單</p>
            <p class="text-sm pl-3">(應自轉介日期起三十日內，持本單至全民健康保險特約之社區復健機構辦理，逾期失效)</p>
          </div>

          <div class="border border-[#1e40af] p-2 grid gap-2">
            <my-input-group class="grid gap-2 grid-cols-3">
              <my-input-wrapper label="轉介院所名稱(機構)">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="轉介院所代號(機構)">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="轉介日期">
                <my-date-input v-bind="QInputProps"></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="建議轉往之社區復健機構名稱">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="轉介類別" input-border>
                <q-option-group :options="referralTypeItems" inline></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="個案來源" input-border>
                <q-option-group :options="patientSourceItems" inline></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="病歷號碼">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="轉介醫師">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="聯絡電話">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </div>
        </section>

        <section class="border border-[#1e40af] grid gap-2">
          <div class="px-2 mt-2">
            <p class="text-lg">一、一般資料</p>
            <my-input-group class="grid gap-2 grid-cols-4">
              <my-input-wrapper label="姓名">
                <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="出生日期">
                <my-date-input v-bind="QInputProps" v-model="data.出生日期"></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="年齡(足歲)">
                <my-date-input v-bind="QInputProps" v-model="data.出生日期"></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="身分證字號">
                <q-input v-bind="QInputProps" v-model="data.身分證字號"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="連絡電話">
                <q-input v-bind="QInputProps" v-model="data.連絡電話"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="戶籍地址">
                <q-input v-bind="QInputProps" v-model="data.住址"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="居住地址">
                <q-input v-bind="QInputProps" v-model="data.住址"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="婚姻">
                <q-select v-bind="QSelectProps" v-model="data.婚姻" :options="marriageItems" inline></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="學歷">
                <q-select v-bind="QSelectProps" v-model="data.學歷" :options="educationalItems" inline></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="就業現況">
                <q-select v-bind="QSelectProps" v-model="data.就業現況" :options="employmentItems" inline></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="主要聯絡人">
                <q-input v-bind="QInputProps" v-model="data.主要聯絡人"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="與病患關係">
                <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="聯絡電話">
                <q-input v-bind="QInputProps" v-model="data.聯絡電話"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-3" label="聯絡人地址">
                <q-input v-bind="QInputProps" v-model="data.聯絡人地址"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </div>

          <div class="px-2">
            <p class="text-lg">二、醫療情形</p>
            <my-input-group class="grid gap-2 grid-cols-4">
              <my-input-wrapper class="col-span-4" label="診斷">
                <q-input v-bind="QInputProps" v-model="data.診斷"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-2" label="首次病發約">
                <q-input v-bind="QInputProps" v-model="data.首次病發約">
                  <template #append>
                    <div>歲</div>
                  </template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-2" label="國際疾病代碼">
                <q-input v-bind="QInputProps" v-model="data.國際疾病代碼"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="是否曾住院" input-border>
                <q-checkbox v-model="data.是否曾住院"></q-checkbox>
                <div v-if="data.是否曾住院" class="grid gap-2 m-2">
                  <my-input-wrapper label="住院次數">
                    <q-input v-bind="QInputProps" v-model="data.住院次數" type="number"></q-input>
                  </my-input-wrapper>
                  <my-input-wrapper label="最近一次住院期間" range-input>
                    <template #range-input-0>
                      <my-date-input v-bind="QInputProps" v-model="data.最近一次住院期間start"></my-date-input>
                    </template>
                    <template #range-input-1>
                      <my-date-input v-bind="QInputProps" v-model="data.最近一次住院期間end"></my-date-input>
                    </template>
                  </my-input-wrapper>
                </div>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="目前是否有下列需要治療的身體疾病" input-border>
                <q-option-group
                  v-model="data.目前是否有下列需要治療的身體疾病"
                  :options="diseaseItems"
                  inline
                ></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="過去是否有下列症狀或行為" input-border>
                <q-option-group
                  v-model="data.過去是否有下列症狀或行為"
                  :options="options1"
                  inline
                  type="checkbox"
                ></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="目前精神症狀及主要問題">
                <q-input v-bind="QInputProps" v-model="data.目前精神症狀及主要問題"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="能否規則前往門診" input-border>
                <q-option-group inline v-model="data.能否規則前往門診" :options="options2"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="對藥物治療的態度" input-border>
                <q-option-group inline v-model="data.對藥物治療的態度" :options="options3"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="目前使用的藥物及劑量">
                <q-input v-bind="QInputProps" v-model="data.目前使用的藥物及劑量"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="有否藥物副作用" input-border>
                <q-option-group inline v-model="data.對藥物治療的態度" :options="options4"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="是否有下列習慣或問題" input-border>
                <q-option-group inline v-model="data.對藥物治療的態度" :options="options5"></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-4" label="其它適切資料">
                <q-input v-bind="QInputProps" v-model="data.目前使用的藥物及劑量"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </div>

          <div class="grid grid-cols-2 border-t border-[#1e40af]">
            <div class="p-2 border-r border-[#1e40af]">
              <p class="text-lg">病人或家屬同意轉介簽章</p>
              <my-input-group class="grid gap-2 grid-cols-2">
                <my-input-wrapper label="病人">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="家屬">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
              </my-input-group>
            </div>
            <div class="p-2">
              <my-input-group class="grid gap-2">
                <my-input-wrapper label="轉介專科醫師簽章">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="醫事服務機構地址">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
              </my-input-group>
            </div>
          </div>
        </section>

        <section>
          <p class="text-lg text-center">申請書</p>
          <my-input-group class="grid gap-2 grid-cols-3 border border-[#1e40af] p-2">
            <my-input-wrapper label="醫事服務機構代號名稱">
              <q-input v-bind="QInputProps" v-model="data.受理編號"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="受理日期(免填)">
              <my-date-input v-bind="QInputProps" v-model="data.收案日期"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="(原)受理編號(詳說明)">
              <q-input v-bind="QInputProps" v-model="data.受理編號"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-2" label="案件類別" input-border>
              <q-option-group v-model="data.案件類別" :options="caseTypeItems" inline></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="收案日期">
              <my-date-input v-bind="QInputProps" v-model="data.收案日期"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="(原)申請期限">
              <my-date-input v-bind="QInputProps" v-model="data.申請期限"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="延長照護期限">
              <my-date-input v-bind="QInputProps" v-model="data.延長照護期限"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="收案理由或延長照護理由">
              <q-input v-bind="QInputProps" v-model="data.收案理由或延長照護理由"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="復健目標">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-1" label="機構負責人姓名">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-1" label="印信">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="醫事服務機構地址">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="保險人意見欄" input-border>
              <q-option-group v-model="data.案件類別" :options="options6" inline></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="審查醫師">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="承辦人">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="複核">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="科長">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="決行">
              <q-input v-bind="QInputProps" v-model="data.復健目標"></q-input>
            </my-input-wrapper>
          </my-input-group>

          <div class="flex border border-[#1e40af] mt-2">
            <div class="border-r border-[#1e40af] bg-[#deecff] flex flex-col justify-around px-2">
              <p>說</p>
              <p>明</p>
            </div>

            <div class="p-2 grow">
              <p>1.本申請書一式三聯，由照護機構於收案後二週內向保險人分區業務組填復。</p>
              <p>2.「原受理編號欄」，係申復或申請延長社區復健時填寫，申請收案者不須填寫。</p>
              <p>3.未依規定報備核准收案或延長社區復健者，不予給付費用。</p>
              <p>
                4.對核定結果有異議者，自核定通知之日起六十日內，應遵循申復及爭議審議途徑申請複
                核或審議，不得以新個案重新申請送核；否則不予受理。
              </p>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-2" v-if="page === '2'">
        <section>
          <p class="text-lg">壹、病患基本資料</p>
          <my-input-group class="grid grid-cols-4 gap-2">
            <my-input-wrapper label="姓名">
              <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="身分證號">
              <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="性別" inputBorder>
              <q-option-group inline v-model="data.性別" :options="genderItems"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="出生日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="連絡電話">
              <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="戶籍地址">
              <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="居住地址">
              <q-input v-bind="QInputProps" v-model="data.姓名"></q-input>
            </my-input-wrapper>
          </my-input-group>
        </section>

        <section>
          <IcdTable></IcdTable>
        </section>

        <section>
          <my-input-group class="grid grid-cols-4 gap-2">
            <my-input-wrapper label="婚姻">
              <q-select v-bind="QSelectProps" v-model="data.婚姻" :options="marriageItems" inline></q-select>
            </my-input-wrapper>
            <my-input-wrapper label="學歷">
              <q-select v-bind="QSelectProps" v-model="data.學歷" :options="educationalItems" inline></q-select>
            </my-input-wrapper>
            <my-input-wrapper label="就業現況">
              <q-select v-bind="QSelectProps" v-model="data.就業現況" :options="employmentItems" inline></q-select>
            </my-input-wrapper>
            <my-input-wrapper class="col-start-1" label="主要聯絡人">
              <q-input v-bind="QInputProps" v-model="data.主要聯絡人"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="與病患關係">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="聯絡電話">
              <q-input v-bind="QInputProps" v-model="data.聯絡電話"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-3" label="聯絡人地址">
              <q-input v-bind="QInputProps" v-model="data.聯絡人地址"></q-input>
            </my-input-wrapper>
          </my-input-group>
        </section>

        <section class="border border-[#1e40af] p-2 grid gap-2">
          <p>貳、功能量表</p>
          <my-input-group class="grid gap-2">
            <my-input-wrapper label="一、積極症狀" input-border>
              <div class="w-full">
                <q-option-group v-model="data.積極症狀" :options="options16"></q-option-group>
                <my-input-wrapper label="說明" class="m-2">
                  <q-input v-bind="QInputProps" v-model="data.積極症狀"></q-input>
                </my-input-wrapper>
              </div>
            </my-input-wrapper>
            <my-input-wrapper label="二、退化症狀" input-border>
              <q-option-group v-model="data.退化症狀" :options="options17"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="三、自殺、自傷傾向" input-border>
              <q-option-group v-model="data.自殺自傷傾向" :options="options18"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="四、暴力傾向" input-border>
              <q-option-group v-model="data.暴力傾向" :options="options10"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="五、人際關係" input-border>
              <q-option-group v-model="data.人際關係" :options="options11"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="六、工作、家務或功課" input-border>
              <q-option-group v-model="data.工作家務或功課" :options="options12"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="七、時間分配" input-border>
              <q-option-group v-model="data.時間分配" :options="options13"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="八、家庭生活" input-border>
              <q-option-group v-model="data.家庭生活" :options="options14"></q-option-group>
            </my-input-wrapper>
            <my-input-wrapper label="九、物質濫用病史" input-border>
              <div class="w-full">
                <q-option-group v-model="data.物質濫用病史" :options="options15" inline></q-option-group>
                <my-input-wrapper label="說明" class="m-2">
                  <q-input v-bind="QInputProps" v-model="data.物質濫用病史說明"></q-input>
                </my-input-wrapper>
              </div>
            </my-input-wrapper>
          </my-input-group>
        </section>

        <section class="grid gap-2">
          <p class="text-xl">參、收案或結案理由</p>
          <my-input-group>
            <my-input-wrapper label="收案或結案理由">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
          </my-input-group>

          <my-input-group class="grid grid-cols-4 gap-2 border border-[#1e40af] p-2">
            <my-input-wrapper label="個案編號">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="評估日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="評量者簽章">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-start-1" label="職 稱">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="服務機關">
              <q-input v-bind="QInputProps" v-model="data.與病患關係"></q-input>
            </my-input-wrapper>
          </my-input-group>
        </section>
      </div>

      <template #actions>
        <q-btn unelevated dense color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated dense color="indigo-14" label="暫存"></q-btn>
        <q-btn
          unelevated
          dense
          color="warning"
          :label="page === '1' ? '下一步' : '上一步'"
          @click="changePage()"
        ></q-btn>
        <q-btn v-if="page === '2'" unelevated dense color="add" label="提交並列印"></q-btn>
        <q-btn v-if="page === '2'" unelevated dense color="edit" label="提交申請書與評量表"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'

// components
import IcdTable from 'components/opd/IcdTable.vue'

// utils
import { QInputProps, QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const page = ref('1')

const changePage = () => {
  if (page.value === '1') page.value = '2'
  else page.value = '1'
}

const data = reactive({
  是否曾住院: false,
  目前是否有下列需要治療的身體疾病: [],
  過去是否有下列症狀或行為: [],
})

const patientSourceItems = [
  { label: '本院、所門診初診', value: '本院、所門診初診' },
  { label: '本院、所門診複診', value: '本院、所門診複診' },
  { label: '本院急性病房', value: '本院急性病房' },
  { label: '本院慢性病房', value: '本院慢性病房' },
  { label: '本院日間留院', value: '本院日間留院' },
  { label: '本院其他科室', value: '本院其他科室' },
  { label: '其他醫事機構', value: '其他醫事機構' },
  { label: '社會福利機構', value: '社會福利機構' },
  { label: '公共衛生機構', value: '公共衛生機構' },
  { label: '心理輔導機構', value: '心理輔導機構' },
  { label: '收容機構', value: '收容機構' },
  { label: '病人自行提出', value: '病人自行提出' },
  { label: '家屬提出申請', value: '家屬提出申請' },
  { label: '其他', value: '其他' },
]

const referralTypeItems = [
  { label: '日間型機構', value: '日間型機構' },
  { label: '住宿型機構(全日)', value: '住宿型機構(全日)' },
  { label: '住宿型機構(夜間)', value: '住宿型機構(夜間)' },
  { label: '居家治療', value: '居家治療' },
]

const marriageItems = [
  { label: '未婚', value: '未婚' },
  { label: '已婚', value: '已婚' },
  { label: '離婚', value: '離婚' },
  { label: '分居', value: '分居' },
  { label: '鰥寡', value: '鰥寡' },
  { label: '再婚', value: '再婚' },
  { label: '同居', value: '同居' },
  { label: '不詳', value: '不詳' },
]

const educationalItems = [
  { label: '不識字', value: '不識字' },
  { label: '小學', value: '小學' },
  { label: '國(初)中', value: '國(初)中' },
  { label: '高中(職)肄', value: '高中(職)肄' },
  { label: '高中(職)', value: '高中(職)' },
  { label: '五專、二專肄', value: '五專、二專肄' },
  { label: '五專、二專', value: '五專、二專' },
  { label: '三專、大學肄', value: '三專、大學肄' },
  { label: '三專、大學', value: '三專、大學' },
  { label: '研究所以上', value: '研究所以上' },
  { label: '不詳', value: '不詳' },
]

const employmentItems = [
  { label: '就業中', value: '就業中' },
  { label: '主婦', value: '主婦' },
  { label: '學生', value: '學生' },
  { label: '從未就業', value: '從未就業' },
  { label: '失業', value: '失業' },
  { label: '服役', value: '服役' },
  { label: '退休', value: '退休' },
  { label: '不詳', value: '不詳' },
  { label: '其他', value: '其他' },
]

const diseaseItems = [
  { label: '心臟血管疾病', value: '心臟血管疾病' },
  { label: '腦血管疾病', value: '腦血管疾病' },
  { label: '癲癇', value: '癲癇' },
  { label: '肺結核', value: '肺結核' },
  { label: '性病', value: '性病' },
  { label: '皮膚病', value: '皮膚病' },
  { label: '糖尿病', value: '糖尿病' },
  { label: '肝炎', value: '肝炎' },
  { label: '其他', value: '其他' },
]

const options1 = [
  { label: '幻聽', value: '幻聽' },
  { label: '妄想', value: '妄想' },
  { label: '憂鬱', value: '憂鬱' },
  { label: '自殺、自傷行為', value: '自殺、自傷行為' },
  { label: '攻擊他人', value: '攻擊他人' },
  { label: '嚴重破壞行為', value: '嚴重破壞行為' },
  { label: '危害公眾之行為', value: '危害公眾之行為' },
  { label: '性方面問題如強暴、雜交', value: '性方面問題如強暴、雜交' },
  { label: '其他', value: '其他' },
]

const options2 = [
  { label: '規則', value: '規則' },
  { label: '不規則', value: '不規則' },
  { label: '其他', value: '其他' },
]

const options3 = [
  { label: '完全拒服，經勸服無效', value: '完全拒服，經勸服無效' },
  { label: '拒服，但經勸服可改善', value: '拒服，但經勸服可改善' },
  { label: '不規則或未持續服藥，但經提醒後可改善', value: '不規則或未持續服藥，但經提醒後可改善' },
  { label: '能自動且規則的持續服藥', value: '能自動且規則的持續服藥' },
]

const options4 = [
  { label: '無', value: '無' },
  { label: '有，但不影響日常生活及活動', value: '拒服，但經勸服可改善' },
  { label: '有，且影響日常生活及活動', value: '有，且影響日常生活及活動' },
]

const options5 = [
  { label: '抽菸', value: '抽菸' },
  { label: '喝酒', value: '喝酒' },
  { label: '藥物濫用', value: '藥物濫用' },
]

const options6 = [
  { label: '同意備查', value: '抽菸' },
  { label: '不符條件，不同意', value: '不符條件，不同意' },
  { label: '資料填寫不全，請補正', value: '資料填寫不全，請補正' },
  { label: '其它', value: '其它' },
]

const caseTypeItems = [
  { label: '申請收案', value: '申請收案' },
  { label: '申請複核', value: '申請複核' },
  { label: '申請延長照護', value: '申請延長照護' },
]

const genderItems = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
]

const options16 = [
  { label: '重度症狀：對生活干擾極嚴重，一般人觀察即發現有異狀。', value: '3' },
  { label: '中度症狀：對生活有明顯干擾，家人或專業人員觀察即發現症狀。', value: '2' },
  { label: '輕微症狀：對生活無太大干擾，經詢問才可發現症狀。', value: '1' },
  { label: '無明顯精神症狀。', value: '0' },
]

const options17 = [
  {
    label:
      '重度退化：極少有人際關係之興趣與活動動機，縱使鼓勵之，亦不參與活動生活極度懶散，不活潑，個人衛生極差，情感一直很平板，因思考極度沒有內容而甚少說話。',
    value: '3',
  },
  {
    label:
      '中度退化：人際關係之興趣與活動動機很低，要積極鼓勵才可以參與活動，而且不能持久，個人衛生差，情感很遲滯，講話時，思考內容甚少。',
    value: '2',
  },
  {
    label:
      '輕度退化：人際關係與活動興趣嫌少，均在被動情況下才參與活動；參與活動之持久性不高，個人衛生差，情感較貧乏，思考內容不多。',
    value: '1',
  },
  { label: '無退化症狀：人際關係與活動興趣，可主動參與或經鼓勵即可主動參與。', value: '0' },
]

const options18 = [
  { label: '極度傾向：一再重覆或手段致命性高。', value: '4' },
  { label: '重度傾向：有具體行為。', value: '3' },
  { label: '中度傾向：重覆表現確定意念。', value: '2' },
  { label: '輕度傾向：意念搖擺不定。', value: '1' },
  { label: '無明顯傾向。', value: '0' },
]

const options10 = [
  { label: '極度傾向：強烈妄想或幻覺，曾傷人致送醫。', value: '4' },
  { label: '重度傾向：曾攻擊別人，但無嚴重後果。', value: '3' },
  { label: '中度傾向：粗暴行為或破壞物品。', value: '2' },
  { label: '輕度傾向：口頭威脅，言詞激動。', value: '1' },
  { label: '無明顯傾向。', value: '0' },
]

const options11 = [
  { label: '與人有衝突，不易相處或房門深鎖，刻意孤僻生活。', value: '6' },
  { label: '與人相處退縮，有意避開別人或易發脾氣，但不致明顯衝突。', value: '5' },
  { label: '與人相處，顯的被動或情緒不穩，但無大礙。', value: '4' },
  { label: '一般常人般之人際關係，應付無困難，與人相處沒有困難，少有朋友，無社交生活。', value: '3' },
  { label: '一般常人般之人際關係，應付人際關係得體，有朋友，偶有社交生活。', value: '2' },
  { label: '較一般人更能處理人際關係，有朋友來往，常有社交活動，可以享受人際樂趣。', value: '1' },
  { label: '人際關係良好，容易交朋友，常有社交活動，心胸開闊，能主動，助人為樂。', value: '0' },
]

const options12 = [
  { label: '沒有工作又無動機找工作，沒有動機做家務或上學。', value: '6' },
  { label: '只偶爾工作，找工作不熱心；只偶爾做家事，做家事不熱心；只偶爾上學，上學不熱心。', value: '5' },
  {
    label: '工作不穩定，時常換工作，時常不規則上班；只被動的做家事，做得不理想；只被動上學，時常不上學，應付上學而已。',
    value: '4',
  },
  { label: '有工作，工作表現尚可，感受相當壓力；主動做家務或上學，但表現馬馬虎虎。', value: '3' },
  { label: '工作表現良好，工作壓力能順利應付，家務或功課表現良好。', value: '2' },
  { label: '工作、家務、功課表現優良，沒有感受壓力，能順利處理工作、家務、功課上之困難，同時獲得樂趣。', value: '1' },
  {
    label:
      '工作、家務、功課表現極優，能得上司、家人、老師的器重，並能幫助同事、家人、同學處理特殊難題，工作、家務、功課，很有樂趣。',
    value: '0',
  },
]

const options13 = [
  { label: '成天無所事是，沒有特殊活動。', value: '6' },
  { label: '只能被動的參與活動，空閒時間多，但工作與休閒均少。', value: '5' },
  { label: '只偶爾有主動的活動，大部分為被動參與，多空閒與生活時間安排凌亂。', value: '4' },
  { label: '鮮有社交活動，工作緊湊，沒有休閒。', value: '3' },
  { label: '工作緊湊、有休閒活動，但缺社交。', value: '2' },
  { label: '工作與休閒有良好調配，偶有社交活動。', value: '1' },
  { label: '生活悠閒，工作與社交時間有理想的調配。', value: '0' },
]

const options14 = [
  { label: '與家人常常有衝突，對家庭生活不負責任，在家裡生活感到痛苦。', value: '6' },
  { label: '不理會家裡生活，對家庭生活時有抱怨，與家人偶有衝突。', value: '5' },
  { label: '不照顧家裡生活，或不理會家人，只獨處房間，但無明顯衝突。', value: '4' },
  { label: '能照顧家裡生活，與家人少溝通，可正常生活，缺少感情來往。', value: '3' },
  { label: '對家庭負責盡職，與家人和好相處。', value: '2' },
  { label: '主動關心家人生活，對家庭負責盡職，生活融洽，有說有笑，有家庭生活之樂趣。', value: '1' },
  { label: '對家庭負責盡職，生活融洽，主動關心家人，能主動安排家庭生活的種種活動，頗能享受家庭生活樂趣。', value: '0' },
]

const options15 = [
  { label: '煙', value: '3' },
  { label: '酒', value: '2' },
  { label: '違禁藥', value: '1' },
  { label: '治療藥', value: '0' },
]
</script>
