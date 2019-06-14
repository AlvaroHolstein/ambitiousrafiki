-<template>
  <div class="container">
    <h3>Notifications</h3>
    <div
      v-for="(noti, cont) of userNotifications"
      v-bind:key="cont"
      v-bind:class="{ 'seen': noti.visto, 'NotSeen': !noti.visto }"
      v-if="$store.state.users.loggedUser.notifications.length != 0"
    >
      <div class="row">
        <div class="col-md-12">
          <ul class="list-inline">
            <li class="list-inline-item">
              <input
                type="checkbox"
                class="mx-left checks"
                v-bind:id="noti.id"
                v-on:click="pick($event)"
              >
            </li>
            <li class="list-inline-item" v-on:click="seenNotification(noti.id)">
              <router-link
                v-bind:to="{ name: 'thread', params: { threadid: noti.idThread } }"
                class="dropdown-item"
                v-bind:class="{ 'bgNoti': noti.visto, 'textNoti': noti.visto }"
              >
                <i class="far fa-flag ii"></i>
                {{
                noti.userInfo != undefined
                ? noti.userInfo.name + " - " + noti.text
                : ""
                }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="text-center">Não tens mais notificações</h1>
    </div>
    <div class="text-center" id="bottomDiv">
      <button
        v-show="rmNotifications.length > 0"
        class="btn btn-outline-dark"
        v-on:click="remove_notifications()"
      >Apagar</button>
    </div>
  </div>
</template>

<script>
import cookie from "cookie";
export default {
  data() {
    /* return {
      loginID: this.$store.getters.getloginID,
      loginUser: null,
      users: this.$store.getters.getUsers
    };*/
    return {
      // notis_: this.$store.state.users.loggedUser.notifications != null ? this.$store.state.users.,
      user_: this.$store.state.users.loggedUser,
      rmNotifications: []
    };
  },
  created() {
    //Encontrar user logado
    /*this.loginUser = this.$store.getters.getUsers.filter(
      us => us.id == this.loginID
    )[0];*/
  },
  methods: {
    pick(event) {
      console.log(event.target.id);
      let checkNoti = $(".checks");
      console.log(checkNoti);
      if (event.target.checked) {
        this.rmNotifications.push(Number(event.target.id));
      } else {
        let index = this.rmNotifications.findIndex(
          btn => btn == event.target.id
        );
        if (index != -1) this.rmNotifications.splice(index, 1);
      }
      console.log(this.rmNotifications);
    },
    seenNotification(id) {
      //Check if notification is true
      let notifi = this.$store.state.users.loggedUser.notifications.find(
        noti => noti.id == id
      );
      console.log(notifi);
      if (notifi.visto != true) {
        let parsedCookie = cookie.parse(document.cookie);

        console.log(this.user_, "PARSED COOOOOOOOOOOOOOOOOOOOOOOOOKIE");
        this.$http({
          url: `http://${this.$store.getters.getIp}/data-api/users/${
            this.user_.id
          }/updatenotification/${id}`,
          method: "put",
          headers: { "x-access-token": parsedCookie.login }
        })
          .then(res => {
            console.log(id, "seenNotification");
            this.$store.commit("users/viewOrNotNotification", id);
            // let notiChange = this.$store.state.users.loggedUser.notifications.filter(
            //   noti => noti.id == id
            // );
            // notiChange[0].visto = true;
            // let index = this.$store.state.users.loggedUser.notifications.findIndex(
            //   notification => notification.id == notiChange[0].id
            // );
            // this.$store.state.users.loggedUser.notifications.splice(index, 1);
            // this.$store.state.users.loggedUser.notifications.push(notiChange);
            // console.log(res);
          })
          .catch(err => console.log(err, "erro no updateNoti"));
      } else {
        console.log("Já Foi Vista");
      }
    },
    deleteNotification(id) {
      // Passou a chamar se remove_notifications()
      /*let parsedCookie = cookie.parse(document.cookie);
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.$http
        .(`http://${this.$store.getters.getIp}/data-api/users/${this.user_.id}/updatenotification/${id}`, {
          headers: headers
        })
        .then(res => { 
          let notiChange = this.loggedUser.notifications.filter(noti => noti.id == id)
          notiChange[0].visto = true
        })
        .catch(err => console.log(err, "erro no updateNoti"));*/
    },
    checkeds() {
      let checkNotis = $(".checks");
      for (let i of checkNotis) {
        console.log(i, "leleleleleell");
      }
      return checkNotis.filter(btn => console.log(btn, "alalalal"));
    },
    remove_notifications() {
      if (this.rmNotifications.length > 0) {
        this.$http({
          url: `http://${
            this.$store.getters.getIp
          }/data-api/users/removenotification/${
            this.$store.state.users.loggedUser.id
          }`,
          method: "PUT",
          headers: {
            "x-access-token": cookie.parse(document.cookie).login
          },
          data: {
            notifications: this.rmNotifications
          }
        }).then(res => {
          if (res.data.success) {
            this.$store.commit("users/removeNotis", this.rmNotifications);
          }
        });
      }
    }
    /* notificacaoVista(id) {
      let indexUser = this.users.findIndex(us => us.id == this.loginUser.id);
      let indexNoti = this.loginUser.notifications.findIndex(
        not => not.id == id
      );
      //Mandar index user e index notificacao no user
      this.$store.dispatch("change_notification_status", {
        indexUser: indexUser,
        indexNoti: indexNoti
      });
    }*/
  },
  computed: {
    userNotifications() {
      return this.$store.state.users.loggedUser != null
        ? this.$store.state.users.loggedUser.notifications
        : [];
    }
    /*loginUserNotifications() {
      if (
        this.$store.state.users.loggedUser.notifications.length > 0 &&
        this.$store.state.users.loggedUser.notifications[0] != null
      )
        return this.$store.state.users.loggedUser.notifications;

      return [{}];
    }*/
    /*notificacoes() {
      let aux = this.loginUser.notifications;
      aux = aux.reverse();
      let aux2 = [];
      for (let i = 0; i < aux.length; i++) {
        if (aux[i] != undefined) aux2.push(aux[i]);
      }
      // console.log(aux2);
      return aux2;
    }*/
  }
};
</script>
<style>
.alert {
  border: 0;
  border-radius: 10px;
  padding: 20px 15px !important;
  font-weight: 400;
  color: #fff !important;
}
.NotSeen {
  border: 1px solid red;
}
.seen {
  border: 1px solid black;
}
span.Info {
  font-weight: bold;
  font-size: 2.2vh;
  font-family: verdana;
}
.checks {
  background-color: black;
}
#bottomDiv {
  margin-top: 10px;
}
</style>
