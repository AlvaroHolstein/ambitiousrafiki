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
      console.log('alalala')
      return this.$store.state.threads.length != 0
        ? this.$store.state.threads
        : { thread: { title: "Sem tags para mostrar" } };
    }
  },
  methods: {
    fillThreads() {
      this.$store.dispatch("users/getStandUser");
      this.$store.dispatch("getThreads");
    }
  },
  created() {
    this.fillThreads()
  }
};
</script>
