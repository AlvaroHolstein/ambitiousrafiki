import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import bootstrap from "./assets/bootstrap.min.css"
import axios from "axios"

Vue.config.productionTip = false;

new Vue({ //Para aceder a estas propriedades tem que see usar o this.$<nome> ou só $<nome>
  router,
  store,
  bootstrap,
  axios,
  render: h => h(App)
}).$mount("#app");
