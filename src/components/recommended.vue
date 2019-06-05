<template>
  <div class="fitText">
    <div
      style="padding: 0 0 0 5; padding-inline-start: 20px"
      class="list-group"
      v-if="relatedThreads.length > 0"
    >
      <a
        style="width:100%"
        class="list-group-item"
        v-for="thread in relatedThreads"
        v-bind:key="thread.id"
        @click="goToThread(thread.id)"
        >{{ thread.title }}</a
      >
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
    this.relatedTags = this.$store.state.users.lastViewedThread;
    console.log(this.relatedTags);
    let string = "";
    for (let i = 0; i < this.relatedTags.length; i++) {
      string += this.relatedTags[i].text;
      console.log(string);
      if (i < this.relatedTags.length - 1) {
        string += ",";
      }
    }
    //Agora Fazer o pedido para ir buscar threads por tags
    let params = {
      tags: string
    };

    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/threads/findTag`, {
        params
      })
      .then(res => {
        console.log("RESPOSTA", res);
        this.relatedThreads = res.data;
        this.relatedThreads.length = 5;
      });
  },
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
a.list-group-item {
  cursor: pointer !important;
}
</style>
