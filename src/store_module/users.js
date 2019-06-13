import axios from "axios";
import { async } from "q";

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
    let all = this.getTotContribution(threadsArr, commentsArr, answersArr); //Isto depois vai substituir a batota
    let numThreads = this.getTotThreads(threadsArr);
    let numAnswers = this.getTotAnswers(answersArr);
    let numComments = this.getTotComments(commentsArr);
    console.log(all);
    // let batota = 20;

    for (let badge of badgesArr) {
      let gravar = false;
      // eslint-disable-next-line no-inner-declarations
      function badgeComparisson(goal, actual) {
        if (actual >= goal) gravar = true;
      }
      console.log(badge, "badge");
      console.log(this.experience, "experience");
      console.log(badge.goal);

      if (badge.goal <= this.experience && badge.category == "rank") {
        console.log("alalalalalal");
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
            badgeComparisson(badge.goal, numAnswers);
            break;

          case "threads":
            badgeComparisson(badge.goal, numThreads);
            break;

          case "comments":
            badgeComparisson(badge.goal, numComments);
            break;

          case "all":
            badgeComparisson(badge.goal, all);
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
    console.log(badges, "lalalalalalalala badges");
    return badges;
  }

  getTotContribution(threadsArr, commentsArr, answersArr) {
    /* Vai ter que returnar um numero */
    let total = 0;

    total += threadsArr.filter(th => th.userInfo.userid == this.id).length;
    total += commentsArr.filter(cm => cm.userInfo.userid == this.id).length;
    total += answersArr.filter(ans => ans.userInfo.userid == this.id).length;
    console.log(total, "total user class");
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

class Notification {
  constructor(threadId, text, name, userId, id = 1) {
    this.id = id
    this.idThread = threadId,
      this.text = text,
      this.userInfo = {
        name: name,
        id: userId
      },
      this.visto = false,
      this.date = new Date().toISOString()
  }
}

/** VUEX */
const users = {
  namespaced: true,
  state: {
    userClass: User,
    notificationClass: Notification,
    /**
     * Não vai haver uma variável tipo (isLoggedIn),
     * vai se ver se o loggedUser é diferente de null
     */
    loggedUser: null,
    lastViewedThread: null
    // notifications: [] //As notificações só vão ser preenchidas na mutation getLoggedUser
  },
  mutations: {
    /** Preencher o loggedUser */
    setLoggedUser(state, payload) {
      console.log(payload, "PAYLOAD NO SETLOGGEDUSER!!!!!!!!!!!!!");
      let {
        id,
        name,
        mail,
        description,
        experience,
        course,
        year,
        follow,
        notifications,
        picture,
        upvotes
      } = payload;
      state.loggedUser = new User(
        id,
        name,
        experience,
        description,
        year,
        course,
        picture,
        follow,
        upvotes,
        mail,
        notifications
      );
      console.log(state.loggedUser, "LOGGED USEER !!!!!?!?!?!?!?!?!!?!?!? ");
    },
    /**REmover loggedUSer */
    unLoggedUser(state) {
      console.log(state, "unLoggedUser");
      state.loggedUser = null;
    },
    /** Fazer Follow/Unfollow ("add"/"remove") */
    changeFollow(state, payload) {
      console.log(payload, "payload no users.js changeFollow()");
      if (payload.type == "add") {
        state.loggedUser.follow.push(payload.id);
      } else {
        let index = state.loggedUser.follow.findIndex(fol => fol == payload.id);
        state.loggedUser.follow.splice(index, 1);
      }
    },
    SET_LAST_THREAD(state, payload) {
      state.lastViewedThread = payload;
    },
    addFollow(state, follow) {
      state.loggedUser.follow.push(follow)
    },
    removeFollow(state, follow) {
      let index = state.loggedUser.follow.findIndex(fol => fol == follow)
      if (index != -1) state.loggedUser.follow.splice(index, 1)
      console.log(index, "mutation")
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), 1000)
      })
    },
    addUpvote(state, upvote) {
      let insert = true
      console.log(upvote)
      for (let upv of state.loggedUser.upvotes) {
        if (upv.type == upvote.type && upv.targetId == upvote.targetId) {
          insert = false
          return;
        }
      }
      if (insert) state.loggedUser.upvotes.push(upvote)
    },
    removeUpvote(state, upvote) {
      let index = state.loggedUser.upvotes.findIndex(upv => {
        if (upv.type == upvote.type && upv.targetId == upvote.targetId) return true
        return false
      })
      if (index != -1) state.loggedUser.upvotes.splice(index, 1)
    },
    removeNotis(state, payload) {
      for (let noti of payload) {
        let index = state.loggedUser.notifications.findIndex(nt => nt.id == noti)
        if (index != -1) state.loggedUser.notifications.splice(index, 1)
      }
    },
    viewOrNotNotification(state, id) {
      let index = state.loggedUser.notifications.findIndex(nt => nt.id == id)
      if (index != -1) state.loggedUser.notifications[index].visto = !state.loggedUser.notifications[index].visto
    }
  },
  actions: {
    /** Buscar os badges e filtrar-los para depois fazer commit deles */
    user_badges({ rootGetters, rootState, commit, state }) {
      async function aux() {
        try {
          let threads = await axios
            .get(
              `http://${rootGetters.getIp}/data-api/threads/userThreads/${
              state.loggedUser.id
              }`
            )
            .then(res => res.data);
          let answers = await axios
            .get(
              `http://${rootGetters.getIp}/data-api/userAnswers/${
              state.loggedUser.id
              }`
            )
            .then(res => res.data);
          let comments = await axios
            .get(
              `http://${rootGetters.getIp}/data-api/userComments/${
              state.loggedUser.id
              }`
            )
            .then(res => res.data);
          return {
            th: threads,
            ans: answers,
            com: comments
          };
        } catch (err) {
          console.log(err, "ERRO no users/user_badges!!!!!!!!!");
        }
      }
      aux().then(res => {
        commit(
          "user_badges",
          state.loggedUser.getBadges(rootState.badges, res.th, res.com, res.ans)
        );
        return;
      });
    },

    /** Adicionar Upvote */
    add_upvote({ state, commit, rootGetters }, { upv, burnUpv, login }) {
      let exp = 30;

      /** A confirmação se o upvote é ou não
       * burned, é feita no back-end só
       */

      axios({
        url: `http://${rootGetters.getIp}/data-api/users/${
          burnUpv.userId
          }/isBurned`,
        method: "post",
        data: upv,
        headers: {
          "x-access-token": login
        }
      }).then(res => {
        if (!res.data.isBurned) {
          /** Agora vou dar commit da experiencia e a seguir
           * faz se o pedido à API para alterar o user
           */
          commit("add_upvote");
        }
      });
    },
    set_last_thread(context, payload) {
      context.commit("SET_LAST_THREAD", payload);
    }
  },
  getters: {}
};

export default users;
