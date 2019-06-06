<template>
  <div class="container">
    <div class="header row" style="margin-bottom: 40px;">
      <div class="col-md-4 text-center">
        <img :src="user.picture" class="picture img-fluid" />
      </div>
      <div class="col-md-5">
        <h1>{{ user.name }}</h1>
        <span>Level:{{ user.level }}</span>

        <div class="progress">
          <div
            :style="{ width: getUserProgress }"
            class="progress-bar progress-bar-info"
          ></div>
        </div>
      </div>
      <div class="col-md-3">
        <apexchart
          ref="demoradar"
          type="radar"
          height="250"
          :options="chartOptions"
          :series="series"
          @
        />
      </div>
    </div>

    <ul class="nav nav-tabs" id="nav" style="margin-bottom:1em">
      <!-- Quais e como é que vão ser mostradas as tabs só para o loggedUser -->
      <li class="nav-item">
        <a class="nav-link" v-on:click="ulIndex = 1">About</a>
      </li>

      <li class="nav-item">
        <a class="nav-link" v-on:click="ulIndex = 2">User Badges</a>
      </li>

      <li class="nav-item" v-if="ownProfile">
        <a class="nav-link" v-on:click="ulIndex = 3">My Threads</a>
      </li>
      <li class="nav-item" v-else>
        <a class="nav-link" v-on:click="ulIndex = 3">User Threads</a>
      </li>
      <li v-if="ownProfile" class="nav-item">
        <a class="nav-link" v-on:click="ulIndex = 4">Ranking</a>
      </li>
      <li v-if="ownProfile" class="nav-item">
        <a class="nav-link" v-on:click="ulIndex = 5">Edit Profile</a>
      </li>
    </ul>
    <transition name="fade" mode="out-in">
      <!-- Ver se é melhor usar o v-if ou v-show -->
      <about v-bind:user="user" v-if="ulIndex == 1" />
      <userBadges v-bind:user="user" v-if="ulIndex == 2" />
      <myThreads v-bind:threads="userThreads" v-if="ulIndex == 3" />
      <myrankings v-if="ulIndex == 4" />
      <edit v-bind:user="user" v-if="ulIndex == 5" />
      <!-- <div v-if="ulIndex == 1">
        <h1>1</h1>
      </div>
      <div v-if="ulIndex == 2">
        <h1>2</h1>
      </div>-->
    </transition>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import about from "@/components/About.vue";
