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
                            <small>
                              <strong>asked</strong>
                              {{ thread.date | filterDate }}
                            </small>
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
                    <div class="news-tags">
                      <h5>Tags</h5>
                      <button
                        type="button"
                        class="btn btn-sm btn-secondary btn-tag"
                        v-for="(tag, cont) in thread.tags"
                        v-bind:key="cont"
                      >{{ tag.text }}</button>
                    </div>
                    <hr>
                    <div>
                      <div class="news-likes">
                        <span>
                          <a
                            v-bind:class="{'btn': true, 'text-white': true, 'btn-success': thread.upv, 'btn-danger': !thread.upv}"
                            v-on:click="upvoteThread(thread.upv)"
                          >
                            <i
                              v-bind:class="{'fas fa-thumbs-up': thread.upv, 'fas fa-thumbs-down': !thread.upv}"
                            >
                              {{
                              thread.upvotes == 0 ? "" : thread.upvotes
                              }}
                            </i>
                            {{thread.upv ? "Upvote":"Downvote"}}
                          </a>
                        </span>
                        <!-- {{ numberUpvotes }} -->
                        <button
                          v-bind:class="{'btn btn-primary': !aSeguir(), 'btn btn-secondary': aSeguir()}"
                          style="margin-left: 5px;"
                          v-on:click="seguir(thread.unfollow)"
                        >
                          <span class="badge">
                            <i class="fas fa-heart"></i>
                            {{ numberFollowers }}
                          </span>
                          {{!aSeguir() ? "Follow" : "Unfollow"}}
                        </button>
                      </div>

                      <div class="row news-author">
                        <div class="col-md-auto">
                          <a href="#" title>
                            <img
                              v-bind:src="thread.userInfo.photo"
                              alt="Author image"
                              class="rounded-circle"
                              style="width:100px"
                            >
                          </a>
                        </div>
                        <div class="col">
                          <div class="auth-title">
                            <h4 class="author h4">
                              <span v-on:click="goToUser()">
                                {{
                                thread.userInfo.name
                                }}
                              </span>
                            </h4>
                            <ul class="list-unstyled list-inline">
                              <li class="list-inline-item">
                                Rank:
                                <span class="rank">
                                  {{
                                  thread.userInfo.rank
                                  }}
                                </span>
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
        <br>
        <div class="news-title">
          <h3>Answers</h3>
        </div>

        <div v-if="answers.length > 0">
          <!-- Respostas e Comentários -->
          <div class="card" v-for="(ans, cont) in answers" v-bind:key="cont">
            <div class="card-body">
              <div class="row">
                <div class="col-md-2">
                  <img v-bind:src="ans.userInfo.photo" class="img img-rounded img-fluid">
                  <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                </div>
                <div class="col-md-10">
                  <p>
                    <router-link
                      class="float-left"
                      :to="{name: 'viewProfile', params: { userid: ans.userInfo.userid}}"
                    >
                      <strong>{{ ans.userInfo.name }}</strong>
                    </router-link>
                  </p>
                  <div class="clearfix"></div>
                  <p>{{ ans.answer }}</p>
                  <p>
                    <a
                      v-show="!threadFechada"
                      v-bind:id="ans.id + '_anchor'"
                      class="float-right btn btn-outline-primary ml-2"
                      v-on:click="openModal(ans)"
                    >
                      <i class="fa fa-reply" v-bind:id="ans.id + '_icon'"></i>
                    </a>
                    <a
                      class="float-right btn text-white btn-success ml-2"
                      v-on:click="upvoteAns(ans, $event)"
                    >
                      <i
                        v-bind:class="{'fas': true, 'fa-thumbs-up': !ans.upv, 'fa-thumbs-down': ans.upv}"
                      >{{ ans.upvotes == 0 ? "" : ans.upvotes }}</i>
                    </a>
                    <a
                      v-bind:id="ans.id + '_hide'"
                      class="float-right btn text-white btn-primary"
                      v-on:click="hideComments($event, ans.id)"
                    >
                      <i class="fas fa-caret-up" style="padding-right: 1px"></i> |
                      <i class="fas fa-sort-down" style="padding-left: 1px"></i>
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
                          <img src class="img img-rounded img-fluid">
                          <!-- <p class="text-secondary text-center">15 Minutes Ago</p> -->
                        </div>
                        <div class="col-md-10">
                          <p>
                            <a href>
                              <router-link
                                class="float-left"
                                :to="{name: 'viewProfile', params: { userid: com.userInfo.userid}}"
                              >{{ com.userInfo.name }}</router-link>
                            </a>
                          </p>
                          <p>{{ com.comment }}</p>
                          <p>
                            <!-- <a class="float-right btn btn-outline-primary ml-2">
                            <i class="fa fa-reply"></i>
                            </a>-->
                            <a
                              v-bind:class="{'float-right': true, 'btn': true, 'text-white':true, 'btn-success':verifyUpv(com), 'ml-2': true, 'btn-danger': !verifyUpv(com)}"
                              v-on:click="upvoteComment(com, ans, $event)"
                            >
                              <i
                                v-bind:class="{'fas fa-thumbs-up': verifyUpv(com), 'fas fa-thumbs-down': !verifyUpv(com)}"
                              >
                                {{
                                com.upvotes == 0 ? "" : parseInt(com.upvotes)
                                }}
                              </i>
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
          <h1 class="text-center">There's no answers yet</h1>
        </div>
        <div class="row" v-show="!threadFechada == true">
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
              <button class="btn btn-outline-success" v-on:click="addAnswer">Answer</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <h3 style="padding: 0 0 0 5; padding-inline-start: 20px">Topics For You</h3>
        <!-- <related></related> -->
      </div>
    </div>
    <dialog id="idDialog" ref="myDialogcomment">
      <form method="dialog" v-on:submit="comentar()">
        <h4>
          Answer to
          <span
            style="font-weight: bold; font-family: verdana; color: rgb(255, 65, 99);"
          >{{ replyUser }}</span>
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
      answerText: "", //TExto para a resposta
      commentToAnswer: "",
      targetAns: 0, // Facilitar o comment Answer
      replyUser: ""
    };
  },
  created() {
    let id = this.$route.params.threadid;
    let ip = this.$store.getters.getIp;
    /** Depois fazer um return de um objeto  */
    /** get Thread */
    this.$http.get(`http://${ip}/data-api/threads/${id}`).then(res => {
      console.log();
      this.threadF = res.data;
      this.$store.dispatch("users/set_last_thread", res.data.tags);
    });
    /** Answers */
    this.$http.get(`http://${ip}/data-api/threads/${id}/answers`).then(res => {
      this.answersF = res.data;
      for (let i = 0; i < this.answersF.length; i++) {
        console.log(
          this.answersF[i],
          "Answer dentro do ciclo for para os comments"
        );
        /** Comments */
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
      se foi buscar à api na created(). */
    thread() {
      console.log(this.threadF, "THREAD!!!!!!!");
      if (this.threadF != null && this.$store.state.users.loggedUser != null) {
        this.threadF.unfollow = false;
        this.threadF.upv = true;
        for (let fol of this.$store.state.users.loggedUser.follow) {
          if (fol == this.threadF.id) {
            this.threadF.unfollow = true;
            console.log(this.threadF.unfollow, "unflwlwlalelele");
          }
        }
        for (let upv of this.$store.state.users.loggedUser.upvotes) {
          if (upv.type == "thread" && upv.targetId == this.threadF.id)
            this.threadF.upv = false;
        }
      }
      return this.threadF || { userInfo: {} };
    },
    answers() {
      console.log(this.answersF, "ANSWER|!!!!!!");
      if (
        this.answersF != null &&
        this.$store.state.users.loggedUsers != null
      ) {
        for (let i = 0; i < this.answersF.length; i++) {
          this.answersF[i].upv = true;
          for (let upv of this.$store.state.users.loggedUser.upvotes) {
            if (upv.type == "answer" && upv.targetId == this.answersF[i].id)
              this.answersF[i].upv = false;
          }
        }
      }
      return this.answersF || [{ userInfo: {} }];
    },
    comments() {
      console.log(this.commentsF, "COMMENTS!!!!!!!");
      if (
        this.commentsF != null &&
        this.$store.state.users.loggedUsers != null
      ) {
        for (let com of this.commentsF) {
          com.upv = true;

          for (let upv of this.$store.state.users.loggedUser.upvotes) {
            if (upv.type == "comment" && upv.targetId == com.id) {
              com.upv = false;
              console.log("DOWNVTE::::::::");
            }
          }
        }
      }
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
    verifyUpv(comment) {
      if (this.$store.state.users.loggedUser != null) {
        console.log(comment);

        let upv = true;
        for (let upv of this.$store.state.users.loggedUser.upvotes) {
          if (upv.type == "comment") console.log(upv);

          if (upv.type == "comment" && upv.targetId == comment.id) {
            upv = false;
          }
        }
        console.log(upv, "Porque não funcionas.....");
        return upv;
      }
      return true
    },
    verifyAnsUpv(answer) {},
    fol_unfol() {
      //Não está a ser usado
      if (this.$store.state.users.loggedUser == null) return true;
      if (this.threadF != null && this.threadF.unfollow == true) return true;
    },
    aSeguir() {
      if (
        this.threadF != null &&
        this.threadF.unfollow == true &&
        this.$store.state.users.loggedUser != null
      )
        return true;
      return false;
    },
    /** Follow/Unfollow */
    seguir(unfollow) {
      if (this.confirmAuth() === true) {
        if (unfollow === false) {
          let main = {
            /* Estas variáveis têm que estar fora da
             * async function, porque dentro desta
             * o (this) é undefined
             */
            ip: this.$store.getters.getIp,
            lg: this.$store.state.users.loggedUser,
            th: this.threadF,
            author: this.threadF.userInfo,
            cookie: this.getLogCookie(),
            http: this.$http,
            expValue: 5,
            notiClass: this.$store.state.users.notificationClass
          };
          console.log(main);

          async function follow() {
            try {
              // console.log(this.threadF, "alalalalala");
              /** introduzir o follow no loggedUser */
              let successFollow = await main
                .http({
                  //Follow para o user que o faz
                  url: `http://${main.ip}/data-api/users/addfollow/${
                    main.lg.id
                  }`,
                  method: "put",
                  data: {
                    follow: main.th.id
                  }
                })
                .then(res => res.data.success);

              /** Incrementar os follows na thread */
              let successThread = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/follow`,
                  method: "put"
                })
                .then(res => res.data.success);

              /** Incrementar experiencia no autor*/
              let successExp = await main
                .http({
                  url: `http://${main.ip}/data-api/users/addexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  data: {
                    exp: main.expValue
                  },
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success);

              /** Enviar notificação, podia se confirmar se a experriencia foi mesmo adicionada com um ifzito */
              await main
                .http({
                  url: `http://${main.ip}/data-api/users/addnotification/${
                    main.author.userid
                  }`,
                  method: "put",
                  data: {
                    notification: new main.notiClass(
                      main.th.id,
                      "Seguiu a sua Thread",
                      main.lg.name,
                      main.lg.id
                    )
                  },
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res =>
                  console.log(res.data, "Notificação adicionada com sucesso")
                );
              /** Enviar ExpLog */
              await main.http({
                url: `http://${main.ip}/data-api/explog/add`,
                method: "post",
                headers: {
                  "x-access-token": main.cookie
                },
                data: {
                  expLog: {
                    targetId: main.th.id,
                    targetType: "thread",
                    logType: "follow",
                    expValue: main.expValue,
                    expUserInfo: {
                      userId: main.author.userid,
                      name: main.author.name,
                      rank: main.author.rank
                    },
                    receiverUserInfo: {
                      userId: main.lg.id,
                      name: main.lg.name,
                      rank: main.lg.rank.trueRank
                    }
                  }
                }
              });

              // let
              return {
                insertFollowLg: successFollow,
                incrementThread: successThread,
                incrementExp: successExp
              };
            } catch (err) {
              console.log(err, "Erro apanhado dentro do 1º catch !!!!!!!!");
            }
          }
          follow().then(res => {
            /** Atualizar aqui os valores locais,
             * porque significa que não houve erros, penso eu de que
             * UPDATE:
             * Funciona fixe, mas é melhor confirmar um de cada vez,
             * ou só se todos os campos forem true é que se atualiza localmente,
             * - Acho melhor como está....
             */
            console.log(res);
            if (res.insertFollowLg == true) {
              console.log("biba caralho");
              this.$store.commit("users/addFollow", this.threadF.id);
            }
            if (res.incrementThread === true) {
              console.log("tamo jiunti");
              this.threadF.follow++;
            }
            if (res.incrementExp === true) {
              console.log("experiencia adicionada");
            }
          });
        } else if (unfollow === true) {
          /** REmover unfollow */
          let main = {
            /* Estas variáveis têm que estar fora da
             * async function, porque dentro desta
             * o (this) é undefined
             */
            ip: this.$store.getters.getIp,
            lg: this.$store.state.users.loggedUser,
            th: this.threadF,
            author: this.threadF.userInfo,
            cookie: this.getLogCookie(),
            http: this.$http,
            expValue: -5,
            notiClass: this.$store.state.users.notificationClass
          };
          async function follow() {
            try {
              let successFollow = await main
                .http({
                  url: `http://${main.ip}/data-api/users/removefollow/${
                    main.lg.id
                  }`,
                  method: "put",
                  data: {
                    follow: main.th.id
                  }
                })
                .then(res => res.data.success);

              let successThread = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/unfollow`,
                  method: "put"
                })
                .then(res => res.data.success);

              let sucessExp = main
                .http({
                  url: `http://${main.ip}/data-api/users/rmexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  data: {
                    exp: Math.abs(main.expValue) // Tem que ir um valor positivo em todos estes pedidos
                  },
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success);

              /**Não gera notificação, só expLog */
              await main.http({
                url: `http://${main.ip}/data-api/explog/add`,
                method: "post",
                headers: {
                  "x-access-token": main.cookie
                },
                data: {
                  expLog: {
                    targetId: main.th.id,
                    targetType: "thread",
                    logType: "unfollow",
                    expValue: main.expValue,
                    expUserInfo: {
                      userId: main.author.userid,
                      name: main.author.name,
                      rank: main.author.rank
                    },
                    receiverUserInfo: {
                      userId: main.lg.id,
                      name: main.lg.name,
                      rank: main.lg.rank.trueRank
                    }
                  }
                }
              });
              return {
                insertFollowLg: successFollow,
                incrementThread: successThread,
                incrementExp: sucessExp
              };
            } catch (err) {
              console.log(err, "Erro apanhado dentro do 1º catch !!!!!!!!");
              throw err; // Para ir para o 2º catch tem que se fazer isto (throw err)
            }
          }
          follow()
            .then(res => {
              /** Atualizar aqui os valores locais,
               * porque significa que não houve erros, penso eu de que
               */
              console.log("akakakakaka");
              console.log(res);
              if (res.insertFollowLg) {
                console.log("biba caralho");
                this.$store.commit("users/removeFollow", this.threadF.id);
              }
              if (res.incrementThread) {
                this.threadF.follow--;
                this.aSeguir();
              }
              if (res.incrementExp) console.log("foi removida Experiencia");
            })
            .catch(err => {
              /** Como a async function devolve uma promise,
               * então deve dar para apanhar as merdas com isto e o then
               * ---- E aqui não se faz nada com os pedidos, porque visto que alguma coisa correu mal,
               * não há nada para atualizar
               */
              this.errorSwal(
                "Foi um erro do nosso lado, pedimos desculpa!",
                true
              );
              console.log(err, "Erro apanhado dentro do 2º catch ##########");
            });
        }
      } else {
        this.errorSwal("Tens que estar autenticado para poderes dar follow");
      }
    },
    /** Upvotes */
    upvoteThread(upvote) {
      if (this.confirmAuth()) {
        console.log(upvote, "Upvote (true/false)");
        if (upvote) {
          console.log("Vais dar UPVOTE!!!!");
          let main = {
            ip: this.$store.getters.getIp,
            lg: this.$store.state.users.loggedUser,
            th: this.threadF,
            author: this.threadF.userInfo,
            cookie: this.getLogCookie(),
            http: this.$http,
            expValue: 10,
            upvote: {
              type: "thread",
              targetId: this.threadF.id
            },
            notiClass: this.$store.state.users.notificationClass
          };
          console.log(main, "main");
          async function upvoteTh() {
            try {
              let successUpv = await main
                .http({
                  url: `http://${main.ip}/data-api/users/addupvote/${
                    main.lg.id
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    upvote: main.upvote
                  }
                })
                .then(res => res.data.success);
              console.log("1");
              let successUpvTh = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/upvote`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success)
                .catch(err => false);
              console.log("2");
              let addExp = await main
                .http({
                  url: `http://${main.ip}/data-api/users/addexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    exp: main.expValue
                  }
                })
                .then(res => res.data.success);
              console.log("3");
              /** notificações */
              let noti = new main.notiClass(
                main.th.id,
                "deu upvote à sua thread",
                main.lg.name,
                main.lg.id
              );
              console.log(noti, "NOTIFICAÇAAAAAAAAAAAO");
              await main
                .http({
                  url: `http://${main.ip}/data-api/users/addnotification/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    notification: new main.notiClass(
                      main.th.id,
                      "deu upvote à sua thread",
                      main.lg.name,
                      main.lg.id
                    )
                  }
                })
                .then(res =>
                  res.data.success
                    ? console.log(res.data, "Notificação adicionada")
                    : console.log(res.data, "não adicionada")
                );
              console.log("4");
              /** Add ExpLog */
              await main
                .http({
                  url: `http://${main.ip}/data-api/explog/add`,
                  method: "post",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    expLog: {
                      targetId: main.th.id,
                      targetType: "thread",
                      logType: "upvote",
                      expValue: main.expValue,
                      expUserInfo: {
                        userId: main.author.userid,
                        name: main.author.name,
                        rank: main.author.rank
                      },
                      receiverUserInfo: {
                        userId: main.lg.id,
                        name: main.lg.name,
                        rank: main.lg.rank.trueRank
                      }
                    }
                  }
                })
                .then(res => console.log(res.data, "EXPLOG"));
              return {
                insertUpv: successUpv,
                incrementUpvTh: successUpvTh,
                addExp: addExp
              };
            } catch (err) {
              console.log(err, "erro ao dar upvote na thread");
            }
          }

          /** Chamar a função */
          upvoteTh().then(res => {
            console.log(res, "Done!!!!!! (res)");
            if (res.insertUpv === true) {
              /** Mutation */
              this.$store.commit("users/addUpvote", main.upvote);
            }
            if (res.incrementUpvTh === true) {
              this.threadF.upvotes++;
            }
            if (res.addExp === true) {
              console.log("added Exp");
            }
          });
        } else {
          console.log("Vais tirar UPVOTE!!!!");
          let main = {
            ip: this.$store.getters.getIp,
            lg: this.$store.state.users.loggedUser,
            th: this.threadF,
            author: this.threadF.userInfo,
            cookie: this.getLogCookie(),
            http: this.$http,
            expValue: -10, //Não esquecer de fazer math.abs()
            upvote: {
              type: "thread",
              targetId: this.threadF.id
            },
            notiClass: this.$store.state.users.notificationClass
          };
          console.log(main, "main");

          async function removeUpvTh() {
            try {
              let successUpv = await main
                .http({
                  url: `http://${main.ip}/data-api/users/removeupvote/${
                    main.lg.id
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    upvote: main.upvote
                  }
                })
                .then(res => res.data.success);
              console.log("1");
              let removeUpvTh = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/downvote`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success)
                .catch(err => false);
              console.log("2");
              /** REmve experience */
              await main
                .http({
                  url: `http://${main.ip}/data-api/users/rmexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    exp: Math.abs(main.expValue)
                  }
                })
                .then(res => console.log(res.data, "Experiencia removida"));
              console.log("3");
              /** Add Explog */
              await main
                .http({
                  url: `http://${main.ip}/data-api/explog/add`,
                  method: "post",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    expLog: {
                      targetId: main.th.id,
                      targetType: "thread",
                      logType: "downvote",
                      expValue: main.expValue,
                      expUserInfo: {
                        userId: main.author.userid,
                        name: main.author.name,
                        rank: main.author.rank
                      },
                      receiverUserInfo: {
                        userId: main.lg.id,
                        name: main.lg.name,
                        rank: main.lg.rank.trueRank
                      }
                    }
                  }
                })
                .then(res => console.log(res.data, "EXPLOG"));
              return {
                removeUpv: successUpv,
                rmUpvTh: removeUpvTh
              };
            } catch (err) {
              console.log(
                err,
                `Ocorreu um erro ao elimnar o upvote (${
                  main.upvote.targetId
                }) - (${main.upvote.type}) do user`
              );
            }
          }

          removeUpvTh().then(res => {
            if (res.removeUpv === true) {
              this.$store.commit("users/removeUpvote", main.upvote);
            }
            if (res.rmUpvTh === true) {
              this.threadF.upvotes--;
            }
          });
        }
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar upvote");
      }
    },
    upvoteAns(answer, event) {
      console.log(event, "alalall");
      if (this.confirmAuth() == true) {
        let main = {
          ip: this.$store.getters.getIp,
          lg: this.$store.state.users.loggedUser,
          th: this.threadF,
          author: answer.userInfo,
          cookie: this.getLogCookie(),
          http: this.$http,
          expValue: 5, //Não esquecer de fazer math.abs()
          upvote: {
            type: "answer",
            targetId: answer.id
          },
          notiClass: this.$store.state.users.notificationClass
        };
        let upvote = true;
        for (let ans of this.answersF) {
          for (let upv of this.$store.state.users.loggedUser.upvotes) {
            console.log(ans, upv);
            if (upv.type == "answer" && upv.targetId == answer.id)
              upvote = false;
          }
        }
        console.log(answer, upvote);
        if (upvote == true) {
          console.log("Vais dar upvote!!!!");
          async function addUpvote() {
            try {
              let successUpv = await main
                .http({
                  url: `http://${main.ip}/data-api/users/addupvote/${
                    main.lg.id
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    upvote: main.upvote
                  }
                })
                .then(res => res.data.success)
                .catch(err => {
                  // if (err.response.status == 500) {
                  //   document.cookie = `login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
                  //   this.$store.commit("users/unLoggedUser");
                  //   this.$router.push({
                  //     name: "home"
                  //   });
                  // }
                });

              let successUpvAns = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/answers/${answer.id}/upvote`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success);

              /** Experiencia  ao autor */
              await main
                .http({
                  url: `http://${main.ip}/data-api/users/addexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    exp: main.expValue
                  }
                })
                .then(res => console.log("adicionada exp!!!"))
                .catch(err => console.log(err));

              /** Notificação autor da thread(userInfo) e criador,
               * só para o criador da answer.....
               */
              await main
                .http({
                  url: `http://${main.ip}/data-api/users/addnotification/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    notification: new main.notiClass(
                      main.th.id,
                      "deu upvote à sua resposta",
                      main.lg.name,
                      main.lg.id
                    )
                  }
                })
                .then(res =>
                  console.log("notificação autor da thread adicionada")
                )
                .catch(err => console.log(err));
              /** Experience Log */
              await main.http({
                url: `http://${main.ip}/data-api/explog/add`,
                method: "post",
                headers: {
                  "x-access-token": main.cookie
                },
                data: {
                  expLog: {
                    targetId: answer.id,
                    targetType: "answer",
                    logType: "upvote",
                    expValue: main.expValue,
                    expUserInfo: {
                      userId: main.author.userid,
                      name: main.author.name,
                      rank: main.author.rank
                    },
                    receiverUserInfo: {
                      userId: main.lg.id,
                      name: main.lg.name,
                      rank: main.lg.rank.trueRank
                    }
                  }
                }
              });
              return {
                insertUpv: successUpv,
                insertUpvAns: successUpvAns
              };
            } catch (err) {
              console.log(
                err,
                `Ocorreu um erro ao adicionar o upvote (${
                  main.upvote.targetId
                }) - (${main.upvote.type}) do user`
              );
            }
          }

          addUpvote().then(res => {
            console.log(res);
            if (res.insertUpv === true) {
              this.$store.commit("users/addUpvote", main.upvote);
            }
            if (res.insertUpvAns === true) {
              for (let ans of this.answersF) {
                if (ans.id == answer.id) {
                  ans.upvotes++;
                }
              }
            }
          });
        } else {
          console.log("Vais tirar upvote!!!!");
          async function removeUpv() {
            try {
              let successUpv = await main
                .http({
                  url: `http://${main.ip}/data-api/users/removeupvote/${
                    main.lg.id
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    upvote: main.upvote
                  }
                })
                .then(res => res.data.success)
                .catch(err => {
                  // if (err.response.status == 500) {
                  //   document.cookie = `login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
                  //   this.$store.commit("users/unLoggedUser");
                  //   this.$router.push({
                  //     name: "home"
                  //   });
                  // }
                });
              let successUpvAns = await main
                .http({
                  url: `http://${main.ip}/data-api/threads/${
                    main.th.id
                  }/answers/${answer.id}/downvote`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  }
                })
                .then(res => res.data.success)
                .catch(err => console.log(err));

              await main
                .http({
                  url: `http://${main.ip}/data-api/users/rmexp/${
                    main.author.userid
                  }`,
                  method: "put",
                  headers: {
                    "x-access-token": main.cookie
                  },
                  data: {
                    exp: main.expValue
                  }
                })
                .then(res => console.log("Exp removida"))
                .catch(err => console.log(err));
              /** Criar expLog */
              await main.http({
                url: `http://${main.ip}/data-api/explog/add`,
                method: "post",
                headers: {
                  "x-access-token": main.cookie
                },
                data: {
                  expLog: {
                    targetId: answer.id,
                    targetType: "answer",
                    logType: "downvote",
                    expValue: -main.expValue,
                    expUserInfo: {
                      userId: main.author.userid,
                      name: main.author.name,
                      rank: main.author.rank
                    },
                    receiverUserInfo: {
                      userId: main.lg.id,
                      name: main.lg.name,
                      rank: main.lg.rank.trueRank
                    }
                  }
                }
              });
              return {
                removeUpv: successUpv,
                removeUpvAns: successUpvAns
              };
            } catch (err) {
              console.log(
                err,
                `Ocorreu um erro ao elimnar o upvote (${
                  main.upvote.targetId
                }) - (${main.upvote.type}) do user`
              );
            }
          }
          removeUpv().then(res => {
            console.log(res);
            if (res.removeUpv === true) {
              this.$store.commit("users/removeUpvote", main.upvote);
            }
            if (res.removeUpvAns === true) {
              for (let ans of this.answersF) {
                if (ans.id == answer.id) ans.upvotes--;
              }
            }
          });
        }
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar upvote");
      }
    },
    upvoteComment(comment, answer, event) {
      if (this.confirmAuth() == true) {
        let Upv = true;

        console.log(answer);
        console.log(comment, "Comentário e em cima answer");
        for (let com of this.$store.state.users.loggedUser.upvotes) {
          if (com.type == "comment" && com.targetId == comment.id) Upv = false;
        }

        let main = {
          ip: this.$store.getters.getIp,
          lg: this.$store.state.users.loggedUser,
          th: this.threadF,
          author: comment.userInfo,
          cookie: this.getLogCookie(),
          http: this.$http,
          expValue: 5, //Não esquecer de fazer math.abs()
          upvote: {
            type: "comment",
            targetId: comment.id
          },
          headers: {
            "x-access-token": this.getLogCookie()
          },
          notiClass: this.$store.state.users.notificationClass
        };

        if (Upv) {
          console.log("Vais adicionar upv");
          async function addUpvCom() {
            /** Adicionar Upvote */
            let successUpv = await main
              .http({
                url: `http://${main.ip}/data-api/users/addupvote/${main.lg.id}`,
                method: "put",
                headers: main.headers,
                data: {
                  upvote: main.upvote
                }
              })
              .then(res => res.data.success);

            /** Icrementar Upvote comment */
            let successUpvCom = await main
              .http({
                url: `http://${main.ip}/data-api/threads/${
                  main.th.id
                }/answers/${answer.id}/comments/${comment.id}/upvote`,
                method: "put",
                headers: main.headers
              })
              .then(res => res.data.success);
            /** Adicionar experiencia ao autor do comentário */
            await main
              .http({
                url: `http://${main.ip}/data-api/users/addexp/${
                  main.author.userid
                }`,
                method: "put",
                headers: main.headers,
                data: {
                  exp: main.expValue
                }
              })
              .then(res => console.log("experiencia adicionada com suucesso"));
            /** Adicionar Notificação ao autor do comentário */
            await main.http({
              url: `http://${main.ip}/data-api/users/addNotification/${
                main.author.userid
              }`,
              method: "put",
              headers: main.headers,
              data: {
                notification: new main.notiClass(
                  main.th.id,
                  "deu upvote no seu comentário",
                  main.lg.name,
                  main.lg.id
                )
              }
            });

            /** Adicionar ExpLog */
            await main.http({
              url: `http://${main.ip}/data-api/explog/add`,
              method: "post",
              headers: main.headers,
              data: {
                expLog: {
                  targetId: comment.id,
                  targetType: "comment",
                  logType: "upvote",
                  expValue: main.expValue,
                  expUserInfo: {
                    userId: main.author.userid,
                    name: main.author.name,
                    rank: main.author.rank
                  },
                  receiverUserInfo: {
                    userId: main.lg.id,
                    name: main.lg.name,
                    rank: main.lg.rank.trueRank
                  }
                }
              }
            });
            /** Devolver objeto */
            return {
              upvUser: successUpv,
              addUpvCom: successUpvCom
            };
          }

          addUpvCom().then(res => {
            console.log(res, "res do addUpvCom()");
            if (res.upvUser) {
              this.$store.commit("users/addUpvote", main.upvote);
            }
            if (res.addUpvCom) {
              for (let com of this.commentsF) {
                if (com.id == comment.id) com.upvotes++;
              }
            }
          });
        } else {
          console.log("Vais remover upv");
          async function rmUpvCom() {
            /** Remover Upvote */
            let successUpv = await main
              .http({
                url: `http://${main.ip}/data-api/users/removeupvote/${
                  main.lg.id
                }`,
                method: "put",
                headers: main.headers,
                data: {
                  upvote: main.upvote
                }
              })
              .then(res => res.data.success);
            /** tirar upvote commnet */

            let successUpvCom = await main
              .http({
                url: `http://${main.ip}/data-api/threads/${
                  main.th.id
                }/answers/${answer.id}/comments/${comment.id}/downvote`,
                method: "put",
                headers: main.headers
              })
              .then(res => res.data.success);
            /** Remover exp autor do comment */
            await main
              .http({
                url: `http://${main.ip}/data-api/users/rmexp/${
                  main.author.userid
                }`,
                method: "put",
                headers: main.headers,
                data: {
                  exp: main.expValue
                }
              })
              .then(res => console.log("experiencia removida com suucesso"));

            /** Adicionar explog */
            await main.http({
              url: `http://${main.ip}/data-api/explog/add`,
              method: "post",
              headers: main.headers,
              data: {
                expLog: {
                  targetId: comment.id,
                  targetType: "comment",
                  logType: "downvote",
                  expValue: -main.expValue,
                  expUserInfo: {
                    userId: main.author.userid,
                    name: main.author.name,
                    rank: main.author.rank
                  },
                  receiverUserInfo: {
                    userId: main.lg.id,
                    name: main.lg.name,
                    rank: main.lg.rank.trueRank
                  }
                }
              }
            });
            /** Devolver objeto */
            return {
              rmUpvUser: successUpv,
              rmUpvCom: successUpvCom
            };
          }

          rmUpvCom().then(res => {
            console.log(res, "res do rmUpvcom()");
            if (res.rmUpvUser) {
              this.$store.commit("users/removeUpvote", main.upvote);
            }
            if (res.rmUpvCom) {
              for (let com of this.commentsF) {
                if (com.id == comment.id) com.upvotes--;
              }
            }
          });
        }
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar upvote");
      }
    },
    /** Respostas/Comentários,
     * Aqui é que se vai fazer a confirmação por badges
     */
    addAnswer() {
      // Fuckiing
      /** Confirmar 1º se a resposta é vazia ou não */
      if (this.confirmAuth() == true) {
        if (this.answerText == "") {
          // answer vazia
          this.errorSwal("Tens que escrever alguma coisa", true, "warning");
        } else {
          console.log(this.answerText, "Aqui vai uma resposta");
          let main = {
            ip: this.$store.getters.getIp,
            lg: this.$store.state.users.loggedUser,
            th: this.threadF,
            // author: this.userInfo,
            cookie: this.getLogCookie(),
            http: this.$http,
            expValue: 5, //Não esquecer de fazer math.abs()
            upvote: {
              type: "answer to thread",
              targetId: this.threadF.id
            },
            headers: {
              "x-access-token": this.getLogCookie()
            },
            notiClass: this.$store.state.users.notificationClass
          };
          console.log(this.answerText);
          let newAnswer = {
            // idThread: this.threadF.id,
            userInfo: {
              name: this.$store.state.users.loggedUser.name,
              photo: this.$store.state.users.loggedUser.picture,
              userid: this.$store.state.users.loggedUser.id,
              rank: this.$store.state.users.loggedUser.rank.trueRank
            },
            answer: this.answerText
          };

          async function addAnswer() {
            /** Adicionar Answer */
            let addAns = await main
              .http({
                url: `http://${main.ip}/data-api/threads/${main.th.id}/answers`,
                method: "post",
                headers: main.headers,
                data: {
                  answer: newAnswer
                }
              })
              .then(res => res.data.answer)
              .catch(err => {
                throw err;
              });

            /** Adicionar Experiencia */
            await main
              .http({
                url: `http://${main.ip}/data-api/users/addexp/${main.lg.id}`,
                method: "put",
                headers: main.headers,
                data: {
                  exp: main.expValue
                }
              })
              .then(res => console.log("Experiencia adicionada"));

            /** Adicionar notificações */
            //Notificação para o criador da thread
            await main.http({
              url: `http://${main.ip}/data-api/users/addnotification/${
                main.th.userInfo.userid
              }`,
              method: "put",
              headers: main.headers,
              data: {
                notification: new main.notiClass(
                  main.th.id,
                  "respondeu à sua thread",
                  main.lg.name,
                  main.lg.id
                )
              }
            });
            //Notificação para os seguidores
            await main.http({
              url: `http://${main.ip}/data-api/users/multiplenotis`,
              method: "put",
              headers: main.headers,
              data: {
                threadId: main.th.id,
                notification: new main.notiClass(
                  main.th.id,
                  "respondeu a uma thread que segue",
                  main.lg.name,
                  main.lg.id
                )
              }
            }); //Não vai estar à espera de uma resposta, por agora, tem que ficar xD

            /** Adicionar expLog */
            await main
              .http({
                url: `http://${main.ip}/data-api/explog/add`,
                method: "post",
                headers: main.headers,
                data: {
                  expLog: {
                    targetId: main.th.id,
                    targetType: "answer",
                    logType: "answer to thread",
                    expValue: main.expValue,
                    receiverUserInfo: {
                      userId: main.th.userInfo.userid,
                      name: main.th.userInfo.name,
                      rank: main.th.userInfo.rank
                    },
                    expUserInfo: {
                      userId: main.lg.id,
                      name: main.lg.name,
                      rank: main.lg.rank.trueRank
                    }
                  }
                }
              })
              .then(res => console.log("explog adicionado"));
            return {
              add: addAns
            };
          }
          addAnswer().then(res => {
            if (res.add) {
              console.log(res.add, "'resposta' vinda da api");
              this.answersF.push(res.add);
              this.answerText = "";
            }
          });
        }
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar upvote");
      }
    },
    comentar() {
      /** Adicionar Comentário */
      /** Atribuir experiencia a quem fez o comment
       * Mandar notificações para:
       * Autor da thread,
       * autor da answer,
       * todos os seguidores
       */
      let main = {
        ip: this.$store.getters.getIp,
        lg: this.$store.state.users.loggedUser,
        th: this.threadF,
        // author: this.userInfo,
        cookie: this.getLogCookie(),
        http: this.$http,
        expValue: 5, //Não esquecer de fazer math.abs()
        ans: this.targetAns,
        upvote: {
          type: "comment to answer",
          targetId: this.targetAns.id
        },
        headers: {
          "x-access-token": this.getLogCookie()
        },
        notiClass: this.$store.state.users.notificationClass
      };

      let newComment = {
        userInfo: {
          name: this.$store.state.users.loggedUser.name,
          photo: this.$store.state.users.loggedUser.picture,
          userid: this.$store.state.users.loggedUser.id,
          rank: this.$store.state.users.loggedUser.rank.trueRank
        },
        comment: this.commentToAnswer
      };
      if (this.confirmAuth()) {
        async function addComment() {
          /** Adicionar resposta */
          let com = await main
            .http({
              url: `http://${main.ip}/data-api/threads/${main.th.id}/answers/${
                main.ans.id
              }/comments`,
              method: "post",
              headers: main.headers,
              data: {
                comment: newComment
              }
            })
            .then(res => res.data.comment);

          /** Adicionar experiencia */
          await main
            .http({
              url: `http://${main.ip}/data-api/users/addexp/${
                main.ans.userInfo.userid
              }`,
              method: "put",
              headers: main.headers,
              data: {
                exp: main.expValue
              }
            })
            .then(res => console.log(res, "experiencia adicionada"));

          /** Adicionar notificação
           * autor da answer,
           * criador thread,
           * followers
           */
          await main.http({
            url: `http://${main.ip}/data-api/users/addnotification/${
              main.ans.userInfo.userid
            }`,
            method: "put",
            headers: main.headers,
            data: {
              notification: new main.notiClass(
                main.th.id,
                "comentou a sua answer",
                main.lg.name,
                main.lg.id
              )
            }
          });

          await main.http({
            url: `http://${main.ip}/data-api/users/addnotification/${
              main.th.userInfo.userid
            }`,
            method: "put",
            headers: main.headers,
            data: {
              notification: new main.notiClass(
                main.th.id,
                "comentou uma resposta a uma thread sua",
                main.lg.name,
                main.lg.id
              )
            }
          });

          await main.http({
            url: `http://${main.ip}/data-api/users/multiplenotis`,
            method: "put",
            headers: main.headers,
            data: {
              threadId: main.th.id,
              notification: new main.notiClass(
                main.th.id,
                "comentou uma resposta de uma thread que segue",
                main.lg.name,
                main.lg.id
              )
            }
          });

          /** Adicionar expLog */
          await main.http({
            url: `http://${main.ip}/data-api/explog/add`,
            method: "post",
            headers: main.headers,
            data: {
              expLog: {
                targetId: main.th.id,
                targetType: "comment",
                logType: "comment to answer",
                expValue: main.expValue,
                receiverUserInfo: {
                  // Isto não deve estar a fazer sentido
                  userId: main.ans.userInfo.userid,
                  name: main.ans.userInfo.name,
                  rank: main.ans.userInfo.rank
                },
                expUserInfo: {
                  userId: main.lg.id,
                  name: main.lg.name,
                  rank: main.lg.rank.trueRank
                }
              }
            }
          });

          return {
            addedComment: com
          };
        }
        addComment().then(res => {
          /** Adicionar comentario localmente */
          if (res.addedComment) {
            console.log(res.addComment);
            this.commentsF.push(res.addedComment);
            this.commentToAnswer = "";
          }
        });
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar comentar");
      }
    },
    openModal(ans) {
      if (this.confirmAuth() == true) {
        this.targetAns = ans;
        this.replyUser = ans.userInfo.name;
        this.$refs.myDialogcomment.showModal();
      } else {
        this.errorSwal("Tens que estar autenticado para poder dar comentar");
      }
    },
    /** Dar toogle aos comentários (dá para usar jQuery)  */
    hideComments(event, ansid) {
      let coms = $(`#${ansid}_wrapper.theWrapper`);
      coms.toggle();
    },
    /** Ir para um determinado user */
    goToUser() {
      console.log(
        this.threadF.userInfo.userid,
        "USERRRRRRRRR a ir para o perfil"
      );
      this.$router.push({
        name: "viewProfile",
        params: { userid: this.threadF.userInfo.userid }
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
    errorSwal(msg, isLoggedIn = false, type = "error") {
      if (isLoggedIn) {
        Swal({
          title: "Ocorreu um erro",
          type: type,
          text: msg
        });
      } else {
        Swal({
          title: "Ocorreu um erro",
          type: type,
          text: msg,
          footer: `<a href="/#/login"><strong>Ir para Login/Register</strong></a>` //Decidir se isto é um erro ou não...(kinda que é)
        });
      }
    },
    closeDialog() {
      this.$refs.myDialogcomment.close();
    },
    /** Funções de chamada À API,
     * não está a ser usada, porque está a função perdida da vida?????
     */
    changeUser(user) {
      console.log(user, "USER changeUser()");
      this.$http({
        url: `http://${this.$store.getters.getIp}/data-api/user/${user.id}`,
        data: user
      });
    },
    /**
     * Methods to generate badges
     * - Ranking e Help,
     * VAi ser usado no respoinder o comentar, para o loggedUser
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
    },
    getLogCookie() {
      let logCok = cookie.parse(document.cookie).login;
      console.log(logCok);
      return logCok; //Só para confirmar, depois pode ser reduzida
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
