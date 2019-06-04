<template>
  <div id="searchBox">
    <div class="cont btn-group dropup">
      <button id="searchButton" type="button" class="btn btn-primary" data-toggle="dropdown">
        <i class="fas fa-plus"></i>
      </button>
      <div id="dropsSearchThing" class="dropdown-menu">
        <a v-on:click="cTid" class="dropdown-item botoesSearchThing">Create Thread</a>
        <a
          class="botoesSearchThing dropdown-item"
          data-toggle="modal"
          data-target="#modalSearch"
          v-on:click="openDialog"
        >Search</a>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="modalSearch"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <!-- data-backdrop="false", para não deixar a modal ao clicar fora desta -->
      <div id="contentor" class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="col-md-12">
              <h1 class="text-center" style="display: inline-block; width: 50%;">Search</h1>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true bg-blue">&times;</span>
              </button>
            </div>
            <div class="col-md-12">
              <div class="searchbar">
                <input
                  id="search"
                  type="text"
                  class="search_input form-control"
                  placeholder="Find what you want"
                  v-model="searchText"
                >
                <a class="search_icon">
                  <i class="fas fa-search"></i>
                </a>
              </div>
            </div>
            <div class="row containerDropdowns">
              <div v-for="(res, incr) in theSearch" v-bind:key="incr" class="col-md-12 dropdowns">
                <div class="userImg text-center">
                  <i v-if="res.name == undefined" class="fas fa-atom"></i>
                  <i v-else class="fas fa-user"></i>
                </div>
                <div class="desc">
                  <a
                    v-if="res.name == undefined"
                    v-bind:class="defineClass(res.id, 'thread')"
                    v-on:click="incrementar(res.id)"
                  >{{res.title}}</a>
                  <a
                    v-else
                    v-bind:class="defineClass(res.id, 'user')"
                    v-on:click="goToUser(res.id)"
                  >{{res.name}}</a>
                </div>
              </div>
            </div>
            <div class="row">
              <div v-if="showPagination" class="col-md-12 text-center">
                <nav aria-label="Page navigation example" style="display:inline-block;">
                  <ul class="pagination">
                    <li v-if="navigation > 0" v-on:click="navigate($event)" class="page-item">
                      <a class="page-link prev" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>
                    <li
                      class="page-item navigation"
                      v-for="page in cont"
                      v-on:click="navigationNumbers(page)"
                      v-bind:class="{active: page == 1 ? true : false}"
                      v-bind:key="page"
                    >
                      <a class="page-link" href="#">{{page}}</a>
                    </li>

                    <li v-if="navigation < cont -1" v-on:click="navigate($event)" class="page-item">
                      <!-- VAi ser preciso controlar se se mostra esta seta ou não
                      pode se controlar isso pela página em que o user está-->
                      <a class="page-link next" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*npm Libraries*/
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";

