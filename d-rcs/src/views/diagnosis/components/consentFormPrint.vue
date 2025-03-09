<template>
  <div class="print p-8">
    <div class="p-4 border border-black text-justify">
      <div class="py-2 text-center text-2xl font-bold">電子病歷跨院互通暨提供就醫紀錄與結果資訊同意書</div>

      <p class="py-1">
        <span>本人</span>
        <span class="border-b border-black mx-2">
          {{ data.PatientName }}
        </span>
        <span>同意</span>
        <span class="border-b border-black mx-2"> {{ data.StationName + (!!data.HospitalName ? `、${data.HospitalName}` : '') }}醫師 </span>
        <span
          >為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情及藥事人員調劑、給予本人用藥諮詢或指導需要時，於本人簽署本同意書日期起算7年內，可調閱下列資料：</span
        >
      </p>

      <p class="flex ml-4 py-1">
        <i class="pi pi-check-square mr-2 mt-1"></i>
        <span>透過衛生福利部電子病歷交換中心系統調閱本人最近就醫醫療院所之全部電子病歷資料。</span>
      </p>

      <p class="flex ml-4 py-1">
        <i class="pi pi-check-square mr-2 mt-1"></i>
        <span>自衛生福利部中央健康保險署（以下稱健保署）依全民健康保險法相關規定建置之健保醫療資訊雲端查詢系統（包含健保雲端藥歷系統），執行下列作業：</span>
      </p>

      <div class="ml-8">
        <p class="flex py-1">
          <span>一、</span>
          <span>下載於查詢系統中本人就醫之醫療費用申報資料及健保卡上傳就醫資料。（包含用藥紀錄、檢查檢驗項目、手術項目、牙科處置及手術項目等資料）。</span>
        </p>
        <p class="flex py-1">
          <span>二、</span>
          <span
            >線上查詢及下載該查詢系統中，各健保署特約醫事服務機構上傳之本人就醫結果資料。（包含檢查（驗）結果報告、檢查（驗）影像檔案、出院病歷摘要等資料）。</span
          >
        </p>
      </div>

      <p class="py-1 mt-4">
        <span>前述資料，僅限本人於</span>
        <span class="border-b border-black mx-2">{{ data.StationName + (!!data.HospitalName ? `、${data.HospitalName}` : '') }}醫師</span>
        <span>
          為遠距醫療及空中轉診後送綜合判斷轉診處置決策、診療本人病情、病情評估及完成後送之癒後評估、藥事人員調劑、給予本人用藥諮詢或指導需要查詢比對使用，另如遠距醫療後醫師評估需緊急空中轉診，則資料自動轉入空中轉診後送使用，不得將該項資料另移作其他目的使用，且本人完成前述事項後，即應將該下載資訊刪除。但下載之資訊，醫師因醫療或追蹤管理需要，已列入病歷或處置決策紀錄者，不在此限。
        </span>
      </p>

      <p class="py-1">本人依個人資料保護法第3條規定，保留隨時取消本同意書或變更本同意書內容之權利。</p>

      <p class="py-1">※上述電子病歷跨院互通同意書暨提供就醫紀錄與結果資訊同意書，詳閱無誤，請在此同意書簽名：</p>

      <div class="flex items-center py-1">
        <span>立同意書人簽章：</span>
        <img v-if="!!data.ConsentSignature" :src="data.ConsentSignature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>

        <span>關係：病人之{{ !!data.ConsentRelationship ? `其他：${data.ConsentRelationship}` : '本人' }}</span>
      </div>

      <div class="flex items-center py-1">
        <span>出生年月日：</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.Birthday === false }">{{ data.Birthday }}</span>
        <span>，身分證號：</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.PatientIdentifier === false }">{{ data.PatientIdentifier }}</span>
      </div>

      <div class="flex items-center py-1">
        <span>見證人簽章：1.</span>
        <img v-if="!!data.Eyewitness1Signature" :src="data.Eyewitness1Signature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>
        <span>2.</span>
        <img v-if="!!data.Eyewitness2Signature" :src="data.Eyewitness2Signature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>
      </div>

      <div class="flex items-center py-1">
        <span>法定代理人/監護人：</span>
        <img v-if="!!data.AgentSignature" :src="data.AgentSignature" style="width: 20%" />
        <div v-else class="mx-1 px-12 border-b border-black h-6"></div>

        <span>關係：病人之</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.AgentRelationship === false }">{{ data.AgentRelationship }}</span>
        <span>，身分證號：</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.AgentIdentifier === false }">{{ data.AgentIdentifier }}</span>
      </div>

      <p class="py-1">
        <span>病人申請時間：</span>
        <span :class="{ 'mx-1 px-12 border-b border-black h-6': !!data.ApplyTime === false }">{{
          !!data.ApplyTime ? dayjs(data.ApplyTime).format('YYYY 年 MM 月 DD 日 HH 時 mm 分') : null
        }}</span>
      </p>
    </div>
    <div class="text-right">{{ chiDate }} V2</div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { inject, computed } from 'vue'

const chiDate = computed(() => {
  const date = dayjs().format('YYYY-MM').split('-')
  const y = Number(date[0]) - 1911
  return `${y}-${date[1]}`
})

const data = inject('consentData')
</script>
