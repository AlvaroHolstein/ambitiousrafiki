<template>


  <footer class="row text-center text-xs-center text-sm-left text-md-left">
    <hr>
  <div class="container-fluid">
	  <div class="row text-center">
		  <div class="col-xs-12 col-md-3">
        <img alt="Vue logo" src="@/assets/logoR.png" style="width: 100px" >
		  </div>
		  <div class="col-xs-12 col-md-3">
        <img alt="Vue logo" src="@/assets/ipp_logo.png" style="width: 100px" >
        <h6>Escola Superior de Media Artes e Design</h6>
		  </div>
		  <div class="col-xs-12 col-md-3">
        <router-link :to="{name:'faq'}" id="faq"><h3 class="footerText">FAQ</h3></router-link>
		  </div>
		  <div class="col-xs-12 col-md-3">
        <h3>HELP</h3>
          <router-link :to="{name:'contactus'}" id="contactus">SEND US AN EMAIL</router-link>
		  </div>
	  </div>
  </div>





    <!--<div class="col-sm-4">
      <img alt="Vue logo" src="@/assets/logoR.png" style="width: 100px" >
    </div>
        <div class="col-sm-4">
      <img alt="Vue logo" src="@/assets/ipp_logo.png" style="width: 100px" >
    </div>
    
    <div class="col-sm-8 text-center">
      <div class="row">
        <div class="col-md-4">
          <img alt="Vue logo" src="@/assets/ipp_logo.png" style="width: 100px" >
          <h3></h3>
        </div>
        <div class="col-md-4">
          <h3>FAQ</h3>
        </div>
        <div class="col-md-4">
          <h3>HELP</h3>
          <router-link to="contactus" id="contactus">Send us an email</router-link>
        </div>
      </div>
    </div> -->
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
footer {
  padding: 10px;
  margin: 0;
  /* background: #282C35;
  color: rgba(255, 255, 255, 0.774); Como estava antes */
  background: rgba(255, 255, 255, 0.774);
  color: #282c35;
  /* border-top: 1px solid #282C35; */
  font-size: 12px;
}
footer > hr {
  border: 3px solid #282c35;
  border-radius: 10px;
  width: 70%;
  /* transition: all 5s; */

  animation: 2s infinite alternate moving-lines;
  /*animation-delay: 2s;*/
}
.footerText {
  color:rgb(40,40,40);
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
#contactus {
  text-decoration: none;
}
</style>
