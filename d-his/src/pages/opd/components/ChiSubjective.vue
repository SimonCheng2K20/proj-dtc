<template>
  <div class="grid gap-1">
    <q-card class="border border-[rgba(33,92,186,0.4)]" flat square>
      <q-card-section class="my-card-title"> 四診 </q-card-section>
      <q-card-section class="grid grid-cols-2">
        <div>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">望神</div>
            <div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].失神.length }">失神</div>
                <q-option-group
                  v-model="editItem[4]['失神']"
                  :options="options.失神"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].得神.length }">得神</div>
                <q-option-group
                  v-model="editItem[4]['得神']"
                  :options="options.得神"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].假神.length }">假神</div>
                <q-option-group
                  v-model="editItem[4]['假神']"
                  :options="options.假神"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">望色</div>
            <div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].白色.length }">白色</div>
                <q-option-group
                  v-model="editItem[4]['白色']"
                  :options="options.白色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].靑色.length }">靑色</div>
                <q-option-group
                  v-model="editItem[4]['靑色']"
                  :options="options.靑色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].紅色.length }">紅色</div>
                <q-option-group
                  v-model="editItem[4]['紅色']"
                  :options="options.紅色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].黃色.length }">黃色</div>
                <q-option-group
                  v-model="editItem[4]['黃色']"
                  :options="options.黃色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].黑色.length }">黑色</div>
                <q-option-group
                  v-model="editItem[4]['黑色']"
                  :options="options.黑色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">望體態</div>
            <div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].形體.length }">形體</div>
                <q-option-group
                  v-model="editItem[4]['形體']"
                  :options="options.形體"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].姿態.length }">姿態</div>
                <q-option-group
                  v-model="editItem[4]['姿態']"
                  :options="options.姿態"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">望局部</div>
            <div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].舌象.length }">舌象</div>
                <q-option-group
                  v-model="editItem[4]['舌象']"
                  :options="options.舌象"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].舌色.length }">舌色</div>
                <q-option-group
                  v-model="editItem[4]['舌色']"
                  :options="options.舌色"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">聞診</div>
            <div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].聽語言.length }">聽語言</div>
                <q-option-group
                  v-model="editItem[4].聽語言"
                  :options="options.聽語言"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].聽呼吸.length }">聽呼吸</div>
                <q-option-group
                  v-model="editItem[4].聽呼吸"
                  :options="options.聽呼吸"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].聽咳嗽.length }">聽咳嗽</div>
                <q-option-group
                  v-model="editItem[4].聽咳嗽"
                  :options="options.聽咳嗽"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].病體氣味.length }">病體氣味</div>
                <q-option-group
                  v-model="editItem[4].病體氣味"
                  :options="options.病體氣味"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div class="px-1 border rounded" :class="{ 'bg-yellow': editItem[4].病室氣味 }">病室氣味</div>
                <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4].病室氣味"></q-input>
              </div>
            </div>
          </div>
        </div>
        <div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">問診</div>
            <div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{ 'bg-yellow': editItem[4].問寒熱.length || editItem[4]['問寒熱.持續時間'] }"
                >
                  問寒熱
                </div>
                <q-option-group
                  v-model="editItem[4].問寒熱"
                  :options="options.問寒熱"
                  type="checkbox"
                  inline
                ></q-option-group>
                <div class="flex items-center ml-2">
                  <div>持續時間</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問寒熱.持續時間']"></q-input>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow':
                      editItem[4].問汗.length ||
                      editItem[4]['問汗.部位'] ||
                      editItem[4]['問汗.時間'] ||
                      editItem[4]['問汗.出汗量'],
                  }"
                >
                  問汗
                </div>
                <div class="flex items-center ml-2">
                  <div>部位</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問汗.部位']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>時間</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問汗.時間']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>出汗量</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問汗.出汗量']"></q-input>
                </div>
                <q-option-group
                  v-model="editItem[4].問汗"
                  :options="options.問汗"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow':
                      editItem[4].問頭身.length || editItem[4]['問頭身.部位'] || editItem[4]['問頭身.疼痛性質'],
                  }"
                >
                  問頭身
                </div>
                <q-option-group
                  v-model="editItem[4].問頭身"
                  :options="options.問頭身"
                  type="checkbox"
                  inline
                ></q-option-group>
                <div class="flex items-center ml-2">
                  <div>部位</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問頭身.部位']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>疼痛性質</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問頭身.疼痛性質']"></q-input>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow':
                      editItem[4]['問便.次數/日'] ||
                      editItem[4]['問便.量'] ||
                      editItem[4]['問便.顏色'] ||
                      editItem[4]['問便.氣味'] ||
                      editItem[4]['問便.伴隨症狀'],
                  }"
                >
                  問便
                </div>
                <div class="flex items-center ml-2">
                  <div>次數/日</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問便.次數/日']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>量</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問便.量']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>顏色</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問便.顏色']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>氣味</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問便.氣味']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>伴隨症狀</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問便.伴隨症狀']"></q-input>
                </div>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow': editItem[4].問飲食.length || editItem[4]['問飲食.飲水'] || editItem[4]['問飲食.食量'],
                  }"
                >
                  問飲食
                </div>
                <div class="flex items-center ml-2">
                  <div>飲水</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問飲食.飲水']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>食量</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['問飲食.食量']"></q-input>
                </div>
                <q-option-group
                  v-model="editItem[4].問飲食"
                  :options="options.問飲食"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow': editItem[4].問胸.length,
                  }"
                >
                  問胸
                </div>
                <q-option-group
                  v-model="editItem[4].問胸"
                  :options="options.問胸"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow': editItem[4].問睡眠.length,
                  }"
                >
                  問睡眠
                </div>
                <q-option-group
                  v-model="editItem[4].問睡眠"
                  :options="options.問睡眠"
                  type="checkbox"
                  inline
                ></q-option-group>
              </div>
              <div class="flex items-center">
                <div
                  class="px-1 border rounded"
                  :class="{
                    'bg-yellow': editItem[4]['婦科.經期週期'] || editItem[4]['婦科.量'] || editItem[4]['婦科.生理特徵'],
                  }"
                >
                  婦科
                </div>
                <div class="flex items-center ml-2">
                  <div>經期週期</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['婦科.經期週期']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>量</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['婦科.量']"></q-input>
                </div>
                <div class="flex items-center ml-2">
                  <div>生理特徵</div>
                  <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['婦科.生理特徵']"></q-input>
                </div>
              </div>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">切診</div>
            <q-input class="m-2" v-bind="QInputProps" v-model="editItem[4]['切診']"></q-input>
          </div>
          <div class="flex no-wrap items-start">
            <div class="p-2 shrink-0 w-[64px] text-end">脈象</div>
            <q-option-group v-model="editItem[4].脈象" :options="options.脈象" type="checkbox" inline></q-option-group>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="border border-[rgba(33,92,186,0.4)]" flat square>
      <q-card-section class="my-card-title"> 八綱辨證 </q-card-section>
      <q-card-section class="grid grid-cols-2">
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">陽證</div>
          <q-option-group v-model="editItem[8].陽證" :options="options.陽證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">陰證</div>
          <q-option-group v-model="editItem[8].陰證" :options="options.陰證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">寒證</div>
          <q-option-group v-model="editItem[8].寒證" :options="options.寒證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">熱證</div>
          <q-option-group v-model="editItem[8].熱證" :options="options.熱證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">表證</div>
          <q-option-group v-model="editItem[8].表證" :options="options.表證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">裏證</div>
          <q-option-group v-model="editItem[8].裏證" :options="options.裏證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">虛證</div>
          <q-option-group v-model="editItem[8].虛證" :options="options.虛證" type="checkbox" inline></q-option-group>
        </div>
        <div class="flex no-wrap items-start">
          <div class="p-2 shrink-0 w-[64px] text-end">實證</div>
          <q-option-group v-model="editItem[8].實證" :options="options.實證" type="checkbox" inline></q-option-group>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { isArray, isString } from 'lodash-es'

