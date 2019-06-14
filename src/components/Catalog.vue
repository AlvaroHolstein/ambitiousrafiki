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
        v-if="searchBy == 'Tag'"
        class="text-center d-flex flex-column justify-content-center"
      >
        <p class="p-2">Search By Tag</p>
        <vue-tags-input
          class="p-2 mx-auto"
          id="inputTags"
          v-model="tag"
          :tags="tags"
          :autocomplete-items="filteredItems"
          @tags-changed="newTags => (tags = newTags)"
        />
      </div>
      <div
        id="findByKeyword"
        v-if="searchBy == 'Keyword'"
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
          <tr v-for="thread in filteredThreads" v-bind:key="thread.id">
            <td>
              <!-- v-on:click="" -->
              <a v-on:click="goToThread(thread.id)" class="title">{{ thread.title }}</a>
            </td>
            <td>
              <!-- v-bind:src="" -->
              <img v-bind:src="thread.userInfo.photo" class="img-fluid pic">
            </td>
            <td>{{ thread.views }}</td>

            <td>{{ thread.upvotes }}</td>
            <td>{{ thread.date | filterDate }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <button v-on:click="moreThreads()" class="btn btn-outline-dark">View More</button>
      </div>
    </div>
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
    /** Ir buscar as Threads inicias dependendo de quantas se quer mostrar na tabela */
    this.$store.dispatch("threads/getInitialThreads", this.totalThreads);

    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/tags`)
      .then(res => {
        console.log(res.data, "TAGS no CATALOG");
        this.autoComleteTags = res.data;
      });
    if (this.$store.state.searchTag != "") {
      this.searchBy = "Tag";
      this.tag = this.$store.state.searchTag;
    }
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
        let thread1 = false;
        /** Mais um delimitador de threads a apresentar */
        if (cont + 1 <= this.totalThreads) {
          if (this.tags.length > 0) {
            console.log("Entra");
            for (let i = 0; i < this.tags.length; i++) {
              if (thread.tags.find(tag => tag.text == this.tags[i].text)) {
                thread1 = true;
                console.log("Entra");
              } else {
                thread1 = false;
              }
            }
          } else if (this.keyword != "") {
            if (
              thread.title.toLowerCase().includes(this.keyword.toLowerCase())
            ) {
              thread1 = true;
            } else {
              thread1 = false;
            }
          } else if (this.keyword == "" && this.tags.length == 0) {
            thread1 = true;
          }
        }

        return thread1;
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
      if (alreadyHere.length > this.totalThreads) {
        /** Sim smi sim, era mais fácil fazer sempre pedidos e "esvaziar" o array */
        console.log(
          alreadyHere,
          this.totalThreads,
          "Ainda não vai ser preciso fazer pedidos"
        );
        this.totalThreads *= 2;
      } else {
        this.getThreads_(alreadyHere);
      }
    },
    getThreads_(alreadyHere) {
      this.$http
        .post(
          `http://${this.$store.getters.getIp}/data-api/threads/findAndExclude`,
          {
            exclude: alreadyHere,
            /** Vai buscar o numero de threads a apresentar na tabela */
            qty: this.totalThreads
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
    getUserById(id) {
      console.log("tá");
      return this.$store.getters.getUsers.filter(user => user.id == id)[0];
    },
    goToThread(id) {
      this.$http
        .put(`http://${this.$store.getters.getIp}/data-api/threads/${id}/view`)
        .then()
        .catch(err => {
          if (err) throw err;
        });
         this.$store.dispatch("threads/add_view_thread", id);
          this.$router.push({
            name: "thread",
            params: {
              threadid: id
            }
          });
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
