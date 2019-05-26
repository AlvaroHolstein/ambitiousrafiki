class User {
    constructor(
        /**
         * Ver se não é preciso melhorar esta class.
         */
        id,
        nome,
        exp,
        desc,
        year,
        course,
        foto,
        follow = null,
        upvotes = null,
        mail = null,
        notifications = null
    ) {
        //fazer nos getter's a atribuição de badges, level e rank
        this.id = id; //Não vai ser preciso fazer o getId aqui, porque já é feito nos dois sitios onde os utilizadores são adicionados
        this.name = nome;
        this.email = mail;
        this.experience = exp;
        this.level = this.getLevel();
        this.rank = this.getRank();
        this.badges = [];
        this.description = desc;
        this.picture = foto;
        this.follow = follow;
        this.year = year;
        this.course = course;
        /**
         * Fazer a "dissecação dos badges aqui"
         */
        this.upvotes = upvotes;
        /**
         * Fazer um get Notifications
         */
        this.notifications = notifications;
    }

    getLevel() {
        return Math.floor(this.experience / 100) + 1;
    }

    getRank() {
        //Vai ter que se fazer um switch para dar os nomes aos ranks
        let rank = Math.floor(this.level / 10);
        let trueRank = null;
        // console.log(this.level);
        switch (
        rank //O calculo do rank deve estar mal....
        ) {
            case 0:
                trueRank = "A começar";
                break;
            case 1:
                trueRank = "grande";
                break;
            case 2:
                trueRank = "muito grande";
                break;
        }

        // console.log(trueRank);
        // console.log(rank);
        return [rank, trueRank];
    }
    getBadges(badgesArr, threadsArr, commentsArr, answersArr) {
        let badges = [];
        this.badges = [];
        // console.log(threadsArr);
        let tr = this.getThreads(threadsArr, commentsArr, answersArr); //Isto depois vai substituir a batota
        console.log(tr);
        // let batota = 20;
        for (let badge of badgesArr) {
            let gravar = false;

            console.log(badge);
            if (badge.goal <= this.exp && badge.category == "rank") {
                gravar = true;
            }

            if (badge.category == "help") {
                if (badge.goal <= tr) {
                    gravar = true;
                }
            }

            if (gravar) {
                badges.push(badge.id);
            }
        }
        console.log(this.badges);
        console.log(this.exp);
        return badges;
    }

    getThreads(threadsArr, commentsArr, answersArr) {
        /* Vai ter que returnar um numero */
        let total = 0;

        total += threadsArr.filter(th => th.userid == this.id).length;
        total += commentsArr.filter(cm => cm.idUser == this.id).length;
        total += answersArr.filter(ans => ans.idUser == this.id).length;
        return total;
    }
    
    tamanhoMaximo() {
        if (this.notifications.length == 6) this.notifications.shift();
    }
}
const users = {
    namespaced: true,
    state: {
        userClass: User,
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
        a() {
            console.log('alalalalalalalalalalalalala')
        }
    },
    getters: {

    }
}

export default users; 