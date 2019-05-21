<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <br>
        <h2>Users</h2>
        <br>
        <input
          class="form-control mr-sm-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          v-model="userSearch"
        >
      </div>
    </div>
    <br>
    <br>
    <div class="row">
      <div
        class="col-lg-3"
        v-for="(user) in filteredUsers"
        v-bind:key="user.id"
        @click="goToUserProfile(user.id)"
      >
        <div class="user-show">
          <div class="user-front">
            <img v-bind:src="user.picture" class="img-fluid">
            <a class="userName">{{user.name}}</a>
            <p>LEVEL - {{user.experience}}</p>
            <!-- <p>RANK - {{user.rank[1]}}</p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  /**
   * Os Users aqui carregados vão precisar apenas
   * do:
   *  nome, picture, level, rank
   */
  data() {
    return {
      userSearch: ""
    };
  },
  methods: {
    goToUserProfile(userid) {
      /**
       * Vai mandar sempre para o mesmo about, depois lá é que se vai
       * ver se quem está a ver o perfil é o próprio
       */
      this.$router.push({
        name: "About",
        params: {
          visiteduserid: userid
        }
      });
    },
    filterUsers(arr) {
      /**
       * Acho que vai ter que ser aqui que
       * se vai controlar a paginação e o numero
       * de threads a mostrar.
       */
      return arr.filter(user => {
        //Nada a filtrar
        if (this.userSearch == "") {
          return true;
        }

        //Filtrar
        if (this.userSearch != "") {
          return user.name
            .toUpperCase()
            .includes(this.userSearch.toUpperCase());
        }
      });
    }
  },
  computed: {
    filteredUsers() {
      let users = this.$store.state.users_root;

      // console.log(this.$store.state, "STATE")
      console.log(users.length, "Users na página Users > filterUserse");

      if (users.length == 0) {
        axios
          .get(
            `http://${this.$store.state.address +
              this.$store.state.port}/data-api/users`
          )
          .then(res => {
            this.$store.state.users_root = res.data;
            console.log(res.data, 'res')
            return this.filterUsers(this.$store.state.users_root);
          })
          .catch(err => {
            console.log(err, "ERRO Users.vue");
          });
      } else {
        //Remediar por agora para mostrar sempre users
        return this.filterUsers(this.$store.state.users_root);
      }

      //Assim só está a fazer o pedido
    }
  }
};
</script>

<style>
.user-show {
  width: 100%;
  height: auto;
  border-bottom: 5px #00ccff solid;
  background: #fff;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: 0.5s;
  margin-bottom: 28px;
}

.user-show img {
  border-radius: 50%;
  margin-bottom: 20px;
  width: 90px;
}

.userName {
  font-size: 15px;
  font-weight: 700;
  font-style: none;
  text-align: center;
  color: black;
}

.user-show p {
  margin-bottom: 0;
}

.user-front {
  width: 100%;
  height: auto;
  position: relative;
  z-index: 10;
  background: #ffffff;
  padding: 15px;
  bottom: 0px;
}

.user-front {
  cursor: pointer;
}
</style>
