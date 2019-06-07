<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Users</h2>
        <hr>
      </div>
    </div>
    <div class="table-responsive">
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
              <!--{{user.level}}
              {{getLevel(user.id)}}-->
            </td>
            <td>{{user.course}}</td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteUser(user.id)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- BADGES -->

    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Badges</h2>
        <hr>
        <button
          type="button"
          class="btn btn-success btn-lg"
          @click="openDialog('badges')"
        >Create Badge</button>
        <br>
        <br>
      </div>
    </div>
    <div class="table-responsive">
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
        <h2>Threads</h2>
        <hr>
      </div>
    </div>
    <div class="table-responsive">
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
            <td>{{thread.date}}</td>
            <td>
              <!--{{getUserById(thread.userInfo.userid).name}}-->
              {{thread.userInfo.name}}
            </td>
            <td>
              <button type="button" class="btn btn-danger btn-sm" @click="deleteThread(thread.id)">X</button>
              <button
                type="button"
                class="btn btn-caution btn-sm"
                @click="closeThread(thread.id)"
                v-if="thread.closeDate==''"
              >Close</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- TAGS -->
    <div class="row">
      <div class="col-md-12">
        <br>
        <h2>Tags</h2>
        <hr>
        <button
          v-on:click="openDialog('tags')"
          type="button"
          class="btn btn-success btn-lg"
        >Create Tag</button>
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
    <div class="table-responsive">
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
  </div>
</template>

<script>
import cookie from "cookie";
export default {
  data() {
    return {
      badges: this.$store.getters.getBadges,
      badgeId: "",
      badgeName: "",
      badgeGoal: "",
      badgeDesc: "",
      badgeCat: "",
      dialog: "",
      tagName: "",
      tags_: [],
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

    //level
    /*this.$http
      .get(
        `http://${this.$store.getters.getIp}/data-api/userLevel/${
          this.$route.params.userid
        }`
      )
      .then(res => (this.level_ = res.data))
      .catch(err => console.log(err, "level"));*/
    this.getUsers();
  },
  methods: {
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
        }).catch(err => console.log(err, "erro no delete"));
    },

    deleteBadge(id) {
      this.$store.dispatch("delete_badge", id);
    },

    deleteThread(id) {
      this.$store.dispatch("delete_thread", id);
    },

    deleteTag(id) {
      this.$store.dispatch("delete_tag", id);
    },
    createTag() {
      let id =
        this.$store.getters.getTags.length == 0
          ? 1
          : this.$store.getters.getTags[this.$store.getters.getTags.length - 1]
              .id + 1;
      console.log(
        this.$store.getters.getTags[this.$store.getters.getTags.length - 1]
      );
      this.$store.dispatch("add_tag", { id: id, text: this.tagName });
      this.tagName = "";
    },
    openDialog(dialog) {
      if (dialog == "badges") this.$refs.myDialog.showModal();
      else if (dialog == "tags") this.$refs.addTag.showModal();
    },

    closeDialog(dialog) {
      if (dialog == "badges") this.$refs.myDialog.close();
      else if (dialog == "tags") this.$refs.addTag.close();
    },

    getLastID() {
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
      this.badgeId = this.getLastID() + 1;
      this.$store.dispatch("add_badge", {
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

  computed: {
    /*getLevel(id) {
      this.$http
        .get(`http://${this.$store.getters.getIp}/data-api/userLevel/${id}`)
        .then(res => (this.level_ = res.data))
        .catch(err => console.log(err, "level"));
    },*/
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
  }
};
</script>
<style>
.pic {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 4px solid rgb(0, 89, 255);
}
</style>