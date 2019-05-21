<template>
  <div>
    <div class="bs-callout bs-callout-danger">
      <h4>Education</h4>
      <table class="table table-striped table-responsive">
        <thead>
          <tr>
            <th>Course</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <!-- <td>{{getUser(this.$route.params.visiteduserid).course}}</td>
            <td>{{getUser(this.$route.params.visiteduserid).year}}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bs-callout bs-callout-danger">
      <h4>Bio</h4>
      <!-- <p>{{getUser(this.$route.params.visiteduserid).description}}</p> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      users: this.$store.getters.getUsers
    };
  },
  methods: {
    getUser(id) {
      return this.users.filter(user => user.id == id)[0];
    }
  }
};
</script>

<style>
.bs-callout {
  -moz-border-bottom-colors: none;
  -moz-border-left-colors: none;
  -moz-border-right-colors: none;
  -moz-border-top-colors: none;
  border-color: #eee;
  border-image: none;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px 1px 1px 5px;
  margin-bottom: 5px;
  padding: 20px;
}
.bs-callout:last-child {
  margin-bottom: 0px;
}
.bs-callout h4 {
  margin-bottom: 10px;
  margin-top: 0;
}

.bs-callout-danger {
  border-left-color: #d9534f;
}

.bs-callout-danger h4 {
  color: #d9534f;
}

.resume .list-group-item:first-child,
.resume .list-group-item:last-child {
  border-radius: 0;
}
</style>
