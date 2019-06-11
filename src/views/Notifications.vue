<template>
  <div class="container">
    <h3>Notifications</h3>
    <div
      v-for="(noti, cont) of userNotifications"
      v-bind:key="cont"
      v-on:click="seenNotification(noti._id)"
      v-bind:class="{seen: noti.visto, NotSeen: !noti.visto}"
    >
      <div class="container">
        <div>
          <router-link
            v-bind:to="{name: 'thread', params: {threadid: noti.idThread}}"
            class="dropdown-item"
            v-bind:class="{ 'bgNoti': noti.visto, 'textNoti': noti.visto }"
          >
            <i class="far fa-flag ii"></i>
            {{noti.userInfo != undefined ? noti.userInfo.name + " - " + noti.text : ""}}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    /* return {
      loginID: this.$store.getters.getloginID,
      loginUser: null,
      users: this.$store.getters.getUsers
    };*/
    return {
      notis_: this.$store.state.users.loggedUser.notifications
    };
  },
  created() {
    //Encontrar user logado
    /*this.loginUser = this.$store.getters.getUsers.filter(
      us => us.id == this.loginID
    )[0];*/
  },
  methods: {
    seenNotification(id) {
      
      console.log(id, "seenNotification");
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
      return this.notis_;
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
    background-color: yellow !important;
}
.seen {
  background-color: red !important;
}
span.Info {
  font-weight: bold;
  font-size: 2.2vh;
  font-family: verdana;
}
</style>