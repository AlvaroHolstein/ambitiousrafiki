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

  getRank(newlevel = null) {
    let lvl = newlevel == null ? this.level : newlevel
    let rank = Math.floor(lvl / 10);
    let trueRank = null;

    /** Falta acrescentear ranks */
    switch (
    rank
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

    return {
      rank: rank,
      trueRank: trueRank
    };
  }
  getBadges(badgesArr, threadsArr, commentsArr, answersArr, userPos) {
    let badges = [];
    this.badges = [];
    // console.log(threadsArr);
    let all = this.getTotContribution(threadsArr, commentsArr, answersArr);
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
      // console.log(badge, "badge");
      // console.log(this.experience, "experience");
      console.log(badge.goal);

      /** AHAHAHAHAHAHAAH, isto não pode ser calculado assim */
      if (badge.category == "rank") {
        console.log("alalalalalal");
        if(badge.goal >= userPos) gravar = true;
      }
      /** Ui que isto vai ser grande */

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
  sortUsers(usersR) {
    let users = usersR.sort((a, b) => {
      if (a.experience > b.experience) return -1;
      if (a.experience < b.experience) return 1;
      else return 0;
    });

    return users;
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
      console.log(id, "assadasdasdasd")
      if (index != -1) state.loggedUser.notifications[index].visto = !state.loggedUser.notifications[index].visto
    },
    user_badges(state, payload) {
      console.log(payload, "PAyload no user_badges LALALALA Commit")
      state.loggedUser.badges = payload
    }
  },
  actions: {
    /** Buscar os badges e filtrar-los para depois fazer commit deles */
    user_badges({ rootGetters, rootState, commit, state }) {
      async function aux() {
        try {
          function sortUsers(usersR) {
            let users = usersR.sort((a, b) => {
              if (a.experience > b.experience) return -1;
              if (a.experience < b.experience) return 1;
              else return 0;
            });
    
            return users;
          }
          
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

          let pos = await axios.get(`http://${rootGetters.getIp}/data-api/users`).then(res => {
            let users = sortUsers(res.data);
            return users.findIndex(user => user.id == state.loggedUser.id);
          });
          return {
            th: threads,
            ans: answers,
            com: comments,
            pos: pos
          };
        } catch (err) {
          console.log(err, "ERRO no users/user_badges!!!!!!!!!");
        }
      }
      aux().then(res => {
        commit(
          "user_badges",
          state.loggedUser.getBadges(rootState.badges, res.th, res.com, res.ans, res.pos)
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
