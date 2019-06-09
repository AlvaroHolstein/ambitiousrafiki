<template>
  <div class="container">
    <div class="row">
      <div class="col-md-9">
        <div class="row mb-2">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="news-title">
                      <h2>{{ thread.title }}</h2>
                    </div>
                    <div class="news-cats">
                      <ul class="list-unstyled list-inline mb-1">
                        <li class="list-inline-item">
                          <i class="fa fa-folder-o text-danger"></i>
                          <a href="#">
                            <small>{{ thread.course }}</small>
                          </a>
                        </li>

                        <li class="news-title">
                          <i class="fa fa-folder-o text-danger"></i>
                          <a href="#">
                            <small>asked {{ thread.date | filterDate }}</small>
                            <p></p>
                            <!-- Isto e o <p> de cima vão sair, é só para ver o id da thread -->
                          </a>
                        </li>
                      </ul>
                    </div>
                    <hr />

                    <div class="news-content">
                      <p v-html="thread.question"></p>
                    </div>
                    <hr />
                    <div class="news-tags">
                      <h5>Tags</h5>
                      <button
                        type="button"
                        class="btn btn-sm btn-secondary btn-tag"
                        v-for="(tag, cont) in thread.tags"
                        v-bind:key="cont"
                      >
                        {{ tag.text }}
                      </button>
                    </div>
                    <hr />
                    <!-- TRY 
                    <div class="col-md-6 buttons-section">
                      <button
                        class="btn text-white btn-success"
                        v-on:click="upvoteThread(thread.id)"
                      >
                        <i class="fas fa-thumbs-up">{{thread.upvotes == 0 ? '' : thread.upvotes}}</i>

                        Upvote
                      </button>
                      {{numberUpvotes}}
                      <button
                        class="btn btn-primary"
                        style="margin-left: 5px;"
                        v-on:click="seguir"
                      >
                        <span class="badge">
                          <i class="fas fa-heart"></i>
                        </span>
                        Follow
                      </button>
                      {{numberFollowers}}
                    </div>
                    <div class="col-md-6 user-section">
                      <a href="#" title>
                        <img
                          v-bind:src="  thread.userInfo.photo"
                          alt="Author image"
                          class="rounded-circle"
                          style="width:100px"
                        >
                      </a>
                      <h4 class="author h4">
                        <span v-on:click="goToUser()">{{thread.userInfo.name}}</span>
                      </h4>
                      <ul class="list-unstyled list-inline">
                        <li class="list-inline-item">
                          Rank:
                          <span class="rank">{{thread.userInfo.rank}}</span>
                        </li>
                      </ul>
                    </div>
                    -->
                    <!-- -->
                    <div>
                      <div class="news-likes">
                        <span>
                          <a
                            class="btn text-white btn-success"
                            v-on:click="upvoteThread(thread.id)"
                          >
                            <i class="fas fa-thumbs-up">{{
                              thread.upvotes == 0 ? "" : thread.upvotes
                            }}</i>
                            Upvote
                          </a>
                        </span>
                        {{ numberUpvotes }}
                        <button
                          class="btn btn-primary"
                          style="margin-left: 5px;"
                          v-on:click="seguir"
                        >
                          <span class="badge">
                            <i class="fas fa-heart"></i>
                          </span>
                          Follow
                        </button>
                        {{ numberFollowers }}
                      </div>

                      <div class="row news-author">
                        <div class="col-md-auto">
                          <a href="#" title>
                            <img
                              v-bind:src="thread.userInfo.photo"
                              alt="Author image"
                              class="rounded-circle"
                              style="width:100px"
                            />
                          </a>
                        </div>
                        <div class="col">
                          <div class="auth-title">
                            <h4 class="author h4">
                              <span v-on:click="goToUser()">{{
                                thread.userInfo.name
                              }}</span>
                            </h4>
                            <ul class="list-unstyled list-inline">
                              <li class="list-inline-item">
                                Rank:
                                <span class="rank">{{
                                  thread.userInfo.rank
                                }}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card threadFechada" v-show="threadFechada">
          <div class="card-body text-center">
            <h1>This thread is closed!</h1>
          </div>
        </div>
        <br />
        <div class="news-title">
          <h3>Answers</h3>
        </div>

        <div v-if="answers.length > 0">
          <!-- Respostas e Comentários -->
          <div class="card" v-for="(ans, cont) in answers" v-bind:key="cont">
            <div class="card-body">
              <div class="row">
                <div class="col-md-2">
                  <img
                    v-bind:src="ans.userInfo.photo"
                    class="img img-rounded img-fluid"
                  />
                  <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                </div>
                <div class="col-md-10">
                  <p>
                    <a
                      class="float-left"
                      href="https://maniruzzaman-akash.blogspot.com/p/contact.html"
                    >
                      <strong>{{ ans.userInfo.name }}</strong>
                    </a>
                  </p>
                  <div class="clearfix"></div>
                  <p>{{ ans.answer }}</p>
                  <p>
                    <a
                      v-show="!threadFechada"
                      v-bind:id="ans.id + '_anchor'"
                      class="float-right btn btn-outline-primary ml-2"
                      v-on:click="commentAnswer(ans.id, ans.userInfo.id)"
                    >
                      <i class="fa fa-reply" v-bind:id="ans.id + '_icon'"></i>
                    </a>
                    <a
                      class="float-right btn text-white btn-success ml-2"
                      v-on:click="upvoteAns(ans.id)"
                    >
                      <i class="fas fa-thumbs-up"
                        >| {{ ans.upvotes == 0 ? "" : ans.upvotes }}</i
                      >
                    </a>
                    <a
                      v-bind:id="ans.id + '_hide'"
                      class="float-right btn text-white btn-danger"
                      v-on:click="hideComments($event, ans.id)"
                    >
                      <i class="fas fa-caret-up">|</i>
                      <i class="fas fa-sort-down"></i>
                      <!-- <i v-bind:id="ans.id" v-bind:class="arrowCommentDirection"></i> -->
                    </a>
                  </p>
                </div>
              </div>
              <div v-bind:class="ans.id">
                <div v-bind:id="ans.id + '_wrapper'" class="theWrapper">
                  <div
                    class="card card-inner"
                    v-for="com in comments"
                    v-bind:key="com.id"
                    v-if="com.idAnswer == ans.id"
                  >
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-2">
                          <img src class="img img-rounded img-fluid" />
                          <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                        </div>
                        <div class="col-md-10">
                          <p>
                            <a href>
                              <strong>{{ com.userInfo.name }}</strong>
                            </a>
                          </p>
                          <p>{{ com.text }}</p>
                          <p>
                            <!-- <a class="float-right btn btn-outline-primary ml-2">
                            <i class="fa fa-reply"></i>
                            </a>-->
                            <a
                              class="float-right btn text-white btn-success ml-2"
                              v-on:click="upvoteComment(com.id, ans.id)"
                            >
                              <i class="fas fa-thumbs-up"
                                >|
                                {{
                                  com.upvotes == 0 ? "" : parseInt(com.upvotes)
                                }}</i
                              >
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="text-center">There's no answers yet </h1>
        </div>
        <div class="row" v-show="isLoggedIn == true && !threadFechada == true">
          <div class="col-md-12 text-left">
            <h4>Answer</h4>
            <textarea
              name
              id="resposta"
              cols="30"
              rows="10"
              style="width: inherit"
              placeholder="Type your answer"
              v-model="answerText"
            ></textarea>

            <div class="text-right" style="margin-bottom: 15px;">
              <button class="btn btn-outline-success" v-on:click="addAnswer">
                Answer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <h3 style="padding: 0 0 0 5; padding-inline-start: 20px">
          Topics For You
        </h3>
        <!-- <related></related> -->
      </div>
    </div>
    <dialog id="idDialog" ref="myDialogcomment">
      <form method="dialog" v-on:submit="comentar()">
        <h4>
          Answer to
          <span
            style="font-weight: bold; font-family: verdana; color: rgb(255, 65, 99);"
            >{{ replyUser }}</span
          >
        </h4>
        <textarea
          placeholder="Comment..."
          name
          id="comentario"
          v-model="commentToAnswer"
        ></textarea>
        <div class="col-md-12 text-right">
          <button class="btn btn-outline-success bg-dark" type="submit">
            Answer
          </button>
          <button
            class="btn btn-outline-success bg-dark"
            type="button"
            @click="closeDialog()"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script>
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";
// import Related from "@/components/Related.vue";
import $ from "jquery";
import cookie from "cookie";

