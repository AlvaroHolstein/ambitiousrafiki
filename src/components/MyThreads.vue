<template>
  <div class="span8">
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
            >Read More</router-link
          >
          <!--Depois alterar-->
        </p>
      </div>

      <p>
        <i class="icon-calendar"></i>
        {{ thread.date }}
        <!--Data-->
        |
        <i class="icon-tags"></i> Tags :
        <!--TAGS-->
        <a v-for="(tag, cont) in thread.tags" v-bind:key="cont">
          <!---->
          <span class="label label-info">{{ tag.text }}</span>
        </a>
      </p>
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
  }
};
</script>
