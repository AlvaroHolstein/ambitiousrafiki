import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

/**
 * Mostrar todos os Users
 */
import users from "@/views/Users.vue"
/**
 * View Profile
 */
import viewProfile from "./views/ViewProfile.vue"
import about from "@/views/About.vue"


Vue.use(Router);

export default new Router({
  routes: [
    {
      /**
       * Home
       */
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/users",
      name: "users",
      component: users
    },
    {
      path: "/viewProfile/:visiteduser",
      name: "ViewProfile",
      component: viewProfile ,
      children: [
        {
          path: "/about",
          name: "About",
          component: about
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Aboutd.vue")
    }
  ]
});
