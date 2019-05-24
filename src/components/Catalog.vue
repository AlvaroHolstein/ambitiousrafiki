<template>
  <!-- <div class="container"> -->
  <div id="letabela">
    <!--Filtros-->
    <div style="padding:5px;">
      <span>Filter Threads By:</span>
      <select class="custom-select" style="width:30%;" v-model="searchBy">
        <option value="All">All</option>
        <option>Tag</option>
        <option>Keyword</option>
      </select>
      <div
        id="findByTag"
        v-if="searchBy=='Tag'"
        class="text-center d-flex flex-column justify-content-center"
      >
        <p class="p-2">Search By Tag</p>
        <vue-tags-input
          class="p-2 mx-auto"
          id="inputTags"
          v-model="tag"
          :tags="tags"
          :autocomplete-items="filteredItems"
          :max-tags="1"
          @tags-changed="newTags => tags = newTags"
        />
      </div>
      <div
        id="findByKeyword"
        v-if="searchBy=='Keyword'"
        class="text-center d-flex flex-column justify-content-center"
      >
        <p class="p-2">Search By Keyword</p>
        <br>
        <input
          class="p-2 mx-auto"
          type="text"
          style="width:49%;"
          v-model="keyword"
          placeholder="Search By Keyword"
        >
      </div>
    </div>
    <br>
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>Topic</th>
            <th>Owner</th>
            <th>Views</th>
            <th>Upvotes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(thread) in filteredThreads" v-bind:key="thread.id">
            <td>
              <!-- v-on:click="" -->
              <a class="title">{{thread.title}}</a>
            </td>
            <td>
              <!-- v-bind:src="" -->
              <img v-bind:src="thread.userInfo.photo" class="img-fluid pic">
            </td>
            <td>{{thread.views}}</td>

            <td>{{thread.upvotes}}</td>
            <td>{{thread.date | filterDate}}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <button v-on:click="moreThreads()" class="btn btn-outline-dark">View More</button>
      </div>
    </div>

    <!-- <div
      class="border-pill border col-sm-12"
      v-for="thread in filteredThreads"
      v-bind:key="thread.id"
      style="width: 100%;margin-bottom: 20px;"
    >
       <div class="col-sm-3">
          <img src="../assets/logo.png" class="card-img-left img-fluid" alt="...">
      </div>
      <div class="card-body">
        <a
          tag="h5"
          class="card-title titulo"
        >{{thread.title}}</a>
        <h6 class="card-subtitle mb-2 text-muted">{{thread.date}}</h6>
        <p class="card-text">
          <span v-for="tag in thread.tags" v-bind:key="tag.id">{{tag.text}}</span>
        </p>
        <a href="#" class="card-link">{{thread.id}}</a>
        <a href="#" class="card-link">{{thread.views}}</a>
        >{{thread.title}}</router-link>

        <div class="item-content-block tags">
          <a v-for="tag in thread.tags" v-bind:key="tag.id">{{tag.text}}</a>
        </div>
        <a href="#" class="card-link">Upvotes {{thread.upvotes}}</a>
        <a href="#" class="card-link">Views {{thread.views}}</a>
        <a href="#" class="card-link"> Upvotes {{thread.upvotes}}</a>
        <a href="#" class="card-link"> Views {{thread.views}}</a>
        <h6 class="card-subtitle mb-2 text-muted">Posted {{thread.date}}</h6>
      </div>
    </div>-->
  </div>

  <!-- </div> -->
