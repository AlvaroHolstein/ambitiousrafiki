<template>
<div class="container"> 
  <div class="row">
    <div class="col-md-12">
      <br>
      <h2>Badges</h2>
      <br>
      <h4>Helpful Awards</h4>
      <hr>
    </div>
  </div>
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(badge) in $store.state.badges" v-if="badge.category==='help'" v-bind:key="badge.id">
			<div class="offer offer-radius offer-success">
				<div class="shape">
					<div class="shape-text">
						<p>{{badge.id}}</p>		
					</div>
				</div>
				<div>
					<h3 class="offer-content">
						{{badge.name}}
					</h3>
					<p class="offer-content2">
              {{badge.desc}}
					</p>
				</div>
			</div>
		</div>	
	</div>

  <!-- AQUI COMEÇAM OS RANKING AWARDS--> 
  <div class="row">
    <div class="col-md-12">
      <br>
      <h4>Ranking Awards</h4>
      <hr>
    </div>
  </div>
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3" v-for="(badge) in $store.state.badges"  v-if="badge.category==='rank'" v-bind:key="badge.id">
			<div class="offer offer-radius offer-warning">
				<div class="shape">
					<div class="shape-text">
						<p>{{badge.id}}</p>		
					</div>
				</div>
				<div>
					<h3 class="offer-content">
						{{badge.name}}
					</h3>
					<p class="offer-content2">
              {{badge.desc}}
					</p>
				</div>
			</div>
		</div>	
	</div>
  <br>


</div>


</template>

<script>
export default {
  name: "helpBadges",
  data: function() {
    return {
      helpBadges: [],
      rankBadges: []
    };
  },
  /*created() {
    this.helpBadges = [
      {
        id: 1,
        name: "Nice, you're helpful!",
        text: "Give 10 answers",
      },
      {
        id: 2,
        name: "Damn! You know alot!",
        text: "Give 20 answers",
      },
      {
        id: 3,
        name: "We don't deserve you!",
        text: "Give 30 answers",
      },
      {
        id: 4,
        name: "You're like a guru!",
        text: "Give 40 answers",
      },
      {
        id: 5,
        name: "Rafiki, is that you?",
        text: "Give 50 answers",
      }
    ];
  this.rankBadges = [
    {
        id: 1,
        name: "THE 100 BEST",
        text: "Reach TOP 100",
      },
      {
        id: 2,
        name: "Keep climbing!",
        text: "Reach TOP 60",
      },
      {
        id: 3,
        name: "Leave them behind!",
        text: "Reach TOP 50",
      },
      {
        id: 4,
        name: "You're a beast!",
        text: "Reach TOP 5",
      },
      {
        id: 5,
        name: "Our Lord, our Rafiki",
        text: "Reach 1st place",
      }
  ]
    
  }*/
};






</script>

<style>
.shape{    
	border-style: solid; border-width: 0 70px 40px 0; float:right; height: 0px; width: 0px;
	-ms-transform:rotate(360deg); /* IE 9 */
	-o-transform: rotate(360deg);  /* Opera 10.5 */
	-webkit-transform:rotate(360deg); /* Safari and Chrome */
	transform:rotate(360deg);
}
.offer{
	background:#fff; border:1px solid #ddd; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); margin: 15px 0; overflow:hidden;
}

.offer-radius{
	border-radius:7px;
}
.offer-danger {	border-color: #d9534f; }
.offer-danger .shape{
	border-color: transparent #d9534f transparent transparent;
}
.offer-success {	border-color: #5cb85c; }
.offer-success .shape{
	border-color: transparent #99ff99 transparent transparent;
}
.offer-default {	border-color: #999999; }
.offer-default .shape{
	border-color: transparent #999999 transparent transparent;
}
.offer-primary {	border-color: #428bca; }
.offer-primary .shape{
	border-color: transparent #428bca transparent transparent;
}
.offer-info {	border-color: #5bc0de; }
.offer-info .shape{
	border-color: transparent #5bc0de transparent transparent;
}
.offer-warning {	border-color: #f0ad4e; }
.offer-warning .shape{
	border-color: transparent #f0ad4e transparent transparent;
}

.shape-text{
	color:#fff; font-size:12px; font-weight:bold; position:relative; right:-50px; top:2px; white-space: nowrap;
	-ms-transform:rotate(30deg); /* IE 9 */
	-o-transform: rotate(360deg);  /* Opera 10.5 */
	-webkit-transform:rotate(30deg); /* Safari and Chrome */
	transform:rotate(30deg);
}	
.offer-content{
	padding:0 20px 10px;
  text-align: center;
  font-size: 14px;
}

.offer-content2{
	padding:0 20px 10px;
  text-align: left;
  
}

@media (min-width: 487px) {
  .container {
    max-width: 750px;
  }
  .col-sm-6 {
    width: 50%;
  }
}
@media (min-width: 900px) {
  .container {
    max-width: 970px;
  }
  .col-md-4 {
    width: 33.33333333333333%;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
  .col-lg-3 {
    width: 25%;
  }
  }

</style>

