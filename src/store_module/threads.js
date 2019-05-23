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
        comments: [],
    },
    mutations: {
        getInitialThreads(state, payload) {
            console.log(payload, "payload na MUTATION")
            state.threads_ = payload
        },
        /**
         * Answers
         */
        getAnswers(state, payload) {

        },
        /**
         * Comments
         */
        getComments(state, payload) {

        }
    },
    actions: {
        getInitialThreads({state, commit, rootGetters}, qty=10) {
            //Isto nem vai ser 
            console.log('ulululululuullulululul')
            if (state.threads_.length == 0) {
                axios.get(`http://${rootGetters.getIp}/data-api/threads?qty=${qty}`)
                    .then(res => {
                        console.log(res.data, `Initial ${qty} threads`)
                        commit('getInitialThreads', res.data)
                    })
                    .catch(err => console.log(err, "err no AXIOS"))
            }
            else console.log('Os users já estão preenchidos');
        },
        /**
         * Get Answers
         */
        getAnswers({ commit, rootGetters }, id_thread) {
            axios.get(`http://${rootGetters.getIp}/data-api/threads/${id_thread}`)
            .then(res => {
                // TODO: 
                console.log(res.data)
            })
            // console.log(rootGetters, 'LELELELELEL')
        },
        /**
         * getComments
         */
        getComments({ commit }, id_ans) {
            console.log('comments')
        }
    }
}

export default threads;