<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>
          Users
          <button @click="showUsers=!showUsers" type="button" class="btn btn-sm">
            <span class="badge">
              <i class="fas fa-chevron-down"></i>
            </span>
          </button>
        </h2>
        <hr>
      </div>
    </div>
    <transition name="slide-fade">
    <div v-if="showUsers" class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th></th>
            <th>Name</th>
            <th>Level</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user) in users" v-bind:key="user.id">
            <td>
              <img v-bind:src="user.picture" class="img-fluid pic">
            </td>
            <td>{{user.name}}</td>
            <td>
              {{getLevel(user.id)}}
            </td>
            <td>{{user.course}}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteUser(user.id)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </transition>
    <!-- BADGES -->

    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Badges  <button @click="showBadges=!showBadges" type="button" class="btn btn-sm">
            <span class="badge">
              <i class="fas fa-chevron-down"></i>
            </span>
          </button></h2>
        <hr>
        <transition name="slide-fade">
        <button v-if="showBadges"
          type="button"
          class="btn btn-success btn-lg"
          style="margin-bottom:15px"
          @click="openDialog('badges')"
        >Create Badge</button>
        </transition>
      </div>
    </div>
    <transition name="slide-fade">
    <div v-if="showBadges" class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Goal</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(badge) in $store.state.badges" v-bind:key="badge.id">
            <td>{{badge.id}}</td>
            <td>{{badge.name}}</td>
            <td>{{badge.desc}}</td>
            <td>{{badge.category}}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteBadge(badge.id)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </transition>
    <dialog id="idDialog" ref="myDialog">
      <form method="dialog">
        <p>
          <label for="nameinput">Name:</label>
          <input
            id="nameinput"
            name="nameinput"
            placeholder
            class="form-control input-md"
            required
            type="text"
            v-model="badgeName"
          >
        </p>

        <p>
          <label for="nameinput">Goal:</label>
          <input
            id="goalinput"
            name="goalinput"
            placeholder
            class="form-control input-md"
            required
            type="number"
            v-model="badgeGoal"
          >
        </p>
        <p>
          <label for="nameinput">Description:</label>
          <input
            id="descinput"
            name="descinput"
            placeholder
            class="form-control input-md"
            required
            type="text"
            v-model="badgeDesc"
          >
        </p>
        <p>
          <label>
            Category:
            <select v-model="badgeCat">
              <option></option>
              <option>help</option>
              <option>rank</option>
              <option>usage</option>
            </select>
          </label>
        </p>
        <menu>
          <button @click="closeDialog('badges')">Cancel</button>
          <button @click="createBadge">Confirm</button>
        </menu>
      </form>
    </dialog>

    <!-- THREADS -->

    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Threads  <button @click="showThreads=!showThreads" type="button" class="btn btn-sm">
            <span class="badge">
              <i class="fas fa-chevron-down"></i>
            </span>
          </button></h2>
        <hr>
      </div>
    </div>
    <transition name="slide-fade">
    <div v-if="showThreads" class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(thread) in getThreads" v-bind:key="thread.id">
            <td>{{thread.title}}</td>
            <td>{{ thread.date | filterDate }}</td>
            <td>{{thread.userInfo.name}}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteThread(thread.id)">X</button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                style="margin-left: 5px; color:white"
                @click="closeThread(thread.id)"
              >Close</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </transition>

    <!-- TAGS -->
    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Tags  <button @click="showTags=!showTags" type="button" class="btn btn-sm">
            <span class="badge">
              <i class="fas fa-chevron-down"></i>
            </span>
          </button></h2>
        <hr>
        <transition name="slide-fade">
        <button v-if="showTags"
          v-on:click="openDialog('tags')"
          type="button"
          class="btn btn-success btn-lg"
        >Create Tag</button>
        </transition>
        <br>
        <br>
      </div>
      <dialog id="idDialog" ref="addTag">
        <form method="dialog">
          <p>
            <label for="tagname">Nome</label>
            <input v-model="tagName" type="text" id="tagname" class="form-control input-md">
          </p>
          <menu>
            <button @click="closeDialog('tags')">Cancel</button>
            <button @click="createTag">Confirm</button>
          </menu>
        </form>
      </dialog>
    </div>
    <transition name="slide-fade">
    <div v-if="showTags" class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tag) in tags" v-bind:key="tag.id">
            <td>{{tag.id}}</td>
            <td>{{tag.text}}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteTag(tag.id)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </transition>
  </div>
</template>

