import Vue from "vue";
import Vuex from "vuex";
import users from "./store_module/users";
import threads from "./store_module/threads";
import axios from "axios";
import cookie from "cookie";
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
    //Tag Procurada
    searchTag: "",

    /**
     * Badges
     */
    badges: [],

    /**
     * VAriáveis de comunicação com a API
     */
    address: "192.168.1.92", //"192.168.1.83" ,
    port: ":420"
  },
  mutations: {
    LOAD_BADGES(state, payload) {
      state.badges = payload;
      console.log(state.badges, "BADGES");
    },
    DELETE_BADGE(state, id) {
      let index = state.badges.findIndex(badge => badge.id == id);
      state.badges.splice(index, 1);
    },
    CREATE_BADGE(state, payload) {
      state.badges.push(payload);
      console.log(payload, "PAYLOAD NA MUTAÇÃO");
      /*let aux = state.badges;
      aux.push(payload);
      state.badges = aux;*/
    },
    SEARCH_TAG(state, tag) {
      state.searchTag = tag;
    }
  },
  actions: {
    load_badges({ commit, state }) {
      axios
        .get(`http://${state.address + state.port}/data-api/badges`)
        .then(res => {
          console.log(res.data, "BADGES DISPATCHHHHHHHHHHHHH!");
          commit("LOAD_BADGES", res.data);
        })
        .catch(err => console.log(err, "ERRO na ACTION load_badges"));
    },
    delete_badge(context, id) {
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      axios
        .delete(
          `http://${context.state.address +
            context.state.port}/data-api/badges/${id}`,
          {
            headers: headers
          }
        )
        .then(function() {
          context.commit("DELETE_BADGE", id);
        })
        .catch(err => console.log(err, "ERRO na ACTION delete_badge"));
    },
    create_badge(context, payload) {
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      console.log(payload, "PAYLOAADDDDDDD");
      axios({
        method: "post",
        url: `http://${context.state.address +
          context.state.port}/data-api/badges`,
        data: {
          id: payload.id,
          name: payload.name,
          goal: payload.goal,
          desc: payload.desc,
          category: payload.category
        },
        headers: headers
      })
        .then(function() {
          console.log("BLAWWEWK"), context.commit("CREATE_BADGE", payload);
        })
        .catch(err => console.log(err, "erro no create badges"));
    },

    search_tag(context, tag) {
      context.commit("SEARCH_TAG", tag);
    }
  },
  getters: {
    getIp: state => state.address + state.port
  }
});
