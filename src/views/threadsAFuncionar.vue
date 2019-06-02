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
                      <h2>{{thread.title}}</h2>
                    </div>
                    <div class="news-cats">
                      <ul class="list-unstyled list-inline mb-1">
                        <li class="list-inline-item">
                          <i class="fa fa-folder-o text-danger"></i>
                          <a href="#">
                            <small>{{thread.course}}</small>
                          </a>
                        </li>

                        <li class="list-inline-item">
                          <i class="fa fa-folder-o text-danger"></i>
                          <a href="#">
                            <small>{{thread.date}}</small>
                            <p></p>
                            <!-- Isto e o <p> de cima vão sair, é só para ver o id da thread -->
                          </a>
                        </li>
                      </ul>
                    </div>
                    <hr>

                    <div class="news-content">
                      <p v-html="thread.question"></p>
                    </div>
                    <hr>
                    <div class="news-footer">
                      <div class="news-likes">
                        <button type="button" class="btn btn-outline-secondary">
                          <i class="fa fa-thumbs-o-up text-success"></i>
                          <span class="badge">Upvotes {{thread.upvotes}}</span>
                        </button>
                        <button
                          type="button"
                          style="margin-left: 5px;"
                          class="btn btn-outline-secondary"
                        >
                          <i class="fa fa-thumbs-o-up text-success"></i>
                          <span class="badge">Followers {{numberFollowers()}}</span>
                        </button>
                        <button
                          class="btn btn-primary"
                          style="margin-left: 5px;"
                          v-on:click="seguir"
                        >
                          <span class="badge">
                            <i class="fas fa-heart"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <hr>
                    <div class="news-tags">
                      <h5>Tags</h5>
                      <button
                        type="button"
                        class="btn btn-sm btn-secondary"
                        v-for="(tag, cont) in thread.tags"
                        v-bind:key="cont"
                      >{{tag.text}}</button>
                    </div>
                    <hr>
                    <div class="news-author">
                      <div class="row">
                        <div class="col-md-auto">
                          <a href="#" title>
                            <img
                              v-bind:src="user.foto"
                              alt="Author image"
                              class="rounded-circle"
                              style="width:100px"
                            >
                          </a>
                        </div>
                        <div class="col">
                          <div class="auth-title">
                            <h4 class="author h4">
                              <router-link
                                v-bind:to="{name: 'viewprofile', params: {visiteduserid: user.id}}"
                              >{{user.name}}</router-link>
                            </h4>
                            <ul class="list-unstyled list-inline">
                              <li class="list-inline-item">
                                Rank:
                                <span class="rank">{{user.rank[1]}}</span>
                              </li>
                              <li class="list-inline-item">
                                <a
                                  class="float-right btn text-white btn-success ml-2"
                                  v-on:click="upvoteThread(thread.id)"
                                >
                                  <i
                                    class="fas fa-thumbs-up"
                                  >| {{thread.upvotes == 0 ? '' : thread.upvotes}}</i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card threadFechada" v-show="threadFechada()">
          <div class="card-body text-center">
            <h1>This thread is closed!</h1>
          </div>
        </div>
        <hr class="devilhr">
        <div>
          <!-- Respostas e Comentários -->
          <div class="card" v-for="(ans, cont) in threadAns" v-bind:key="cont">
            <div class="card-body">
              <div class="row">
                <div class="col-md-2">
                  <img v-bind:src="userFoto(ans.idUser)" class="img img-rounded img-fluid">
                  <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                </div>
                <div class="col-md-10">
                  <p>
                    <a
                      class="float-left"
                      href="https://maniruzzaman-akash.blogspot.com/p/contact.html"
                    >
                      <strong>{{userNome(ans.idUser)}}</strong>
                    </a>
                  </p>
                  <div class="clearfix"></div>
                  <p>{{ans.answer}}</p>
                  <p>
                    <a
                      v-show="!threadFechada()"
                      v-bind:id="ans.id"
                      class="float-right btn btn-outline-primary ml-2"
                      v-on:click="commentAnswer(ans.id, ans.idUser)"
                    >
                      <i class="fa fa-reply" v-bind:id="ans.id"></i>
                    </a>
                    <a
                      class="float-right btn text-white btn-success ml-2"
                      v-on:click="upvoteAns(ans.id)"
                    >
                      <i class="fas fa-thumbs-up">| {{ans.upvotes == 0 ? '' : ans.upvotes}}</i>
                    </a>
                    <a
                      v-bind:id="ans.id"
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
                <div v-bind:id="ans.id" class="theWrapper">
                  <div
                    class="card card-inner"
                    v-for="com in comments"
                    v-bind:key="com.id"
                    v-if="com.idAnswer == ans.id"
                  >
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-2">
                          <img src class="img img-rounded img-fluid">
                          <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                        </div>
                        <div class="col-md-10">
                          <p>
                            <a href>
                              <strong>{{userNome(com.idUser)}}</strong>
                            </a>
                          </p>
                          <p>{{com.text}}</p>
                          <p>
                            <!-- <a class="float-right btn btn-outline-primary ml-2">
                            <i class="fa fa-reply"></i>
                            </a>-->
                            <a
                              class="float-right btn text-white btn-success ml-2"
                              v-on:click="upvoteComment(com.id, ans.id)"
                            >
                              <i
                                class="fas fa-thumbs-up"
                              >| {{com.upvotes == 0 ? '' : parseInt(com.upvotes)}}</i>
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
        <div class="row" v-show="showAnswerDiv == true && !threadFechada()==true">
          <div class="col-md-12 text-left">
            <h4>Answer</h4>
            <textarea
              name
              id="resposta"
              cols="30"
              rows="10"
              style="width: inherit"
              placeholder="Type your answer"
              v-model="textoResposta"
            ></textarea>

            <div class="text-right" style="margin-bottom: 15px;">
              <button class="btn btn-outline-success" v-on:click="adicionarResposta">Answer</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <h3 style="padding: 0 0 0 5; padding-inline-start: 20px">Topics For You</h3>
        <related></related>
      </div>
    </div>
    <dialog id="idDialog" ref="myDialogcomment">
      <form method="dialog" v-on:submit="comentar()">
        <h4>
          Answer to
          <span
            style="font-weight: bold; font-family: verdana; color: rgb(255, 65, 99);"
          >{{replyUser}}</span>
        </h4>
        <textarea placeholder="Comment..." name id="comentario" v-model="commentToAnswer"></textarea>
        <div class="col-md-12 text-right">
          <button class="btn btn-outline-success bg-dark" type="submit">Answer</button>
          <button
            class="btn btn-outline-success bg-dark"
            type="button"
            @click="closeDialog()"
          >Cancel</button>
        </div>
      </form>
    </dialog>
  </div>
