<template>
  <div class="span8">
    <div class="wrapper" v-if="mythreads.length > 0">
      <div v-for="thread in mythreads" v-bind:key="thread.id">
        <h4>
          <strong>
            <a>{{thread.title}}</a>
          </strong>
        </h4>

        <div class="span6">
          <!--Descrição-->
          <p v-html="thread.question"></p>
          <p>
            <router-link
              :to="{name:'thread',params:{threadid:thread.id}}"
              :class="{'btn btn-primary':true}"
            >Read More</router-link>
            <!--Depois alterar-->
          </p>
        </div>

        <p>
          <i class="icon-calendar"></i>
          {{thread.date}}
          <!--Data-->
          |
          <i class="icon-tags"></i> Tags :
          <!--TAGS-->
          <a v-for="tag in thread.tags" v-bind:key="tag.id">
            <!---->
            <span class="label label-info">{{tag.text}}</span>
          </a>
        </p>
      </div>
    </div>
    <div v-else class="wrapper">
      <h1 class="text-center">Não tem Tags</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mythreads: []
    };
  },
  created() {
    let id = this.$route.params.visiteduserid;
    this.mythreads = this.$store.getters.getThreads.filter(
      thread => thread.userid == id
    );
    console.log(this.mythreads);
    this.mythreads = this.mythreads.map(thread => {
      let newOBJ = {
        closeDate: thread.closeDate,
        course: thread.course,
        date: thread.date,
        id: thread.id,
        idGroup: thread.idGroup,
        question: this.removeImageTag(thread.question),
        tags: thread.tags,
        title: thread.title,
        upvotes: thread.upvotes,
        userid: thread.userid,
        views: thread.views
      };
      return newOBJ;
    });
    console.log(this.mythreads);
  },
  methods: {
    removeImageTag(content) {
      content = content.replace(/<img[^>]*>/g, "");
      content = content.replace(/<br>/g, "");
      return content;
    }
  }
};
</script>
