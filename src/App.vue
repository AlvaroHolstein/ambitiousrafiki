<template>
  <div id="app">
    <Navbar/>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
    <Footer/>
    <searchThing/>
  </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import searchThing from "@/components/searchThing.vue";
import cookie from "cookie";

export default {
  components: {
    Navbar,
    Footer,
    searchThing
  },
  created() {
    /**
     * Por agora só os tags é que são carregados
     * para a store logo ao inicio,
     * só se faz este pedido aqui
     */
    this.$store.dispatch("load_badges");

    /**
     * Tem que se ver se existe alguma cookie de login
     * e caso haja, mandar essa cookie para o servidor
     * para ver se o token ainda é válido
     */
    let parsedCookie = cookie.parse(document.cookie);
    console.log(parsedCookie, "Parsed Cokiie no App.vue");
    if (parsedCookie.login != undefined) {
      this.$http({
        url: `http://${this.$store.getters.getIp}/auth-api/keepLogged`,
        headers: {
          "x-access-token": parsedCookie.login
        }
      })
        .then(res => {
          console.log(res.data);
          if (res.data.auth == true) {
            this.$http
              .get(
                `http://${this.$store.getters.getIp}/data-api/users/${
                  res.data.userId
                }`
              )
              .then(resp => {
                this.$store.commit("users/setLoggedUser", resp.data);
                this.$store.dispatch("users/user_badges").then(() => console.log("memememememememememememememeem"));
              })
              .catch(err => {
                if (err) throw err;
              });
          }
        })
        .catch(err => {
          document.cookie = `login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          this.$store.state.users.loggedUser = null;
          console.log("A cookie foi limpa porque o token já não é válido");
          this.$router.push({
            name: 'home'
          })
        });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