</template>
   <!-- <span class="float-right">
                      <i class="text-warning fa fa-star"></i>
                    </span>
                    <span class="float-right">
                      <i class="text-warning fa fa-star"></i>
                    </span>
                    <span class="float-right">
                      <i class="text-warning fa fa-star"></i>
                    </span>
                    <span class="float-right">
                      <i class="text-warning fa fa-star"></i>
                    </span> Estrelas -->
<script>
window.addEventListener("click", contarClicks);
function contarClicks(nClicks) {}
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";
import Related from "@/components/Related.vue";
export default {
  components: {
    Related
  },
  data() {
    return {
      thread: this.$store.getters.getThreads.filter(thread => {
        let threadid = this.$route.params.threadid;

        // console.log(thread, threadid);
        if (thread.id == parseInt(threadid)) {
          // console.log("atatatatatatatatat");
          return true;
        }
      })[0],
      user: null,
      answers: this.$store.getters.getAnswers,
      comments: this.$store.getters.getComments,
      thisAnswers: [],
      thisComments: [],
      textoResposta: "",
      showAnswerDiv: this.$store.getters.getAuth,
      loginUser: null,
      arrowCommentDirection: "fas fa-sort-down",
      open: false,
      commentToAnswer: "",
      ansIdToComment: 0,
      thisThreadFollows: null,
      replyUser: null // Nome do User a que se vai comentar a resposta
    };
  },
  created() {
    this.showAnswerDiv = this.$store.getters.getAuth;
    this.textoResposta = null;
    this.comments = this.$store.getters.getComments;

    // console.log(threadid);
    // this.thread =
    console.log(this.thread);

    this.thisThreadFollows = this.numberFollowers();
    this.user = this.$store.getters.getUsers.filter(user => {
      console.log(this.thread.userInfo);
      this.thread.userInfo.userid == user.id;
    })[0];
    // console.log("OLAAAA");
    // console.log(this.thread);
    // console.log(this.user);
    let threadid = this.$route.params.threadid;
    if (!this.$store.getters.getAuth) {
      localStorage.setItem("setLastThread", threadid);
    }

    if (this.$store.getters.getAuth) {
      this.loginUser = this.$store.getters.getUsers.filter(
        us => us.id == this.$store.getters.getloginID
      )[0];
    }
  },
  computed: {
    threadAns() {
      this.answers = this.$store.getters.getAnswers;
      this.thisAnswers = this.answers.filter(
        ans => ans.idThread == this.thread.id
      );
      return this.thisAnswers;
    },
    ansComments() {
      this.thisComments = this.comments.filter(com => {
        for (let ans of this.thisAnswers) {
          if (com.idAnswer == ans.id) {
            return true;
          }
        }
        // console.log(this.thisComments);
        return false;
      });
    }
  },
  methods: {
    closeDialog() {
      this.$refs.myDialogcomment.close();
    },
    thisThread() {
      let threadid = this.$route.params.threadid;
      console.log(threadid);
      return this.$store.getters.getThreads.filter(thread => {
        // console.log(thread, threadid);
        if (thread.id == parseInt(threadid)) {
          console.log("atatatatatatatatat");
          return true;
        }
      })[0];
    },
    numberFollowers() {
      return this.$store.getters.getUsers.filter(us => {
        // let passou = true;
        // console.log(this.thread);
        for (let fol of us.follow) {
          // console.log(fol, this.thread.id);
          if (fol == this.thread.id) return true;
        }
        // console.log(passou);
      }).length;
    },
    hideComments(evt, ansid) {
      let caixaComentarios = document.getElementsByClassName("theWrapper");
      console.log(caixaComentarios, ansid);

      let index = null;
      for (let i = 0; i < caixaComentarios.length; i++) {
        if (caixaComentarios[i].id == ansid) index = i;
      }
      if (caixaComentarios[index].style.display == "none") {
        caixaComentarios[index].style.display = "block";
      } else {
        caixaComentarios[index].style.display = "none";
      }
      console.log(caixaComentarios[index].style.display);
    },
    commentAnswer(ansid, idUser) {
      if (this.$store.getters.getAuth) {
        this.$refs.myDialogcomment.showModal();
        this.ansIdToComment = ansid;
        this.replyUser = this.$store.getters.getUsers.find(
          us => us.id == idUser
        ).name;
      } else {
        Swal({
          text: "First you need to login!",
          type: "error",
          footer:
            '<a href="#/login" type="button" class="btn btn-outline-dark">Register / Login</a>'
        });
      }
    },
    comentar() {
      console.log(this.commentToAnswer.toString());
      //id(tenho), idAnswer(this.ansIdToComment), idUser(tenho), text(tenho), upvotes(tenho)
      if (this.commentToAnswer != "") {
        let comentarios = this.$store.getters.getComments;
        let nivelAtual = this.loginUser.getLevel();
        let comment = {
          id:
            comentarios.length == 0
              ? 1
              : comentarios[comentarios.length - 1].id + 1,
          idAnswer: this.ansIdToComment,
          idUser: this.loginUser.id,
          text: this.commentToAnswer,
          upvotes: 0
        };
        this.$store.dispatch("add_comment", comment);
        let nivelDepois = this.loginUser.getLevel();
        /* Notiticação */
        this.addNotificacionToStore(
          this.user.id,
          this.loginUser.id,
          "comentou uma resposta"
        );
        if (
          nivelAtual != nivelDepois &&
          nivelDepois <= this.$store.getters.getBadges.length
        ) {
          Swal({
            title: "Boa, Ganhaste mais um Badge",
            type: "success",
            text: "Acede ao teu perfil para o veres!!!",
            showConfirmButton: false,
            position: "top-end",
            timer: 1500
          });
        }
      } else {
        Swal("You didn't type anything", "Type something", "question");
      }
      this.commentToAnswer = "";
    },
    userFoto(iduser) {
      return this.$store.getters.getUsers.filter(us => us.id == iduser)[0].foto;
    },
    userNome(iduser) {
      return this.$store.getters.getUsers.filter(us => us.id == iduser)[0].name;
    },
    adicionarResposta() {
      //Adicionar experiencia ao user
      console.log(this.textoResposta, "alalal");
      let nivelAtual = this.loginUser.getLevel();
      if (this.textoResposta != "" && this.textoResposta != null) {
        this.addNotificacionToStore(
          this.user.id,
          this.loginUser.id,
          "respondeu à tua thread"
        );
        console.log(this.$store.getters.getloginID);
        let answer = {
          id:
            this.answers.length > 0
              ? this.answers[this.answers.length - 1].id + 1
              : 1,
          idThread: this.thread.id,
          idUser: this.$store.getters.getloginID,
          answer: this.textoResposta,
          upvotes: 0
        };
        this.$store.dispatch("add_answer", answer);
        console.log(this.textoResposta);
        let nivelDepois = this.loginUser.getLevel();
        if (
          nivelAtual != nivelDepois &&
          nivelDepois <= this.$store.getters.getBadges.length
        ) {
          Swal({
            title: "Boa, Ganhaste mais um Badge",
            type: "success",
            text: "Acede ao teu perfil para o veres!!!",
            showConfirmButton: false,
            position: "top-end",
            timer: 1500
          });
        }
      } else {
        Swal({
          title: "Não podes responder nada",
          type: "error",
          text: "Escreve alguma coisa para responder"
        });
      }
    },
    upvoteAns(id) {
      let guardar = true;
      console.log(this.thread.id, id, null);

      for (let us of this.$store.getters.getUsers) {
        if (us.upvotes.length > 0) {
          for (let ups of us.upvotes) {
            if (ups.idanswer != undefined) {
              console.log(ups);
              if (
                ups.idthread == this.thread.id &&
                ups.idanswer == id &&
                ups.idcomment == null
              )
                guardar = false;
            }
          }
        }
      }

      if (this.$store.getters.getAuth) {
        if (guardar) {
          let up = {
            // Isto vai ser o que vai para o array dos upvotes do user
            // iduser: this.$store.getters.getloginID,
            idthread: this.thread.id,
            idanswer: id,
            idcomment: null
          };

          let nivelAtual = this.loginUser.getLevel();
          console.log(nivelAtual);

          /* Notidicação */
          this.addNotificacionToStore(
            this.user.id,
            this.loginUser.id,
            "uvpvote na resposta"
          );

          this.$store.dispatch("add_upvote_user", {
            userid: this.$store.getters.getloginID,
            up: up
          });
          this.$store.dispatch("add_upvote_answer", id);
          let nivelDepois = this.loginUser.getLevel();
          if (
            nivelAtual != nivelDepois &&
            nivelDepois <= this.$store.getters.getBadges.length
          ) {
            Swal({
              title: "Boa, Ganhaste mais um Badge",
              type: "success",
              text: "Acede ao teu perfil para o veres!!!",
              showConfirmButton: false,
              position: "top-end",
              timer: 1500
            });
          }
        } else {
          Swal("Ja inseriste", "Ja deste upvote", "error");
        }
      } else {
        Swal({
          text: "First you need to login!",
          type: "error",
          footer:
            '<a href="#/login" type="button" class="btn btn-outline-dark">Registar / Login</a>'
        });
      }
    },
    upvoteComment(id, ansid) {
      //Fazer o upvote, este é só para comentários

      let guardar = true;

      for (let us of this.$store.getters.getUsers) {
        if (us.upvotes.length > 0) {
          for (let ups of us.upvotes) {
            if (ups.idcomment != undefined && ups.idanswer != undefined) {
              // console.log(us.upvotes);
              // console.log(ups.idthread, ups.idanswer, ups.idcomment);
              // console.log(this.thread.id, ansid, id);
              if (
                ups.idthread == this.thread.id &&
                ups.idanswer == ansid &&
                ups.idcomment == id
              ) {
                guardar = false;
              }
            }
          }
        }
      }
      if (this.$store.getters.getAuth) {
        if (guardar) {
          let up = {
            idthread: this.thread.id,
            idanswer: ansid,
            idcomment: id
          };
          let nivelAtual = this.loginUser.getLevel();

          /* Notidicação */
          this.addNotificacionToStore(
            this.user.id,
            this.loginUser.id,
            "upvote num comentário"
          );
          this.$store.dispatch("add_upvote_comment", id);
          this.$store.dispatch("add_upvote_user", {
            up: up,
            userid: this.$store.getters.getloginID
          });

          let nivelDepois = this.loginUser.getLevel();
          if (
            nivelAtual != nivelDepois &&
            this.$store.getters.getBadges.length <= nivelDepois
          ) {
            Swal({
              title: "Boa, Ganhaste mais um Badge",
              type: "success",
              text: "Acede ao teu perfil para o veres!!!",
              showConfirmButton: false,
              position: "top-end",
              timer: 1500
            });
          }
        } else {
          Swal("Already done", "You already upvoted", "error");
        }
      } else {
        Swal({
          text: "First you need to login!",
          type: "error",
          footer:
            '<a href="#/login" type="button" class="btn btn-outline-dark">Registar / Login</a>'
        });
      }
    },
    upvoteThread() {
      let guardar = true;

      // console.log(this.$store.getters.getUsers);
      for (let us of this.$store.getters.getUsers) {
        console.log(us);
        if (us.upvotes.length > 0) {
          for (let ups of us.upvotes) {
            if (
              ups.idthread == this.thread.id &&
              ups.idanswer == null &&
              ups.idcomment == null
            )
              guardar = false;
          }
        }
      }
      if (this.$store.getters.getAuth) {
        if (guardar) {
          /* Notidicação */
          this.addNotificacionToStore(
            this.user.id,
            this.loginUser.id,
            "deu upvote à tua thread"
          );

          let up = {
            idthread: this.thread.id,
            idAnswer: null,
            idcomment: null
          };

          let nivelAtual = this.loginUser.getLevel();

          console.log(this.user.upvotes);
          this.$store.dispatch("add_upvote_thread", this.thread.id);
          this.$store.dispatch("add_upvote_user", {
            userid: this.user.id,
            up: up
          });

          let nivelDepois = this.loginUser.getLevel();
          if (
            nivelAtual != nivelDepois &&
            nivelDepois <= this.$store.getters.getBadges.length
          ) {
            Swal({
              title: "Boa, Ganhaste mais um Badge",
              type: "success",
              text: "Acede ao teu perfil para o veres!!!",
              showConfirmButton: false,
              position: "top-end",
              timer: 1500
            });
          }
        } else {
          Swal("Already done", "You already upvoted", "error");
        }
      } else {
        Swal({
          text: "First you need to login!",
          type: "error",
          footer:
            '<a href="#/login" type="button" class="btn btn-outline-dark">Registar / Login</a>'
        });
      }
    },
    className(id) {
      return { id: true };
    },
    seguir() {
      let seguir = true;
      console.log(this.loginUser);
      if (this.loginUser != null) {
        for (let fol of this.loginUser.follow) {
          if (fol == this.thread.id) {
            seguir = false;
          }
        }

        if (seguir) {
          Swal("Boa", "", "success");

          /* Notidicação */
          this.addNotificacionToStore(
            this.user.id,
            this.loginUser.id,
            "seguiu a tua thread"
          );
          //Atualizar estado
          this.$store.dispatch("add_user_follow", {
            threadid: this.thread.id,
            userid: this.loginUser.id
          });
          this.thisThreadFollows = this.loginUser.follow.length;
        } else {
          Swal(
            "You already followed this thread",
            "Check more threads",
            "error"
          );
        }
      } else {
        Swal({
          text: "First you need to login!",
          type: "error",
          footer:
            '<a href="#/login" type="button" class="btn btn-outline-dark">Register / Login</a>'
        });
      }
    },

    addNotificacionToStore(
      iduser,
      /* parametros para a notificação */ userFirst,
      texto,
      answer = false,
      idans = null
    ) {
      //Fazer o id da notificação aqui... tenho os users e tenho....
      let usernotilength = this.$store.getters.getUsers.filter(
        us => us.id == iduser
      )[0].notifications.length;
      let idnoti = 1;
      if (usernotilength > 0) {
        idnoti =
          this.$store.getters.getUsers.filter(us => us.id == iduser)[0]
            .notifications[usernotilength - 1].id + 1;
      }
      let idAtacar = null;
      if (answer) idAtacar = idAns;
      else idAtacar = this.thread.id;
      let noti = {
        id: idnoti,
        idThread: idAtacar,
        idUserFirst: userFirst,
        text: texto
      };

      let obj = {
        idUser: iduser,
        notification: noti,
        answer: answer
      };

      this.$store.dispatch("add_notification", obj);
    },
    threadFechada() {
      // if (typeof this.thread.closeDate == "object") {
      //   if (this.thread == null) return false;
      // }
      console.log(this.thread.closeDate);
      // if (typeof this.thread.closeDate == "string") {
      if (this.thread.closeDate === "") return false;
      else return true;
      // }
    }
  }
};
</script>

<style>
img {
  width: 100%;
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
</style>