<template>
  <div class="fitText">
    <div
      style="padding: 0 0 0 5; padding-inline-start: 20px"
      class="list-group"
      v-if="relatedThreads.length > 0"
    >
      <div v-for="thread in relatedThreads" v-bind:key="thread.id">
        <a
          style="width:100%"
          class="list-group-item"
          @click="goToThread(thread.id)"
          v-if="thread.title.length < 20"
          >{{ thread.title }}</a
        >
        <a
          style="width:100%"
          class="list-group-item"
          @click="goToThread(thread.id)"
          v-else
          >{{ thread.title.substring(0, 19) + "..." }}</a
        >
      </div>
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
        if (this.relatedThreads.length > 5) this.relatedThreads.length = 5;
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
