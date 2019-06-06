<template>
  <div>
    <div class="text-center" style="margin-bottom: 100px;">
      <h1>Contact us</h1>

      <form v-on:submit.prevent="submit">
        <div class="row" style="margin-bottom: 20px">
          <div class="col-md-2"></div>

          <div class="col-md-8" style="text-align: left">
            <div>
              <select v-model="form.subject">
                <option value disabled selected hidden>Choose</option>
                <option value="duvida">Duvida</option>
                <option value="recomendacao">Recomendação</option>
                <option value="reclamacao">Reclamação</option>
              </select>
            </div>
            <h4>{{form.user_name}}</h4>Name:
            <input type="text" v-model="form.user_name" class="form-control">
            <h4>{{form.user_email}}</h4>E-mail:
            <input type="text" v-model="form.user_email" class="form-control">
            <br>
            <br>
            <h4>Message</h4>
            <textarea cols="30" rows="17" v-model="form.text" class="form-control"></textarea>
          </div>
          <div class="col-md-2"></div>
        </div>
        <button type="submit" class="btn btn-danger">Submit</button>
      </form>
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
      form: {
        subject: "",
        user_name: "",
        user_email: "",
        text: "",
      }
    };
  },
  methods: {
    submit() {
      
      this.$http.post(`http://${this.$store.getters.getIp}/data-api/contact`,{
        email:this.form.user_email,
        name:this.form.user_name,
        message:this.form.text,
        subject:this.form.subject,
      }).then(res=>console.log(res))
    }
  }
};
</script>

<style>
textarea {
  resize: none;
}
</style>