<script>
import cookie from "cookie";
export default {
  data() {
    return {
      showUsers:false,
      showBadges:false,
      showThreads:false,
      showTags:false,
      badges: this.$store.state.badges,
      badgeId: "",
      badgeName: "",
      badgeGoal: "",
      badgeDesc: "",
      badgeCat: "",
      dialog: "",
      tagName: "",
      tags_: [],
      tagId: "",
      threads_: [],
      level_: "",
      users: []
    };
  },
  created() {
    //tags
    this.$http
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/tags`
      )
      .then(res => (this.tags_ = res.data))
      .catch(err => console.log(err, "Erro na tags.vue (axios)"));

    //threads
    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/threads`)
      .then(res => (this.threads_ = res.data))
      .catch(err => console.log(err, "thread"));


    this.getUsers();
    
  },
  /**
   ***** METHODS *****
   */
  methods: {
      getLevel(id) {
      let user_ = this.users.filter(user => user.id == id)[0]
      
      let level2 = Math.round(user_.experience / 100) + 1 
      return level2 

    },
    deleteUser(id) {
      console.log(id);
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.$http
        .delete(`http://${this.$store.getters.getIp}/data-api/users/${id}`, {
          headers: headers
        })
        .then(res => {
          let index = this.users.findIndex(user => user.id == id);
          console.log(index);
          this.users.splice(index, 1);
        })
        .catch(err => console.log(err, "erro no delete"));
    },
    deleteThread(id) {
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.$http
        .delete(`http://${this.$store.getters.getIp}/data-api/threads/${id}`, {
          headers: headers
        })
        .then(res => {
          let index = this.threads_.findIndex(thread => thread.id == id);
          console.log(index);
          this.threads_.splice(index, 1);
        })
        .catch(err => console.log(err, "erro no delete threads"));
    },

    deleteTag(id) {
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.$http
        .delete(`http://${this.$store.getters.getIp}/data-api/tags/${id}`, {
          headers: headers
        })
        .then(res => {
          let index = this.tags_.findIndex(tag => tag.id == id);
          console.log(index);
          this.tags_.splice(index, 1);
        })
        .catch(err => console.log(err, "erro no delete tags"));
    },

    deleteBadge(id) {
      this.$store.dispatch("delete_badge", id);
    },

    //TAGS
    // GET LAST TAG ID
    getLastTagID() {
      let maior;
      if (this.tags_.length != 0) {
        this.tags_.sort(function(a, b) {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
        });
        maior = this.tags_[this.tags_.length - 1].id;
        console.log(maior);
        return maior;
      } else {
        return 0;
      }
    },
    // CREATE TAG
    createTag() {
      let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.tagId = this.getLastTagID() + 1;
      this.$http
        .post(`http://${this.$store.getters.getIp}/data-api/tags`, {
          id: this.tagId,
          text: this.tagName,
          headers: headers
        })
        .then(res => {
          console.log("THEN DO CREATE TAG");
          let tag = {
            id: this.tagId,
            text: this.tagName
          };
          this.tags_.push(tag);
          this.tagName = "";
        })
        .catch(err => console.log(err, "erro no create tags"));
    },

    openDialog(dialog) {
      if (dialog == "badges") this.$refs.myDialog.showModal();
      else if (dialog == "tags") this.$refs.addTag.showModal();
    },

    closeDialog(dialog) {
      if (dialog == "badges") this.$refs.myDialog.close();
      else if (dialog == "tags") this.$refs.addTag.close();
    },

    getLastBadgeID() {
      let maior;
      if (this.badges.length != 0) {
        this.badges.sort(function(a, b) {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
        });
        maior = this.badges[this.badges.length - 1].id;
        console.log(maior);
        return maior;
      } else {
        return 0;
      }
    },

    createBadge() {
      this.badgeId = this.getLastBadgeID() + 1;
      this.$store.dispatch("create_badge", {
        id: this.badgeId,
        name: this.badgeName,
        goal: this.badgeGoal,
        desc: this.badgeDesc,
        category: this.badgeCat
      });
    },
    getUserById(id) {
      return this.$store.getters.getUsers.filter(user => user.id == id)[0];
    },
    closeThread(id) {
      this.$store.dispatch("close_thread", id);
    }
  },
  /**
   ***** COMPUTED *****
   */
  computed: {

    getUsers() {
      this.$http
        .get(
          `http://${this.$store.state.address +
            this.$store.state.port}/data-api/users`
        )
        .then(res => {
          this.users = res.data;
          console.log(res.data, "res");
        })
        .catch(err => {
          console.log(err, "ERRO Users.vue");
        });
    },
    tags() {
      return this.tags_;
    },
    getThreads() {
      return this.threads_;
    },
    level() {
      return this.level_;
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
<style>

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.pic {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 4px solid rgb(0, 89, 255);
}
</style>