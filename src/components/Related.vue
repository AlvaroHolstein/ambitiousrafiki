<template>
  <div class="fitText">
    <div
      style="padding: 0 0 0 5; padding-inline-start: 20px"
      class="list-group"
      v-if="relatedThreads.length>0"
    >
      <a
        style="width:100%"
        class="list-group-item"
        v-for="thread in relatedThreads"
        v-bind:key="thread.id"
        @click="goToThread(thread.id)"
      >{{thread.title}}</a>
    </div>
    <div v-else>
      <a style="width:100%" class="list-group-item">No Topics at the moment</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      relatedThreads: [],
      relatedTags: []
    };
  },
  created() {
    let threadid = JSON.parse(localStorage.getItem("setLastThread"));
    // console.log(threadid);
    if (threadid) {
      let userid = this.$store.getters.getloginID;
      //SE tiver loggado
      // console.log(userid);
      if (userid != 0) {
        this.relatedTags = this.$store.getters.getThreads.filter(
          thread => thread.userid == userid
        );
        // console.log("WTF" + this.relatedTags);
        this.relatedTags = this.relatedTags.map(thread => {
          let newObj = {
            tags: thread.tags
          };
          return newObj;
        });
        // console.log("Todas as threads:" + this.$store.getters.getThreads);
        this.relatedThreads = this.$store.getters.getThreads.filter(thread => {
          let tagExists = false;
          for (let i = 0; i < this.relatedTags.length; i++) {
            console.log(this.relatedTags[i].tags[0].text);
            if (
              thread.tags.find(
                tag => tag.text == this.relatedTags[i].tags[0].text
              )
            ) {
              tagExists = true;
              console.log("Entra?");
            }
          }
          return tagExists;
        });
      } else {
        //Senao tiver loggado
        this.relatedTags = this.$store.getters.getThreads.filter(
          thread => thread.id == threadid
        )[0].tags;
        this.relatedThreads = this.$store.getters.getThreads.filter(thread => {
          let tagExists = false;
          for (let i = 0; i < this.relatedTags.length; i++) {
            // console.log(this.relatedTags[i]);
            // console.log(thread.tags);
            if (thread.tags.find(tag => tag.text == this.relatedTags[i].text)) {
              tagExists = true;
            }
          }
          return tagExists;
        });
        console.log(this.relatedTags);
      }
    }

    this.relatedThreads.length = 5;
    if (this.relatedTags.length == 0) {
      this.relatedThreads.length = 0;
    }
  },
  methods: {
    goToThread(id) {
      this.$router.push({
        name: "thread",
        params: {
          threadid: id
        }
      });
      this.$store.dispatch("increment_views", id);
      location.reload()
    }
  }
};
</script>

<style>
a.list-group-item {
  cursor: pointer !important;
}
</style>
