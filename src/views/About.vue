<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ul>
      <li v-for="thread in threads" v-bind:key="thread.id">{{thread.title}}</li>
      <button v-on:click="fillThreads()">Fill threads</button>
      <p>{{$store.state.users.name}}</p>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    threads() {
      return this.$store.state.threads.length != 0
        ? this.$store.state.threads
        : [{ thread: { title: "Erro" } }];
    }
  },
  methods: {
    fillThreads() {
      this.$store.dispatch("getThreads");
    }
  }
};
</script>
