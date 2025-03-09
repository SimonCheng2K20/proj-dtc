<template>
  <!-- <section class="loadingApi">
    <div class="loading-content">
      <div class="word">資料處理中請稍後</div>
      <div class="load-wrapp">
        <div class="load-box">
          <div class="spinner">
            <div class="bubble-1"></div>
            <div class="bubble-2"></div>
          </div>
        </div>
      </div>
    </div>
  </section> -->
  <section class="loadingApi">
    <div class="loader">
      <h1>LOADING{{ dots[count] }}</h1>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </section>
</template>

<script>
// import Swal from "sweetalert2";
import { ref, onMounted, onUnmounted } from "vue";
export default {
  setup() {
    const myTimer = ref(null);
    const count = ref(0);
    const total = ref(0);
    const dots = ref([".", "..", "..."]);
    const getDots = () => {
      if (count.value < 3) {
        count.value += 1;
      } else {
        count.value = 0;
      }
      total.value = 0;
      total.value += 1;
    };
    onMounted(() => {
      myTimer.value = setInterval(getDots, 1000);
    });
    onUnmounted(() => {
      myTimer.value = null;
    });
    return { myTimer, count, total, dots, getDots };
  },
};
</script>

<style lang="scss" scoped>
// .loadingApi {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   width: 100%;
//   height: 100%;
//   background: rgb(0 0 0 / 75%);
//   border-radius: 5px;
//   display: grid;
//   place-items: center;
//   color: white;
//   z-index: 99999999999999999999;
// }
// .loading-content {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   .word {
//     letter-spacing: 1.7px;
//   }
// }

// .load-wrapp {
//   width: 120px;
//   height: 100px;
//   margin: 0 10px 10px 0;
//   padding: 20px 20px 20px;
//   border-radius: 5px;
//   text-align: center;
//   background-color: transparent;
// }

// .bubble-1,
// .bubble-2 {
//   position: absolute;
//   top: 0;
//   width: 25px;
//   height: 25px;
//   border-radius: 100%;
//   background-color: #4b9cdb;
// }

// .bubble-2 {
//   top: auto;
//   bottom: 0;
// }

// .load-box .spinner {
//   animation: loadingI 2s linear infinite;
// }
// .load-box .bubble-1,
// .load-box .bubble-2 {
//   animation: bounce 2s ease-in-out infinite;
// }
// .load-box .bubble-2 {
//   animation-delay: -1s;
// }

// @keyframes loadingI {
//   100% {
//     transform: rotate(360deg);
//   }
// }

// @keyframes bounce {
//   0%,
//   100% {
//     transform: scale(0);
//   }
//   50% {
//     transform: scale(1);
//   }
// }
.loadingApi {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999999999999999;
  background: #333;
  background: -webkit-gradient(
    radial,
    center center,
    120,
    center center,
    900,
    from(#33495e),
    to(#2e2329)
  );
  background: -moz-radial-gradient(circle, #33495e, #2e2329);
}
.loader {
  margin: 200px auto;
}
h1 {
  font-family: "Actor", sans-serif;
  color: #fff;
  font-size: 16px;
  letter-spacing: 1px;
  font-weight: 200;
  text-align: center;
}
.loader span {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  left: 50%;
  margin-left: -10px;
  -webkit-animation: 3s infinite linear;
  -moz-animation: 3s infinite linear;
  -o-animation: 3s infinite linear;
}

.loader span:nth-child(2) {
  background: #e84c3d;
  -webkit-animation: kiri 1.2s infinite linear;
  -moz-animation: kiri 1.2s infinite linear;
  -o-animation: kiri 1.2s infinite linear;
}
.loader span:nth-child(3) {
  background: #f1c40f;
  z-index: 100;
}
.loader span:nth-child(4) {
  background: #2fcc71;
  -webkit-animation: ray 1.2s infinite linear;
  -moz-animation: ray 1.2s infinite linear;
  -o-animation: ray 1.2s infinite linear;
}

@-webkit-keyframes ray {
  0% {
    -webkit-transform: translateX(20px);
  }

  50% {
    -webkit-transform: translateX(-20px);
  }

  100% {
    -webkit-transform: translateX(20px);
    z-index: 200;
  }
}
@-moz-keyframes ray {
  0% {
    -moz-transform: translateX(20px);
  }

  50% {
    -moz-transform: translateX(-20px);
  }

  100% {
    -moz-transform: translateX(20px);
    z-index: 200;
  }
}
@-o-keyframes ray {
  0% {
    -o-transform: translateX(20px);
  }

  50% {
    -o-transform: translateX(-20px);
  }

  100% {
    -o-transform: translateX(20px);
    z-index: 200;
  }
}

@-webkit-keyframes kiri {
  0% {
    -webkit-transform: translateX(-20px);
    z-index: 200;
  }
  50% {
    -webkit-transform: translateX(20px);
  }
  100% {
    -webkit-transform: translateX(-20px);
  }
}

@-moz-keyframes kiri {
  0% {
    -moz-transform: translateX(-20px);
    z-index: 200;
  }
  50% {
    -moz-transform: translateX(20px);
  }
  100% {
    -moz-transform: translateX(-20px);
  }
}
@-o-keyframes kiri {
  0% {
    -o-transform: translateX(-20px);
    z-index: 200;
  }
  50% {
    -o-transform: translateX(20px);
  }
  100% {
    -o-transform: translateX(-20px);
  }
}
</style>
