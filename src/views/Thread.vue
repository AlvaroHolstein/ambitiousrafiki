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
                        </div>
                        <div class="col-md-10">
                          <p>
                            <a href>
                              <strong>{{userNome(com.idUser)}}</strong>
                            </a>
                          </p>
                          <p>{{com.text}}</p>
                          <p>
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
        <!-- <related></related> -->
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
    <div v-bind:class="extraClass" style="padding: 5px">
      <div class="col-md-9">
        <div id="qusestion">
          <h1>Questions</h1>
          <br>
          <br>
          <br>
          <br>
          <div id="userInfo" class="container text-right" style="margin-bottom: 10px;">
            <div class="text-right" style="padding-right: 0px; width: 200px">
              <div class="card text-left" style="border: none;">
                <div
                  class="card-body"
                  style="border: 1px solid lightgray;border-radius: 10px; padding: 3px;"
                >
                  <ul style="list-style-type: none;padding: 0px">
                    <li>Joaquim David</li>
                    <li>java</li>
                    <li>exp</li>
                  </ul>
                </div>
                <div
                  class="card-footer text-muted"
                  style="padding: 2px; border-radius: 10px"
                >2 days ago</div>
              </div>
            </div>
          </div>
        </div>
        <div id="answers" style="border-top: 1px solid black;">
          <h1>Answers</h1>

          <div class="row" style="border-bottom: 1px solid black;">
            <div class="col-md-3" style="border-right: 1px solid black;">
              <h1>"Profile"</h1>
              <img src>
            </div>
            <div class="col-md-9">
              <h1>Answer</h1>
            </div>
          </div>

          <div class="row" style="border-bottom: 1px solid black;">
            <div class="col-md-3" style="border-right: 1px solid black;  margin-top: 10px">
              <h1>"Profile"</h1>
              <img src>
            </div>
            <div class="col-md-9">
              <h1>Answer</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3" style="border-left: 1px solid black">
        <h1 class="text-center">Related</h1>
        <ul style="list-style-type: none; padding: 0px">
          <li
            style="margin-bottom: 10px; border-bottom: 1px solid black"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea fuga sed beatae eligendi? Nihil ipsa, illo, alias ab dolorem repellendus quis aut sed illum ullam modi facilis quo voluptatum. Esse!</li>
          <li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
          <li>Ea fuga sed beatae eligendi? Nihil ipsa, illo, alias ab dolorem repellendus quis aut sed illum ullam modi facilis quo voluptatum. Esse!</li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script>
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";
// import Related from "@/components/Related.vue";

export default {
  components: {
    // Related
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {}
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

.fitWindow {
  height: calc(100vh - 200px);
}
.fitcontainer {
  display: grid;
  grid-template-columns: fit-content(500px) fit-content(300px) 1fr;
}
</style>