import myThreads from "@/components/MyThreads.vue";
import userBadges from "@/components/MyBadges.vue";
import edit from "@/components/editProfile.vue";
import myrankings from "@/components/MyRankings.vue";
export default {
  components: {
    apexchart: VueApexCharts,
    about,
    myThreads,
    userBadges,
    edit,
    myrankings
  },
  data() {
    return {
      user: {},
      /*
       * Também vai ser preciso ir buscar as notificações
       * depois de se verificar que o user está logado
       */
      userNotifications: [],
      /**
       * Estes 3 arrays vão ser aqui preenchidos
       * e depois enviados por props
       * para os components que precisem.
       */
      userThreads: [],
      userAnswers: [],
      userComments: [],
      progress: 0, // Vai estar a ser atualizado dentro do created depois de se ter o user
      imageSrc: "", // Isto vai se buscar ao user
      ulIndex: 1,
      /**
       * Charts:
       * - Mudar estas variáveis para serem as que estão na store (vão estar TODO: )
       */
      series: [
        {
          name: "",
          data: []
        },
        {
          name: "",
          data: []
        }
      ],

      chartOptions: {
        chart: {
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          },
          size: undefined
        },
        yaxis: {
          show: false
        },
        stroke: {
          width: 1
        },
        fill: {
          opacity: 0.5
        },
        plotOptions: {
          radar: {
            size: 70
          }
        },
        labels: ["Upvotes/100", "Threads", "Comments", "Level"]
      }
    };
  },
  created() {
    //O (this) não funciona dentro da async function .... ?????
    console.log(this);

    this.fetchUser();
  },
  mounted() {
    this.loadGraphs();
  },
  computed: {
    checkIndex() {
      console.log(this.ulIndex);
      return this.ulIndex;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getUserProgress() {
      console.log(this.user.experience, "EXPERIENCE");
      if (this.user.experience) {
        console.log(this.user.experience % 100);
        if (this.user.experience % 100 == 0) {
          return "1%";
        } else {
          return (this.user.experience % 100) + "%";
        }
      }
    },
    ownProfile() {
      /**
       * Saber se o user está a ver o seu próprio perfil,
       * comparando o loggedUser com o user que foi carregado
       */

      console.log(this.user, this.$store.state.users.loggedUser, "users");
      if (this.$store.state.users.loggedUser != null) {
        if (this.user.id == this.$store.state.users.loggedUser.id) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    fetchUser() {
      /**
       * FAzer a confirmação se é um user logado
       * a ver o seu próprio perfil ou não,
       * por agora está a fazer a mesma coisa para todos.
       */
      console.log(this.$route.params.userid, "Router params no viewProfile");
      this.$http
        .get(
          `http://${this.$store.getters.getIp}/data-api/users/${
            this.$route.params.userid
          }`
        )
        .then(res => {
          console.log(res.data, "Find user in USER PROFILE");
          let {
            id,
            name,
            picture,
            year,
            // eslint-disable-next-line no-unused-vars
            upvotes,
            course,
            description,
            experience
          } = res.data;
          this.user = new this.$store.state.users.userClass(
            id,
            name,
            experience,
            description,
            year,
            course,
            picture
          );

          /**
           * Tem que vir para aqui para esperar pelo user,
           * ou seja,
           * depois també vêm aqui as funções para
           * ir buscar as answers e os comments
           */
          this.getThreads(this.user.id);
        })
        .catch(err => console.log(err, "ERRO no find user no computed user"));
    },
    getThreads(userid) {
      console.log(userid, "userid");
      this.$http
        .get(
          `http://${
            this.$store.getters.getIp
          }/data-api/threads/userThreads/${userid}`
        )
        .then(res => {
          console.log(
            res.data,
            "Threads que pertencem ao user visitado getThreads()"
          );
          this.userThreads = res.data;
        })
        .catch(err => {
          console.log(err, "Erro no getThreads()");
        });
    },
    getAnswers(threadid) {
      this.$http(
        `http://${
          this.$store.getters.getIp
        }/data-api/threads/${threadid}/answers`
      ).then(res => {
        console.log(res.data, "Answers ");
      });
    },
    // eslint-disable-next-line no-unused-vars
    getComments(answerid) {},
    loadGraphs() {
      console.log(this.$route.params.userid, "id de procura");
      let logged = false;
      let self = false;
      if (this.$store.state.users.loggedUser != null) {
        logged = true;
        if (
          this.$route.params.userid == this.$store.state.users.loggedUser.id
        ) {
          self = true;
        }
      }
      console.log(logged, self);
      if (logged && self) {
        this.series[0].name = "You";
        this.series[1].name = "Average";
        //Começar a fazer o grafico
        //User Upvotes
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userupvotes/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data / 100);
          });

        //Avg Upvotes
        this.$http
          .get(`http://${this.$store.getters.getIp}/data-api/avgupvotes`)
          .then(res => {
            this.series[1].data.push(res.data / 100);
          });

        //Numero de Threads
        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberThreads/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data);
          });
        //Avg
        this.$http
          .get(`http://${this.$store.getters.getIp}/data-api/avgThreads/`)
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Numero de respostas

        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberAnswers/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data);
          });
        //avg
        this.$http
          .get(`http://${this.$store.getters.getIp}/data-api/avgAnswers/`)
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Level

        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userLevel/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            console.log("Nivel", res.data);
            this.series[0].data.push(res.data);
          });
        //avg
        this.$http
          .get(`http://${this.$store.getters.getIp}/data-api/avgLevel`)
          .then(res => {
            this.series[1].data.push(res.data);
          });
      } else if (logged && !self) {
        this.series[0].name = "You";
        console.log("Este USER:", this.user.name);
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/users/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            console.log(res.data);
            this.series[1].name = res.data.name;
          })
          .catch(err => console.log(err));

        //Começar a fazer o grafico

        //Numero Upvotes

        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userupvotes/${
              this.$store.state.users.loggedUser.id
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data / 100);
          });
        //User Visitado
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userupvotes/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data / 100);
          });
        //Numero Threads
        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberThreads/${
              this.$store.state.users.loggedUser.id
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data);
          });
        //User Visitado
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberThreads/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Numero  de respostas
        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberAnswers/${
              this.$store.state.users.loggedUser.id
            }`
          )
          .then(res => {
            this.series[0].data.push(res.data);
          });
        //User Visitado
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberAnswers/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Level

        //User
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userLevel/${
              this.$store.state.users.loggedUser.id
            }`
          )
          .then(res => {
            console.log("Nivel", res.data);
            this.series[0].data.push(res.data);
          });
        //User Visitado
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userLevel/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            console.log("Nivel", res.data);
            this.series[1].data.push(res.data);
          });
      } else {
        this.series[0].name = "Log in Please";
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/users/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            console.log(res.data);
            this.series[1].name = res.data.name;
          })
          .catch(err => console.log(err));

        //Começar a fazer o gráfico

        //Numero de Upvotes
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userupvotes/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data / 100);
          });
        //Numero de Threads
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberThreads/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Numero de respostas
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userNumberAnswers/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            this.series[1].data.push(res.data);
          });
        //Nivel
        this.$http
          .get(
            `http://${this.$store.getters.getIp}/data-api/userLevel/${
              this.$route.params.userid
            }`
          )
          .then(res => {
            console.log("Nivel", res.data);
            this.series[1].data.push(res.data);
          });
      }
    }
  }
};
</script>
<style>
#nav a.router-link-exact-active {
  color: #ffffff;
  background-color: #007bff;
  border-color: #007bff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.header {
  color: #808080;
  margin-left: 10%;
}

.picture {
  height: 200px;
  width: 150px;
  /* position: absolute; */
  /* top: 75px;
  left: -75px; */
}

.picture_mob {
  position: absolute;
  width: 35%;
  left: 35%;
  bottom: 70%;
}
.apexcharts-canvas {
  background: #8d8b8bb6;
}
.fitWindow {
  height: calc(100vh - 200px);
}
</style>
