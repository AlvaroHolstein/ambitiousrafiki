const threads = {
    state: {
        threads: [],
        /**
         * Tanto as answers como os comments só são carregados 
         */
        answers: [],
        comments: [],
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
}