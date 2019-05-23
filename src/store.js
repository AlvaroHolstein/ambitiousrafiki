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
     * Badges
     */
    badges: [],

    /**
     * VAriáveis de comunicação com a API
     */
    address: '172.23.116.246', // '192.168.1.83', 
    port: ':420'
  },
  mutations: {
    LOAD_BADGES(state, payload) {
      state.badges = payload
      console.log(state.badges, 'BADGES')
    }
  },
  actions: {
    load_badges({ commit, state }) {
      axios.get(`http://${state.address + state.port}/data-api/badges`)
        .then(res => commit('LOAD_BADGES', res.data))
        .catch(err => console.log(err, "ERRO na ACTION load_badges"))
    }
  }
});
