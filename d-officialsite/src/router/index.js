import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter (to, from, next) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        next({ name: 'HomeMobile' });
      } else {
        next();
      }
    }
  },
  {
    path: "/home",
    redirect: { name: 'Home' }
  },
  {
    path: "/homeMobile",
    name: "HomeMobile",
    component: () => import("../views/HomeMobile/index.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutXl.vue"),
  },
  {
    path: "/aboutMobile",
    name: "AboutMobile",
    component: () => import("../views/AboutMobile.vue"),
  },
  {
    path: "/news",
    name: "news",
    component: () => import("../views/NewsXl.vue"),
  },
  {
    path: "/newsMobile",
    name: "newsMobile",
    component: () => import("../views/NewsMobile.vue"),
  },
  {
    path: "/private",
    name: "private",
    component: () => import("../views/Private.vue"),
  },
  {
    path: "/product",
    name: "product",
    component: () => import("../views/ProductXl.vue"),
  },
  {
    path: "/productMobile",
    component: () => import("../views/ProductMobile/index.vue"),
    children: [
      {
        path: "",
        name: "ProductMobile",
        component: () => import("../views/ProductMobile/productList.vue")
      },
      {
        path: ":itemName",
        name: "ProductItemMobile",
        component: () => import("../views/ProductMobile/ProductItem.vue"),
      }
    ]
  },
  {
    path: "/success",
    name: "success",
    component: () => import("../views/SuccessXl.vue"),
  },
  {
    path: "/successMobile",
    name: "successMobile",
    component: () => import("../views/SuccessMobile.vue"),
  },
  {
    path: "/104",
    name: "104",
    component: () => import("../views/104Xl.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactXl.vue"),
  },
  {
    path: "/contactMobile",
    name: "contactMobile",
    component: () => import("../views/ContactMobile.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.name.includes('Mobile') && store.state.isMobile) {
    next({ name: to.name + 'Mobile' });
  } else {
    next();
  }
  // next();
})

export default router;
