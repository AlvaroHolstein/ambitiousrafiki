class User {
    constructor(
        /**
         * Ver se não é preciso melhorar esta class.
         */
        id,
        name,
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
        this.name = name;
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
        return {
            rank: rank,
            trueRank: trueRank
        };
    }
    getBadges(badgesArr, threadsArr, commentsArr, answersArr) {
        let badges = [];
        this.badges = [];
        // console.log(threadsArr);
        let all = this.getThreads(threadsArr, commentsArr, answersArr); //Isto depois vai substituir a batota
        let numThreads = this.getTotThreads(threadsArr)
        let numAnswers = this.getTotAnswers(answersArr)
        let numComments = this.getTotComments(commentsArr)
        console.log(all);
        // let batota = 20;


        for (let badge of badgesArr) {
            let gravar = false;
            function badgeComparisson(goal, actual) {
                if (actual >= goal) gravar = true
            }
            console.log(badge, "badge");
            console.log(this.experience, "experience");
            console.log(badge.goal)

            if (badge.goal <= this.experience && badge.category == "rank") {
                console.log('alalalalalal')
                gravar = true;
            }

            /**
             * Os badges do tipo help vão ter um campo 
             * chamado specific (nome a mudar), para separar os badges
             * de responder 10 vezes ou criar 10 threads por exemplo
             * os valores do specific vão ser: 
             *  - answers
             *  - threads
             *  - comments
             *  - all
             *  - (acrescentar mais)
             */
            if (badge.category == "help") {
                switch (badge.specific) {
                    case "answers":
                        badgeComparisson(badge.goal, numAnswers)
                        break;

                    case "threads":
                        badgeComparisson(badge.goal, numThreads)
                        break;

                    case "comments":
                        badgeComparisson(badge.goal, numComments)
                        break;

                    case "all":
                        badgeComparisson(badge.goal, all)
                        break;

                }
                // if (badge.goal <= all) {, por agora não vai ser usado
                //     gravar = true;
                // }
            }

            if (gravar) {
                badges.push(badge.id);
            }
        }
        console.log(badges);
        return badges;
    }

    getThreads(threadsArr, commentsArr, answersArr) {
        /* Vai ter que returnar um numero */
        let total = 0;

        total += threadsArr.filter(th => th.userInfo.userid == this.id).length;
        total += commentsArr.filter(cm => cm.userInfo.userid == this.id).length;
        total += answersArr.filter(ans => ans.userInfo.userid == this.id).length;
        console.log(total, "total user class")
        return total;
    }
    getTotThreads(arr) {
        return arr.filter(th => th.userInfo.userid == this.id).length;
    }
    getTotAnswers(arr) {
        return arr.filter(ans => ans.userInfo.userid == this.id).length;
    }
    getTotComments(arr) {
        return arr.filter(com => com.userInfo.userid == this.id).length;
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
        // notifications: [] //As notificações só vão ser preenchidas na mutation getLoggedUser
    },
    mutations: {
        // Preencher o loggedUser e as notifications
        setLoggedUser(state, payload) {
            console.log(payload, "PAYLOAD NO SETLOGGEDUSER!!!!!!!!!!!!!")
            let { id, name, mail, description, experience, course, year, follow, notifications, picture, upvotes } = payload
            state.loggedUser = new User(id, name, experience, description, year, course, picture, follow, upvotes, mail, notifications)
            console.log(state.loggedUser, "LOGGED USEER !!!!!?!?!?!?!?!?!!?!?!? ")
            // state.notifications = payload.notifications
        },
        unLoggedUser(state) {
            console.log(state, "unLoggedUser")
            state.loggedUser = null
        },
        changeFollow(state, payload) {
            console.log(payload, "payload no users.js changeFollow()")
            if (payload.type == "add") {
                state.loggedUser.follow.push(payload.id)
            }
            else {
                let index = state.loggedUser.follow.findIndex(fol => fol == payload.id)
                state.loggedUser.follow.splice(index, 1)
            }
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