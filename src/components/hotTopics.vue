<template>
  <div class="fitText">
    <div
      style="padding: 0 0 0 5; padding-inline-start: 20px"
      class="list-group"
    >
      <!-- Assim só aparece 5 threads -->
      <a
        style="width:100%"
        class="list-group-item"
        v-for="thread in hotTopics"
        v-bind:key="thread.id"
        @click="goToThread(thread.id)"
        >{{ thread.title }}</a
      >
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