</template>
<script>
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      searchBy: "All",
      tag: "",
      tags: [],
      keyword: "",
      autoComleteTags: [],
      threads: this.$store.state.threads,
      totalThreads: 2
    };
  },
  created() {
    this.$store.dispatch("threads/getInitialThreads", 2);

    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/tags`)
      .then(res => {
        console.log(res.data, "TAGS no CATALOG");
        this.autoComleteTags = res.data;
      });
  },
  updated() {
    if (this.searchBy == "All") {
      this.tags.length = 0;
      this.tag = "";
      this.keyword = "";
    } else if (this.searchBy == "Tag") {
      this.keyword = "";
    } else {
      this.tags.length = 0;
      this.tag = "";
    }
    if (this.tags.length == 1) {
      this.tag = this.tags[0].text;
    }
    console.log(this.tag);
    console.log(this.keyword);
    console.log(this.tags.length);
  },
  beforeDestroy() {
    this.$store.dispatch("search_tag", "");
  },
  computed: {
    autocompleteItems() {
      return this.autoComleteTags;
    },
    filteredItems() {
      return this.autocompleteItems.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
    filteredThreads() {
      console.log(
        this.$store.state.threads.threads_,
        "filteredThreads catalog.vue"
      );
      return this.$store.state.threads.threads_.filter((thread, cont) => {
        if (cont + 1 <= this.totalThreads) {
          if (this.tags.length == 1) {
            console.log("Entra");

            if (thread.tags.find(tag => tag.text == this.tag)) {
              return true;
              console.log("Entra");
            }
          } else if (this.keyword != "") {
            if (thread.title.toLowerCase().includes(this.keyword.toLowerCase()))
              return true;
          } else if (this.keyword == "" && this.tags.length == 0) {
            return true;
          }
        }
      });
    }
  },
  methods: {
    moreThreads() {
      /* Array para guardar os id's das threads que já temos
       * que depois vai ser enviado para a API,
       * as threads que forem carregadas aqui no Catalog
       * vão ficar na store, mas as threads que forem carregadas na SearchThing
       * fica só no próprio componente.
       * Enviar o numero de threads a ir buscar pelo body.
       */
      let alreadyHere = this.$store.state.threads.threads_.map(
        (thread, cont) => {
          return thread.id;
        }
      );
      console.log(alreadyHere);
      this.$http
        .post(
          `http://${this.$store.getters.getIp}/data-api/threads/findAndExclude`,
          {
            exclude: alreadyHere,
            qty: 1
          }
        )
        .then(res => {
          console.log(res.data, "Mostrar Mais Threads");
          this.totalThreads += res.data.length;
          for (let i = 0; i < res.data.length; i++) {
            this.$store.state.threads.threads_.push(res.data[i]);
          }
        });
    },
    incrementar(id) {
      this.$router.push({
        name: "thread",
        params: {
          threadid: id
        }
      });
      this.$store.dispatch("increment_views", id);
    },
    getUserById(id) {
      console.log("tá");
      return this.$store.getters.getUsers.filter(user => user.id == id)[0];
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
/* #letabela {
  padding-left: 30px;
  padding-right: 0px;
} */
.fitText {
  word-wrap: break-word;
}
.titulo:hover {
  cursor: pointer;
  color: blue;
}
.item {
  color: #48453d;
  margin-top: 30px;
  overflow: hidden;
}
.block-title {
  color: #48453d;
  margin-bottom: 0px;
  font-size: 18px;
  margin-top: 0px;
  font-weight: 700;
  text-transform: uppercase;
}
.item-content-block {
  padding: 20px;
  border-top: 2px solid #f6f6f2;
  background-color: #fff;
  display: block;
}
.tags a {
  background-color: #756f5d;
  padding: 10px;
  color: #fff;
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  line-height: 11px;
  border-radius: 2px;
  margin-bottom: 5px;
  margin-right: 2px;
  text-decoration: none;
}
.tags a:hover {
  background-color: #a38018;
}

a {
  text-align: right;
}

td,
th {
  border-bottom: 1px solid #a5a5a5 !important;
  border-right: none !important;
  border-left: none !important;
  border-top: none !important;
  text-align: left !important;
  padding: 8px;
  color: black !important;
  background-color: #ffffff !important;
}
td > a.title {
  color: blue;
  cursor: pointer;
}
.pic {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 4px solid rgb(0, 89, 255);
}
#findByKeyword,
#findByTag {
  background-color: #ddd9d9;
  padding-bottom: 10px;
  margin-top: 10px;
}
#findByKeyword > input,
#findByTag > input {
  width: 70%;
}
</style>