const props = defineProps({
  fourItems: Array,
  eightItems: Array,
})

const editItem = reactive({
  4: {
    失神: [],
    得神: [],
    假神: [],
    白色: [],
    靑色: [],
    紅色: [],
    黃色: [],
    黑色: [],
    形體: [],
    姿態: [],
    舌象: [],
    舌色: [],
    聽語言: [],
    聽呼吸: [],
    聽咳嗽: [],
    病體氣味: [],
    病室氣味: null,
    問寒熱: [],
    '問寒熱.持續時間': null,
    問汗: [],
    '問汗.部位': null,
    '問汗.時間': null,
    '問汗.出汗量': null,
    問頭身: [],
    '問頭身.部位': null,
    '問頭身.疼痛性質': null,
    '問便.次數/日': null,
    '問便.量': null,
    '問便.顏色': null,
    '問便.氣味': null,
    '問便.伴隨症狀': null,
    問飲食: [],
    '問飲食.飲水': null,
    '問飲食.食量': null,
    問胸: [],
    問睡眠: [],
    '婦科.經期週期': null,
    '婦科.量': null,
    '婦科.生理特徵': null,
    切診: null,
    脈象: [],
  },

  8: {
    陽證: [],
    陰證: [],
    寒證: [],
    熱證: [],
    表證: [],
    裏證: [],
    虛證: [],
    實證: [],
  },
})

