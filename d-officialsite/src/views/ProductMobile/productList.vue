<template>
  <div class="products">
    <dtc-banner title="產品介紹" path="首頁/產品介紹" image="productMobile_image/product_banner.jpg" fontColor="#333" />

    <div class="p-3 mt-3">
      <dtc-title main="PRODUCTS" sub="產品介紹" />
      <div class="product-list mt-4">
        <div v-for="prod in products.filter(({key}) => !key.includes('DC-') && !key.includes('DICOM-') )" :key="prod.title" class="p-2 prod shadow-sm">
          <div v-text="prod.title" class="sub-title" />
          <div v-text="prod.sub" class="sec-sub-title" />
          <div class="p-1 img-frame shadow-sm mb-2">
            <b-img :src="prod.img" class="w-100" />
          </div>
          <b-button class="mx-auto d-table" variant="outline-primary" size="sm" pill @click.stop="jumpTo(prod)">閱讀更多</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dtcTitle from "@/components/dtc-title.vue";
import dtcBanner from "@/components/dtc-banner.vue";
import { products } from "@/assets/js/products.js";
export default {
  components: {
    dtcTitle, dtcBanner
  },
  data () {
    return {
      products
    }
  },
  methods: {
    jumpTo (prod) {
      
      this.$router.push({ path: `/productMobile/${prod.key === 'Pictures' ? 'DC-100' : prod.key}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.products {
  color: #5c5c5c;
}
.product-banner {
  background: transparent no-repeat center center / cover;
  width: 100%;
  height: 40vw;
}

.slogan {
  text-align: center;
  font-weight: bold;
  h1 {
    font-size: 1.7rem;
  }
  .path {
    font-size: 0.7rem;
  }
}

.product-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  .prod {
    border: 1px solid #eee;
    .sub-title {
      font-size: .7rem;
    }
    .sec-sub-title {
      font-size: .7rem;
    }
  }
}
</style>
