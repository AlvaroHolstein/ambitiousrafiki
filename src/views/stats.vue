<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <apexchart type="bar" width="100%" height="350" :options="chartOptions" :series="series"/>
      </div>
      <div class="col-md-6">
        <apexchart
          type="donut"
          width="100%"
          height="350"
          :options="chartOptions2"
          :series="series2"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <apexchart type="bar" width="100%" height="400" :options="chartOptions3" :series="series3"/>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      series: [
        {
          name: "Upvotes",
          data: []
        },
        {
          name: "Views",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          stacked: true
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        xaxis: {
          categories: []
        },
        fill: {
          opacity: 1
        },

        legend: {
          position: "right",
          offsetX: 0,
          offsetY: 50,
          width: 150,
          height: 75
        },
        title: {
          text: "Hot Topics",
          align: "top",
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "20px",
            color: "#fefefe"
          }
        }
      },
      series2: [],
      chartOptions2: {
        title: {
          text: "Experience Distribution - TOP 5",
          align: "top",
          margin: 5,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "15px",
            color: "#fefefe"
          }
        },
        labels: [],
        legend: {
          position: "right",
          offsetX: 0,
          offsetY: 50,
          width: 150,
          height: 75
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ]
      },
      series3: [{ name: "Nº Comments", data: [] }],
      chartOptions3: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: "Top Commentators",
          align: "top",
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "30px",
            color: "#fefefe"
          }
        },
        xaxis: {
          categories: []
        }
      },
      commentators: []
    };
  },
  mounted() {
    //Montar Grafico de hottopics
    this.$http
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/hotTopics`
      )
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
          this.chartOptions.xaxis.categories.push(res.data[i].title);
          if (res.data[i].upvotes != NaN) {
            this.series[0].data.push(res.data[i].upvotes);
          } else {
            this.series[0].data.push(0);
          }
          if (res.data[i].views != NaN) {
            this.series[1].data.push(res.data[i].views);
          } else {
            this.series[1].data.push(0);
          }
        }
      });
    //Montar Gráfico de distribuição de XP
    this.$http
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/exp`
      )
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].experience > 0) {
            this.chartOptions2.labels.push(res.data[i].name);
            this.series2.push(res.data[i].experience);
          }
        }
      });
    //Montar Gráfico de commentators
    this.$http
      .get(
        `http://${this.$store.state.address +
          this.$store.state.port}/data-api/topCommentators`
      )
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
                    console.log(res.data[i])

          this.series3[0].data.push(res.data[i].number);
          this.chartOptions3.xaxis.categories.push(res.data[i].name);
        }
      });
  }
};
</script>