export default {
  components: {
    // Related
  },
  data() {
    return {
      threadF: null,
      answersF: null,
      commentsF: [],
      answerText: "" //TExto para a resposta
    };
  },
  created() {
    /**
     * TEnho que ir buscar as:
     * 1 thread
     * as respostas,
     * os comments,
     * usar o user info em cada uma delas
     */
    console.log(this.$route.params.threadid);
    /** Estas variáveis têm que estar fora da
     * async function, porque dentro desta
     * o (this) é undefined
     */
    let id = this.$route.params.threadid;
    let ip = this.$store.getters.getIp;
    /** Depois fazer um return de um objeto  */
    /** get Thread */
    this.$http.get(`http://${ip}/data-api/threads/${id}`).then(res => {
      console.log();
      this.threadF = res.data;
      this.$store.dispatch("users/set_last_thread", res.data.tags);
    });

    this.$http.get(`http://${ip}/data-api/threads/${id}/answers`).then(res => {
      this.answersF = res.data;
      for (let i = 0; i < this.answersF.length; i++) {
        console.log(
          this.answersF[i],
          "Answer dentro do ciclo for para os comments"
        );
        this.$http
          .get(
            `http://${ip}/data-api/threads/${id}/answers/${
              this.answersF[i].id
            }/comments`
          )
          .then(res => {
            for (let k = 0; k < res.data.length; k++) {
              this.commentsF.push(res.data[k]);
            }
            console.log(this.commentsF, "commentários");
          });
      }
    });
  },
  computed: {
    /** é estas computed's que devolvem a informação que
     * se foi buscar à api na created().
     */
    thread() {
      console.log(this.threadF, "THREAD!!!!!!!");
      return this.threadF || { userInfo: {} };
    },
    answers() {
      console.log(this.answersF, "ANSWER|!!!!!!");
      return this.answersF || [{ userInfo: {} }];
    },
    comments() {
      console.log(this.commentsF, "COMMENTS!!!!!!!");
      return this.commentsF || [{ userInfo: {} }];
    },
    isLoggedIn() {
      /** Computed que verifica se o user está logado e mostra os respetivos div's */
      if (this.$store.state.users.loggedUser != null) return true;
      return false;
    },
    threadFechada() {
      if (this.threadF != null && this.threadF.closeDate == null) {
        return false;
      }
      return true;
    },
    numberFollowers() {
      if (this.threadF == null) return 0;
      return this.threadF.follow;
    },
    numberUpvotes() {
      if (this.threadF == null) return 0;
      return this.threadF.upvotes;
    }
  },
  methods: {
    /** É preciso estar logado */
    /** Vai ser para tirar e por experiencia sempre
     * o user que vai "gerar" a notificação vai ser sempre o utilizador logado,
     * e quem vai receber a notificação vai ser o autor da thread, answer, ou comment.
     */
    /** Follow/Unfollow */
    seguir() {
      //Como só dá para seguir a thread, usar o threadF.id
      /**
       * Chamada à API para incrementar follow na thread e
       * meter um objecto no array follow do user,
       * também fazer notificação
       */

      if (this.confirmAuth() === true) {
        /** inserir follow no BD then, inserir no user local */
        this.$http({
          url: `http://${this.$store.getters.getIp}/data-api/`
        })
        /** Atribuir experiencia no BD */
        
        /** Criar notificação */

        /** Criar document para o expLog */

      } else {
        this.errorSwal("Tens que estar autenticado para poderes dar follow");
      }
    },
    /** Respostas/Comentários */
    addAnswer() {
      /** Confirmar 1º se a resposta é vazia ou não */
      if (this.answerText == false) {
        // answer vazia
        this.errorSwal("Tens que escrever alguma coisa");
      } else {
        //No fim fazer um Swal a dizer que a resposta foi gravada com sucesso
        /** mas se foir para fazer o swal fazer daqueles que aparece à direita em cima */
      }
    },
    commentAnswer() {},
    replyUser() {},
    commentToAnswer() {},
    /** Upvotes */
    upvoteThread() {
      if (this.confirmAuth() == true) {
        
      }
    },
    upvoteAns() {},
    upvoteComment() {},
    /** Não é preciso estar logado */

    /** Dar toogle aos comentários (dá para usar jQuery)  */
    hideComments(event, ansid) {
      let coms = $(`#${ansid}_wrapper.theWrapper`);
      coms.toggle();
    },
    /** Ir para um determinado user */
    goToUser() {
      console.log(this.threadF.userInfo.id, "USERRRRRRRRR a ir para o perfil");
      this.$router.push({
        name: "viewProfile",
        params: { userid: this.threadF.userInfo.id }
      });
    },
    confirmAuth() {
      //Working
      console.log(this.$store.state.users.loggedUser, "lelels");
      if (this.$store.state.users.loggedUser != null) {
        return true;
      }
      return false;
    },
    /** Funções para dar trigger aos Swals */
    successSwal(msg) {
      Swal({
        text: msg,
        type: "success"
      });
    },
    errorSwal(msg) {
      Swal({
        title: "Ocorreu um erro",
        type: "error",
        text: msg,
        footer: `<a href="/#/login"><strong>Ir para Login/Register</strong></a>` //Decidir se isto é um erro ou não...(kinda que é)
      });
    },
    /** Funções de chamada À API */
    changeUser(user) {
      console.log(user, "USER changeUser()");
      this.$http({
        url: `http://${this.$store.getters.getIp}/data-api/user/${user.id}`,
        data: user
      });
    },
    /**
     * Methods to generate badges
     * - Ranking e Help
     */
    checkBadges() {
      let badges1 = this.$store.state.loggedUser.badges;
      /** Badge Ganho */
      /** retorna o badge que ganhou,
       * caso contrário retorna null ou undefined
       */
      this.$store.dispatch("users/user_badges").then(() => {
        console.log(
          this.$store.state.loggedUser.badges,
          "User badges no then do checkBadges !=!=!=!=!="
        );
        if (this.$store.state.loggedUser.badges.length > badges1.length) {
          return this.$store.state.loggedUser.badges.filter(badge => {
            for (let i = 0; i < badges1.length; i++) {
              if (badges1[i] == badge) return false;
              return true;
            }
          });
        }
      });
    }
  },
  filters: {
    filterDate: function(value) {
      if (!value) return "Sem data";

      let date = value.split("T")[0].split("-");
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
  }
};
</script>

<style>
img {
  width: 100%;
}
@media (max-width: 576px) {
  .news-author {
    float: left !important;
    text-align: left;
    margin-top: 15px;
  }

  .auth-title {
    text-align: left !important;
    margin-top: 5px;
    padding-right: 0;
  }
}
.user-section {
  text-align: right;
  display: inline-block;
}
div.buttons-section {
  text-align: left;
  padding: 0px;
  display: inline-block;
}

.news-likes {
  float: left !important;
  margin-top: 20px;
}
.auth-title {
  text-align: right;
}
div.news-author {
  float: right;
}
.news-title {
  text-align: left;
}
.news-content {
  text-align: left;
}
.news-tags {
  text-align: left;
}
.btn-tag {
  margin-right: 2px;
}
.card-inner {
  margin-left: 4rem;
}
.rank {
  font-weight: bold;
}
.rank:hover {
  color: red;
}
a:hover {
  color: blue;
  text-decoration: none !important;
}
#comentario {
  width: 100%;
  height: 15rem;
  resize: none;
}
div.threadFechada {
  border: 1px solid orange;
  border-radius: 7px;
  font-family: fantasy;
}

.fitWindow {
  height: calc(100vh - 200px);
}
.fitcontainer {
  display: grid;
  grid-template-columns: fit-content(500px) fit-content(300px) 1fr;
}
</style>
