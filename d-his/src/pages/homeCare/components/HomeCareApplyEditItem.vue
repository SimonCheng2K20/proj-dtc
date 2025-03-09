<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content header="建立居家照護申請書" class="font-bold" width="1280px" @close="onDialogCancel()">
      <my-input-group class="grid gap-2 grid-cols-4">
        <my-input-wrapper label="申請類別"><q-select v-bind="QSelectProps"></q-select></my-input-wrapper>
      </my-input-group>
      <div class="grid gap-2 mt-2">
        <section>
          <p class="text-lg">居家照護申請書</p>
          <my-input-group class="grid gap-2 grid-cols-4">
            <my-input-wrapper label="保險人受理日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="醫事機構收案日期">
              <my-date-input v-bind="QInputProps"></my-date-input
            ></my-input-wrapper>
            <my-input-wrapper label="前次核定迄日">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-start-1" label="保險對象姓名">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="性別">
              <q-input v-bind="QInputProps"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="出生日期">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-start-1" label="身分證號">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="電話">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="個案所在地">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-2" label="居住地址">
              <q-input v-bind="QInputProps"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="機構代碼">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="機構名稱">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
          </my-input-group>
        </section>

        <section>
          <icd-table class="min-h-[180px]" ref="icdTableRef">
            <template #btn-expand>
              <q-btn color="primary" label="科室公用組套" dense unelevated></q-btn>
            </template>
          </icd-table>
        </section>

        <section class="flex border border-[#1e40af] flex-nowrap">
          <p
            class="text-lg bg-[#deecff] px-1 border-r border-[#1e40af] text-center"
            style="writing-mode: vertical-lr; letter-spacing: 1em"
          >
            護理評估
          </p>
          <div class="grow p-2 flex flex-col gap-2">
            <div class="flex">
              <div class="mr-1">1.意識狀態 :</div>
              <div>
                <q-option-group inline dense v-model="data.意識狀態" :options="options1"></q-option-group>
                <div class="flex">
                  <div class="mr-1">昏迷指數(GCS) :</div>
                  <q-option-group inline dense v-model="data.昏迷指數" :options="options2"></q-option-group>
                  <div class="ml-1">分</div>
                </div>
              </div>
            </div>

            <div class="flex">
              <div class="mr-1">2.情緒狀態 :</div>
              <div>
                <q-option-group inline dense v-model="data.情緒狀態" :options="options3"></q-option-group>
              </div>
            </div>

            <div class="flex">
              <div class="mr-1">3.溝通方式 :</div>
              <div>
                <div class="flex">
                  <div class="mr-1">a.能理解 :</div>
                  <q-option-group inline dense v-model="data.能理解" :options="options4"></q-option-group>
                </div>
                <div class="flex">
                  <div class="mr-1">b.能表達 :</div>
                  <q-option-group inline dense v-model="data.能表達" :options="options5"></q-option-group>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">4.呼吸 :</div>
              <div class="flex items-center">
                <q-option-group inline dense v-model="data.能理解" :options="options6"></q-option-group>
                <q-input class="ml-2" v-bind="QInputProps"></q-input>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">5.進食 :</div>
              <div class="flex items-center">
                <q-option-group inline dense v-model="data.能理解" :options="options7"></q-option-group>
                <q-input class="ml-2" v-bind="QInputProps"></q-input>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">6.排泄 :</div>
              <div class="flex items-center">
                <q-option-group inline dense v-model="data.能理解" :options="options8"></q-option-group>
                <q-input class="ml-2" v-bind="QInputProps"></q-input>
              </div>
            </div>

            <div class="pl-2">(重複二者以上請勾6並註明)</div>

            <div class="flex flex-nowrap">
              <div class="mr-1 whitespace-nowrap leading-10">7.皮膚 :</div>
              <div class="flex items-center">
                <q-option-group inline dense v-model="data.能理解" :options="options9"></q-option-group>
                (數目、最嚴重部位、大小、等級 :
                <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>、
                <q-input class="mx-1" v-bind="QInputProps"></q-input>、
                <q-input class="mx-1" v-bind="QInputProps"></q-input>X
                <q-input class="mx-1" v-bind="QInputProps"></q-input>X
                <q-input class="mx-1" v-bind="QInputProps"></q-input>、
                <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>級)
              </div>
            </div>

            <div class="flex flex-nowrap">
              <div class="mr-1 whitespace-nowrap leading-10">8.活動能力評估 :</div>
              <div class="flex">
                <div class="flex items-center mr-1 pb-1">
                  巴氏量表總分<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分 :
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (1)進食 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (2)移位 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (3)個人衛生 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (4)如廁 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (5)洗澡 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (6)走路 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (7)上下樓梯 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (8)穿脫衣襪 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (9)大便控制 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  (10)小便控制 :<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分
                </div>
                <div class="flex items-center mr-1 pb-1">
                  肌力 :上肢 (左:<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分 右:<q-input
                    class="mx-1 w-14"
                    v-bind="QInputProps"
                  ></q-input
                  >分)、 下肢(左: <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>分 右:<q-input
                    class="mx-1 w-14"
                    v-bind="QInputProps"
                  ></q-input
                  >分)
                </div>
              </div>
            </div>

            <div class="flex flex-nowrap items-center">
              <div class="mr-1">9.其它 :</div>
              <q-input class="grow" v-bind="QInputProps"></q-input>
            </div>
          </div>
        </section>

        <section class="flex border border-[#1e40af] flex-nowrap">
          <p
            class="text-lg bg-[#deecff] px-1 border-r border-[#1e40af] text-center"
            style="writing-mode: vertical-lr; letter-spacing: 1em"
          >
            護理計畫或申請延長照護理由
          </p>
          <div class="grow p-2 gap-2 flex flex-col">
            <div>申請(延長)照護理由 : (健康問題/技術性護理服務計畫)</div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">1.定期更換導尿管，預防泌尿道感染</p>
              <q-option-group class="mr-3" inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
              (頻率:<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>天一次)
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">2.指導家屬尿管護理及水分之攝取</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">3.定期更換胃管，評估營養狀態</p>
              <q-option-group class="mr-3" inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
              (頻率:<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>天一次)
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">4.指導家屬調理進食食物，注重個案營養的維持</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">5.定期更換氣切管，評估呼吸道感染狀態</p>
              <q-option-group class="mr-3" inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
              (頻率:<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>天一次)
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">6.指導家屬抽痰技巧及翻身扣背之方法</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">7.協助傷口換藥，維持皮膚完整性</p>
              <q-option-group class="mr-3" inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
              (頻率:<q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>天一次)
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">8.協助家屬制定活動計畫，預防因不動所致之健康問題</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">9.注意、指導肢體活動及翻身，預防壓瘡發生</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">10.給予身體評估，早期發現健康問題之變化</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">11.指導家屬照顧個案所需之知識、技能及必要之家庭安全設備</p>
              <q-option-group inline dense v-model="data.意識狀態" :options="options10"></q-option-group>
            </div>

            <div class="flex flex-nowrap items-center">
              <q-checkbox dense></q-checkbox>
              <p class="mr-1">12.其它 :</p>
              <q-input class="grow" v-bind="QInputProps"></q-input>
            </div>

            <div class="flex flex-nowrap items-center">(申請延長照護者，勾選理由為1、3、5者，請附四個月評值結果表)</div>
          </div>
        </section>

        <section class="grid grid-cols-6 border border-[#1e40af]">
          <div class="flex flex-nowrap col-span-3">
            <p
              class="text-lg bg-[#deecff] px-1 border-r border-[#1e40af] text-center"
              style="writing-mode: vertical-lr"
            >
              保險醫事服務機構
            </p>
            <my-input-group class="grid gap-2 grid-cols-2 p-2 grow">
              <my-input-wrapper class="col-span-2" label="名稱">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="代號">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="電話">
                <q-input v-bind="QInputProps"> </q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-2" label="居住地址">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="申請日期">
                <my-date-input v-bind="QInputProps"> </my-date-input>
              </my-input-wrapper>
            </my-input-group>
          </div>

          <div class="flex flex-nowrap col-span-2">
            <p
              class="text-lg bg-[#deecff] px-1 border-l border-r border-[#1e40af] text-center"
              style="writing-mode: vertical-lr"
            >
              保險醫事服務機構
            </p>
            <div class="grow p-2">
              <q-option-group dense v-model="data.意識狀態" :options="options11"></q-option-group>
              <my-input-group class="grid gap-2 mt-2">
                <my-input-wrapper label="審查醫師">
                  <q-input v-bind="QInputProps"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="日期">
                  <my-date-input v-bind="QInputProps"> </my-date-input>
                </my-input-wrapper>
              </my-input-group>
            </div>
          </div>

          <div class="border-l border-[#1e40af] col-span-1">
            <p class="text-lg bg-[#deecff] border-b border-[#1e40af] text-center">決行簽章</p>
            <div></div>
          </div>
        </section>

        <q-separator spaced="8px" />

        <section>
          <p class="text-lg">居家照護4個月評估表</p>
          <my-input-group class="grid gap-2 grid-cols-4">
            <my-input-wrapper label="申請日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="評值日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-start-1" label="保險對象姓名">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="保險對象身份證號">
              <q-input v-bind="QInputProps"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="出生日期">
              <my-date-input v-bind="QInputProps"></my-date-input>
            </my-input-wrapper>
          </my-input-group>
        </section>

        <section class="border border-[#1e40af]">
          <div class="border-b border-[#1e40af] p-2 grid gap-2">
            <p>勾選第1項－定期更換導尿管，預防泌尿道感染</p>
            <p>評值結果:</p>
            <div class="flex items-center">
              <div class="mr-1">1.小便性狀 :</div>
              <div class="flex items-center grow">
                <q-option-group inline dense v-model="data.能理解" :options="options12"></q-option-group>
                <q-input class="ml-2 grow" v-bind="QInputProps"></q-input>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">2.UTI徵狀 :</div>
              <div class="flex items-center grow">
                <q-option-group inline dense v-model="data.能理解" :options="options13"></q-option-group>
                <q-input class="ml-2 grow" v-bind="QInputProps"></q-input>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">3.每日水分攝取量 :</div>
              <div class="flex items-center grow">
                <q-option-group inline dense v-model="data.能理解" :options="options14"></q-option-group>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">4.其它 :</div>
              <q-input class="grow" v-bind="QInputProps"></q-input>
            </div>
          </div>

          <div class="border-b border-[#1e40af] p-2 grid gap-2">
            <p>勾選第3項－定期更換胃管，評估營養狀態</p>
            <p>評值結果:</p>
            <div class="flex">
              <div class="mr-1 leading-10">1.每日進食 :</div>
              <div class="grid gap-1">
                <div class="flex">
                  <q-checkbox> </q-checkbox>
                  <div class="flex items-center">
                    1.每日進食紀錄正餐次數及點心次數
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>
                    次
                  </div>
                </div>

                <div class="flex items-center">
                  <q-checkbox></q-checkbox>
                  <div class="flex items-center">
                    2.每日攝取熱量約
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>
                    卡
                  </div>
                </div>

                <div class="flex items-center">
                  <q-checkbox></q-checkbox>
                  <div class="flex items-center">
                    3.管灌
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>
                    次(請填總
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>
                    cc數)
                  </div>
                </div>

                <div class="flex items-center">
                  <q-checkbox></q-checkbox>
                  <div class="flex items-center">
                    3.腸道外營養
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>
                    次 (請填寫營養品名<q-input class="grow mx-1" v-bind="QInputProps"></q-input>總
                    <q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>cc數/天)
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">2.最近一次血液檢查 :</div>
              <div class="flex items-center grow">
                <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>年
                <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>月
                <q-input class="mx-1 w-14" v-bind="QInputProps"></q-input>日
                <q-checkbox label="四個月內無抽血檢查"></q-checkbox>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-1">3.其它 :</div>
              <q-input class="grow" v-bind="QInputProps"></q-input>
            </div>
          </div>

          <div class="border-b border-[#1e40af] p-2 grid gap-2">
            <p>勾選第5項－定期更氣切管，評估呼吸道感染狀態</p>
            <p>評值結果:</p>
            <div class="flex items-center">
              <div class="mr-1">1.呼吸音 :</div>
              <div class="flex items-center">
                <div class="flex">
                  (1)左肺:
                  <q-option-group
                    class="mx-1"
                    inline
                    dense
                    v-model="data.意識狀態"
                    :options="options15"
                  ></q-option-group>
                </div>

                <div class="flex items-center">
                  (2)右肺:
                  <q-option-group
                    class="mx-1"
                    inline
                    dense
                    v-model="data.意識狀態"
                    :options="options16"
                  ></q-option-group>

                  <div class="flex items-center ml-1">
                    下葉 :<q-input class="w-14 mx-1" v-bind="QInputProps"></q-input>(呼吸音請依 1.正常 2.無聲 3.囉聲
                    4.濕囉聲 5.喘鳴 6.其它 代碼填寫)
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-nowrap">
              <div class="mr-1 whitespace-nowrap">2.排痰型態 :</div>
              <q-option-group inline dense v-model="data.意識狀態" :options="options17"></q-option-group>
            </div>

            <div class="flex">
              <div class="mr-1">3.痰液性狀 :</div>
              <div>
                <q-option-group inline dense v-model="data.意識狀態" :options="options18"></q-option-group>
                <div class="flex">
                  <div class="mr-1">狀 :</div>
                  <q-option-group inline dense v-model="data.意識狀態" :options="options19"></q-option-group>
                </div>
                <div class="flex">
                  <div class="mr-1">色 :</div>
                  <q-option-group inline dense v-model="data.意識狀態" :options="options20"></q-option-group>
                </div>
              </div>
            </div>
          </div>

          <div class="border-b border-[#1e40af] p-2">
            <my-input-wrapper label="補充">
              <q-input class="w-full" v-bind="QInputProps"></q-input>
            </my-input-wrapper>
          </div>

          <div class="p-2 grid gap-2">
            <my-input-group class="grid grid-cols-3 gap-2">
              <my-input-wrapper label="保險醫事服務機構(或醫師身分證)">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="機構章戳(或醫師簽名)">
                <q-input v-bind="QInputProps"></q-input>
              </my-input-wrapper>
            </my-input-group>
          </div>
        </section>
      </div>

      <template #actions>
        <q-btn unelevated dense color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated dense color="indigo-14" label="暫存"></q-btn>
        <q-btn unelevated dense color="add" label="提交申請書並列印"></q-btn>
        <q-btn unelevated dense color="edit" label="提交申請書"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'

