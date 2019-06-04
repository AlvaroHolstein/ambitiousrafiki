<template>
  <div class="container-fluid">
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Level</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, cont) in orderedUsers"
            v-bind:key="user.id"
            v-bind:class="{'table-active':(user.id==userid)}"
          >
            <td scope="row">{{cont + 1}}</td>
            <td>{{user.name}}</td>
            <td>{{user.experience}}</td>
            <td>{{user.course}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      userid: 0
    };
  },
  created() {
    this.$http
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/users/userByRank/rankings`
      )
      .then(res => (this.users = res.data))
      .catch(err => console.log(err));
  },
  computed: {
    orderedUsers() {
      console.log(this.users, "Mudei os Users rankings");
      return this.users;
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
