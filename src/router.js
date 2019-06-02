import Vue from "vue";
import Router from "vue-router";

/**
 * Mostrar todos os Users
 */
import users from "@/views/Users.vue"
/**
 * View Profile
 */
import viewProfile from "@/views/ViewProfile.vue"

/**
 * View thread
 */
import viewThread from "@/views/Thread.vue"

/**
 * Home (Dentro do Home é que estão os componentes Catalog e Related)
 */
import home from "@/views/Home.vue"

/**
 * Login Page
 */
import login from "@/views/Login.vue"

/**
 * Páginas "Simples"
 * Faq, Rankings, Tags, Badges, Contact us
 */
import faq from "@/views/Faq.vue"
import rankings from "@/views/Ranking.vue"
import tags from "@/views/Tags.vue"
import badges from "@/views/Badges.vue"
import contact from "@/views/ContactUs.vue"

Vue.use(Router);

export default new Router({
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
      component: viewProfile,
      /*children: [
        { // About Tab
          path: "/",
          name: "about",
          component: about
        },
        { // Badges Tab
          path: "/badges",
          name: "badges",
          component: userBadges
        } 
        { // Ranking Tab
          path: "/ranking",
          name: "ranking",
          component: ranking
        },
        { //Edit Profile Tab
          path: "/editProfile",
          name: "editProfile",
          component: editProfile
        }
  ]*/
    },
    {
      path: "/faq",
      name: "faq",
      component: faq
    },
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
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/Aboutd.vue")
    // }
  ]
});