// components
import IcdTable from 'components/opd/IcdTable.vue'

// utils
import { QInputProps, QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const data = reactive({})

const options1 = [
  { label: '1.清醒警覺', value: '1' },
  { label: '2.躁動', value: '2' },
  { label: '3.人時地混淆', value: '3' },
  { label: '4.瞻忘', value: '4' },
  { label: '5.木僵', value: '5' },
  { label: '6.植物人狀態', value: '6' },
  { label: '7.昏迷', value: '7' },
  { label: '8.其它', value: '8' },
]
const options2 = [
  { label: 'E', value: '1' },
  { label: 'M', value: '2' },
  { label: 'V', value: '3' },
]
const options3 = [
  { label: '1.平穩', value: '1' },
  { label: '2.憂慮', value: '2' },
  { label: '3.焦慮', value: '3' },
  { label: '4.無法評估', value: '4' },
]
const options4 = [
  { label: '1.是', value: '1' },
  { label: '2.否', value: '2' },
]
const options5 = [
  { label: '1.語言', value: '1' },
  { label: '2.肢體表達', value: '2' },
  { label: '3.溝通輔具', value: '3' },
  { label: '4.否', value: '4' },
]
const options6 = [
  { label: '1.自行呼吸', value: '1' },
  { label: '2.使用氧氣', value: '2' },
  { label: '3.氣切插管', value: '3' },
  { label: '4.使用呼吸器', value: '4' },
  { label: '5.其它', value: '5' },
]
const options7 = [
  { label: '1.自行進食', value: '1' },
  { label: '2.協助進食', value: '2' },
  { label: '3.鼻胃管進食', value: '3' },
  { label: '4.靜脈注射', value: '4' },
  { label: '5.其它', value: '5' },
]
const options8 = [
  { label: '1.自行排泄', value: '1' },
  { label: '2.需協助排泄', value: '2' },
  { label: '3.大小便失禁', value: '3' },
  { label: '4.存留導尿管', value: '4' },
  { label: '5.腸造口', value: '5' },
]
const options9 = [
  { label: '1.完整', value: '1' },
  { label: '2.破損', value: '2' },
]
const options10 = [
  { label: 'Y', value: '1' },
  { label: 'N', value: '2' },
]
const options11 = [
  { label: '1.同意備查', value: '1' },
  { label: '2.不符收案條件，不同意', value: '2' },
  { label: '3.資料填寫不全，請補正', value: '3' },
  { label: '4.其它', value: '4' },
]
const options12 = [
  { label: '1.清澈無沉澱', value: '1' },
  { label: '2.清澈有沉澱', value: '2' },
  { label: '3.混濁無沉澱', value: '3' },
  { label: '4.混濁有沉澱', value: '4' },
  { label: '5.色深無沉澱', value: '5' },
  { label: '6.色深有沉澱', value: '6' },
  { label: '7.其它', value: '7' },
]
const options13 = [
  { label: '1.無', value: '1' },
  { label: '2.小便有灼熱感', value: '2' },
  { label: '3.頻尿', value: '3' },
  { label: '4.發燒', value: '4' },
  { label: '5.血尿', value: '5' },
  { label: '6.尿液混濁', value: '6' },
  { label: '7.其它', value: '7' },
]
const options14 = [
  { label: '2,000cc以上/天', value: '1' },
  { label: '1,500至未滿2,000cc/天', value: '2' },
  { label: '1,000至未滿1,500cc/天', value: '3' },
  { label: '500至未滿1,000cc/天', value: '4' },
  { label: '未滿500cc/天', value: '5' },
]
const options15 = [
  { label: '上葉', value: '1' },
  { label: '下葉', value: '2' },
]
const options16 = [
  { label: '上葉', value: '1' },
  { label: '中葉', value: '2' },
]
const options17 = [
  { label: '1.無痰液', value: '1' },
  { label: '2.自咳易', value: '2' },
  { label: '3.自咳不易但未抽痰', value: '3' },
  { label: '4.自咳不易需抽痰，每日十次以下', value: '4' },
  { label: '5.自咳不易需抽痰，每日十次以上', value: '5' },
  { label: '6.由氣切處每日抽痰十次以下', value: '6' },
  { label: '7.由氣切處每日抽痰十次以上', value: '7' },
]
const options18 = [
  { label: '1.無痰液(下面免填)', value: '1' },
  { label: '2.有痰液', value: '2' },
]
const options19 = [
  { label: '1.水樣', value: '1' },
  { label: '2.濕黏', value: '2' },
  { label: '3.乾燥', value: '3' },
]
const options20 = [
  { label: '1.清澈', value: '1' },
  { label: '2.白', value: '2' },
  { label: '3.黃', value: '3' },
  { label: '4.黃綠', value: '3' },
  { label: '5.褐', value: '3' },
  { label: '6.紅', value: '3' },
]
</script>
