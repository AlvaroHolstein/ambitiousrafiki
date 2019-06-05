<template>
  <div class="container" style="padding: 0px">
    <table class="table table-striped" v-if="users.length > 0">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Level</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          v-bind:key="user.id"
          v-bind:class="{ 'table-active': user.id == userid }"
        >
          <th scope="row">{{ user.rank }}</th>
          <td>{{ user.name }}</td>
          <td>{{ user.level }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: []
    };
  },
  created() {
    this.$http
      .get(`http://${this.$store.getters.getIp}/data-api/users`)
      .then(res => {
        this.users = this.sortUsers(res.data);
        console.log(this.users);
        let pos = this.users.findIndex(
          user => user.id == this.$route.params.userid
        );

        if (pos < 5) {
          console.log("Top 5");
          this.users = this.users.map((user, index) => {
            let newObj = {
              id: user.id,
              rank: index + 1,
              name: user.name,
              level: Math.floor(user.experience / 100) + 1
            };
            return newObj;
          });
          this.users.length = 5;
        } else {
          console.log("Abaixo do top 5");
          let ranks = [];
          for (let i = pos; i >= 0; i--) {
            ranks.push(this.users[i]);
          }
          ranks.reverse();
          this.users = [];

          ranks = ranks.map((user, index) => {
            let newObj = {
              id: user.id,
              rank: index + 1,
              name: user.name,
              level: Math.floor(user.experience / 100) + 1
            };
            return newObj;
          });
          for (let i = pos + 1 - 5; i < pos + 1; i++) {
            this.users.push(ranks[i]);
          }
          console.log("Ranks", ranks);
        }
      });
  },
  methods: {
    sortUsers(usersR) {
      let users = usersR.sort((a, b) => {
        if (a.experience > b.experience) return -1;
        if (a.experience < b.experience) return 1;
        else return 0;
      });

      return users;
    }
  }
};
</script>
<style>
.table-active,
.table-active > td,
.table-active > th {
  background-color: rgb(255, 223, 135);
}
</style>
