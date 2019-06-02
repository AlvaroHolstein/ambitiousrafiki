<template>
  <div>
    <div class="container login-container">
      <div class="row">
        <!-- lOGIN -->
        <div class="col-md-6 login-form-1">
          <h3>Login</h3>
          <form v-on:submit.prevent="login()">
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Your Email *"
                v-model="loginEmail"
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Your Password *"
                v-model="loginPassword"
                value
              >
            </div>
            <div class="form-group">
              <input type="submit" class="btnSubmit" value="Login" :disabled="loginEmail==''">
            </div>
          </form>

          <!-- FORGOT PASSWORD -->
          <form v-on:submit.prevent="forgotPassword()">
            <div class="form-group">
              <p class="btnForgetPwd" v-on:click="showfp = !showfp; emailfp = null">Forgot Password?</p>
              <div class="col-md-12" v-show="showfp">
                <p class="form-text">Insert your e-mail and we send you Rafiki</p>
                <input
                  type="email"
                  v-model="emailfp"
                  class="form-control"
                  placeholder="E-mail..."
                  required
                >
                <div class="col-md-12 text-right" style="margin-top: 1rem;">
                  <button type="submit" class="btn btn-success">Enviar</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- REGISTER -->
        <div class="col-md-6 login-form-2">
          <h3>Register</h3>
          <form>
            <div class="form-group">
              <input
                id="inputReg"
                type="text"
                class="form-control"
                placeholder="Your Username"
                v-model="regUsername"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Your Email"
                v-model="regEmail"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Your Password *"
                v-model="regPassword"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm Password *"
                v-model="regConfPassword"
                required
              >
            </div>
            <div class="form-group">
              <input type="button" class="btnSubmit" value="Register" @click="register">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";
import cookie from "cookie";

export default {
  data() {
    return {
      loginEmail: "",
      loginPassword: "",
      regUsername: "",
      regEmail: "",
      regPassword: "",
      regConfPassword: "",
      regConfPassword: "",
      showfp: false,
      emailfp: null
    };
  },
  created() {},
  methods: {
    register() {
      /**
       * Register
       * Falta chamada à API
       * Depois de fazer REgister vai direto para o viewProfile
       */
      if (this.regPassword == this.regConfPassword) {
        /**
         * Depois disto é que se faz a chamada à API
         */
      } else {
        Swal("Password Diferente de Confirmar Password");
      }
    },
    login() {
      /**
       * Login
       * Falta chamada à API
       */
      //Enviar dados à API.
      this.$http
        .post(`http://${this.$store.getters.getIp}/auth-api/login`, {
          email: this.loginEmail,
          password: this.loginPassword
        })
        .then(res => {
          console.log(res, "LOGINNNNNN!!!!!!!");
          let { auth, token, id, user } = res.data;
          if (auth === true) {
            let options = {
              // httpOnly: true,
              maxAge: 9999,
              path: "/"
            };
            let setCookie = cookie.serialize(res.data.cookie, token, options);
            console.log(setCookie, "SET COOKIE");
            document.cookie = setCookie.toString();
            this.$store.commit("users/setLoggedUser", user);
            this.$router.push({
              name: "viewProfile",
              params: {
                userid: this.$store.state.users.loggedUser.id
              }
            })
          }
        })
        .catch(err => {
          Swal.fire("Credencias Erradas", "Username ou password erradas", "error")
          console.log(err, "Erro ao fazer Login");
        });
    },
    forgotPassword() {
      /**
       * Forgot Password
       */
    }
  }
};
</script>


<!-- 
let focusReg = false;
      focusReg = Swal({
        title: "O teu e-mail não está registado ainda",
        text: "Podes te registar na caixa vermelha e tá",
        type: "error",
        animation: false,
        customClass: "animated tada",
        confirmButtonText: "Registar-me",
        preConfirm: resp => {
          document.getElementById("inputReg").focus();
          return true;
        }
        -->
<style>
.login-container {
  margin-top: 5%;
  margin-bottom: 15%;
}
.login-form-1 {
  padding: 1rem;
  background: rgba(9, 71, 204, 0.904);
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 0 5px;
}
.login-form-1 h3 {
  text-align: center;
  margin-bottom: 12%;
  color: #fff;
}
.login-form-2 {
  padding: 1rem;
  background: #f05837;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  padding: 0 5px;
}
.login-form-2 h3 {
  text-align: center;
  margin-bottom: 12%;
  color: #fff;
}
.btnSubmit {
  font-weight: 600;
  width: 50%;
  color: #282726;
  background-color: #fff;
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
}
.btnForgetPwd {
  color: rgb(255, 212, 212);
  /* text-decoration: none; */
  font-family: "Arial Narrow Bold", sans-serif;
}
.btnForgetPwd:active {
  text-decoration: none;
  cursor: help;
  animation: 0.2s change_font;
}
.btnForgetPwd:hover {
  cursor: help;
}
@keyframes change_font {
  from {
    font-family: "Arial Narrow Bold", sans-serif;
  }
  to {
    font-family: Tahoma, "Arial Narrow Bold", sans-serif;
    font-weight: 500;
  }
}
.form-text {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  text-align: center;
}
</style>
<style>
.fitWindow {
  height: calc(100vh - 200px);
}
</style>