export default {
  data() {
    return {
      showSearchBar: true,
      users: this.$store.state.users,
      threads: this.$store.state.threads,
      loginID: this.$store.getters.getloginID,
      searchText: null,
      cont: 0,
      showPagination: false,
      navigation: 0, // "página" atual (entre 0 e máximo de páginas -1)
      maxEle: 5,
      index: 0 //Index para controlar os divs no modal de search
    };
  },
  mounted() {
    // $("li.navigation")[0].className = "page-item navigation active"
    // console.log($("li.navigation"));
    let search = document.querySelector("#search");
    search.addEventListener("keydown", event => {
      if (this.searchText != null && this.searchText != "") {
        console.log(event.key);
        this.navigateSearch(event);
      }
    });
  }, //a
  methods: {
    defineClass(id, type) {
      return `${id} ${type}`;
    },
    navigateSearch({ key, target }) {
      //Variavel para saber em que "casa" do array final de search,
      //o cursor está.
      let dropdowns = $("div.dropdowns");
      // console.log(dropdowns);
      let type = null,
        targetId = null;
      /**
       * Saber em que div está,
       * controlar a div em que está,
       * criar um indice
       */

      if (dropdowns.length > 0) {
        if (key == "ArrowUp") {
          if (this.index > 0) this.index--;
        } else if (key == "ArrowDown") {
          if (this.index < dropdowns.length - 1) this.index++;
        }
        console.log(this.index);
        console.log(dropdowns[this.index].children[1]);
        if (this.index > dropdowns.length) this.index = 0; // Previne os erros caso o index não seja atualizado e seja maior que o dropdowns
        type = dropdowns[this.index].children[1].children[0].className.split(
          " "
        )[1];
        targetId = dropdowns[
          this.index
        ].children[1].children[0].className.split(" ")[0];
        console.log({ type: type }, { targetId: targetId });

        for (let i = 0; i < dropdowns.length; i++) {
          if (this.index == i) {
            dropdowns[i].className = "col-md-12 dropdowns activeSearch";
          } else {
            dropdowns[i].className = "col-md-12 dropdowns";
          }
        }

        //Isto tem que ficar para ultimop que é para o this.index estar atualizado
        if (key == "Enter") {
          // Verificar o index do div que está selecionado
          // e ir buscar a informação à variavel dropdowns

          if (type == "thread") this.incrementar(targetId);
          else this.goToUser(targetId);
        }
      } else {
        this.index = 0; //Para voltar ao inicio se a pesquisa não tiver resultados
      }
    },
    incrementar(threadid) {
      this.$router.push({
        name: "thread",
        params: {
          threadid: threadid
        }
      });
      this.$store.dispatch("increment_views", threadid);
      location.reload();
    },
    goToUser(usid) {
      this.$router.push({
        name: "viewprofile",
        params: {
          visiteduserid: usid
        }
      });
      location.reload();
    },
    openDialog() {
      setTimeout(() => {
        let search = document.querySelector("#search");
        search.focus();
      }, 500);
    },
    cTid() {
      console.log("este e o id" + this.loginID);
      this.$router.push({
        name: "createThread",
        params: { userId: this.loginID }
      });
    },
    trimTitle(title) {
      let index1 = title.indexOf(">");
      let index2 = title.indexOf("<", index1);

      return title.substring(index1 + 1, index2);
    },
    navigate(eve) {
      // console.log(eve.path[0].tagName, 'alala')

      // for (let el of eve.path) {
      //   console.log(el.tagName);
      // }

      // Toggle the active class in the navigationList
      let navigationList = $("li.navigation");
      // console.log(navigationList);

      const path = eve.path;
      if (
        (path[0].className.includes("next") ||
          path[1].className.includes("next")) &&
        this.navigation < this.cont
      ) {
        console.log("mais");
        this.navigation++;
      }
      if (
        (path[0].className.includes("prev") ||
          path[1].className.includes("prev")) &&
        this.navigation > 0
      ) {
        console.log("menos");
        this.navigation--;
      }

      for (let i = 0; i < navigationList.length; i++) {
        // console.log(i);
        if (i == this.navigation)
          navigationList[i].className = "page-item navigation active";
        else navigationList[i].className = "page-item navigation";
      }
      console.log(this.navigation);
    },
    navigationNumbers(index) {
      this.navigation = index - 1;
      let navigationList = $("li.navigation");
      for (let i = 0; i < navigationList.length; i++) {
        // console.log(i);
        if (i == this.navigation)
          navigationList[i].className = "page-item navigation active";
        else navigationList[i].className = "page-item navigation";
      }
      this.theSearch;
    }
  },
  computed: {
    fillArray() {
      this.users = this.$store.state.users;
    },
    theSearch() {
      let aux = [];

      // Filtrar os Users
      if (this.searchText != null) {
        aux = this.users.filter(user =>
          user.name.toUpperCase().includes(this.searchText.toUpperCase())
        );

        // Filtrar Threads
        let auxThreads = [];
        auxThreads = this.threads.filter(thread =>
          thread.title.toUpperCase().includes(this.searchText.toUpperCase())
        );

        if (auxThreads.length > 0) {
          for (let thread of auxThreads) {
            //Limpar o titulo das threads para ser apresentável.
            if (thread.title[0] == "<") {
              thread.title = this.trimTitle(thread.title);
            }
            //Inserir-las no mesmo array que os users
            aux.push(thread);
          }
        }
      }

      // "Esvaziar" o array para o caso de não ter nada escrito
      if (this.searchText == "") {
        aux = [];
      }

      // MOstrar ou não a paginação
      if (aux.length >= 5) {
        //Determinar as "páginas" da paginação, por agora cada "página" vai mostrar 5 elementos
        let nPages = Math.ceil(aux.length / 5);
        this.cont = nPages;
        this.showPagination = true;

        let finalArr = [];
        let begin = this.cont == 1 ? 0 : this.navigation * this.maxEle;
        let end = begin + 5;
        for (let i = begin; i < end; i++) {
          if (aux[i] != undefined) finalArr.push(aux[i]);
        }
        // console.log(finalArr);
        return finalArr;
      } else this.showPagination = false;

      // console.log(nPages, aux.length);

      return aux;
    }
  }
};
</script>

<style>
#main {
  position: absolute;
  right: 0;
  display: inline-block;
  text-align: right;
}

