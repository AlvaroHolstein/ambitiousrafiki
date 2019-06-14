import Vue from "vue";
import Router from "vue-router";

/**
 * Mostrar todos os Users
 */
import users from "@/views/Users.vue";
/**
 * View Profile
 */
import viewProfile from "@/views/ViewProfile.vue";

/**
 * View thread
 */
import viewThread from "@/views/Thread.vue";

/** Create Thread */
import createThread from "@/views/CreateThread.vue";

/**
 * Home (Dentro do Home é que estão os componentes Catalog e Related)
 */
import home from "@/views/Home.vue";

/**
 * Login Page
 */
import login from "@/views/Login.vue";
/**
 * Back Office
 */
import backoffice from "@/views/BackOffice.vue";

/**
 * Notifications (view more)
 */
import notifications from "@/views/Notifications.vue";

/**
 * Páginas "Simples"
 * Faq, Rankings, Tags, Badges, Contact us,Stats
 */
import faq from "@/views/Faq.vue";
import rankings from "@/views/Ranking.vue";
import tags from "@/views/Tags.vue";
import badges from "@/views/Badges.vue";
import contact from "@/views/ContactUs.vue";
import stats from "@/views/stats.vue";
import store from "./store.js";

Vue.use(Router);

const router= new Router({
  routes: [
    {
      /**
       * Home
       */
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/thread/:threadid",
      name: "thread",
      component: viewThread
    },
    {
      /**
       * User List
       */
      path: "/users",
      name: "users",
      component: users
    },
    {
      /**
       * ViewProfile
       */
      path: "/viewProfile/:userid",
      name: "viewProfile",
      component: viewProfile
    },
    {
      path: "/faq",
      name: "faq",
      component: faq
    },
    { path: "/stats", name: "stats", component: stats },
    {
      path: "/rankings",
      name: "rankings",
      component: rankings
    },
    {
      path: "/tags",
      name: "tags",
      component: tags
    },
    {
      path: "/badges",
      name: "badges",
      component: badges
    },
    {
      path: "/cantactus",
      name: "contactus",
      component: contact
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/createThread",
      name: "createThread",
      component: createThread,
      meta:{
        needsAuth:true
      }
    },
    {
      path: "/notifications",
      name: "notifications",
      component: notifications

    },
    {
      path: "/backoffice",
      name: "backoffice",
      component: backoffice,
      meta: {
        admin: true
      }
    },
  ]
});
router.beforeEach((to,from,next)=>{
  let auth=false
  let id=0
  if(store.state.users.loggedUser!=null){
    auth=true
    if(store.state.users.loggedUser.id==1){
      id=1
    }
  }
  

  if (to.matched.some(record => record.meta.needsAuth) && !auth) {
    alert("NOT LOGGED IN");
    next("/");
  } else{
    next(); 
  }
  if (to.matched.some(record => record.meta.admin)) {
    if(id!=1){
      alert("Not Allowed In There")
      router.go(-1)
    }else{
      next()
    }
  }
})

export default router;