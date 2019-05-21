const users = {
    namespaced: true,
    state: {
        name: 'lalalalal',
        /**
         * Não vai haver uma variável tipo (isLoggedIn),
         * vai se ver se o loggedUser é diferente de null 
         */
        loggedUser: null,
        notifications: [] //As notificações só vão ser preenchidas na mutation getLoggedUser
    },
    mutations: {
        // Preencher o loggedUser e as notifications
        getLoggedUser(state, payload) {
            state.loggedUser = payload.user
            state.notifications = payload.notifications
        }
    },
    actions: {
        // Pedido à API para o user e notificações que vai ser para o login

    },
    getters: {

    }
}

export default users; 