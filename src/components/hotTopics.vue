<template>
  <div class="fitText">
    <div style="padding: 0 0 0 5; padding-inline-start: 20px" class="list-group">
      <!-- Assim só aparece 5 threads -->
      <div v-for="thread in hotTopics" v-bind:key="thread.id" v-if="thread != null">
        <a
          style="width:100%"
          class="list-group-item"
          @click="goToThread(thread.id)"
          v-if="thread.title.length < 20"
        >{{ thread.title }}</a>
        <a
          style="width:100%"
          class="list-group-item"
          @click="goToThread(thread.id)"
          v-else
        >{{ thread.title.substring(0, 19) + "..." }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hotTopics: []
    };
  },
  created() {
    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/hotTopics`)
      .then(res => {
        console.log(res.data);
        this.hotTopics = res.data;
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
