<template>
  <div class="span8">
    <div v-if="threads.length > 0">
      <div v-for="(thread, cont) in threads" v-bind:key="cont">
        <h4>
          <strong>
            <a>{{ thread.title }}</a>
          </strong>
        </h4>

        <div class="span6">
          <!--Descrição-->
          <p v-html="removeImageTag(thread.question)"></p>
          <p>
            <router-link
              :to="{ name: 'thread', params: { threadid: thread.id } }"
              :class="{ 'btn btn-primary': true }"
            >Read More</router-link>
            <!--Depois alterar-->
          </p>
        </div>

        <p>
          <i class="icon-calendar"></i>
          {{ thread.date | filterDate}}
          <!--Data-->
          |
          <i class="icon-tags"></i> Tags :
          <!--TAGS-->
          <a v-for="(tag, cont) in thread.tags" v-bind:key="cont">
            <!---->
            <span class="label label-info">{{ tag.text }}</span>
          </a>
        </p>
        <hr class="separator">
      </div>
    </div>
    <div v-else>
      <h1 class="text-center">Ainda não criou threads</h1>
      <router-link
        tag="button"
        class="btn btn-3-success"
        :to="{name: 'createThread'}"
      >Criar Thread</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ["threads"],
  data() {
    return {};
  },
  created() {},
  methods: {
    removeImageTag(content) {
      content = content.replace(/<img[^>]*>/g, "");
      content = content.replace(/<br>/g, "");
      return content;
    }
  },
  filters: {
    filterDate: function(value) {
      if (!value) return "Sem data";

      let date = value.split("T")[0].split("-");
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
  }
};
</script>

<style scoped>
.separator {
  border: 0.5px solid black;
  width: 50%;
}
</style>
