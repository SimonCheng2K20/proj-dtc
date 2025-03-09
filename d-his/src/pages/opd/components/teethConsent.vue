<template>
  <div id="teethConsent" class="teethConsent">
    <div class="teethConsentTitle">牙周手術同意書</div>
    <div class="teethConsentContent">
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel">病歷號碼：</div>
        <InputText :value="data.PatientId" />
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel">病人</div>
        <InputText :value="data.PersonName" />，
        <div class="teethConsentLabel">性別</div>
        <InputText :value="data.Gender" style="width:60px;"/>，
        <InputText :value="dayjs(data.BirthDate).format('YYYY')" style="width:60px;"/>
        <div class="teethConsentLabel">年</div>
        <InputText :value="dayjs(data.BirthDate).format('MM')" style="width:60px;"/>
        <div class="teethConsentLabel">月</div>
        <InputText :value="dayjs(data.BirthDate).format('DD')" style="width:60px;"/>
        <div class="teethConsentLabel">日生</div>，
        <div class="teethConsentLabel">因患</div>
        <InputText placeholder="請輸入" />
        <div class="teethConsentLabel">需實施</div>
        <InputText placeholder="請輸入" />手術，
      </div>
      <div class="flex items-center mb-4">
        貴院______________醫師 (由醫師親自簽名) 詳細說明下列事項，並已充分瞭解，同意由貴院施行該項手術。
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">病人病史填註：本次手術區域本人</div>
      </div>
      <div class="flex items-center mb-4 pl-4">
        <q-checkbox class="mr-2" />兩年內不曾接受牙周手術
      </div>
      <div class="flex items-center mb-4 pl-4">
        <q-checkbox class="mr-2" />兩年內曾於______________院所接受牙周手術
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">立同意書人：</div>______________ (簽名)
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">身分證字號：</div>______________
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">日期：</div>民國_______年_______月_______日
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">實施牙周手術說明：</div>
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">一、手術原因：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">在完成牙周病基本治療後，由於牙周深部仍有問題，因此需要手術作深部清理，與作必要時的齒槽骨修整。</div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">二、手術性質：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">牙周手術極為細膩費時，通常只須局部麻醉，不需住院。雖然術後難免有些許的不適感，但一般而言不會影響到日常生活及工作。</div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">三、成功率：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">手術之主要目的為延長牙齒之使用年限，大多數的手術能達此目的，但因牙周環境特殊，仍需病人維持良好的口腔衛生並定期回診。</div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">四、術後常見之情況：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">術後常見之情況：雖然術後有短期的不適，但換來長期的牙周健康，十分值得。 <br /><br />牙齦退縮：手術區牙齦會有些許退縮，因此牙齒會顯得稍長。 <br />牙齒敏感：手術區的牙齒對溫差，尤其是冷，或某些水果、甜食會較敏感， 此種情況約三、四週才會逐漸改善。 <br />牙齒動搖：手術區的牙齒動搖度會暫時增加，請勿擔心，通常一、兩個月後會回復。 </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">五、可能發生之併發症及危險：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">手術後輕度的不適與腫脹為正常反應。較常見之併發症為術後傷口滲血，與對手術時植入之材料過敏。重大傷害極為罕見。 </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">六、手術以外之其他選擇：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">如未接受手術，須了解牙周破壞通常仍在進行當中，同時易有急性復發的可能性。不手術時的替代方式為定期保養〈即支持性牙周治療〉， 以緩和牙周破壞。拔牙也是選擇之一。</div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">七、本次手術區域：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">
        <InputText placeholder="請輸入" style="width:100%;" />
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">八、健保給付說明：</div>
      </div>
      <div class="flex items-center mb-4 pl-4">本區域之牙周手術二年內，無論任何原因，所做相同之牙周手術，皆不得再向保險人申報給付，亦不得向病人收取費用。</div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">九、</div>
      </div>
      <div class="flex items-center mb-4 pl-4">牙周手術除健保給付外，另需自費部分，醫師應與患者說明，並由患者簽名同意。 本人因牙周手術需要，必須支付自費項目且經醫師說明完整，願意支付此項金額。
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel">自費金額：新台幣</div><InputText />元整
      </div>
      <div class="flex items-center mb-4">
        <div class="teethConsentLabel mr-2">簽名：</div>______________
      </div>
    </div>
    <div class="flex items-center justify-center">
      <button @click="printDiv">OK</button>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
const props = defineProps({
  data: Object,
});

const printDiv=async ()=> {
  var divContents = document.getElementById("teethConsent").innerHTML;
  let stylesHtml = '';
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML;
  }
  var a = window.open('', '', 'width=2480');
  a.document.write('<html>');
  a.document.write('<head>');
  a.document.write(stylesHtml);
  a.document.write('<style>');
  a.document.write(`
    .teethConsentTitle {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
    .teethConsentContent {
      font-size: 20px;
    }
    .teethConsentLabel {
      background-color: #DEECFF;
      border: 1px solid #215DBB;
      font-size: 20px;
      font-weight: bold;
      padding: 2px 6px;
    }
    .p-inputtext {
      width: 140px;
      border-radius: 0px;
      height: 36px;
      padding-top: 0px;
      padding-bottom: 0px;
    }
  `);
  a.document.write('</style>');
  a.document.write('</head>');
  a.document.write('<body >');
  a.document.write(divContents);
  a.document.write('</body></html>');
  a.document.close();
  a.print();
}

</script>

<style lang="scss" scoped>
  .teethConsent {
    .teethConsentTitle {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
    .teethConsentContent {
      font-size: 20px;
    }
    .teethConsentLabel {
      background-color: #DEECFF;
      border: 1px solid #215DBB;
      font-size: 20px;
      font-weight: bold;
      padding: 2px 6px;
    }
    .p-inputtext {
      width: 140px;
      border-radius: 0px;
      height: 36px;
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
</style>
