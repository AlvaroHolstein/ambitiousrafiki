import Vue from "vue";
import Vuex from "vuex";
import axios from "axios"
import users from "./store_module/users";
import threads from "./store_module/threads"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users: users,
    threads: threads
  },
  state: {
    /**
     * Quando houver users pré carregados vêm para aqui,
     * Nota: 
     *  - No searchThing a primeira pesquisa é feita aqui, ou seja, 
     *    antes de fazer o pedido verificar 
     *  - As threads, answers e comments vão estar no store > module threads
     */
    users_root: [],
    /**
     * VAriáveis de comunicação com a API
     */
    address: '192.168.1.83', //'172.23.116.246',
    port: ':420'
  },
  mutations: {

  },
  actions: {

  }
});
