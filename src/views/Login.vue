<template>
  <div>
    <div class="container login-container">
      <div class="row">
        <div class="col-md-6 login-form-1">
          <h3>Login Now</h3>
          <form v-on:submit.prevent="submitfp()">
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Your Email *"
                v-model="inputEmail"
                value
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Your Password *"
                v-model="inputPassword"
                value
              >
            </div>
            <div class="form-group">
              <input
                type="button"
                class="btnSubmit"
                value="Login"
                @click="login"
                :disabled="inputEmail==''"
              >
            </div>
            <div class="form-group">
              <p
                href="#"
                class="btnForgetPwd"
                v-on:click="showfp = !showfp; emailfp = null"
              >Forgot Password?</p>
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
        <!-- <div class="col-md-6 login-form-2" style="border-radius: 10px;">
          <a href="#" class="btnForgetPwd">Forgot Password?</a>
        </div>-->
        <!-- </form> -->
        <div class="col-md-6 login-form-2">
          <h3>Register Now</h3>
          <form>
            <div class="form-group">
              <input
                id="inputReg"
                type="text"
                class="form-control"
                placeholder="Your Username"
                v-model="newUsername"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="email"
                class="form-control"
                placeholder="Your Email"
                v-model="newEmail"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Your Password *"
                v-model="newPassword"
                required
              >
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                placeholder="Confirm Password *"
                v-model="newCPassword"
                required
              >
            </div>
            <div class="form-group">
              <input type="button" class="btnSubmit" value="Register" @click="addUser">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";

class User {
  constructor(id, nome, pass, mail, exp, desc, foto, follow, skill) {
    //fazer nos getter's a atribuição de badges, level e rank
    this.id = id; //Não vai ser preciso fazer o getId aqui, porque já é feito nos dois sitios onde os utilizadores são adicionados
    this.name = nome;
    this.password = pass;
    this.email = mail;
    this.exp = exp;
    this.level = this.getLevel();
    this.rank = this.getRank();
    this.desc = desc;
    this.picture = foto;
    this.follow = follow;
    this.skill = skill; //Isto devia ser um array, um gadjo pode ter váriass skills
  }

  getLevel() {
    return Math.floor(this.exp / 100) + 1;
  }

  getRank() {
    //Vai ter que se fazer um switch para dar os nomes aos ranks
    let rank = Math.floor(this.level / 10);
    let trueRank = null;

    switch (
      rank //O calculo do rank deve estar mal....
    ) {
      case 0:
        trueRank = "A começar";
        break;
      case 1:
        trueRank = "grande";
        break;
      case 2:
        trueRank = "muito grande";
        break;
    }
    console.log(trueRank);
    console.log(rank);
    return [rank, trueRank];
  }
}

export default {
  data() {
    return {
      users: this.$store.getters.getUsers,
      users: [],
      inputEmail: "",
      inputPassword: "",
      newUsername: "",
      newEmail: "",
      newPassword: "",
      newCPassword: "",
      showfp: false,
      emailfp: null,
      newCPassword: ""
    };
  },
  created() {
    this.users = this.$store.getters.getUsers;
  },
  methods: {
    getLastID() {
      let maior;
      if (this.users.length != 0) {
        this.users.sort(function(a, b) {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
        });
        //Por isto a dar
        console.log("Dá?" + this.users.length);
        console.log("ID:" + this.users);
        maior = this.users[this.users.length - 1].id;
        console.log(maior);
        return maior;
      } else {
        return 0;
      }
    },
    addUser() {
      //Verificar email, depois username
      let emailExists = this.users.some(user => user.email == this.newEmail);
      let usernameExists = this.users.some(
        user => user.name == this.newUsername
      );
      console.log("Email Existe:" + emailExists);
      console.log("Nome existe:" + usernameExists);

      if (this.newPassword == this.newCPassword) {
        let id = this.getLastID() + 1;
        if (emailExists || usernameExists) {
          Swal("Já Existe alguém com essas credenciais");
        } else {
          this.$store.dispatch(
            "addUserAct",
            new User(
              id,
              this.newUsername,
              this.newPassword,
              this.newEmail,
              0,
              "Newbie",
              "",
              "http://www.coffeebrain.org/wiki/images/9/93/PEOPLE-NoFoto.JPG",
              [],
              "programador",
              [],
              []
            )
          );
          Swal("Utilizador registado com sucesso");
          this.$store.dispatch("authentication");
          this.$store.dispatch("change_loginid", id);
          this.$router.push({
            name: "AboutMe",
            params: { userid: id }
          });
          location.reload();
        }
      } else {
        Swal("Password Diferente de Confirmar Password");
      }
    },
    login() {
      console.log(this.users);
      // let id = this.users.filter(user => {
      //   if (
      //     user.email == this.inputEmail &&
      //     user.password == this.inputPassword
      //   ) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })[0].id;
      let id = this.users.filter(user => {
        if (
          user.email == this.inputEmail &&
          user.password == this.inputPassword
        ) {
          return true;
        } else {
          return false;
        }
      });
      console.log(id);
      if (id.length > 0) {
        this.$store.dispatch("authentication");
        this.$store.dispatch("change_loginid", id[0].id);
        this.$router.push({
          name: "AboutMe",
          params: { userid: id[0].id }
        });
      } else {
        Swal("Credenciais Erradas");
      }
    },
    submitfp() {
      console.log("E-mail Forgot Password - " + this.emailfp);
      console.log(this.users);

      //Ver se o email está na "base de dados"
      let esquecido = this.users.find(user => user.email == this.emailfp);

      if (esquecido != undefined) {
        let user = {
          user_name: esquecido.name,
          user_pass: esquecido.password,
          user_email: esquecido.email
        };

        Swal({
          title: "A enviar",
          // showLoaderOnConfirm: true,
          onBeforeOpen: () => {
            Swal.showLoading();

            emailjs.send("outlook", "template_n921A41V", user).then(
              response => {
                console.log("SUCCESS!", response.status, response.text);

                Swal({
                  type: "success",
                  title: "Tranquilo",
                  text: `Mandamos um mail para o ${
                    this.emailfp
                  } com a tua passe!!!`,
                  animation: false,
                  customClass: "animated tada"
                });
              },
              error => {
                console.log("Falhou.....!", JSON.parse(error.text));
                Swal({
                  type: "error",
                  title: "Alguma coisa correu mal, \nTenta mais tarde.",
                  text: `Erro: ${JSON.parse(error.text).error}`
                });
              }
            );
          }
        });
      } else {
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
        });

        console.log(focusReg.preConfirm);

        if (focusReg) {
          console.log("ata");
          document.getElementById("inputReg").focus();
        }
      }
    }
  }
};
</script>


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
