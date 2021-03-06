import axios from "axios";

const threads = {
  namespaced: true,
  state: {
    threads_: [],
    /**
     * Tanto as answers como os comments só são carregados
     * na página da thread
     */
    answers: [],
    comments: []
  },
  mutations: {
    getInitialThreads(state, payload) {
      console.log(payload, "payload na MUTATION");
      state.threads_ = payload;
    },
    ADD_VIEW_THREAD(state,payload){
      let index=state.threads_.findIndex(thread=>thread.id=payload)

      state.threads_[index].views+=1
      console.log(state.threads_[index].views,"Views Atualizado")
    }
  },
  actions: {
    /**
     * TAmbém pode ser usado para pedir X threads de cada vez
     */
    getInitialThreads({ state, commit, rootGetters }, qty = 10) {
      if (state.threads_.length == 0) {
        axios
          .get(`http://${rootGetters.getIp}/data-api/threads?qty=${qty}`)
          .then(res => {
            console.log(res.data, `Initial ${qty} threads`);
            commit("getInitialThreads", res.data);
          })
          .catch(err => console.log(err, "err no AXIOS"));
      } else console.log("Os users já estão preenchidos");
    },

    /** REmover Upvotes */
    remove_upvote_thread({ rootGetters }, payload) {
      axios({
        url: `http://${rootGetters.getIp}/data-api/threads/${
          payload.th.id
        }/downvote`,
        method: "put",
        headers: {
          "x-access-token": payload.login
        }
      }).catch(err => {
        throw err;
      });
    },

    /** Adicionar Upvotes */
    add_upvote_thread({ rootGetters }, payload) {
      axios({
        url: `http://${rootGetters.getIp}/data-api/threads/${
          payload.th.id
        }/upvote`,
        method: "put",
        headers: {
          "x-access-token": payload.login
        }
      }).catch(err => {
        throw err;
      });
    },
    add_view_thread(context,payload){
      context.commit("ADD_VIEW_THREAD",payload)
    }
  }
};

export default threads;