#searchBox {
  display: block;
  position: fixed;
  right: 10px;
  bottom: 0;
  z-index: 100;
}
#searchBox > div.cont {
  padding: 2px;
  border-radius: 5px;
  margin: 5px;
  background-color: green;

  /* animation: 2s infinite alternate moving-lines; */

  animation: 10s infinite trocarCoresDiv;
}
#searchButton {
  background-color: initial;
  border: none;
}

@keyframes trocarCoresDiv {
  from {
    background-color: #60cae2;
  }
  to {
    background-color: #1c91c2;
  }
}
#searchBox div.dropdown-divider {
  border: 1px solid rgb(20, 247, 255);
  width: 100%;
  margin-left: 75px;
  animation: 5s infinite trocarCoresBorder;
}
@keyframes trocarCoresBorder {
  from {
    border-color: rgb(80, 253, 80);
  }
  to {
    border-color: rgb(223, 139, 43);
  }
}
#searchBox .botoesSearchThing {
  padding: 0px 5px 0px 0px;
  margin: 0px;
  /* border: 1px solid green; */
  border-radius: 10px;
  background-color: white;
  /* width: auto; */
  /* text-align: right; */

  /* animation: 10s infinite trocarCoresBorder; */
}
#searchBox div.dropdown-item.drop {
  padding: 0px;
  margin: 0px;
  display: inline-block !important;
}
#searchBox div#dropsSearchThing {
  border: none;
  cursor: pointer;
  padding: 0px 10px 10px 0px;
  /* background-color: rgba(255, 255, 255, 0); */
  width: 100px !important;
}
#searchBox div#dropsSearchThing a {
  font-weight: 600;
}
#searchBox div#dropsSearchThing a:hover {
  background-color: #1c91c2;
  color: white;
}

#searchBox .modal-backdrop {
  display: none;
}
#searchBox div.searchbar {
  margin-bottom: auto;
  margin-top: auto;
  height: 60px;
  background-color: #d6d5d5;
  border-radius: 20px;
  padding: 10px;
}
#searchBox div.searchbar > input.search_input,
#searchBox input.search_input:focus {
  color: white;
  border: 0;
  outline: 0;
  background: none;
  caret-color: transparent;
  line-height: 40px;
  border-color: #353b48;
  width: 85%;
  margin: 0 !important;
  display: inline-block;
  caret-color: black;
}
#searchBox .devilhr {
  border: 3px solid #282c35;
  border-radius: 10px;
  width: 70%;
  /* transition: all 5s; */

  animation: 2s infinite alternate moving-lines;
  /*animation-delay: 2s;*/
}
@keyframes moving-lines {
  from {
    /* stroke-dashoffset: 6000; */
    border-color: black;
  }
  to {
    /* stroke-dashoffset: 0; */
    border-color: rgb(68, 68, 214);
  }
}
#searchBox div.modal-footer {
  padding: 0px;
  padding-right: 10%;
  border: 0;
  padding-bottom: 2%;
}
#searchBox div.searchbar > a.search_icon {
  margin-left: 5%;
  height: auto;
  color: white;
  padding: 2px;
}
#searchBox div.searchbar > a.search_icon:hover {
  color: #1c91c2;
  cursor: pointer;
  /* background-color: white;
  border-radius: 50px; */
}
#searchBox button.btn {
  background-color: #129dfa;
  color: white;
}
#searchBox div.row > div.dropdowns {
  margin-bottom: 2px;
  margin-top: 2px;
  height: 60px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #129dfa;
  padding: 10px;
}
#searchBox div.row.containerDropdowns {
  width: 95%;
  margin: 3% 2.5%;
}
#searchBox div.dropdowns:hover {
  background-color: rgb(202, 207, 255) !important;
  cursor: pointer;
}
#searchBox .col-md-12.dropdowns.activeSearch {
  background-color: rgb(202, 207, 255) !important;
  cursor: pointer;
}
#searchBox div.userImg {
  width: 20%;
  margin-top: 10px;
  background-color: rgb(202, 207, 255);
  border-radius: 20px;
  display: inline-block !important;
}
#searchBox div.desc {
  width: 80%;
  display: inline-block !important;
  padding-left: 5px;
}
#searchBox div.midlePagination {
  padding: 0% 10%;
  display: block;
  text-align: center;
}
/* div#contentor {
   background-color: blue;
} */
#searchBox li.navigation.active {
  background-color: rgb(202, 207, 255);
}
#searchBox li.navigation.active > a {
  color: black !important;
  font-weight: bold;
}
</style>
