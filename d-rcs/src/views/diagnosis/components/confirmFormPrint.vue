<template>
  <div class="print p-8">
    <div class="p-4 border border-black text-justify">
      <div class="text-center font-bold">{{ data.InstitutionName }}</div>
      <div class="text-center font-bold text-2xl">偏遠地區遠距醫療建置計畫之遠距會診同意書</div>

      <div class="text-center text-sm mb-4">請詳細閱讀內容，待醫師或相關醫事人員向您說明後，再簽署同意書</div>

      <div class="py-1">
        <span>病人</span>
        <span class="border-b border-black mx-2">{{ data.PatientName }}</span>
        <span>病歷號碼</span>
        <span class="border-b border-black mx-2">{{ getTextPatientId(data.PatientId) }}</span>
        <span>性別</span>
        <span class="border-b border-black mx-2">{{ data.PatientGenderCode }}</span>
        <span>，出生於</span>
        <span class="border-b border-black mx-2">
          {{ !!data.PatientBirthday ? dayjs(data.PatientBirthday).format('YYYY 年 MM 月 DD 日') : null }}
        </span>
        <span>，因罹患</span>
        <span class="border-b border-black mx-2">{{ data.Malady }}</span>
        <span>疾病，經本院醫師評估，需輔以運用科技通訊技術，由本院與基地醫院醫師進行遠距照會，以提升轉診及緊急醫療處置之品質。</span>
      </div>

      <div class="py-1">
        本院醫師或相關醫事人員，已向您充分說明本次遠距照會之目的、必要性、可能結果、遠距照會之限制性等，包括且不限於基地醫院（被照會）醫師受限於無法實際進行完整的身體診察、觸診、聽診、氣味辨識、意識評估等，及因此可能無法給予完整之意見。經說明後，充分了解遠距照會無法取代實境照會，且基地醫院（被照會）醫師之意見僅供參考。
      </div>

      <div class="py-1">若對醫療照護處置有任何疑問，請在簽名前，再與您的醫師或相關醫事人員充分討論。</div>

      <div class="py-1 mt-4">
        說明地點（醫院/機構）：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.InstitutionName === false }">{{ data.InstitutionName }}</span>
      </div>

      <div class="py-1">
        說明之醫事人員：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.CreateAccountName === false }"> {{ data.CreateAccountName }} </span>
        ，職稱：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.CreateAccountTitle === false }"> {{ data.CreateAccountTitle }} </span>
      </div>

      <div class="py-1">
        網絡醫院醫師：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsultAccountName === false }"> {{ data.ConsultAccountName }} </span>
        專科別：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.CreateAccountDepartmentName === false }"> {{ data.CreateAccountDepartmentName }} </span>
      </div>

      <div class="py-1">
        日期：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsentTime === false }">
          {{ !!data.ConsentTime ? dayjs(data.ConsentTime).format('YYYY 年 MM 月 DD 日 HH 時 mm 分') : null }}
        </span>
      </div>

      <div class="flex items-center py-1 mt-4">
        <span>立同意書人：</span>
        <img v-if="!!data.ConsentSignature" :src="data.ConsentSignature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>

        <span>身份證字號：</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsentIdentifier === false }"> {{ data.ConsentIdentifier }} </span>
      </div>

      <div class="py-1">
        <span>關係：病人之{{ !!data.ConsentRelationship ? `其他：${data.ConsentRelationship}` : '本人' }}</span>
      </div>

      <div class="py-1">
        住址：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsentAddress === false }"> {{ data.ConsentAddress }} </span>
        電話：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsentTel === false }"> {{ data.ConsentTel }} </span>
      </div>

      <div class="py-1">
        日期：
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ConsentTime === false }">
          {{ !!data.ConsentTime ? dayjs(data.ConsentTime).format('YYYY 年 MM 月 DD 日 HH 時 mm 分') : null }}
        </span>
      </div>

      <div class="my-8">
        <div class="py-1">１. 如由病人、親屬或關係人簽署本同意書，則無需見證，見證人部分得免填</div>
        <div class="py-1">２. 若意識清楚，但無法親次簽具者且無親屬或關係人在場，得以按指印代替簽名，惟應有二名見證人</div>
        <div class="py-1">３. 若病人意識不清且無親屬或關係人在場，醫療緊急情況得由二名合格醫師在病歷上證明需檢查或治療即可</div>
      </div>

      <div class="flex items-center py-1 mt-4">
        <span>見證人１：</span>
        <img v-if="!!data.Eyewitness1Signature" :src="data.Eyewitness1Signature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>

        <span>見證人２：</span>
        <img v-if="!!data.Eyewitness2Signature" :src="data.Eyewitness2Signature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import dayjs from 'dayjs'

const data = inject('confirmData')

const getTextPatientId = (data) => {
  const PidReg = /^PATT.\w{0,}.(\w{0,})/
  return data.match(PidReg)[1]
}

</script>
