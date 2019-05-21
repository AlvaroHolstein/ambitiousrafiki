import Vue from "vue";
import Vuex from "vuex";
import axios from "axios"
import users from "./store_module/users";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users: users
  },
  state: {
    users: [],
    threads: [],
    /**
     * Tanto as answers como os comments só são carregados 
     */
    answers: [],
    comments: [],
    /**
     * Variavel que vai guardar o user logado
     */
    loogedUser: {
      notifications: []
    },
    /**
     * VAriáveis de comunicação com a API
     */
    address: '172.23.116.246',
    port: ':420'
  },
  mutations: {
    getThreads(state, payload) {
      console.log(payload, "payload na MUTATION")
      state.threads = payload
    }
  },
  actions: {
    getThreads(context) {
      //Isto nem vai ser 
      if (context.state.threads.length == 0) {
        axios.get(`http://${context.state.address + context.state.port}/data-api/threads`)
          .then(res => {
            context.commit('getThreads', res.data)
          })
          .catch(err => console.log(err, "err no AXIOS"))
      }
      else console.log('Os users já estão preenchidos');
    }
  }
});