const options = computed(() => {
  const arr = [
    { key: '失神', options: ['沒有神氣', '眼神迷濛', '正氣低迷', '病痛纏身', '精神不濟', '昏迷'] },
    { key: '得神', options: ['面色紅潤有光澤', '眼睛有神且靈活'] },
    {
      key: '假神',
      options: ['迴光返照', '殘燈復燃', '暫時好轉'],
    },
    {
      key: '白色',
      options: ['氣血不足', '陽虛(面色紅潤有光澤)', '失血(淡白無光澤)', '眼臉淡白(血液循環有障礙)'],
    },
    {
      key: '靑色',
      options: ['淤血', '主寒', '痛', '風證'],
    },
    {
      key: '紅色',
      options: ['熱', '氣血過剩', '實熱證(面紅耳赤)', '陰虛證(兩顴泛紅)'],
    },
    {
      key: '黃色',
      options: ['脾虛不能運化(觀察鞏膜、手掌、足部)'],
    },
    {
      key: '黑色',
      options: ['淤血', '久病(有痼疾或重病)'],
    },
    {
      key: '形體',
      options: ['體質強', '體質弱', '氣血旺盛', '氣血衰弱'],
    },
    {
      key: '姿態',
      options: ['半身不遂', '口眼歪斜', '口唇或面頰抽動', '關節腫痛', '手足拘攣', '屈伸不利'],
    },
    {
      key: '舌象',
      options: ['薄白', '苔淡', '粉紅色且可靈活移動', '舌面乾燥'],
    },
    {
      key: '舌色',
      options: ['薄白', '厚白', '薄白微黃', '黃膩', '黃燥', '黑灰垢膩'],
    },
    {
      key: '聽語言',
      options: ['譫語', '鄭語', '獨語'],
    },
    {
      key: '聽呼吸',
      options: ['喘', '哮', '少氣', '短氣'],
    },
    {
      key: '聽咳嗽',
      options: ['咳', '嗽', '咳嗽'],
    },
    {
      key: '病體氣味',
      options: ['口臭', '鼻臭', '酸臭', '腐臭', '身臭'],
    },
    {
      key: '問寒熱',
      options: ['寒', '熱', '輕', '重'],
    },
    {
      key: '問汗',
      options: ['兼症盜汗'],
    },
    {
      key: '問頭身',
      options: ['疼痛', '癢', '痠腫麻木'],
    },
    {
      key: '問飲食',
      options: ['味覺異常', '口苦', '口酸', '口臭'],
    },
    {
      key: '問胸',
      options: ['耳鳴', '聽不見', '蟬鳴', '響鳴', '口渴', '喜熱飲', '喜冷飲'],
    },
    {
      key: '問睡眠',
      options: ['失眠', '眠淺', '多夢', '嗜睡'],
    },
    {
      key: '脈象',
      options: ['有胃', '有神', '有根'],
    },
    { key: '陽證', options: ['反應亢奮', '心情煩躁', '面紅身熱', '氣狀聲高', '口渴喜冷飲', '呼吸氣粗', '便秘'] },
    { key: '陰證', options: ['病深重', '有氣無力', '少言沉靜', '虛寒', '呼吸微弱', '口不渴', '便溏', '脈遲'] },
    { key: '寒證', options: ['活動衰減', '惡寒喜暖', '四肢冰冷', '分泌物清晰', '面色蒼白'] },
    { key: '熱證', options: ['陽盛陰衰', '惡熱喜冷', '面紅目赤', '煩躁不寧', '吐血', '衂血'] },
    { key: '表證', options: ['病位淺', '發熱惡寒', '舌苔薄白', '脈浮', '四肢酸痛', '流涕咳嗽', '發病急而短'] },
    {
      key: '裏證',
      options: ['臟腑機能失調相關', '骨髓病變', '煩躁神昏', '口渴腹痛', '疲倦嘔吐', '小便短赤', '脈沉', '病情重且長'],
    },
    { key: '虛證', options: ['精神萎靡', '身倦無力', '煩熱盜汗', '呼吸短促', '小便頻頻', '失禁'] },
    { key: '實證', options: ['腹脹痛', '胸悶煩躁', '神昏譫語', '呼吸喘促', '小便困難', '便秘'] },
  ]

  return arr.reduce((obj, item) => {
    return {
      ...obj,
      [item.key]: item.options.map((label) => ({
        label: label,
        value: label,
      })),
    }
  }, {})
})

defineExpose({
  getData: () => {
    const setData = ([key, value], type) => {
      if (isArray(value) && value.length > 0) {
        data[type].push({ Key: key, Value: value.join(',') })
        return
      }

      if (isString(value) && value.length > 0) {
        data[type].push({ Key: key, Value: value })
        return
      }
    }

    const data = {
      4: [],
      8: [],
    }

    Object.entries(editItem[4]).forEach((item) => setData(item, 4))
    Object.entries(editItem[8]).forEach((item) => setData(item, 8))

    return data
  },
})

const init = () => {
  const setEditItem = (item, type) => {
    if (isArray(editItem[type][item.Key])) {
      const value = item.Value.split(',')
      editItem[type][item.Key] = isArray(value) ? value : [value]
    } else {
      editItem[type][item.Key] = item.Value
    }
  }

  if (props.fourItems.length > 0) {
    props.fourItems.forEach((item) => setEditItem(item, 4))
  }
  watch(
    () => props.fourItems.length,
    () => {
      props.fourItems.forEach((item) => setEditItem(item, 4))
    }
  )

  if (props.eightItems.length > 0) {
    props.eightItems.forEach((item) => setEditItem(item, 8))
  }
  watch(
    () => props.eightItems.length,
    () => {
      props.eightItems.forEach((item) => setEditItem(item, 8))
    }
  )
}
init()
</script>

