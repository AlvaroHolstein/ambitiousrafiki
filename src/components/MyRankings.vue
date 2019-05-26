<template>
  <div class="container" style="padding: 0px">
    <table class="table table-striped" v-if="ranks.length>0">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Level</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rank, cont) in ranks" v-bind:key="cont">
          <th scope="row">{{rank.rank[0] + 1}}</th>
          <td>{{rank.name}}</td>
          <td>{{rank.level}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ranks: [],
      users: this.$store.getters.getUsers
    };
  },
  created() {
    this.users.sort((a, b) => {
      if (a.level > b.level) return -1;
      if (a.level < b.level) return 1;
      else return 0;
    });
    console.log(this.users)

    //Ordenar users ranking global
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].rank[0] = i;
    }

    let pos = this.getIndexByID();
    console.log(pos);
    let cont = 5;
    if (pos <= 1) {
      console.log("TOP 5");
      for (let i = 0; i < cont; i++) {
        this.ranks.push(this.users[i]);
        console.log('ata');
      }
    } else if (pos >= 0) {
      console.log("Está a meio ou no fim da ladder");
      for (let i = pos + 1 - cont; i < pos + 1; i++) {
        this.ranks.push(this.users[i]);
        console.log('ata2');
      }
    }
    console.log(this.ranks)
  },
  methods: {
    getIndexByID() {
      return this.users.findIndex(
        user => user.id == this.$store.getters.getloginID
      );
    }
  }
};
</script>
