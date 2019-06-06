<template>
  <div id="containerHome" class="container">
    <h1></h1>
    <div class="row">
      <div class="col-md-9">
        <Catalog />
      </div>
      <div class="col-md-3" style="padding: 0 0 0 5">
        <h4 style="padding: 0 0 0 5; padding-inline-start: 20px">Hot Topics</h4>
        <hotTopics></hotTopics>
        <h4 style="padding: 0 0 0 5; padding-inline-start: 20px">
          Most viewed Topics
        </h4>
        <mostViewed />
        <h3 style="padding: 0 0 0 5; padding-inline-start: 20px">
          Topics For You
        </h3>
        <related v-if="show"></related>
        <div v-else>
                <a style="width:100%" class="list-group-item">Please Log in</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Catalog from "@/components/Catalog.vue";
import hotTopics from "@/components/hotTopics.vue";

import mostViewed from "@/components/mostViewed.vue";
import Related from "@/components/recommended.vue";

// document.getElementById('containerHome').
export default {
  components: {
    Catalog,
    hotTopics,
    mostViewed,
    Related
  },
  data() {
    return {
      viewedThreads: [],
      hotTopics: [],
      show: false
    };
  },
  created() {
    if (this.$store.state.users.loggedUser !== null) {
  
        this.show = true;
     
    }
  },
  /* created() {
    // Para que servia isto
    //Most viewd????
    this.viewedThreads = this.$store.state.threads.threads_.sort((a, b) => {
      if (a.views > b.views) return -1;
      if (a.views < b.views) return 1;
      else return 0;
    });
    // this.viewedThreads.length = 5;
    this.hotTopics = this.$store.state.threads.threads_.map(thread => {
      let newObj = {
        id: thread.id,
        title: thread.title,
        points: thread.upvotes + thread.views
      };
      return newObj;
    });
    // console.log("Antes de receber pontos por comentarios" + this.hotTopics);
    let answers = this.$store.getters.getAnswers;
    let comments = this.$store.getters.getComments;
    for (let i = 0; i < this.hotTopics.length; i++) {
      for (let j = 0; j < answers.length; j++) {
        if (this.hotTopics[i].id == answers[j].idThread) {
          for (let k = 0; k < comments.length; k++) {
            if (answers[j].id == comments[k].idAnswer) {
              this.hotTopics[i].points += 1;
            }
          }
          this.hotTopics[i].points += 1;
        }
      }
    }
    // console.log(this.hotTopics);
    this.hotTopics = this.hotTopics.sort((a, b) => {
      if (a.points > b.points) return -1;
      if (a.points < b.points) return 1;
      else return 0;
    });
  },*/
  methods: {
    goToThread(id) {
      this.$router.push({
        name: "thread",
        params: {
          threadid: id
        }
      });
    }
  }
};
</script>
<style>
.fitWindow {
  height: calc(100vh - 200px);
}
</style>
