<template>
  <!-- Form Name -->
  <!-- Text input-->
  <div class="row">
    <div class="col-md-3">
      <img :src="user1.picture" class="picture img-fluid center">
      <!-- <button class="btnChange">Choose avatar</button> -->
      <div v-if="user1.picture.length == 0">
        <input type="file" round class="change-profile-image" @change="onFileChange">
      </div>
      <div v-else>
        <button
          class="delete-profile-image"
          color="secondary"
          icon="delete"
          @click="removeImage"
        >Delete</button>
      </div>
    </div>
    <div class="col-md-9">
      <form>
        <div class="form-group">
          <label class="col-md-4 control-label" for="textinput">Name</label>
          <div class="col-md-8">
            <input
              id="textinput"
              name="textinput"
              placeholder
              class="form-control input-md"
              required
              type="text"
              v-model="user1.name"
            >
          </div>
        </div>
        <!-- Text input-->
        <div class="form-group">
          <label class="col-md-6 control-label" for="textinput">Course</label>
          <div class="col-md-6">
            <input
              id="textinput"
              name="textinput"
              placeholder
              class="form-control input-md"
              required
              type="text"
              v-model="user1.course"
            >
          </div>
          <label class="col-md-2 control-label" for="yearinput">Year</label>
          <div class="col-md-2">
            <input
              id="yearinput"
              name="yearinput"
              placeholder
              class="form-control input-md"
              required
              type="number"
              v-model="user1.year"
            >
          </div>
        </div>

        <!-- Textarea -->
        <div class="form-group">
          <label class="col-md-4 control-label" for="textarea">Bio:</label>
          <div class="col-md-8">
            <textarea
              class="form-control"
              id="textarea"
              name="textarea"
              v-model="user1.description"
            ></textarea>
          </div>
        </div>

        <!-- Button (Double) -->
        <div class="form-group">
          <div class="col-md-8">
            <button
              id="btnSave"
              name="btnSave"
              class="btn btn-success"
              @click.prevent="saveProfile"
            >Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import cookie from "cookie";
import Swal from "../../node_modules/sweetalert2/dist/sweetalert2.js";
import "../../node_modules/sweetalert2/src/sweetalert2.scss";
export default {
  props: ["user"],
  data() {
    return {
      user1: this.user
    };
  },
  created() {
    console.log(this.user1);
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.user1.picture = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function(e) {
      this.user1.picture = "";
    },
    saveProfile() {
      let sendUser={
        name:this.user1.name,
        picture:this.user1.picture,
        course:this.user1.course,
        description:this.user1.description,
        year:this.user1.year
      }
      let data = {
        user: sendUser
      };
      console.log(data,"USER A SER ENVIADO")
      let parsedCookie = cookie.parse(document.cookie);
      console.log(parsedCookie.login, "Parsed Cokiie no App.vue");
      let headers = {
        "x-access-token": parsedCookie.login
      };
      this.$http
        .put(
          `http://${this.$store.getters.getIp}/data-api/users/${this.user1.id}`,
          data,
          {
            headers: headers
          }
        )
        .then(res => {
          Swal({
            title: "Inglês",
            type: "success"
          });
        });
      // this.$router.push({
      //   name: "viewProfile",
      //   params: { userid: this.user1.id }
      // });
    }
  }
};
</script>
<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
}
.btnChange {
  display: block;
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>
