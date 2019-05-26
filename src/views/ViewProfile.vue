<template>
  <div class="container">
    <div class="header row" style="margin-bottom: 40px;">
      <div class="col-md-4 text-center">
        <img :src="user.picture" class="picture img-fluid">
      </div>
      <div class="col-md-5">
        <h1>{{user.name}}</h1>
        <span>Level:{{user.level}}</span>

        <div class="progress">
          <div
            :style="{'width': getUserProgress}"
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

    <!-- Routing for the user info (caredo que bom inglês) -->
    <ul class="nav nav-tabs" id="nav" style="margin-bottom:1em">
      <li class="nav-item">
        <button class="btn btn-primary" v-on:click="ulIndex = 1">About</button>
      </li>

      <li class="nav-item">
        <button class="btn btn-primary" v-on:click="ulIndex = 2">User Badges</button>
      </li>
      <!--
        <li v-if="$store.state.user" class="nav-item">
        <router-link
          :to="{name:'MyThreads'}"
          :class="{'nav-link':true}"
        >{{ownProfile ? 'My Threads' : 'User Threads'}}</router-link>
      </li>
       <li class="nav-item">
        <router-link
          v-show="ownProfile"
          :to="{name:'MyRankings'}"
          :class="{'nav-link':true}"
        >My Ranking</router-link>
      </li>
      <li class="nav-item">
        <router-link
          v-show="ownProfile"
          :to="{name:'EditProfile'}"
          :class="{'nav-link':true}"
        >Edit Profile</router-link>
        </li>
      -->
    </ul>
    <transition name="fade" mode="out-in">
      <about v-bind:user="user" v-if="ulIndex == 1"/>
      <!-- <userBadges v-if="ulIndex == 2"/> -->
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
// import userBadges from "@/components/MyBadges.vue";

export default {
  components: {
    apexchart: VueApexCharts,
    about
    // userBadges
  },
  data() {
    return {
      // users: this.$store.getters.getUsers,
      user: {},
      ownProfile: false,
      progress: 0, // Vai estar a ser atualizado dentro do created depois de se ter o user
      imageSrc: "", // Isto vai se buscar ao user
      ulIndex: 1,
      /**
       * Charts:
       * - Mudar estas variáveis para serem as que estão na store (vão estar TODO: )
       */
      series: [
        {
          name: "You",
          data: []
        },
        {
          name: "Average",
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
    this.fetchUser();
    this.checkIndex;
  },
  computed: {
    checkIndex() {
      console.log(this.ulIndex);
      return this.ulIndex;
    },
    getUserProgress() {
      console.log(this.user.experience % 100, "EXPERIENCE");
      if (this.user.experience) return this.user.experience % 100;
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
          console.log(this.user, "User depois de passar pela class");
        })
        .catch(err => console.log(err, "ERRO no find user no computed user"));
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

