
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Tags</h2>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-2" v-for="(tag) in tags" v-bind:key="tag.id">
        <button
          type="button"
          class="btn btn-default btn-lg btn3d"
          @click="goToTag(tag.text)"
        >{{tag.text}}</button>
        <br>
      </div>
    </div>
    <br>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      tags_: []
    }
  },
  created() {
    axios
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/tags`
      )
      .then(res => (this.tags_ = res.data))
      .catch(err => console.log(err, "Erro na tags.vue (axios)"));
  },
  computed: {
    tags() {
      return this.tags_;
    }
  },
  methods: {
    goToTag(tag) {
      this.$store.dispatch("search_tag", tag);
      this.$router.push({ name: "home" });
    }
  }
};
</script>
<style>
.btn3d {
  position: relative;
  top: -6px;
  border: 0;
  transition: all 40ms linear;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 2px;
  margin-right: 2px;
}

.btn3d:active,
.btn3d.active {
  top: 2px;
}

.btn3d.btn-default {
  color: #f9f9f9;
  box-shadow: 0 0 0 1px #ebebeb inset, 0 0 0 2px rgba(255, 255, 255, 0.1) inset,
    0 8px 0 0 #bebebe, 0 8px 8px 1px rgba(0, 0, 0, 0.2);
  background-color: #666666;
}
.btn3d.btn-default:active,
.btn3d.btn-default.active {
  color: #666666;
  box-shadow: 0 0 0 1px #ebebeb inset, 0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 1px 3px 1px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
.btn3d.btn-default:hover {
  background-color: rgb(6, 135, 255);
  color: white;
}
</style>
